/* ==========================================================================
   Medien-Skript
   --------------------------------------------------------------------------
   Bereitet Bilder & Videos aus "media-original/" für die Website auf:
   - verkleinert Bilder und speichert sie als WebP in "media/"
   - erzeugt quadratische Kacheln und kleine Vorschaubilder
   - schreibt die Liste aller Medien nach "media.js" (liest die Website automatisch)

   Start: Doppelklick auf "medien-aktualisieren.bat" im Website-Ordner.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "media-original");
const OUT = path.join(ROOT, "media");
const MANIFEST = path.join(ROOT, "media.js");
const STATE = path.join(ROOT, "tools", "generiert.json");

const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".gif"]);
const VIDEO = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const COVER_NAMES = new Set(["cover", "titelbild", "kachel"]);
const QUALITY = 82;
const VIDEO_WARN_MB = 20;
const VIDEO_MAX_MB = 95; // GitHub lehnt Dateien über 100 MB ab

const generated = new Set();
const stats = { neu: 0, gleich: 0, warnungen: 0 };

/* ---------- Helfer -------------------------------------------------------- */
const log = (msg = "") => console.log(msg);
const warn = (msg) => { stats.warnungen++; console.log(`    ⚠ ${msg}`); };
const url = (abs) => path.relative(ROOT, abs).split(path.sep).join("/");
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "datei";
}

// "02_Detail Cockpit.jpg" → { caption: "Detail Cockpit", isCover: false }
function parseName(file) {
  const base = path.parse(file).name;
  const m = base.match(/^\d+[\s._-]*(.*)$/);
  const caption = (m ? m[1] : base).replace(/_+/g, " ").replace(/\s+/g, " ").trim();
  return { base, caption, isCover: COVER_NAMES.has(caption.toLowerCase()) };
}

const listFiles = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && !/^[._]/.test(d.name) && !/^(thumbs\.db|desktop\.ini)$/i.test(d.name))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, "de", { numeric: true }))
  : [];

const listDirs = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !/^[._]/.test(d.name)).map((d) => d.name)
  : [];

// Nur neu rechnen, wenn das Original neuer ist als das Ergebnis
const isFresh = (src, dest) => fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;

async function image(src, dest, transform) {
  generated.add(dest);
  if (isFresh(src, dest)) { stats.gleich++; return url(dest); }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const animated = path.extname(src).toLowerCase() === ".gif";
  await transform(sharp(src, { animated }).autoOrient()).webp({ quality: QUALITY, effort: 5 }).toFile(dest);
  stats.neu++;
  return url(dest);
}

function copy(src, dest) {
  generated.add(dest);
  if (isFresh(src, dest)) { stats.gleich++; return url(dest); }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  stats.neu++;
  return url(dest);
}

const full = (s) => s.resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
const small = (s) => s.resize({ width: 360, height: 360, fit: "inside", withoutEnlargement: true });
const tile = (s) => s.resize({ width: 1200, height: 1200, fit: "cover", position: sharp.strategy.attention });
const portrait = (s) => s.resize({ width: 1000, height: 1250, fit: "cover", position: sharp.strategy.attention });

function readContent() {
  const ctx = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, "content.js"), "utf8"), ctx);
  } catch (e) {
    log(`⚠ content.js enthält einen Fehler und konnte nicht gelesen werden: ${e.message}`);
    log("  Projekte werden trotzdem anhand der Ordnernamen verarbeitet.\n");
  }
  return ctx.window.PORTFOLIO || {};
}

