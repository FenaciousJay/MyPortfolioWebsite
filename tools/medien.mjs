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

// Ordnername → Projekttitel. Reine Kurznamen ("night-shift") behalten den Titel aus content.js.
const looksLikeSlug = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
function folderTitle(dir, proj) {
  if (!looksLikeSlug(dir)) return dir;
  return proj ? "" : dir.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}
// Titel → gültiger Windows-Ordnername
const safeName = (s) => String(s).replace(/[\\/:*?"<>|]+/g, "-").replace(/[. ]+$/, "").trim() || "projekt";

// "Fingerabdruck" eines Ordners (Dateinamen + Größen) – erkennt umbenannte Ordner wieder
const signature = (dir) => listFiles(dir).map((f) => `${f}|${fs.statSync(path.join(dir, f)).size}`);
function similarity(a, b) {
  if (!a.length || !b.length) return 0;
  const set = new Set(b);
  return a.filter((x) => set.has(x)).length / Math.max(a.length, b.length);
}

/* ---------- content.js automatisch pflegen -------------------------------
   Vor jeder Änderung wird eine Sicherung angelegt: tools/content-sicherung.js
   ------------------------------------------------------------------------- */
const CONTENT = path.join(ROOT, "content.js");
let backedUp = false;
function writeContent(src) {
  if (!backedUp) { fs.copyFileSync(CONTENT, path.join(ROOT, "tools", "content-sicherung.js")); backedUp = true; }
  fs.writeFileSync(CONTENT, src);
}

// slug eines Projekts in content.js ändern (nur wenn er dort genau einmal vorkommt)
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function renameSlugInContent(oldSlug, newSlug, oldTitle, newTitle) {
  let src = fs.readFileSync(CONTENT, "utf8");
  const re = new RegExp(`(slug\\s*:\\s*)(["'])${reEscape(oldSlug)}\\2`, "g");
  if ((src.match(re) || []).length !== 1) return false;
  src = src.replace(re, `$1"${newSlug}"`);
  if (oldTitle && newTitle) { // Titel nur ändern, wenn er noch dem alten Ordnernamen entspricht
    const rt = new RegExp(`(title\\s*:\\s*)(["'])${reEscape(oldTitle)}\\2`, "g");
    if ((src.match(rt) || []).length === 1) src = src.replace(rt, `$1${JSON.stringify(newTitle)}`);
  }
  writeContent(src);
  return true;
}

// Position der schließenden Klammer zu "[" bei start (überspringt Texte und Kommentare)
function findClosing(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++;
    } else if (c === "/" && src[i + 1] === "/") {
      i = src.indexOf("\n", i);
      if (i < 0) return -1;
    } else if (c === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i + 2) + 1;
      if (i <= 0) return -1;
    } else if ("[{(".includes(c)) depth++;
    else if ("]})".includes(c) && --depth === 0) return i;
  }
  return -1;
}

// Grundgerüst für ein neues Projekt (Texte füllst du danach aus)
function projectSkeleton(slug, title, year) {
  return [
    "    {",
    `      slug: ${JSON.stringify(slug)},`,
    `      title: ${JSON.stringify(title)},   // Titel auf der Seite – frei änderbar`,
    '      subtitle: "",',
    '      category: "",        // z. B. "3D", "Illustration" – erscheint als Filter',
    `      year: "${year}",`,
    "      featured: false,     // true = Kachel doppelt so groß",
    "      info: {",
    '        "Rolle": "",',
    '        "Software": "",',
    "      },",
    "      description: [",
    '        "",',
    "      ],",
    "      media: [],           // z. B. { type: \"youtube\", url: \"https://…\" }",
    "    },",
  ].join("\n");
}

// Neue Projekte ans Ende der Projektliste in content.js anhängen
function addProjectsToContent(entries) {
  const src = fs.readFileSync(CONTENT, "utf8");
  const m = /\bprojects\s*:\s*\[/.exec(src);
  const end = m ? findClosing(src, m.index + m[0].length - 1) : -1;
  if (end < 0) return false;
  const head = src.slice(0, end).replace(/\s*$/, "");
  const comma = /[[,]$/.test(head) ? "" : ",";
  writeContent(`${head}${comma}\n${entries.map((e) => projectSkeleton(e.slug, e.title, e.year)).join("\n")}\n  ${src.slice(end)}`);
  return true;
}

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

// Breite & Höhe eines erzeugten Bildes – die Website braucht sie für weiche Übergänge
async function dim(rel) {
  const m = await sharp(path.join(ROOT, rel)).metadata();
  return [m.width, m.height];
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
const previewSize = (s) => s.resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true });
const portrait = (s) => s.resize({ width: 1000, height: 1250, fit: "cover", position: sharp.strategy.attention });

// Häufiger Tippfehler: category: "3D", "Illustration",  →  category: ["3D", "Illustration"],
function repairCategories() {
  const src = fs.readFileSync(CONTENT, "utf8");
  const fixed = [];
  const out = src.replace(/^([ \t]*category\s*:\s*)("[^"\r\n]*"(?:\s*,\s*"[^"\r\n]*")+)(\s*,)/gm, (m, head, list, tail, offset) => {
    fixed.push(src.slice(0, offset).split("\n").length);
    return `${head}[${list}]${tail}`;
  });
  if (!fixed.length) return;
  writeContent(out);
  log(`  ✎ content.js: mehrere Kategorien in [ ] gesetzt (Zeile ${fixed.join(", ")})`);
}

