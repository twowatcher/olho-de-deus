<!-- README principal do repositório Olho de Deus -->

<p align="center">
  <img src="assets/logo.svg" alt="Olho de Deus" width="220">
</p>

<h1 align="center">Olho de Deus</h1>

> Um repositório-esqueleto para agregar conhecimento público sobre o mundo — índice organizado, ferramentas e dashboards (ex.: Weather Dashboard).


Principais seções
- Sobre — propósito e escopo
- Weather Dashboard — demo que consome Open-Meteo (sem chave)
- Como usar — instruções rápidas para rodar localmente
- Fontes de dados & política — o que é permitido e como citar
- Contribuição — como enviar dados/ajustes
- Licença e contato

---

## ✨ Sobre
Olho de Deus é um projeto para organizar e centralizar referências, dados públicos e ferramentas que ajudam a entender o estado do mundo. Não tentamos "conter tudo" automaticamente — fornecemos uma estrutura, exemplos e automações seguras para coletar e validar informações públicas e abertas.

Escopo imediato deste repositório (inicial):
- Um dashboard de clima simples (diretório `weather-dashboard/`) usando Open-Meteo.
- Índices e fichas iniciais em `KNOWLEDGE_INDEX.md` e a pasta `world/` com páginas por região.
- Boas práticas, templates e scripts placeholder para coleta/transformação de dados.

---

## 🚀 Demo: Weather Dashboard
Abra `weather-dashboard/index.html` em um navegador (ou sirva por um servidor local) para testar rapidamente.

Principais características:
- Busca por cidade (Geocoding via Open-Meteo)
- Exibe clima atual e previsão horária
- Sem necessidade de chave de API

Links úteis:
- Diretório do dashboard: `weather-dashboard/`
- README do dashboard: `weather-dashboard/README.md`

---

## ▶️ Como executar localmente
Recomendado: servir por um servidor local para evitar restrições de CORS ao abrir arquivos locais.

Com Python 3 (rápido e simples):

```bash
git clone https://github.com/twowatcher/olho-de-deus.git
cd olho-de-deus/weather-dashboard
python -m http.server 8000
# abra http://localhost:8000 no navegador
```

Ou usar `npx http-server` (Node) ou outra ferramenta de sua preferência.

---

## 📚 Fontes de dados e política
- Favor usar apenas fontes públicas, livres ou com permissão explícita para redistribuição.
- Cite sempre a fonte (nome da API, URL, data de obtenção) nos arquivos `data/` e em cada ficha do `world/`.
- Não adicione conteúdo protegido por direitos autorais sem permissão. Se quiser importar relatórios ou textos longos, adicione somente trechos permitidos e referências.

APIs usadas no dashboard de clima (exemplos):
- Geocoding: https://geocoding-api.open-meteo.com/
- Weather: https://api.open-meteo.com/

---

## 🤝 Contribuindo
Veja `CONTRIBUTING.md` para instruções detalhadas.
Resumo:
- Use `issues` para propor novas fontes, categorias ou correções factuais.
- Para adicionar dados ou scripts, abra um Pull Request com descrição clara, fonte e licença da fonte.
- Preencha a checklist de contribuição no template de PR.

---

## 📄 Licença
Este repositório está licenciado sob MIT. Consulte o arquivo `LICENSE`.

---

## ✉️ Contato
Mantenedor: twowatcher
