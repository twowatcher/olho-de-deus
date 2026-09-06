const $ = (selector) => document.querySelector(selector);
const state = { items: [], query: "", source: "" };
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
const date = (value) => value ? new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)) : "Agora";

function render() {
  const query = state.query.toLocaleLowerCase("pt-BR");
  const visible = state.items.filter((item) => !state.source || item.source === state.source)
    .filter((item) => !query || [item.title,item.summary,item.source,item.region].join(" ").toLocaleLowerCase("pt-BR").includes(query));
  $("#count").textContent = visible.length === 1 ? "1 manchete encontrada" : `${visible.length} manchetes encontradas`;
  $("#empty").hidden = visible.length !== 0;
  $("#news").innerHTML = visible.map((item) => `<article class="card">
    <div class="meta"><span>${escapeHTML(item.source)}</span><span>${escapeHTML(item.region || "")}</span></div>
    <h2>${escapeHTML(item.title)}</h2>
    ${item.summary ? `<p>${escapeHTML(item.summary)}</p>` : ""}
    <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Ler na fonte →</a>
  </article>`).join("");
}

async function start() {
  try {
    const response = await fetch("./news-dashboard/data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Dados indisponíveis");
    const data = await response.json();
    state.items = Array.isArray(data.items) ? data.items : [];
    const sources = [...new Set(state.items.map((item) => item.source))].sort();
    $("#source").insertAdjacentHTML("beforeend", sources.map((source) => `<option>${escapeHTML(source)}</option>`).join(""));
    $("#updated").textContent = data.updatedAt ? `Atualizado em ${date(data.updatedAt)} · ${state.items.length} manchetes` : "Aguardando a primeira atualização";
    render();
  } catch {
    $("#updated").textContent = "Não foi possível carregar as notícias agora.";
  }
}
$("#search").addEventListener("input", (event) => { state.query = event.target.value; render(); });
$("#source").addEventListener("change", (event) => { state.source = event.target.value; render(); });
start();