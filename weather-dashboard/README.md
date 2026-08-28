# Weather Dashboard — Olho de Deus

Este dashboard de clima é um exemplo prático dentro do projeto Olho de Deus. Ele demonstra como conectar-se a APIs públicas e exibir informações úteis.

Principais pontos técnicos:
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search` (busca por nome de cidade)
- Weather: `https://api.open-meteo.com/v1/forecast` (current_weather + hourly)
- Sem necessidade de chave de API para as chamadas usadas aqui.

Melhorias possíveis (se quiser que eu implemente):
- Cache local (IndexedDB) para evitar chamadas repetidas durante navegação
- Busca por coordenadas diretamente
- Modo claro/escuro e internacionalização de strings
- Gráfico da previsão (Chart.js / lightweight alternative)

Uso e contribuição
- Abra `weather-dashboard/index.html` ou sirva a pasta via servidor
- Para estender, edite `js/app.js` e siga o padrão existente

Licença: MIT
