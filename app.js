const $ = (selector) => document.querySelector(selector);
const CATEGORY_RULES = [
  ["Política", /governo|presidente|eleiç|congresso|senado|câmara|stf|supremo|ministro|partido|prefeito/],
  ["Economia", /economia|mercado|inflação|bolsa|dólar|euro|juros|empresa|emprego|combustível|preço/],
  ["Ciência & Tech", /tecnologia|ciência|cient|ia\b|inteligência artificial|pesquisa|internet|digital|espaço|vacina/],
  ["Saúde", /saúde|hospital|doença|médic|anvisa|vírus|bem-estar/],
  ["Esportes", /futebol|esporte|campeonato|liga|atleta|futsal|jogo|gol|seleção/],
  ["Cultura", /cultura|música|cinema|livro|arte|cantor|cantora|moda|festival/],
  ["Clima", /chuva|clima|tempo|calor|frio|incêndio|enchente|granizo|meteorolog/]
];
const state = { items: [], query: "", source: "", category: "" };
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
const categoryFor = (item) => item.category || CATEGORY_RULES.find(([, rule]) => rule.test((item.title + " " + item.summary).toLocaleLowerCase("pt-BR")))?.[0] || "Mundo";
const date = (value) => value ? new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)) : "Agora";
const visibleItems = () => {
  const query = state.query.toLocaleLowerCase("pt-BR");
  return state.items.filter((item) => !state.source || item.source === state.source)
    .filter((item) => !state.category || categoryFor(item) === state.category)
    .filter((item) => !query || [item.title,item.summary,item.source,item.region,categoryFor(item)].join(" ").toLocaleLowerCase("pt-BR").includes(query));
};
const newsCard = (item, index, featured = false) => {
  const category = categoryFor(item);
  return featured ? `<article class="feature" data-index="0${index + 1}">
    <span class="chip">${escapeHTML(category)}</span><h3>${escapeHTML(item.title)}</h3>
    ${item.summary ? `<p>${escapeHTML(item.summary)}</p>` : ""}
    <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">ABRIR FONTE ↗</a>
  </article>` : `<article class="card">
    <div class="meta"><span>${escapeHTML(item.source)}</span><span>${escapeHTML(category)} · ${escapeHTML(item.region || "")}</span></div>
    <h3>${escapeHTML(item.title)}</h3>${item.summary ? `<p>${escapeHTML(item.summary)}</p>` : ""}
    <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">LER NA FONTE ↗</a>
  </article>`;
};
function renderCategories() {
  const categories = ["", ...new Set(state.items.map(categoryFor))];
  $("#categories").innerHTML = categories.map((category) => `<button class="category ${state.category === category ? "active" : ""}" data-category="${escapeHTML(category)}">${category ? escapeHTML(category) : "TODOS OS SINAIS"}</button>`).join("");
  $("#categories").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { state.category = button.dataset.category; render(); }));
}
function render() {
  const items = visibleItems();
  $("#count").textContent = `${items.length} ${items.length === 1 ? "sinal encontrado" : "sinais encontrados"}`;
  $("#empty").hidden = items.length !== 0;
  $("#featured").innerHTML = items.slice(0, 3).map((item, index) => newsCard(item, index, true)).join("");
  $("#news").innerHTML = items.slice(3).map((item, index) => newsCard(item, index)).join("");
  renderCategories();
}
async function start() {
  try {
    const response = await fetch("./news-dashboard/data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Dados indisponíveis");
    const data = await response.json();
    state.items = Array.isArray(data.items) ? data.items : [];
    const sources = [...new Set(state.items.map((item) => item.source))].sort();
    $("#source").insertAdjacentHTML("beforeend", sources.map((source) => `<option>${escapeHTML(source)}</option>`).join(""));
    $("#updated").textContent = data.updatedAt ? date(data.updatedAt) : "Aguardando atualização";
    $("#total").textContent = `${state.items.length} sinais captados · atualização horária`;
    render();
  } catch {
    $("#updated").textContent = "Falha ao sincronizar";
    $("#total").textContent = "Tente atualizar a página";
  }
}
$("#search").addEventListener("input", (event) => { state.query = event.target.value; render(); });
$("#source").addEventListener("change", (event) => { state.source = event.target.value; render(); });
start();