function readContent() {
  repairCategories();
  const ctx = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, "content.js"), "utf8"), ctx, { filename: "content.js" });
  } catch (e) {
    const line = (/content\.js:(\d+)/.exec(e.stack || "") || [])[1];
    log(`⚠ content.js enthält einen Fehler${line ? ` in Zeile ${line}` : ""} und konnte nicht gelesen werden: ${e.message}`);
    if (line) log(`    → ${fs.readFileSync(path.join(ROOT, "content.js"), "utf8").split(/\r?\n/)[line - 1].trim()}`);
    log("  Bitte korrigieren – bis dahin trägt das Skript nichts in content.js ein.");
    log("  Projekte werden trotzdem anhand der Ordnernamen verarbeitet.\n");
  }
  return ctx.window.PORTFOLIO || {};
}

/* ---------- Projekte ------------------------------------------------------ */
async function processProject(dir, projects) {
  const key = slugify(dir);
  const proj = projects.find((p) => slugify(p.slug) === key || slugify(p.title || "") === key);
  const slug = proj ? slugify(proj.slug) : key; // immer die vereinheitlichte Form (wie auf der Website)
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
  const title = folderTitle(dir, proj);
  if (title) entry.title = title;
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
          entry.coverDim = await dim(src1);
          entry.thumb = await image(src, path.join(outDir, "kachel.webp"), tile);
          entry.preview = await image(src, path.join(outDir, "vorschau.webp"), previewSize); // unbeschnitten, für das Mauerwerk-Raster
          continue;
        }
        const item = { type: "image", src: src1, thumb: await image(src, path.join(outDir, `${name}-klein.webp`), small), dim: await dim(src1) };
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
  return [slug, entry, { dir, sig: signature(srcDir) }];
}

/* ---------- YouTube-Vorschaubilder ----------------------------------------
   Werden einmalig von YouTube geladen und lokal gespeichert. So sendet die Seite
   erst beim Klick auf "Play" Daten an YouTube (datenschutzfreundlich).
   -------------------------------------------------------------------------- */
