const V = "ml-c4fc94f30b";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "config.js"];
const CDN = ["https://cdn.jsdelivr.net/npm/fflate@0.8.3/umd/index.js", "https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.js"];
const LIVE = ["open.er-api.com", "gold-api.com", "www.googleapis.com", "accounts.google.com", "apis.google.com"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.all([...SHELL.map(u => c.add(u).catch(() => {})), ...CDN.map(u => c.add(new Request(u, { mode: "cors" })).catch(() => {}))])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return; const u = new URL(r.url);
  if (LIVE.includes(u.hostname)) return; // prices and Google sign-in always go to the network
  if (u.origin === location.origin) { // open instantly from cache, refresh quietly in the background
    e.respondWith(caches.open(V).then(async c => { const hit = await c.match(r, { ignoreSearch: true }); const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => null); return hit || (await net) || (r.mode === "navigate" ? c.match("index.html") : Response.error()); }));
    return; }
  if (/jsdelivr|fonts\.(googleapis|gstatic)/.test(u.hostname)) { // libraries and fonts: cache first
    e.respondWith(caches.open(V).then(async c => { const hit = await c.match(r); if (hit) return hit; try { const res = await fetch(r); if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; } catch (x) { return Response.error(); } })); }
});