/* ---------- Projekte ------------------------------------------------------ */
async function processProject(dir, projects) {
  const key = slugify(dir);
  const proj = projects.find((p) => p.slug === key || slugify(p.title || "") === key);
  const slug = proj ? proj.slug : key;
  const srcDir = path.join(SRC, "projekte", dir);
  const outDir = path.join(OUT, "projekte", slug);
  const files = listFiles(srcDir);

  if (!files.length) { log(`  · ${dir}: noch leer`); return null; }
  log(`  ▸ ${dir}${proj ? "" : "  (neues Projekt)"}`);

  // Ein Bild mit gleichem Namen wie ein Video (03_Turntable.jpg + 03_Turntable.mp4) wird dessen Vorschaubild
  const videoBases = new Set(files.filter((f) => VIDEO.has(path.extname(f).toLowerCase())).map((f) => path.parse(f).name));
  const posters = new Map();
  const images = files.filter((f) => IMAGE.has(path.extname(f).toLowerCase()) && !videoBases.has(path.parse(f).name));
  const coverFile = images.find((f) => parseName(f).isCover) || images[0];
  const entry = { cover: "", thumb: "", media: [] };
  if (!proj) entry.title = dir;
  let nImg = 0, nVid = 0;
  const pendingPosters = [];

  for (const file of files) {
    const src = path.join(srcDir, file);
    const ext = path.extname(file).toLowerCase();
    const { base, caption } = parseName(file);
    const name = slugify(base);
    try {
      if (IMAGE.has(ext) && videoBases.has(base)) {
        posters.set(base, {
          poster: await image(src, path.join(outDir, `${name}-poster.webp`), full),
          thumb: await image(src, path.join(outDir, `${name}-klein.webp`), small),
        });
      } else if (IMAGE.has(ext)) {
        const src1 = await image(src, path.join(outDir, `${name}.webp`), full);
        nImg++;
        if (file === coverFile) {
          entry.cover = src1;
          entry.thumb = await image(src, path.join(outDir, "kachel.webp"), tile);
          continue;
        }
        const item = { type: "image", src: src1, thumb: await image(src, path.join(outDir, `${name}-klein.webp`), small) };
        if (caption) item.caption = caption;
        entry.media.push(item);
      } else if (VIDEO.has(ext)) {
        const size = fs.statSync(src).size;
        if (size / 1024 / 1024 > VIDEO_MAX_MB) {
          warn(`${file} ist ${mb(size)} MB groß und wird übersprungen (GitHub erlaubt max. 100 MB). Tipp: mit HandBrake verkleinern oder auf YouTube hochladen.`);
          continue;
        }
        if (size / 1024 / 1024 > VIDEO_WARN_MB) warn(`${file} ist ${mb(size)} MB groß und lädt für Besucher langsam. Tipp: mit HandBrake verkleinern (Ziel: unter ${VIDEO_WARN_MB} MB).`);
        if (ext === ".mov") warn(`${file}: .mov läuft nicht in allen Browsern. Besser als .mp4 exportieren.`);
        const item = { type: "video", src: copy(src, path.join(outDir, `${name}${ext}`)) };
        if (caption) item.caption = caption;
        entry.media.push(item);
        nVid++;
        pendingPosters.push([base, item]);
      } else if (ext === ".heic") {
        warn(`${file}: HEIC wird nicht unterstützt. Bitte als JPG exportieren.`);
      } else {
        warn(`${file}: Dateityp ${ext || "?"} wird ignoriert.`);
      }
    } catch (e) {
      warn(`${file} konnte nicht verarbeitet werden: ${e.message}`);
    }
  }

  for (const [base, item] of pendingPosters) {
    const p = posters.get(base);
    if (p) Object.assign(item, p);
    else log(`    · Tipp: Für ein Vorschaubild zum Video ein Bild „${base}.jpg“ daneben legen.`);
  }

  log(`    ${nImg} Bild${nImg === 1 ? "" : "er"}, ${nVid} Video${nVid === 1 ? "" : "s"}${entry.cover ? ` · Cover: ${coverFile}` : ""}`);
  if (!proj) log(`    → Texte ergänzen: in content.js ein Projekt mit  slug: "${slug}"  anlegen.`);
  return [slug, entry];
}

/* ---------- Über mich (Porträt & Lebenslauf) ----------------------------- */
async function processAbout(manifest) {
  const dir = path.join(SRC, "ueber-mich");
  const files = listFiles(dir);
  const img = files.find((f) => IMAGE.has(path.extname(f).toLowerCase()));
  const pdf = files.find((f) => path.extname(f).toLowerCase() === ".pdf");
  if (!img && !pdf) { log("  · ueber-mich: noch leer (Porträt & Lebenslauf-PDF hier ablegen)"); return; }
  log("  ▸ ueber-mich");
  if (img) manifest.portrait = await image(path.join(dir, img), path.join(OUT, "ueber-mich", "portrait.webp"), portrait);
  if (pdf) manifest.cv = copy(path.join(dir, pdf), path.join(OUT, "ueber-mich", "lebenslauf.pdf"));
  log(`    ${img ? `Porträt: ${img}` : "kein Porträt"} · ${pdf ? `Lebenslauf: ${pdf}` : "kein Lebenslauf"}`);
}

/* ---------- Ablauf --------------------------------------------------------- */
async function main() {
  log("Medien aktualisieren");
  log("====================\n");

  const content = readContent();
  const projects = (content.projects || []).filter((p) => p && p.slug);

  // Ordnerstruktur anlegen: ein Ordner pro Projekt aus content.js
  fs.mkdirSync(path.join(SRC, "ueber-mich"), { recursive: true });
  const existing = listDirs(path.join(SRC, "projekte")).map(slugify);
  for (const p of projects) {
    if (!existing.includes(p.slug) && !existing.includes(slugify(p.title || ""))) {
      fs.mkdirSync(path.join(SRC, "projekte", p.slug), { recursive: true });
    }
  }

  const manifest = { projects: {} };
  await processAbout(manifest);
  for (const dir of listDirs(path.join(SRC, "projekte")).sort((a, b) => a.localeCompare(b, "de", { numeric: true }))) {
    const res = await processProject(dir, projects);
    if (res) manifest.projects[res[0]] = res[1];
  }

  // Dateien entfernen, deren Original gelöscht wurde
  let removed = 0;
  const previous = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : [];
  for (const rel of previous) {
    const abs = path.join(ROOT, rel);
    if (!generated.has(abs) && fs.existsSync(abs)) { fs.rmSync(abs); removed++; }
  }
  const now = [...generated].map(url).sort();
  fs.writeFileSync(STATE, JSON.stringify(now, null, 2) + "\n");

  const js = "// Automatisch erzeugt von medien-aktualisieren.bat – bitte nicht von Hand bearbeiten.\n" +
    `window.PORTFOLIO_MEDIA = ${JSON.stringify(manifest, null, 2)};\n`;
  const changed = !fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== js;
  if (changed) fs.writeFileSync(MANIFEST, js);

  log("\n--------------------");
  log(`Fertig: ${stats.neu} Datei(en) neu erstellt, ${stats.gleich} unverändert${removed ? `, ${removed} veraltete entfernt` : ""}.`);
  if (stats.warnungen) log(`${stats.warnungen} Hinweis(e) – siehe ⚠ oben.`);
  log("\nNächste Schritte: index.html öffnen und prüfen, dann mit GitHub Desktop hochladen (Commit + Push).");
}

main().catch((e) => {
  console.error(`\nFehler: ${e.message}`);
  process.exitCode = 1;
});