function youtubeId(v) {
  const s = String(v || "").trim();
  const m = s.match(/(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(s) ? s : "";
}

async function processYoutube(projects, manifest) {
  const ids = new Set();
  for (const p of projects) {
    for (const m of [].concat(p.media || [])) {
      if (m && m.type === "youtube" && !m.poster) { const id = youtubeId(m.id || m.url); if (id) ids.add(id); }
    }
  }
  if (!ids.size) return;
  log("  ▸ YouTube-Vorschaubilder");
  manifest.youtube = {};
  for (const id of ids) {
    const posterFile = path.join(OUT, "youtube", `${id}.webp`);
    const thumbFile = path.join(OUT, "youtube", `${id}-klein.webp`);
    generated.add(posterFile);
    generated.add(thumbFile);
    if (fs.existsSync(posterFile) && fs.existsSync(thumbFile)) {
      stats.gleich += 2;
    } else {
      let buf = null;
      for (const q of ["maxresdefault", "sddefault", "hqdefault"]) { // beste verfügbare Auflösung
        try {
          const r = await fetch(`https://i.ytimg.com/vi/${id}/${q}.jpg`);
          if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); break; }
        } catch { /* nächste Größe versuchen */ }
      }
      if (!buf) { warn(`Vorschaubild für YouTube-Video ${id} konnte nicht geladen werden (Internet? Video privat?).`); generated.delete(posterFile); generated.delete(thumbFile); continue; }
      fs.mkdirSync(path.dirname(posterFile), { recursive: true });
      await sharp(buf).resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(posterFile);
      await small(sharp(buf)).webp({ quality: QUALITY }).toFile(thumbFile);
      stats.neu += 2;
    }
    manifest.youtube[id] = { poster: url(posterFile), thumb: url(thumbFile) };
  }
  log(`    ${ids.size} Video${ids.size === 1 ? "" : "s"}`);
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
  const projDir = path.join(SRC, "projekte");
  fs.mkdirSync(path.join(SRC, "ueber-mich"), { recursive: true });
  fs.mkdirSync(projDir, { recursive: true });

  // Stand vom letzten Lauf (ältere Versionen speicherten nur eine Dateiliste)
  let state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {};
  if (Array.isArray(state)) state = { files: state };
  state = { files: state.files || [], folders: state.folders || {} };

  const dirs = () => listDirs(projDir).map((dir) => ({ dir, key: slugify(dir), sig: signature(path.join(projDir, dir)) }));
  const owner = (d) => projects.find((p) => slugify(p.slug) === d.key || slugify(p.title || "") === d.key);

  // Umbenannte Ordner erkennen: Projekt ohne Ordner + neuer Ordner mit denselben Dateien
  for (const p of projects) {
    const current = dirs();
    if (current.some((d) => owner(d) === p)) continue;
    const before = state.folders[slugify(p.slug)];
    if (!before || !before.sig || !before.sig.length) continue;
    const hits = current.filter((d) => !owner(d) && similarity(d.sig, before.sig) >= 0.6);
    if (hits.length !== 1) continue;
    const newSlug = hits[0].key;
    if (renameSlugInContent(p.slug, newSlug, before.dir, folderTitle(hits[0].dir, null))) {
      log(`  ↻ Umbenennung erkannt: „${before.dir || p.title || p.slug}“ → „${hits[0].dir}“ – slug in content.js angepasst`);
      state.folders[newSlug] = before;
      p.slug = newSlug;
    }
  }

  // Für Ordner ohne Eintrag in content.js automatisch ein Grundgerüst anlegen
  const orphans = dirs().filter((d) => !owner(d) && d.sig.length); // leere Ordner ignorieren
  if (orphans.length && content.projects) {
    const entries = orphans.map((d) => {
      const files = listFiles(path.join(projDir, d.dir));
      const times = files.map((f) => fs.statSync(path.join(projDir, d.dir, f)).mtime.getFullYear());
      return { slug: d.key, title: folderTitle(d.dir, null), year: times.length ? Math.min(...times) : new Date().getFullYear() };
    });
    if (addProjectsToContent(entries)) {
      for (const e of entries) {
        projects.push({ slug: e.slug, title: e.title });
        log(`  ✚ Neues Projekt in content.js angelegt: „${e.title}“ – Texte dort ergänzen`);
      }
    } else {
      warn("Neue Projekte konnten nicht automatisch in content.js eingetragen werden (Projektliste nicht gefunden).");
    }
  }

  // Ein Ordner pro Projekt aus content.js – benannt nach dem Titel.
  // Leere Ordner mit Kurznamen (z. B. "kintsugi") werden in den Titel umbenannt.
  for (const p of projects) {
    const want = safeName(p.title || p.slug);
    const mine = dirs().find((d) => owner(d) === p);
    if (!mine) {
      fs.mkdirSync(path.join(projDir, want), { recursive: true });
    } else if (mine.dir !== want && looksLikeSlug(mine.dir) && !mine.sig.length && slugify(want) === mine.key) {
      try { fs.renameSync(path.join(projDir, mine.dir), path.join(projDir, want)); } catch { /* egal, dann bleibt der alte Name */ }
    }
  }

  const manifest = { projects: {} };
  const folders = {};
  await processAbout(manifest);
  for (const dir of listDirs(projDir).sort((a, b) => a.localeCompare(b, "de", { numeric: true }))) {
    const res = await processProject(dir, projects);
    if (res) { manifest.projects[res[0]] = res[1]; folders[res[0]] = res[2]; }
  }
  await processYoutube(projects, manifest);

  // Dateien entfernen, deren Original gelöscht wurde
  let removed = 0;
  for (const rel of state.files) {
    const abs = path.join(ROOT, rel);
    if (!generated.has(abs) && fs.existsSync(abs)) { fs.rmSync(abs); removed++; }
  }
  for (const d of listDirs(path.join(OUT, "projekte"))) {
    const abs = path.join(OUT, "projekte", d);
    if (!fs.readdirSync(abs).length) fs.rmdirSync(abs);
  }
  const ytDir = path.join(OUT, "youtube");
  if (fs.existsSync(ytDir) && !fs.readdirSync(ytDir).length) fs.rmdirSync(ytDir);
  const now = { files: [...generated].map(url).sort(), folders };
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
