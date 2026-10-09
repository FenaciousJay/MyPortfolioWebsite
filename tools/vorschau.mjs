/* ==========================================================================
   Lokale Vorschau
   --------------------------------------------------------------------------
   Startet einen kleinen Webserver für den Website-Ordner und öffnet den Browser.
   So verhält sich die Seite wie online – z. B. laufen eingebettete
   YouTube-Videos (die bei einem Doppelklick auf index.html nicht abspielen).

   Start: Doppelklick auf "vorschau-starten.bat". Beenden: Fenster schließen.
   ========================================================================== */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START_PORT = 5500;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif",
  ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".woff2": "font/woff2", ".pdf": "application/pdf", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { res.writeHead(400).end(); return; }
  let file = path.join(ROOT, rel);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; } // nichts außerhalb des Ordners ausliefern
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Nicht gefunden"); return; }

  const size = fs.statSync(file).size;
  const headers = { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Accept-Ranges": "bytes", "Cache-Control": "no-cache" };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range) { // Teilanfragen – nötig, damit Videos vor- und zurückspulen können
    const start = range[1] ? +range[1] : 0;
    const end = range[2] ? Math.min(+range[2], size - 1) : size - 1;
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, "Content-Length": size });
    fs.createReadStream(file).pipe(res);
  }
});

function listen(port) {
  server.once("error", (e) => (e.code === "EADDRINUSE" ? listen(port + 1) : console.error(e.message)));
  server.listen(port, "127.0.0.1", () => {
    const url = `http://localhost:${port}/`;
    console.log("Lokale Vorschau läuft:");
    console.log(`  ${url}\n`);
    console.log("Änderungen sehen: Seite im Browser neu laden (F5).");
    console.log("Beenden: dieses Fenster schließen.");
    if (!process.env.VORSCHAU_NICHT_OEFFNEN) exec(`start "" "${url}"`);
  });
}
listen(START_PORT);
