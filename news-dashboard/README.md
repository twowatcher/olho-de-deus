# Painel de notícias

Painel estático em português que exibe títulos, resumos curtos e links de matérias publicadas por fontes públicas.

## Fontes iniciais

- G1
- Agência Brasil
- CNN Brasil
- Observador
- RTP Notícias

Os dados ficam em `data/news.json` e são atualizados pelo workflow `Atualizar notícias`. O painel não reproduz matérias completas: ele direciona para a publicação original.

## Publicação

Para publicar, ative o GitHub Pages no repositório e selecione a branch `main` com a pasta `/news-dashboard` (ou publique essa pasta em outro serviço estático).