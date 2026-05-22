const http = require("http");
const https = require("https");
const url = require("url");

const STATIONS = [
  { id:"s1",  name:"SomaFM Groove Salad",   stream:"https://ice1.somafm.com/groovesalad-128-mp3",              country:"United States", cc:"US", tags:"ambient,lofi,chill",      lat:37.77,  lon:-122.41 },
  { id:"s2",  name:"SomaFM Lush",           stream:"https://ice1.somafm.com/lush-128-mp3",                    country:"United States", cc:"US", tags:"ambient,electronic",      lat:37.77,  lon:-122.42 },
  { id:"s3",  name:"SomaFM Jazz",           stream:"https://ice1.somafm.com/somaFMjazz-128-mp3",              country:"United States", cc:"US", tags:"jazz",                     lat:37.78,  lon:-122.41 },
  { id:"s4",  name:"SomaFM Soundscape",     stream:"https://ice1.somafm.com/soundscape-128-mp3",              country:"United States", cc:"US", tags:"ambient,electronic",      lat:37.76,  lon:-122.43 },
  { id:"s5",  name:"SomaFM Drone Zone",     stream:"https://ice1.somafm.com/dronezone-128-mp3",               country:"United States", cc:"US", tags:"ambient",                 lat:37.75,  lon:-122.44 },
  { id:"s6",  name:"SomaFM Indie Pop",      stream:"https://ice1.somafm.com/indiepop-128-mp3",                country:"United States", cc:"US", tags:"indie,pop",               lat:37.74,  lon:-122.41 },
  { id:"s7",  name:"SomaFM Folk Fwd",       stream:"https://ice1.somafm.com/folkfwd-128-mp3",                 country:"United States", cc:"US", tags:"folk,world",              lat:37.76,  lon:-122.40 },
  { id:"s8",  name:"SomaFM Vaporwaves",     stream:"https://ice1.somafm.com/vaporwaves-128-mp3",              country:"United States", cc:"US", tags:"electronic,ambient",      lat:37.79,  lon:-122.42 },
  { id:"s9",  name:"Radio Paradise",        stream:"https://stream.radioparadise.com/aac-128",                country:"United States", cc:"US", tags:"ambient,eclectic",        lat:38.89,  lon:-121.29 },
  { id:"s10", name:"Radio Paradise Rock",   stream:"https://stream.radioparadise.com/rock-aac-128",           country:"United States", cc:"US", tags:"rock",                    lat:38.90,  lon:-121.30 },
  { id:"s11", name:"Radio Paradise Mellow", stream:"https://stream.radioparadise.com/mellow-aac-128",         country:"United States", cc:"US", tags:"ambient,chill",           lat:38.88,  lon:-121.28 },
  { id:"s12", name:"Radio Paradise World",  stream:"https://stream.radioparadise.com/world-aac-128",          country:"United States", cc:"US", tags:"world",                   lat:38.87,  lon:-121.27 },
  { id:"s13", name:"Radio Swiss Jazz",      stream:"https://stream.srg-ssr.ch/rsj/mp3_128.stream",            country:"Switzerland",   cc:"CH", tags:"jazz",                     lat:46.95,  lon:7.44    },
  { id:"s14", name:"Radio Swiss Classic",   stream:"https://stream.srg-ssr.ch/rsc_de/aacp_96.stream",         country:"Switzerland",   cc:"CH", tags:"classical",                lat:47.38,  lon:8.54    },
  { id:"s15", name:"Radio Swiss Pop",       stream:"https://stream.srg-ssr.ch/rsp/mp3_128.stream",            country:"Switzerland",   cc:"CH", tags:"pop",                      lat:46.95,  lon:7.43    },
  { id:"s16", name:"Radio FIP",             stream:"https://icecast.radiofrance.fr/fip-midfi.mp3",            country:"France",        cc:"FR", tags:"jazz,world,eclectic",     lat:48.86,  lon:2.33    },
  { id:"s17", name:"France Inter",          stream:"https://icecast.radiofrance.fr/franceinter-midfi.mp3",    country:"France",        cc:"FR", tags:"news,talk",               lat:48.85,  lon:2.35    },
  { id:"s18", name:"Jazz Radio France",     stream:"https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3",  country:"France",        cc:"FR", tags:"jazz",                     lat:48.85,  lon:2.36    },
  { id:"s19", name:"BBC Radio 1",           stream:"https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",     country:"UK",            cc:"GB", tags:"pop,rock",                lat:51.51,  lon:-0.12   },
  { id:"s20", name:"BBC Radio 4",           stream:"https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm",  country:"UK",            cc:"GB", tags:"news,talk",               lat:51.52,  lon:-0.11   },
  { id:"s21", name:"Classic FM UK",         stream:"https://media-ice.musicradio.com/ClassicFMMP3",            country:"UK",            cc:"GB", tags:"classical",                lat:51.52,  lon:-0.10   },
  { id:"s22", name:"Jazz FM UK",            stream:"https://edge-bauerall-03-gos2.sharp-stream.com/jazzfm.mp3",country:"UK",           cc:"GB", tags:"jazz",                     lat:51.50,  lon:-0.13   },
  { id:"s23", name:"Deutschlandradio",      stream:"https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3", country:"Germany",       cc:"DE", tags:"news,public",             lat:52.52,  lon:13.40   },
  { id:"s24", name:"WDR 3",                stream:"https://wdr-wdr3-live.icecastssl.wdr.de/wdr/wdr3/live/mp3/256/stream.mp3",country:"Germany",cc:"DE",tags:"classical",        lat:50.94,  lon:6.96    },
  { id:"s25", name:"Rock Antenne",          stream:"https://streams.rockantenne.de/rockantenne/stream/mpeg",   country:"Germany",       cc:"DE", tags:"rock",                    lat:48.14,  lon:11.57   },
  { id:"s26", name:"FluxFM Berlin",         stream:"https://streams.fluxfm.de/flux/mp3-128/streams.fluxfm.de/",country:"Germany",      cc:"DE", tags:"indie,alternative",       lat:52.52,  lon:13.38   },
  { id:"s27", name:"Chillhop Radio",        stream:"https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/",country:"Germany",  cc:"DE", tags:"lofi,hiphop,jazz",        lat:52.53,  lon:13.39   },
  { id:"s28", name:"KEXP 90.3",             stream:"https://kexp-mp3-128.streamguys1.com/kexp128.mp3",         country:"United States", cc:"US", tags:"indie,rock,alternative",  lat:47.62,  lon:-122.35 },
  { id:"s29", name:"NPR News",              stream:"https://npr-ice.streamguys1.com/live.mp3",                 country:"United States", cc:"US", tags:"news,public",             lat:38.89,  lon:-77.04  },
  { id:"s30", name:"ABC Jazz Australia",    stream:"https://live-radio01.mediahubaustralia.com/JAZW/mp3/",     country:"Australia",     cc:"AU", tags:"jazz",                     lat:-33.87, lon:151.21  },
  { id:"s31", name:"CBC Radio One",         stream:"https://cbcmp3.ic.llnwd.net/stream/cbcmp3_cbc_r1_tor",    country:"Canada",        cc:"CA", tags:"news,public",             lat:43.65,  lon:-79.38  },
  { id:"s32", name:"CJPX Classical",        stream:"https://cjpx.ice.infomaniak.ch/cjpx-128.mp3",             country:"Canada",        cc:"CA", tags:"classical",                lat:45.50,  lon:-73.57  },
  { id:"s33", name:"Rai Radio 3",           stream:"https://icestreaming.rai.it/3.mp3",                        country:"Italy",         cc:"IT", tags:"classical,culture",       lat:41.90,  lon:12.49   },
  { id:"s34", name:"Rai Radio 2",           stream:"https://icestreaming.rai.it/2.mp3",                        country:"Italy",         cc:"IT", tags:"pop,rock",                lat:41.90,  lon:12.50   },
  { id:"s35", name:"Sveriges Radio P1",     stream:"https://sverigesradio.se/topsy/direkt/132-hi.mp3",         country:"Sweden",        cc:"SE", tags:"news,talk",               lat:59.33,  lon:18.06   },
  { id:"s36", name:"NRK P1",               stream:"https://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_h", country:"Norway",        cc:"NO", tags:"news,pop",                lat:59.91,  lon:10.74   },
  { id:"s37", name:"181.fm Classical",      stream:"https://listen.181fm.com/181-classical_128k.mp3",          country:"United States", cc:"US", tags:"classical",                lat:37.40,  lon:-79.18  },
  { id:"s38", name:"181.fm Country",        stream:"https://listen.181fm.com/181-country_128k.mp3",            country:"United States", cc:"US", tags:"country",                 lat:36.17,  lon:-86.78  },
  { id:"s39", name:"181.fm The Mix",        stream:"https://listen.181fm.com/181-themix_128k.mp3",             country:"United States", cc:"US", tags:"pop,mix",                 lat:37.39,  lon:-79.19  },
  { id:"s40", name:"Smooth Jazz Florida",   stream:"https://smoothjazz.cdnstream1.com/2585_128.mp3",          country:"United States", cc:"US", tags:"jazz,smooth",             lat:25.77,  lon:-80.19  },
];

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // GET /stations — return station list (without real stream URLs)
  if (parsed.pathname === "/stations") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const safe = STATIONS.map(({ stream, ...rest }) => rest);
    res.end(JSON.stringify(safe));
    return;
  }

  // GET /stream/:id — proxy the actual audio stream
  const match = parsed.pathname.match(/^\/stream\/(.+)$/);
  if (match) {
    const station = STATIONS.find(s => s.id === match[1]);
    if (!station) { res.writeHead(404); res.end("Not found"); return; }

    const streamUrl = new URL(station.stream);
    const options = {
      hostname: streamUrl.hostname,
      path: streamUrl.pathname + streamUrl.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RadioProxy/1.0)",
        "Accept": "*/*",
        "Icy-MetaData": "1",
      }
    };

    const proto = streamUrl.protocol === "https:" ? https : http;
    const proxyReq = proto.get(options, proxyRes => {
      // Forward audio headers
      const headers = {
        "Content-Type": proxyRes.headers["content-type"] || "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      };
      if (proxyRes.headers["icy-name"])    headers["icy-name"]    = proxyRes.headers["icy-name"];
      if (proxyRes.headers["icy-genre"])   headers["icy-genre"]   = proxyRes.headers["icy-genre"];
      if (proxyRes.headers["icy-br"])      headers["icy-br"]      = proxyRes.headers["icy-br"];

      res.writeHead(200, headers);
      proxyRes.pipe(res);
      req.on("close", () => proxyReq.destroy());
    });

    proxyReq.on("error", err => {
      console.error("Proxy error for", station.name, err.message);
      if (!res.headersSent) { res.writeHead(502); res.end("Stream error"); }
    });
    return;
  }

  // Serve index.html for everything else
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(getHTML());
});

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Radio Globe</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060f0c; color: #d1fae5; font-family: system-ui, sans-serif; min-height: 100vh; }
  header { padding: 14px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(52,211,153,0.15); background: #060f0c; position: sticky; top: 0; z-index: 50; }
  .logo { font-size: 22px; font-weight: 800; color: #34d399; }
  .sub  { font-size: 10px; color: #6ee7b7; opacity: 0.5; letter-spacing: 1px; margin-top: 2px; }
  .search-wrap { padding: 14px 20px 0; }
  input[type=text] { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(52,211,153,0.2); border-radius: 8px; color: #d1fae5; font-size: 14px; outline: none; }
  .tags { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
  .tag  { padding: 3px 11px; border-radius: 20px; font-size: 11px; cursor: pointer; border: 1px solid rgba(52,211,153,0.2); background: transparent; color: #6ee7b7; text-transform: capitalize; }
  .tag.active { background: rgba(52,211,153,0.18); color: #34d399; }
  .list { padding: 14px 20px 110px; }
  .card { display: flex; align-items: center; gap: 12px; padding: 10px 13px; border-radius: 9px; margin-bottom: 5px; cursor: pointer; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); transition: background 0.15s; }
  .card:hover { background: rgba(52,211,153,0.07); }
  .card.active { background: rgba(52,211,153,0.12); border-color: rgba(52,211,153,0.4); }
  .icon { width: 36px; height: 36px; border-radius: 7px; background: #1a3a2a; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; border: 1px solid rgba(52,211,153,0.15); }
  .name { font-size: 14px; font-weight: 600; color: #d1fae5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card.active .name { color: #34d399; }
  .meta { font-size: 11px; color: #6ee7b7; opacity: 0.6; }
  .live { background: #34d399; color: #060f0c; font-size: 8px; font-weight: 800; border-radius: 3px; padding: 2px 5px; margin-left: auto; flex-shrink: 0; }
  .player { position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(to right, #071410, #0a1f18); border-top: 1px solid rgba(52,211,153,0.25); padding: 12px 20px; display: flex; align-items: center; gap: 14px; display: none; }
  .player.visible { display: flex; }
  .pname { font-size: 14px; font-weight: 700; color: #34d399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pmeta { font-size: 11px; color: #6ee7b7; opacity: 0.65; }
  .play-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: #34d399; color: #060f0c; font-size: 17px; cursor: pointer; flex-shrink: 0; }
  .close-btn { background: none; border: 1px solid rgba(52,211,153,0.25); border-radius: 6px; color: #6ee7b7; padding: 5px 10px; cursor: pointer; font-size: 12px; flex-shrink: 0; }
  input[type=range] { width: 70px; accent-color: #34d399; }
  #progress-bar { height: 2px; background: rgba(52,211,153,0.1); }
  #progress-fill { height: 100%; background: #34d399; width: 0%; transition: width 0.3s; }
  .empty { text-align: center; padding: 50px 20px; color: #6ee7b7; opacity: 0.5; }
</style>
</head>
<body>
<header>
  <span style="font-size:22px">📡</span>
  <div>
    <div class="logo">Radio Globe</div>
    <div class="sub" id="status">Loading stations…</div>
  </div>
</header>
<div id="progress-bar"><div id="progress-fill"></div></div>
<div class="search-wrap">
  <input type="text" id="search" placeholder="Search stations, countries, genres…" oninput="render()"/>
  <div class="tags" id="tags"></div>
</div>
<div class="list" id="list"></div>
<div class="player" id="player">
  <div style="width:40px;height:40px;border-radius:8px;background:#1a3a2a;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📻</div>
  <div style="flex:1;min-width:0">
    <div class="pname" id="pname"></div>
    <div class="pmeta" id="pmeta"></div>
  </div>
  <button class="play-btn" id="play-btn" onclick="togglePlay()">▶</button>
  <input type="range" min="0" max="1" step="0.01" value="0.8" oninput="setVol(this.value)"/>
  <button class="close-btn" onclick="closePlayer()">✕</button>
</div>

<script>
const TAGS = ["all","jazz","classical","pop","rock","news","ambient","lofi","world","electronic","country"];
let stations = [];
let activeId = null;
let currentTag = "all";
let playing = false;
const audio = new Audio();

audio.addEventListener("playing", () => { playing = true; document.getElementById("play-btn").textContent = "⏸"; document.getElementById("pmeta").textContent = "● LIVE"; });
audio.addEventListener("waiting", () => { document.getElementById("pmeta").textContent = "Buffering…"; });
audio.addEventListener("error",   () => { document.getElementById("pmeta").textContent = "Stream error — try another station"; });

async function loadStations() {
  try {
    const res = await fetch("/stations");
    stations = await res.json();
    document.getElementById("status").textContent = stations.length + " STATIONS READY";
    document.getElementById("progress-fill").style.width = "100%";
    setTimeout(() => document.getElementById("progress-bar").style.display = "none", 500);
    render();
  } catch(e) {
    document.getElementById("status").textContent = "Error loading stations — is server running?";
  }
}

function flag(cc) {
  if (!cc || cc.length !== 2) return "🌐";
  try { return String.fromCodePoint(...[...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0))); } catch { return "🌐"; }
}

function render() {
  const q = document.getElementById("search").value.toLowerCase();

  // Tags
  const tagsEl = document.getElementById("tags");
  tagsEl.innerHTML = TAGS.map(t =>
    \`<button class="tag \${t === currentTag ? "active" : ""}" onclick="setTag('\${t}')">\${t}</button>\`
  ).join("");

  // Filter
  const filtered = stations.filter(s => {
    const mq = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.tags.toLowerCase().includes(q);
    const mt = currentTag === "all" || s.tags.toLowerCase().includes(currentTag);
    return mq && mt;
  });

  const listEl = document.getElementById("list");
  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="empty">No stations match your search.</div>';
    return;
  }

  listEl.innerHTML = filtered.map(s => \`
    <div class="card \${s.id === activeId ? "active" : ""}" onclick="tune('\${s.id}')">
      <div class="icon">📻</div>
      <div style="min-width:0;flex:1">
        <div class="name">\${s.name}</div>
        <div class="meta">\${flag(s.cc)} \${s.country} · \${s.tags.split(",")[0]}</div>
      </div>
      \${s.id === activeId ? '<span class="live">LIVE</span>' : ""}
    </div>
  \`).join("");
}

function setTag(t) { currentTag = t; render(); }

function tune(id) {
  activeId = id;
  const s = stations.find(x => x.id === id);
  if (!s) return;
  audio.pause();
  audio.src = "/stream/" + id;
  audio.load();
  audio.play().catch(() => {});
  playing = false;
  document.getElementById("play-btn").textContent = "⏸";
  document.getElementById("pname").textContent = s.name;
  document.getElementById("pmeta").textContent = flag(s.cc) + " " + s.country + " · " + s.tags.split(",")[0];
  document.getElementById("player").classList.add("visible");
  render();
}

function togglePlay() {
  if (playing) { audio.pause(); playing = false; document.getElementById("play-btn").textContent = "▶"; }
  else { audio.play().catch(() => {}); document.getElementById("play-btn").textContent = "⏸"; }
}

function setVol(v) { audio.volume = parseFloat(v); }
function closePlayer() { audio.pause(); playing = false; activeId = null; document.getElementById("player").classList.remove("visible"); render(); }

loadStations();
</script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log("\n✅ Radio Globe running at http://localhost:" + PORT);
  console.log("   Open that URL in your browser\n");
});
