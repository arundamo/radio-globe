# 📡 Radio Globe

A lightweight Node.js web application that lets you browse and listen to **43+ global internet radio stations** through a clean, dark-themed single-page interface — and exposes a fully documented REST API so AI agents and other tools can interact with it programmatically.

---

## Features

- 🌍 43 curated stations across 11+ countries
- 🔊 Server-side audio proxy (hides upstream stream URLs, normalises CORS)
- 🔍 Filterable by genre tag, country, or free-text search
- 📄 Self-describing [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) spec served at `/openapi.json`
- ⚡ Zero dependencies — uses only Node.js built-ins (`http`, `https`, `url`)

---

## Quick Start

**Requirements:** Node.js ≥ 18

```bash
# clone and start
git clone https://github.com/arundamo/radio-globe.git
cd radio-globe
node server.js            # or: npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Set `PORT` to change the listen port:

```bash
PORT=8080 node server.js
```

---

## REST API

All endpoints return JSON (except the audio stream) and include `Access-Control-Allow-Origin: *` headers.

### `GET /stations`

Returns the full list of stations. Stream URLs are **never** included in any response.

| Query param | Type   | Description |
|-------------|--------|-------------|
| `q`         | string | Full-text search across name, country, and tags |
| `tag`       | string | Exact genre tag match (e.g. `jazz`, `classical`, `news`) |
| `country`   | string | Partial, case-insensitive country name filter |
| `cc`        | string | ISO 3166-1 alpha-2 country code (e.g. `US`, `GB`, `DE`) |

**Example**
```
GET /stations?tag=jazz&cc=FR
```
```json
[
  { "id": "s16", "name": "Radio FIP", "country": "France", "cc": "FR",
    "tags": "jazz,world,eclectic", "lat": 48.86, "lon": 2.33 },
  { "id": "s18", "name": "Jazz Radio France", "country": "France", "cc": "FR",
    "tags": "jazz", "lat": 48.85, "lon": 2.36 }
]
```

### `GET /stations/:id`

Returns a single station by its ID.

```
GET /stations/s1
```
```json
{ "id": "s1", "name": "SomaFM Groove Salad", "country": "United States",
  "cc": "US", "tags": "ambient,lofi,chill", "lat": 37.77, "lon": -122.41 }
```

Returns **404** `{ "error": "Station not found" }` for unknown IDs.

### `GET /stream/:id`

Proxies the live audio stream. The response body is an infinite chunked audio stream (`audio/mpeg` or `audio/aac`). Keep the connection open to continue receiving audio.

```
GET /stream/s1
→ Content-Type: audio/mpeg
→ Transfer-Encoding: chunked
→ (streaming audio…)
```

### `GET /openapi.json`

Returns the full [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) specification for this API as JSON.

---

## AI Agent Integration

Radio Globe is AI agent–ready out of the box.

### Option 1 — Point your agent at the OpenAPI spec

Many AI frameworks (LangChain tools, OpenAI function calling, Copilot Extensions, etc.) can read an OpenAPI spec and auto-generate tool definitions:

```
http://localhost:3000/openapi.json
```

The spec describes every endpoint, all query parameters, and all response schemas.

### Option 2 — Manual tool definitions (OpenAI / Anthropic style)

```json
[
  {
    "name": "listStations",
    "description": "Browse global radio stations. Filter by q (search text), tag (genre), country, or cc (ISO country code).",
    "parameters": {
      "type": "object",
      "properties": {
        "q":       { "type": "string" },
        "tag":     { "type": "string", "enum": ["jazz","classical","pop","rock","news","ambient","lofi","world","electronic","country"] },
        "country": { "type": "string" },
        "cc":      { "type": "string" }
      }
    }
  },
  {
    "name": "getStation",
    "description": "Get details for a single radio station by ID.",
    "parameters": {
      "type": "object",
      "required": ["id"],
      "properties": { "id": { "type": "string" } }
    }
  },
  {
    "name": "streamStation",
    "description": "Get the proxy URL for a live audio stream so a media player can play it.",
    "parameters": {
      "type": "object",
      "required": ["id"],
      "properties": { "id": { "type": "string" } }
    }
  }
]
```

To call `streamStation`, construct the URL as `http://localhost:3000/stream/{id}` and pass it to any media player or `<audio>` element — the agent does not need to handle the binary stream itself.

### Example agent interaction

```
User:  "Play some French jazz"
Agent: GET /stations?tag=jazz&cc=FR
       → [{id:"s16", name:"Radio FIP",...}, {id:"s18", name:"Jazz Radio France",...}]
       → selects s16, constructs URL http://localhost:3000/stream/s16
       → passes URL to audio player
```

---

## Station Catalogue

| ID  | Name | Country | Tags |
|-----|------|---------|------|
| s1  | SomaFM Groove Salad | United States | ambient, lofi, chill |
| s2  | SomaFM Lush | United States | ambient, electronic |
| s3  | SomaFM Jazz | United States | jazz |
| s4  | SomaFM Soundscape | United States | ambient, electronic |
| s5  | SomaFM Drone Zone | United States | ambient |
| s6  | SomaFM Indie Pop | United States | indie, pop |
| s7  | SomaFM Folk Fwd | United States | folk, world |
| s8  | SomaFM Vaporwaves | United States | electronic, ambient |
| s9  | Radio Paradise | United States | ambient, eclectic |
| s10 | Radio Paradise Rock | United States | rock |
| s11 | Radio Paradise Mellow | United States | ambient, chill |
| s12 | Radio Paradise World | United States | world |
| s13 | Radio Swiss Jazz | Switzerland | jazz |
| s14 | Radio Swiss Classic | Switzerland | classical |
| s15 | Radio Swiss Pop | Switzerland | pop |
| s16 | Radio FIP | France | jazz, world, eclectic |
| s17 | France Inter | France | news, talk |
| s18 | Jazz Radio France | France | jazz |
| s19 | BBC Radio 1 | UK | pop, rock |
| s20 | BBC Radio 4 | UK | news, talk |
| s21 | Classic FM UK | UK | classical |
| s22 | Jazz FM UK | UK | jazz |
| s23 | Deutschlandradio | Germany | news, public |
| s24 | WDR 3 | Germany | classical |
| s25 | Rock Antenne | Germany | rock |
| s26 | FluxFM Berlin | Germany | indie, alternative |
| s27 | Chillhop Radio | Germany | lofi, hiphop, jazz |
| s28 | KEXP 90.3 | United States | indie, rock, alternative |
| s29 | NPR News | United States | news, public |
| s30 | ABC Jazz Australia | Australia | jazz |
| s31 | CBC Radio One | Canada | news, public |
| s32 | CJPX Classical | Canada | classical |
| s33 | Rai Radio 3 | Italy | classical, culture |
| s34 | Rai Radio 2 | Italy | pop, rock |
| s35 | Sveriges Radio P1 | Sweden | news, talk |
| s36 | NRK P1 | Norway | news, pop |
| s37 | 181.fm Classical | United States | classical |
| s38 | 181.fm Country | United States | country |
| s39 | 181.fm The Mix | United States | pop, mix |
| s40 | Smooth Jazz Florida | United States | jazz, smooth |
| s41 | Radio City Hindi | India | bollywood, pop, hindi |
| s42 | Radio City Tamil | India | tamil, pop, regional |
| s43 | Radio City Kannada | India | kannada, pop, regional |

---

## Project Structure

```
radio-globe/
├── server.js      # HTTP server — routing, audio proxy, embedded SPA, OpenAPI spec
├── package.json   # Package metadata (no runtime dependencies)
└── README.md      # This file
```

---

## License

MIT
