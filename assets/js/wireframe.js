/* ==========================================================================
   TEST: Dezentes Wireframe an den freien Seitenrändern
   --------------------------------------------------------------------------
   - wabert ganz leicht im Hintergrund
   - lässt sich an den Rändern mit der Maus ziehen und federt danach zurück
   - erscheint nur, wenn links/rechts neben dem Inhalt genug Platz frei ist

   Ausschalten:  in content.js  site.wireframe: false
   Ganz entfernen: diese Datei, den <script>-Tag in index.html und den
                   "Wireframe"-Block in style.css löschen.
   ========================================================================== */
(() => {
  "use strict";

  if (((window.PORTFOLIO || {}).site || {}).wireframe === false) return;

  const root = document.documentElement;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  const SPACING = 46;    // Maschenweite in px
  const OVERLAP = 40;    // so weit reicht das Netz (unsichtbar auslaufend) in den Inhalt
  const MIN_FREE = 90;   // erst ab so viel freiem Rand anzeigen
  const RADIUS = 190;    // Einflussbereich beim Ziehen
  const MAX_PULL = 130;  // maximale Auslenkung (weich begrenzt)
  const ALPHA = 0.077;   // Grundsichtbarkeit der Linien
  const BUCKETS = 10;

  const canvas = document.createElement("canvas");
  canvas.className = "wireframe";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0, dpr = 1, side = 0, colors = {};
  let verts = [], edges = [];
  let drag = null, cleared = false;
  const t0 = performance.now();

  const rand = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = (x) => x * x * (3 - 2 * x);

  /* ---------- Netz aufbauen ------------------------------------------------ */
  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const css = getComputedStyle(root);
    colors = { line: css.getPropertyValue("--fg").trim() || "#ecebe7", accent: css.getPropertyValue("--accent").trim() || "#ff5a36" };
    const maxw = parseFloat(css.getPropertyValue("--maxw")) || 1280;
    const free = (W - Math.min(W, maxw)) / 2;
    verts = [];
    edges = [];
    side = free + OVERLAP;
    if (free < MIN_FREE) return;

    const cols = Math.ceil(side / SPACING) + 2;
    const rows = Math.ceil(H / SPACING) + 3;
    for (const s of [0, 1]) { // 0 = links, 1 = rechts
      const base = verts.length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = base + r * cols + c;
          const edge = (c - 0.5) * SPACING + (rand(i) - 0.5) * SPACING * 0.3; // Abstand vom äußeren Rand
          const y = (r - 1) * SPACING + (c % 2) * SPACING * 0.5 + (rand(i + 77) - 0.5) * SPACING * 0.3;
          const w = Math.max(0, Math.min(1, (side - edge) / (side * 0.9)));
          verts.push({ rx: s ? W - edge : edge, ry: y, s, w: smooth(w), dx: 0, dy: 0, vx: 0, vy: 0, px: 0, py: 0, pull: 0 });
          // Dreiecksnetz: versetzte Spalten
          if (c > 0) edges.push([i, i - 1]);
          if (r > 0) edges.push([i, i - cols]);
          if (c > 0 && c % 2 && r < rows - 1) edges.push([i, i + cols - 1]);
          if (c > 0 && !(c % 2) && r > 0) edges.push([i, i - cols - 1]);
        }
      }
    }
  }

  /* ---------- Ziehen ------------------------------------------------------- */
  const blocked = (el) => el.closest && el.closest("a, button, input, textarea, select, label, .card, .row, .chips, [data-cursor], .project, .lightbox");
  const inZone = (x) => verts.length && (x < side - OVERLAP || x > W - (side - OVERLAP));

  if (fine) {
    addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || root.classList.contains("is-locked") || !inZone(e.clientX) || blocked(e.target)) return;
      e.preventDefault(); // keine Textauswahl beim Ziehen
      drag = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 };
      for (const v of verts) {
        const d = Math.hypot(v.px - e.clientX, v.py - e.clientY);
        v.pull = d < RADIUS ? (1 - d / RADIUS) ** 2 : 0;
      }
      root.classList.add("is-dragging-mesh");
    });
    addEventListener("pointermove", (e) => {
      if (!drag) return;
      const soft = (v) => MAX_PULL * Math.tanh(v / MAX_PULL); // je weiter, desto schwerer
      drag.dx = soft(e.clientX - drag.x0);
      drag.dy = soft(e.clientY - drag.y0);
    });
    const release = () => {
      if (!drag) return;
      drag = null;
      for (const v of verts) v.pull = 0;
      root.classList.remove("is-dragging-mesh");
    };
    addEventListener("pointerup", release);
    addEventListener("pointercancel", release);
    addEventListener("blur", release);
  }

  /* ---------- Bewegung & Zeichnen ----------------------------------------- */
  function frame(now) {
    requestAnimationFrame(frame);
    if (!verts.length || root.classList.contains("is-locked")) {
      if (!cleared) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); cleared = true; }
      return;
    }
    cleared = false;
    const t = (now - t0) / 1000;
    const still = reduce.matches;

    for (const v of verts) {
      // Feder: zum Zielpunkt (beim Ziehen) bzw. zurück in die Ruhelage
      const tx = drag ? v.pull * drag.dx : 0;
      const ty = drag ? v.pull * drag.dy : 0;
      v.vx = (v.vx + (tx - v.dx) * 0.07) * 0.84;
      v.vy = (v.vy + (ty - v.dy) * 0.07) * 0.84;
      v.dx += v.vx;
      v.dy += v.vy;
      // ganz leichtes Wabern
      const ix = still ? 0 : Math.sin(v.ry * 0.011 + t * 0.5 + v.s * 2.1) * 6 + Math.sin(v.rx * 0.019 - t * 0.27) * 2.5;
      const iy = still ? 0 : Math.cos(v.rx * 0.016 + t * 0.38) * 4.5;
      v.px = v.rx + ix + v.dx;
      v.py = v.ry + iy + v.dy;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;

    // Linien nach Sichtbarkeit gruppieren (schneller als jede Linie einzeln)
    const buckets = Array.from({ length: BUCKETS }, () => []);
    const hot = [];
    for (const e of edges) {
      const a = verts[e[0]], b = verts[e[1]];
      const w = Math.min(a.w, b.w);
      if (w < 0.03) continue;
      buckets[Math.min(BUCKETS - 1, Math.floor(w * BUCKETS))].push(a, b);
      const energy = Math.min(1, (Math.hypot(a.dx, a.dy) + Math.hypot(b.dx, b.dy)) / 120);
      if (energy > 0.04) hot.push(a, b, energy * w);
    }
    ctx.strokeStyle = colors.line;
    buckets.forEach((list, i) => {
      if (!list.length) return;
      ctx.globalAlpha = ((i + 0.5) / BUCKETS) * ALPHA;
      ctx.beginPath();
      for (let k = 0; k < list.length; k += 2) { ctx.moveTo(list[k].px, list[k].py); ctx.lineTo(list[k + 1].px, list[k + 1].py); }
      ctx.stroke();
    });
    // gezogene Bereiche leicht in der Akzentfarbe
    ctx.strokeStyle = colors.accent;
    for (let k = 0; k < hot.length; k += 3) {
      ctx.globalAlpha = hot[k + 2] * 0.315;
      ctx.beginPath();
      ctx.moveTo(hot[k].px, hot[k].py);
      ctx.lineTo(hot[k + 1].px, hot[k + 1].py);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  let resizeT;
  addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(build, 150); });
  build();
  requestAnimationFrame(frame);
})();
