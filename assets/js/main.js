/* ==========================================================================
   Portfolio — Logik
   Liest alle Inhalte aus content.js (window.PORTFOLIO) und baut die Seite.
   Normalerweise musst du hier nichts ändern.
   ========================================================================== */
(() => {
  "use strict";

  const D = window.PORTFOLIO;
  if (!D) {
    document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">content.js konnte nicht gelesen werden. ' +
      "Meist ist es ein Tippfehler, z. B. ein fehlendes Komma oder Anführungszeichen. " +
      "Öffne die Browser-Konsole (F12), dort steht die genaue Zeile.</p>";
    return;
  }

  /* ---------- Helfer ------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const reduce = () => mqReduce.matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (v) => (v == null || v === "" ? [] : [].concat(v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const P = D.person || {};
  const site = D.site || {};
  const projects = list(D.projects).filter((p) => p && p.slug);
  const fullName = [P.firstName, P.lastName].filter(Boolean).join(" ");
  const baseTitle = site.title || fullName || "Portfolio";

  /* ---------- Platzhalter & Medien ---------------------------------------- */
  function hash(str) {
    let h = 2166136261;
    for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  // Erzeugt aus einem Namen + Farbpalette einen eindeutigen Farbverlauf.
  function placeholderBg(seed, palette) {
    const [a = "#4a4a52", b = "#8d8c87", c = "#16161a"] = list(palette);
    const h = hash(seed);
    const r = (s) => ((h >>> s) & 255) / 255;
    return `background:radial-gradient(circle at ${(15 + r(0) * 70).toFixed(1)}% ${(15 + r(8) * 70).toFixed(1)}%, ${a} 0%, transparent 58%),` +
      `radial-gradient(circle at ${(r(16) * 100).toFixed(1)}% ${(r(24) * 100).toFixed(1)}%, ${b} 0%, transparent 52%),` +
      `linear-gradient(${Math.round(r(4) * 360)}deg, ${c}, #0c0c0d)`;
  }

  function media(src, { seed = src, palette, alt = "", cls = "", natural = false, ratio, eager = false, video = false, poster } = {}) {
    let style = placeholderBg(seed || "x", palette);
    if (ratio) style += `;--ratio:${ratio}`;
    let inner = "";
    if (src && video) {
      inner = `<video src="${esc(src)}"${poster ? ` poster="${esc(poster)}"` : ""} muted loop playsinline autoplay preload="metadata"></video>`;
    } else if (src) {
      inner = `<img src="${esc(src)}" alt="${esc(alt)}"${eager ? "" : ' loading="lazy"'} decoding="async">`;
    }
    const classes = ["ph", natural && "ph--natural", !src && "is-missing", cls].filter(Boolean).join(" ");
    return `<div class="${classes}" style="${esc(style)}">${inner}<span class="ph__hint">+ ${esc(src || "Datei fehlt")}</span></div>`;
  }

  // Bilder/Videos melden, ob sie geladen wurden – sonst bleibt der Platzhalter.
  const isPh = (t) => t.parentElement && t.parentElement.classList.contains("ph");
  document.addEventListener("load", (e) => { if (e.target.tagName === "IMG" && isPh(e.target)) e.target.parentElement.classList.add("is-loaded"); }, true);
  document.addEventListener("loadeddata", (e) => { if (e.target.tagName === "VIDEO" && isPh(e.target)) e.target.parentElement.classList.add("is-loaded"); }, true);
  document.addEventListener("error", (e) => {
    const t = e.target;
    if ((t.tagName === "IMG" || t.tagName === "VIDEO") && isPh(t)) { t.parentElement.classList.add("is-missing"); t.remove(); }
  }, true);

  // Text in einzelne Buchstaben zerlegen (für Animationen)
  function splitHTML(text) {
    let i = 0;
    return String(text ?? "").split(" ").map((w) =>
      `<span class="word">${[...w].map((c) => `<span class="ch-wrap"><span class="ch" style="--i:${i++}">${esc(c)}</span></span>`).join("")}</span>`
    ).join(" ");
  }

  /* ---------- Grunddaten ---------------------------------------------------- */
  document.title = baseTitle;
  if (site.description) $('meta[name="description"]').setAttribute("content", site.description);
  if (site.accent) root.style.setProperty("--accent", site.accent);
  if (site.showPlaceholderHints === false) root.classList.add("no-hints");

  const binds = {
    initials: ((P.firstName || "")[0] || "") + ((P.lastName || "")[0] || ""),
    location: P.location, availableText: P.availableText, role: P.role, intro: P.intro,
    statement: D.about && D.about.statement, email: P.email, fullName,
  };
  $$("[data-bind]").forEach((el) => { el.textContent = binds[el.dataset.bind] ?? ""; });
  $("#status").hidden = !P.available;
  const year = new Date().getFullYear();
  $("#year").textContent = year;
  $("#footYear").textContent = year;

  /* ---------- Hero ----------------------------------------------------------- */
  $("#firstName").innerHTML = splitHTML(P.firstName);
  $("#lastName").innerHTML = splitHTML(P.lastName);

  // Lange Namen automatisch verkleinern, damit sie nie über den Rand ragen
  function fitName() {
    const h = $(".hero__name");
    h.style.fontSize = "";
    const w = Math.max(...$$(".hero__line", h).map((l) => l.scrollWidth));
    if (w > h.clientWidth) h.style.fontSize = `${(parseFloat(getComputedStyle(h).fontSize) * h.clientWidth / w) * 0.98}px`;
  }
  addEventListener("resize", fitName);

  const ready = () => {
    fitName();
    root.classList.add("is-ready");
    setTimeout(() => root.classList.add("intro-done"), 2200);
    buildMarquee();
  };
  (document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve()).then(ready);

  // Uhr mit blinkendem Doppelpunkt
  const clock = $("#clock");
  function tickClock() {
    const opts = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" };
    let parts;
    try { parts = new Intl.DateTimeFormat("de-DE", { ...opts, timeZone: P.timezone }).formatToParts(new Date()); }
    catch { parts = new Intl.DateTimeFormat("de-DE", opts).formatToParts(new Date()); }
    const get = (t) => (parts.find((p) => p.type === t) || {}).value || "";
    clock.innerHTML = `${get("hour")}<span class="blink">:</span>${get("minute")}`;
  }
  tickClock();
  setInterval(tickClock, 10000);

  /* ---------- Laufband ------------------------------------------------------- */
  const track = $("#marquee");
  const marquee = { x: 0, unit: 0, speed: 0, dir: 1 };
  function buildMarquee() {
    const words = list(D.disciplines);
    if (!words.length) { track.parentElement.hidden = true; return; }
    const unit = words.map((w) => `<span>${esc(w)}<b>✦</b></span>`).join("");
    track.innerHTML = unit;
    marquee.unit = track.scrollWidth || 1;
    track.innerHTML = unit.repeat(Math.ceil((innerWidth * 2) / marquee.unit) + 1);
  }
  let resizeT;
  addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(buildMarquee, 200); });

  /* ---------- Arbeiten: Raster & Liste -------------------------------------- */
  const grid = $("#grid");
  const listEl = $("#list");
  $("#workCount").textContent = `(${pad(projects.length)})`;

  grid.innerHTML = projects.map((p, i) => `
    <a class="card${p.featured ? " card--featured" : ""} reveal" href="#/projekt/${esc(p.slug)}" data-slug="${esc(p.slug)}" data-cat="${esc(p.category)}" data-cursor="Ansehen" style="--d:${(i % 4) * 70}ms">
      ${media(p.cover, { seed: p.slug, palette: p.palette, alt: p.title })}
      <span class="card__index mono">${pad(i + 1)}</span>
      <div class="card__info">
        <span class="card__cat mono">${esc(p.category)}${p.year ? ` · ${esc(p.year)}` : ""}</span>
        <h3 class="card__title">${esc(p.title)}</h3>
      </div>
    </a>`).join("");

  listEl.innerHTML = projects.map((p, i) => `
    <a class="row" href="#/projekt/${esc(p.slug)}" data-slug="${esc(p.slug)}" data-cat="${esc(p.category)}" data-cursor="Ansehen">
      <span class="row__idx mono">${pad(i + 1)}</span>
      <span class="row__title">${esc(p.title)}</span>
      <span class="row__cat mono">${esc(p.category)}</span>
      <span class="row__year mono">${esc(p.year)}</span>
    </a>`).join("");

  // Filter
  const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filters = $("#filters");
  if (cats.length > 1) {
    filters.innerHTML = ["Alle", ...cats].map((c, i) => {
      const n = c === "Alle" ? projects.length : projects.filter((p) => p.category === c).length;
      return `<button type="button" data-cat="${esc(c)}" class="${i === 0 ? "is-active" : ""}" aria-pressed="${i === 0}">${esc(c)}<sup>${n}</sup></button>`;
    }).join("");
  } else filters.hidden = true;

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const cat = btn.dataset.cat;
    $$("button", filters).forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn); });
    let n = 0;
    $$(".card, .row").forEach((el) => {
      const show = cat === "Alle" || el.dataset.cat === cat;
      el.classList.toggle("is-filtered", !show);
      if (show && el.classList.contains("card") && !reduce()) {
        el.classList.remove("is-entering");
        void el.offsetWidth;
        el.style.setProperty("--i", n++);
        el.classList.add("is-entering");
      }
    });
  });
  grid.addEventListener("animationend", (e) => e.target.classList.remove("is-entering"));

  // Raster / Liste umschalten (Auswahl wird gemerkt)
  const viewBtns = $$(".viewtoggle button");
  function setView(v) {
    grid.hidden = v === "list";
    listEl.hidden = v !== "list";
    viewBtns.forEach((b) => { const on = b.dataset.view === v; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
    try { localStorage.setItem("pf-view", v); } catch {}
  }
  viewBtns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  try { if (localStorage.getItem("pf-view") === "list") setView("list"); } catch {}

  // 3D-Neigung & Lichtpunkt auf den Kacheln
  if (fine) {
    grid.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const ph = c.querySelector(".ph");
      ph.style.setProperty("--mx", `${x * 100}%`);
      ph.style.setProperty("--my", `${y * 100}%`);
      if (reduce()) return;
      const k = c.classList.contains("card--featured") ? 3 : 6;
      c.classList.add("is-tilting");
      c.style.setProperty("--ry", `${(x - 0.5) * k}deg`);
      c.style.setProperty("--rx", `${(0.5 - y) * k}deg`);
    });
    grid.addEventListener("pointerout", (e) => {
      const c = e.target.closest(".card");
      if (!c || c.contains(e.relatedTarget)) return;
      c.classList.remove("is-tilting");
      c.style.removeProperty("--rx");
      c.style.removeProperty("--ry");
    });
  }

  // Schwebende Vorschau in der Listenansicht
  const preview = $("#floatPreview");
  const prev = { x: 0, y: 0, slug: null, on: false };
  if (fine) {
    listEl.addEventListener("pointerover", (e) => {
      const row = e.target.closest(".row");
      if (!row) return;
      if (prev.slug !== row.dataset.slug) {
        const p = projects.find((x) => x.slug === row.dataset.slug);
        preview.innerHTML = media(p.cover, { seed: p.slug, palette: p.palette });
        preview.style.setProperty("--fr", `${(Math.random() * 8 - 4).toFixed(1)}deg`);
        prev.slug = row.dataset.slug;
      }
      if (!prev.on) { prev.x = mouse.x; prev.y = mouse.y; }
      prev.on = true;
      preview.classList.add("is-visible");
    });
    listEl.addEventListener("pointerleave", () => { prev.on = false; preview.classList.remove("is-visible"); });
  }

  /* ---------- Über mich ------------------------------------------------------ */
  const about = D.about || {};
  $("#portrait").innerHTML = media(P.portrait, { seed: "portrait", palette: ["#5a5a62", site.accent || "#ff5a36", "#121214"], alt: fullName });
  $("#aboutText").innerHTML = list(about.text).map((t) => `<p>${t}</p>`).join("");
  $("#skills").innerHTML = list(about.skills).map((s) => `<li>${esc(s)}</li>`).join("");
  $("#tools").innerHTML = list(about.tools).map((s) => `<li>${esc(s)}</li>`).join("");
  const cvBtn = $("#cvBtn");
  if (P.cv) cvBtn.href = P.cv; else cvBtn.hidden = true;

  /* ---------- Werdegang ------------------------------------------------------ */
  $("#timeline").innerHTML = list(D.timeline).map((g) => `
    <div class="tl">
      <h3 class="tl__heading mono label reveal">${esc(g.heading)}</h3>
      <div>${list(g.items).map((it) => `
        <div class="tl__item reveal">
          <span class="tl__period mono">${esc(it.period)}</span>
          <div><h4 class="tl__title">${esc(it.title)}</h4>${it.place ? `<p class="tl__place">${esc(it.place)}</p>` : ""}</div>
          <p class="tl__text">${it.text || ""}</p>
        </div>`).join("")}
      </div>
    </div>`).join("");

  /* ---------- Kontakt -------------------------------------------------------- */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  }
  $("#mailto").href = `mailto:${P.email || ""}`;
  $("#mail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(P.email); toast("E-Mail-Adresse kopiert ✓"); }
    catch { location.href = `mailto:${P.email}`; }
  });
  $("#socials").innerHTML = list(D.socials).map((s) =>
    `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} <i aria-hidden="true">↗</i></a></li>`).join("");

  /* ---------- Einblenden beim Scrollen -------------------------------------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  const observe = (scope) => $$(".reveal:not(.is-in)", scope).forEach((el) => io.observe(el));
  observe(document);

  /* ---------- Navigation ein-/ausblenden ------------------------------------ */
  const nav = $("#nav");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* ---------- Projekt-Ansicht ------------------------------------------------ */
  const projEl = $("#project");
  const pScroll = $("#pScroll");
  const FULL = "inset(0% 0% 0% 0% round 0px)";
  let current = null;
  let lastTrigger = null;
  let closeAnim = null;

  function embedHTML(url, label, item, half) {
    const cap = item.caption ? `<figcaption class="mono">${esc(item.caption)}</figcaption>` : "";
    const ratio = esc(item.ratio || "16 / 9");
    if (!url) {
      if (site.showPlaceholderHints === false) return "";
      return `<figure class="p-item${half} reveal"><div class="embed" style="--ratio:${ratio}"><div class="embed__consent">
        <span class="mono">${esc(label)}</span><small>Noch keine ${esc(label)}-ID bzw. URL in content.js eingetragen.</small></div></div>${cap}</figure>`;
    }
    return `<figure class="p-item${half} reveal"><div class="embed" style="--ratio:${ratio}" data-src="${esc(url)}" data-title="${esc(label)}">
      <button type="button" class="embed__consent" data-cursor="Abspielen">
        <span class="embed__play" aria-hidden="true">▶</span>
        <span class="mono">${esc(label)} laden</span>
        <small>Beim Laden werden Daten (z. B. deine IP-Adresse) an ${esc(label)} übertragen.</small>
      </button></div>${cap}</figure>`;
  }

  function itemHTML(item, i, p) {
    if (typeof item === "string") item = { type: "image", src: item };
    const half = item.size === "half" ? " p-item--half" : "";
    const cap = item.caption ? `<figcaption class="mono">${esc(item.caption)}</figcaption>` : "";
    const opts = { seed: `${p.slug}-${i}`, palette: p.palette, natural: true, ratio: item.ratio };
    switch (item.type || "image") {
      case "image":
        return `<figure class="p-item${half} reveal">${media(item.src, { ...opts, alt: item.alt || item.caption || p.title })}${cap}</figure>`;
      case "video":
        return `<figure class="p-item${half} reveal">${media(item.src, { ...opts, video: true, poster: item.poster })}${cap}</figure>`;
      case "youtube":
        return embedHTML(item.id && `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.id)}?autoplay=1&rel=0`, "YouTube", item, half);
      case "vimeo":
        return embedHTML(item.id && `https://player.vimeo.com/video/${encodeURIComponent(item.id)}?autoplay=1&dnt=1`, "Vimeo", item, half);
      case "embed":
        return embedHTML(item.url, item.label || "Externer Inhalt", item, half);
      case "compare":
        return `<figure class="p-item${half} reveal">
          <div class="compare" style="--ratio:${esc(item.ratio || "16 / 9")}" tabindex="0" role="slider" aria-label="Vorher-Nachher-Vergleich" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" data-cursor="Ziehen">
            ${media(item.before, { seed: `${p.slug}-${i}a`, palette: [...list(p.palette)].reverse(), alt: item.beforeLabel })}
            ${media(item.after, { seed: `${p.slug}-${i}b`, palette: p.palette, alt: item.afterLabel, cls: "compare__after" })}
            <span class="compare__handle"></span>
            <span class="compare__label compare__label--l mono">${esc(item.beforeLabel || "Vorher")}</span>
            <span class="compare__label compare__label--r mono">${esc(item.afterLabel || "Nachher")}</span>
          </div>${cap}</figure>`;
      case "text":
        return `<div class="p-item p-text reveal"><h3>${esc(item.title)}</h3><p>${item.text || ""}</p></div>`;
      default:
        return "";
    }
  }

  function projectHTML(p, idx) {
    const next = projects[(idx + 1) % projects.length];
    const info = Object.entries(p.info || {});
    const desc = list(p.description);
    return `
      <header class="p-hero">
        <div class="p-hero__meta mono"><b>${pad(idx + 1)}</b><span>${esc(p.category)}</span><span>${esc(p.year)}</span></div>
        <h1 class="p-hero__title" id="pTitle">${splitHTML(p.title)}</h1>
        ${p.subtitle ? `<p class="p-hero__sub">${esc(p.subtitle)}</p>` : ""}
      </header>
      <figure class="p-cover">${media(p.cover, { seed: p.slug, palette: p.palette, alt: p.title, eager: true })}</figure>
      ${info.length || desc.length ? `
      <section class="p-info">
        <dl class="p-facts reveal">${info.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="p-desc reveal">${desc.map((t) => `<p>${t}</p>`).join("")}</div>
      </section>` : ""}
      <section class="p-gallery">${list(p.media).map((m, i) => itemHTML(m, i, p)).join("")}</section>
      ${projects.length > 1 ? `
      <a class="p-next" href="#/projekt/${esc(next.slug)}" data-cursor="Weiter">
        ${media(next.cover, { seed: next.slug, palette: next.palette })}
        <span class="p-next__label mono">Nächstes Projekt →</span>
        <div class="p-next__title">${esc(next.title)}</div>
      </a>` : '<div style="height:120px"></div>'}`;
  }

  // Rechteck eines sichtbaren Elements als clip-path – für den "Aufzieh"-Effekt
  function clipFrom(el) {
    if (!el || !el.offsetParent) return null;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) return null;
    return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 4px)`;
  }

  function openProject(p) {
    if (current === p) return;
    const switching = !!current && !projEl.hidden;
    current = p;
    if (closeAnim) { closeAnim.cancel(); closeAnim = null; }
    const idx = projects.indexOf(p);
    $("#pCounter").textContent = `${pad(idx + 1)} / ${pad(projects.length)} — ${p.title}`;
    pScroll.innerHTML = projectHTML(p, idx);
    pScroll.scrollTop = 0;
    document.title = `${p.title} — ${fullName || baseTitle}`;
    observe(pScroll);
    onProjectScroll();
    preview.classList.remove("is-visible");
    closeLightbox();

    projEl.classList.remove("is-shown");
    const show = () => requestAnimationFrame(() => requestAnimationFrame(() => projEl.classList.add("is-shown")));

    if (switching) {
      if (!reduce()) pScroll.animate([{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)" });
      show();
      return;
    }
    projEl.hidden = false;
    root.classList.add("is-locked");
    if (!reduce()) {
      const from = clipFrom(lastTrigger) || "inset(100% 0% 0% 0% round 0px)";
      projEl.animate([{ clipPath: from }, { clipPath: FULL }], { duration: 900, easing: "cubic-bezier(.76,0,.24,1)" });
    }
    show();
    $("#pClose").focus({ preventScroll: true });
  }

  function closeProject() {
    const p = current;
    current = null;
    document.title = baseTitle;
    closeLightbox();
    const target = $$(`[data-slug="${CSS.escape(p.slug)}"]`, document.querySelector("main")).find((el) => el.offsetParent);
    const finish = () => {
      closeAnim = null;
      if (current || projEl.hidden) return; // inzwischen wurde ein anderes Projekt geöffnet
      projEl.hidden = true;
      projEl.classList.remove("is-shown");
      pScroll.innerHTML = "";
      root.classList.remove("is-locked");
    };
    root.classList.remove("is-locked");
    if (reduce()) finish();
    else {
      closeAnim = projEl.animate([{ clipPath: FULL }, { clipPath: clipFrom(target) || "inset(100% 0% 0% 0% round 0px)" }],
        { duration: 750, easing: "cubic-bezier(.76,0,.24,1)" });
      closeAnim.onfinish = finish;
      setTimeout(finish, 1000); // Sicherheitsnetz, falls der Browser Animationen drosselt
    }
    (target || lastTrigger)?.focus({ preventScroll: true });
  }

  function route() {
    const m = location.hash.match(/^#\/projekt\/([^/?#]+)/);
    const slug = m && decodeURIComponent(m[1]);
    const p = slug && projects.find((x) => x.slug === slug);
    if (p) openProject(p);
    else if (current) closeProject();
  }

  function go(href, replace) {
    try { history[replace ? "replaceState" : "pushState"]({ pf: 1 }, "", href); route(); }
    catch { location.hash = href; } // z. B. bei file://-Aufruf in manchen Browsern
  }

  function requestClose() {
    if (history.state && history.state.pf) history.back();
    else {
      try { history.replaceState(null, "", location.pathname + location.search); route(); }
      catch { location.hash = ""; }
    }
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/projekt/"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    if (!current) lastTrigger = a;
    go(a.getAttribute("href"), !!current);
  });
  addEventListener("popstate", route);
  addEventListener("hashchange", route);
  $("#pClose").addEventListener("click", requestClose);

  // Fortschrittsbalken + leichte Parallaxe des Titelbilds
  const progress = $("#pProgress");
  function onProjectScroll() {
    const max = pScroll.scrollHeight - pScroll.clientHeight;
    progress.style.transform = `scaleX(${max > 0 ? pScroll.scrollTop / max : 0})`;
    const cover = $(".p-cover .ph", pScroll);
    if (cover && !reduce()) cover.style.setProperty("--ps", (1.12 - Math.min(pScroll.scrollTop / 900, 1) * 0.12).toFixed(4));
  }
  pScroll.addEventListener("scroll", onProjectScroll, { passive: true });

  // Klicks innerhalb der Projektansicht: Embeds laden, Bilder vergrößern
  pScroll.addEventListener("click", (e) => {
    const consent = e.target.closest("button.embed__consent");
    if (consent) {
      const box = consent.parentElement;
      const f = document.createElement("iframe");
      f.src = box.dataset.src;
      f.title = box.dataset.title;
      f.allow = "autoplay; fullscreen; picture-in-picture; xr-spatial-tracking";
      f.allowFullscreen = true;
      box.replaceChildren(f);
      return;
    }
    const img = e.target.closest(".ph.is-loaded > img");
    if (img && !img.closest(".compare, .p-next")) openLightbox(img);
  });

  // Vorher/Nachher-Regler
  function setCompare(el, pct) {
    pct = Math.max(0, Math.min(100, pct));
    el.style.setProperty("--pos", `${pct}%`);
    el.setAttribute("aria-valuenow", Math.round(pct));
  }
  let dragging = null;
  pScroll.addEventListener("pointerdown", (e) => {
    const c = e.target.closest(".compare");
    if (!c) return;
    dragging = c;
    c.setPointerCapture(e.pointerId);
    const r = c.getBoundingClientRect();
    setCompare(c, ((e.clientX - r.left) / r.width) * 100);
  });
  pScroll.addEventListener("pointermove", (e) => {
    const c = dragging || (e.pointerType === "mouse" && e.target.closest(".compare"));
    if (!c) return;
    const r = c.getBoundingClientRect();
    setCompare(c, ((e.clientX - r.left) / r.width) * 100);
  });
  addEventListener("pointerup", () => { dragging = null; });
  pScroll.addEventListener("keydown", (e) => {
    const c = e.target.closest(".compare");
    if (!c || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    setCompare(c, +c.getAttribute("aria-valuenow") + (e.key === "ArrowRight" ? 5 : -5));
  });

  /* ---------- Lightbox ------------------------------------------------------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  let lbItems = [];
  let lbIndex = 0;
  function openLightbox(img) {
    lbItems = $$(".p-cover .ph.is-loaded > img, .p-item .ph.is-loaded > img", pScroll).filter((i) => !i.closest(".compare"));
    lbIndex = Math.max(0, lbItems.indexOf(img));
    showLightbox();
    lb.hidden = false;
    $("#lbClose").focus({ preventScroll: true });
  }
  function showLightbox() {
    const img = lbItems[lbIndex];
    if (!img) return;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    const cap = img.closest("figure")?.querySelector("figcaption")?.textContent || "";
    $("#lbCaption").textContent = `${pad(lbIndex + 1)} / ${pad(lbItems.length)}${cap ? ` — ${cap}` : ""}`;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    $("#lbPrev").hidden = $("#lbNext").hidden = lbItems.length < 2;
  }
  const lbStep = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; showLightbox(); };
  function closeLightbox() { if (!lb.hidden) { lb.hidden = true; lbImg.removeAttribute("src"); } }
  $("#lbPrev").addEventListener("click", () => lbStep(-1));
  $("#lbNext").addEventListener("click", () => lbStep(1));
  $("#lbClose").addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });

  /* ---------- Tastatur & Fokus ---------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
      return;
    }
    if (current && e.key === "Escape") requestClose();
  });
  document.addEventListener("focusin", (e) => {
    if (!lb.hidden && !lb.contains(e.target)) $("#lbClose").focus();
    else if (lb.hidden && current && !projEl.contains(e.target)) $("#pClose").focus();
  });

  /* ---------- Cursor, Licht im Hero, Laufband (eine Animationsschleife) ----- */
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, moved: false };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.moved = true; }, { passive: true });

  const cursor = $("#cursor");
  const cursorLabel = $("#cursorLabel");
  const cur = { x: mouse.x, y: mouse.y };
  if (fine) {
    root.classList.add("has-cursor");
    document.addEventListener("pointerover", (e) => {
      const t = e.target;
      const labelled = t.closest("[data-cursor]");
      let label = labelled && labelled.dataset.cursor;
      if (!label && t.matches(".project .ph.is-loaded > img") && !t.closest(".compare, .p-next")) label = "Zoom";
      cursorLabel.textContent = label || "";
      cursor.classList.toggle("is-label", !!label);
      cursor.classList.toggle("is-hover", !label && !!t.closest("a, button, [data-cursor-hover], .chips li"));
    });
    document.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));
    addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") cursor.classList.add("is-hidden"); });
  }

  const hero = $(".hero");
  const glow = $(".hero__glow");
  const g = { x: innerWidth * 0.6, y: innerHeight * 0.4 };
  let t0 = performance.now();
  let lastScroll = scrollY;

  function frame(now) {
    const still = reduce();

    if (fine) {
      cur.x = lerp(cur.x, mouse.x, 0.35);
      cur.y = lerp(cur.y, mouse.y, 0.35);
      cursor.style.setProperty("--cx", `${cur.x}px`);
      cursor.style.setProperty("--cy", `${cur.y}px`);
    }

    // Lichtschein im Hero: folgt der Maus, sonst langsames Treiben
    if (!still && scrollY < hero.offsetHeight) {
      const t = (now - t0) / 1000;
      const tx = mouse.moved && fine ? mouse.x : innerWidth * (0.55 + Math.sin(t * 0.3) * 0.25);
      const ty = mouse.moved && fine ? mouse.y + scrollY : innerHeight * (0.45 + Math.cos(t * 0.23) * 0.2);
      g.x = lerp(g.x, tx, 0.04);
      g.y = lerp(g.y, ty, 0.04);
      glow.style.setProperty("--gx", `${g.x}px`);
      glow.style.setProperty("--gy", `${g.y}px`);
    }

    // Laufband: Richtung & Tempo reagieren aufs Scrollen
    if (!still && marquee.unit > 1 && !current) {
      const dy = scrollY - lastScroll;
      if (dy) marquee.dir = dy > 0 ? 1 : -1;
      marquee.speed = lerp(marquee.speed, 0.5 + Math.min(Math.abs(dy), 60) * 0.12, 0.08);
      marquee.x -= marquee.speed * marquee.dir;
      if (marquee.x <= -marquee.unit) marquee.x += marquee.unit;
      if (marquee.x > 0) marquee.x -= marquee.unit;
      track.style.transform = `translate3d(${marquee.x}px,0,0)`;
    }
    lastScroll = scrollY;

    // Vorschau in der Listenansicht
    if (prev.on) {
      prev.x = lerp(prev.x, mouse.x, 0.18);
      prev.y = lerp(prev.y, mouse.y, 0.18);
      preview.style.setProperty("--fx", `${prev.x}px`);
      preview.style.setProperty("--fy", `${prev.y}px`);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Start ---------------------------------------------------------- */
  route();
})();
