#!/usr/bin/env python3
"""Coleta RSS públicos em português para o painel de notícias."""
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
import json
from pathlib import Path
import re
from urllib.request import Request, urlopen
from urllib.parse import urljoin
from xml.etree import ElementTree as ET

SOURCES = [
    {"name": "G1", "region": "Brasil", "url": "https://g1.globo.com/rss/g1/"},
    {"name": "Agência Brasil", "region": "Brasil", "url": "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml"},
    {"name": "CNN Brasil", "region": "Brasil", "url": "https://www.cnnbrasil.com.br/feed/"},
    {"name": "Observador", "region": "Portugal", "url": "https://observador.pt/feed/"},
    {"name": "RTP Notícias", "region": "Portugal", "url": "https://www.rtp.pt/noticias/rss"},
]
OUTPUT = Path("news-dashboard/data/news.json")
MAX_PER_SOURCE = 12
MAX_ITEMS = 60

def clean(value):
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", unescape(value)).strip()

def child_text(entry, names):
    for node in entry.iter():
        if node.tag.rsplit("}", 1)[-1] in names and (node.text or "").strip():
            return clean(node.text)
    return ""

def entry_link(entry, base_url):
    for node in entry.iter():
        if node.tag.rsplit("}", 1)[-1] != "link":
            continue
        href = node.attrib.get("href")
        if href:
            return urljoin(base_url, href)
        if (node.text or "").strip():
            return urljoin(base_url, clean(node.text))
    return ""

def as_iso(value):
    if not value:
        return ""
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, IndexError):
        return ""

def fetch_source(source):
    request = Request(source["url"], headers={"User-Agent": "olho-de-deus-news/1.0"})
    with urlopen(request, timeout=25) as response:
        root = ET.fromstring(response.read())
    entries = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1] in {"item", "entry"}]
    items = []
    for entry in entries[:MAX_PER_SOURCE]:
        title = child_text(entry, {"title"})
        link = entry_link(entry, source["url"])
        if not title or not link:
            continue
        items.append({
            "title": title,
            "url": link,
            "source": source["name"],
            "region": source["region"],
            "publishedAt": as_iso(child_text(entry, {"pubDate", "published", "updated", "date"})),
            "summary": child_text(entry, {"description", "summary", "encoded"})[:320],
        })
    return items

def sort_key(item):
    return item["publishedAt"] or "1970-01-01T00:00:00+00:00"

def main():
    all_items, failures = [], []
    for source in SOURCES:
        try:
            all_items.extend(fetch_source(source))
        except Exception as error:
            failures.append({"source": source["name"], "error": str(error)[:160]})

    unique = {}
    for item in all_items:
        unique.setdefault(item["url"], item)
    items = sorted(unique.values(), key=sort_key, reverse=True)[:MAX_ITEMS]

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "items": items,
        "sources": [source["name"] for source in SOURCES],
        "failures": failures,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(items)} manchetes atualizadas; {len(failures)} fonte(s) indisponível(is).")

if __name__ == "__main__":
    main()