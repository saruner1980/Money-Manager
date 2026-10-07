const V = "ml-513c09bcb6";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "config.js"];
const CDN = ["https://cdn.jsdelivr.net/npm/fflate@0.8.3/umd/index.js", "https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.js"];
const LIVE = ["open.er-api.com", "gold-api.com", "www.googleapis.com", "accounts.google.com", "apis.google.com"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.all([...SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})), ...CDN.map(u => c.add(new Request(u, { mode: "cors" })).catch(() => {}))])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return; const u = new URL(r.url);
  if (LIVE.includes(u.hostname)) return; // prices and Google sign-in always go to the network
  if (u.origin === location.origin) {
    const page = r.mode === "navigate" || /(^|\/)(index\.html)?$/.test(u.pathname); // the app itself: newest copy first, cached copy only when offline
    if (page) { e.respondWith(caches.open(V).then(async c => { try { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 4000); const res = await fetch(r, { cache: "no-cache", signal: ctl.signal }); clearTimeout(t); if (res.ok) { c.put("index.html", res.clone()); return res; } } catch (x) { } return (await c.match("index.html")) || (await c.match(r, { ignoreSearch: true })) || Response.error(); })); return; }
    e.respondWith(caches.open(V).then(async c => { const hit = await c.match(r, { ignoreSearch: true }); const net = fetch(r, { cache: "no-cache" }).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => null); return hit || (await net) || Response.error(); }));
    return; }
  if (/jsdelivr|fonts\.(googleapis|gstatic)/.test(u.hostname)) { // libraries and fonts: cache first
    e.respondWith(caches.open(V).then(async c => { const hit = await c.match(r); if (hit) return hit; try { const res = await fetch(r); if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; } catch (x) { return Response.error(); } })); }
});
