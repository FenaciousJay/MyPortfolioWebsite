/* ==========================================================================
   INHALT DEINER WEBSITE
   --------------------------------------------------------------------------
   Das ist die einzige Datei, die du normalerweise bearbeiten musst.
   Bilder & Videos legst du in den Ordner "media/" und trägst hier den Pfad ein.

   Tipps:
   - Texte stehen in "Anführungszeichen". Ein Komma nach jedem Eintrag nicht vergessen.
   - In längeren Texten (description, about.text, timeline text) darfst du
     einfaches HTML verwenden, z. B. <a href="https://...">Link</a> oder <em>kursiv</em>.
   - Fehlt ein Bild, zeigt die Seite einen farbigen Platzhalter mit dem
     erwarteten Dateipfad an. So siehst du sofort, was noch fehlt.
   ========================================================================== */

window.PORTFOLIO = {

  /* ---------- Allgemein ---------------------------------------------------- */
  site: {
    title: "Vorname Nachname — Portfolio",
    description: "Portfolio von Vorname Nachname: 3D, Concept Art und visuelles Design.",
    accent: "#ff5a36",           // Akzentfarbe der ganzen Seite
    showPlaceholderHints: true,  // false = Dateipfade in Platzhaltern ausblenden
  },

  /* ---------- Über dich ---------------------------------------------------- */
  person: {
    firstName: "Vorname",
    lastName: "Nachname",
    role: "3D Artist & Visual Designer",
    location: "Berlin",
    timezone: "Europe/Berlin",   // für die kleine Uhr oben rechts
    available: true,             // zeigt „Offen für Projekte“ mit grünem Punkt
    availableText: "Offen für neue Projekte",
    intro: "Ich gestalte Bilder, Welten und Oberflächen an der Schnittstelle von Kunst und Technik.",
    email: "hallo@deine-domain.de",
    cv: "media/lebenslauf.pdf",  // PDF in den media-Ordner legen ("" = Button ausblenden)
    portrait: "media/ueber-mich/portrait.jpg",
  },

  socials: [
    { label: "ArtStation", url: "https://www.artstation.com/" },
    { label: "Instagram",  url: "https://www.instagram.com/" },
    { label: "LinkedIn",   url: "https://www.linkedin.com/" },
    { label: "Behance",    url: "https://www.behance.net/" },
  ],

  // Laufband unter dem Startbereich
  disciplines: ["3D Art", "Concept Art", "Lookdev", "Motion Design", "Illustration", "Art Direction"],

  about: {
    statement: "Gute Bilder erzählen mehr, als sie zeigen.",
    text: [
      "Hier steht ein kurzer Absatz über dich: woher du kommst, was dich antreibt und welche Art von Arbeiten du am liebsten machst.",
      "Ein zweiter Absatz kann deine Arbeitsweise beschreiben – zum Beispiel, wie du von der ersten Skizze bis zum finalen Render vorgehst.",
    ],
    skills: ["Hard Surface Modeling", "Texturing & Shading", "Lighting", "Concept Design", "Komposition", "Compositing"],
    tools: ["Blender", "ZBrush", "Substance Painter", "Photoshop", "Unreal Engine", "After Effects"],
  },

  /* ---------- Werdegang / Lebenslauf -------------------------------------- */
  timeline: [
    {
      heading: "Berufserfahrung",
      items: [
        { period: "2024 — heute", title: "3D Artist", place: "Studio Name, Berlin",
          text: "Kurze Beschreibung deiner Aufgaben und Erfolge in dieser Position." },
        { period: "2022 — 2024", title: "Junior Designer", place: "Agentur Name, Hamburg",
          text: "Kurze Beschreibung deiner Aufgaben und Erfolge in dieser Position." },
        { period: "2021", title: "Praktikum Visual Effects", place: "Firma Name, München",
          text: "Kurze Beschreibung deiner Aufgaben." },
      ],
    },
    {
      heading: "Ausbildung",
      items: [
        { period: "2018 — 2022", title: "B.A. Kommunikationsdesign", place: "Hochschule Name",
          text: "Schwerpunkt, Abschlussarbeit oder Note." },
        { period: "2018", title: "Abitur", place: "Schule Name", text: "" },
      ],
    },
    {
      heading: "Auszeichnungen & Ausstellungen",
      items: [
        { period: "2025", title: "Name des Awards", place: "Veranstalter", text: "" },
        { period: "2023", title: "Gruppenausstellung „Titel“", place: "Galerie, Stadt", text: "" },
      ],
    },
  ],

  /* ---------- Projekte ----------------------------------------------------
     Reihenfolge hier = Reihenfolge auf der Seite.

     slug      → kurzer Name für die URL, nur a-z, 0-9 und Bindestrich
     cover     → Vorschaubild (am besten quadratisch, mind. 1200 × 1200 px)
     featured  → true = Kachel wird im Raster doppelt so groß
     palette   → zwei/drei Farben für den Platzhalter, solange kein Bild da ist
     info      → beliebige Angaben, die links neben der Beschreibung stehen
     media     → Bilder, Videos usw. auf der Projektseite. Mögliche Typen:

       { type: "image",   src: "media/...jpg", caption: "", size: "full" | "half" }
       { type: "video",   src: "media/...mp4", poster: "", size: "full" | "half" }   (läuft stumm als Loop)
       { type: "youtube", id: "VIDEO-ID", caption: "" }
       { type: "vimeo",   id: "123456", caption: "" }
       { type: "embed",   url: "https://sketchfab.com/models/.../embed", label: "Sketchfab", caption: "" }
       { type: "compare", before: "media/...wire.jpg", after: "media/...render.jpg",
                          beforeLabel: "Wireframe", afterLabel: "Render" }
       { type: "text",    title: "Prozess", text: "..." }

     Zwei "half"-Elemente hintereinander stehen nebeneinander.
     YouTube/Vimeo/Embeds laden erst nach Klick (datenschutzfreundlich).
     ------------------------------------------------------------------------ */
  projects: [
    {
      slug: "nebula-drift",
      title: "Nebula Drift",
      subtitle: "Ein Raumschiff-Konzept zwischen Industrie und Organik",
      category: "3D",
      year: "2025",
      featured: true,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      cover: "media/projekte/nebula-drift/cover.jpg",
      info: {
        "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Freies Projekt",
        "Software": "Blender, Substance Painter",
        "Dauer": "4 Wochen",
      },
      description: [
        "Beschreibe hier die Idee hinter dem Projekt: Was war die Aufgabe, was hat dich inspiriert?",
        "Im zweiten Absatz kannst du auf den Prozess, technische Herausforderungen oder das Ergebnis eingehen.",
      ],
      media: [
        { type: "image", src: "media/projekte/nebula-drift/01.jpg", caption: "Hauptansicht" },
        { type: "image", src: "media/projekte/nebula-drift/02.jpg", size: "half", caption: "Detail Cockpit" },
        { type: "image", src: "media/projekte/nebula-drift/03.jpg", size: "half", caption: "Detail Antrieb" },
        { type: "compare", before: "media/projekte/nebula-drift/wireframe.jpg", after: "media/projekte/nebula-drift/01.jpg",
          beforeLabel: "Wireframe", afterLabel: "Render" },
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
        { type: "image", src: "media/projekte/nebula-drift/04.jpg", caption: "Turntable-Still" },
      ],
    },
    {
      slug: "kintsugi",
      title: "Kintsugi",
      subtitle: "Studie über Bruch, Gold und Reparatur",
      category: "Lookdev",
      year: "2025",
      palette: ["#d6a84f", "#2b2118", "#0e0b08"],
      cover: "media/projekte/kintsugi/cover.jpg",
      info: { "Rolle": "Shading, Lighting", "Software": "Blender, Cycles" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/kintsugi/01.jpg" },
        { type: "image", src: "media/projekte/kintsugi/02.jpg", size: "half" },
        { type: "image", src: "media/projekte/kintsugi/03.jpg", size: "half" },
      ],
    },
    {
      slug: "stillleben-no-7",
      title: "Stillleben No. 7",
      subtitle: "Klassische Komposition, digitales Licht",
      category: "Illustration",
      year: "2024",
      palette: ["#7a9e7e", "#e8d8c3", "#1c241d"],
      cover: "media/projekte/stillleben-no-7/cover.jpg",
      info: { "Rolle": "Illustration", "Software": "Photoshop, Procreate" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/stillleben-no-7/01.jpg" },
      ],
    },
    {
      slug: "signal-noise",
      title: "Signal / Noise",
      subtitle: "Ein Motion-Loop über Datenrauschen",
      category: "Motion",
      year: "2024",
      featured: true,
      palette: ["#00e0b8", "#0a2a3a", "#06090c"],
      cover: "media/projekte/signal-noise/cover.jpg",
      info: { "Rolle": "Motion Design", "Kunde": "Musiklabel", "Software": "Houdini, After Effects" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "video", src: "media/projekte/signal-noise/loop.mp4", caption: "Loop, 12 Sekunden" },
        { type: "youtube", id: "", caption: "Ganzes Video auf YouTube – trage die Video-ID ein" },
      ],
    },
    {
      slug: "ferrofluid",
      title: "Ferrofluid",
      subtitle: "Simulation & Materialstudie",
      category: "3D",
      year: "2024",
      palette: ["#5c5c66", "#c9c9d6", "#0b0b0f"],
      cover: "media/projekte/ferrofluid/cover.jpg",
      info: { "Rolle": "Simulation, Rendering", "Software": "Houdini, Redshift" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/ferrofluid/01.jpg" },
        { type: "embed", url: "", label: "Sketchfab", caption: "Interaktives 3D-Modell – trage die Embed-URL ein" },
      ],
    },
    {
      slug: "night-shift",
      title: "Night Shift",
      subtitle: "Environment-Konzept einer Stadt bei Nacht",
      category: "Concept Art",
      year: "2023",
      palette: ["#ff2e88", "#2a1a5e", "#08060f"],
      cover: "media/projekte/night-shift/cover.jpg",
      info: { "Rolle": "Concept Art", "Software": "Blender, Photoshop" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/night-shift/01.jpg" },
        { type: "image", src: "media/projekte/night-shift/02.jpg" },
      ],
    },
    {
      slug: "orbit",
      title: "Orbit",
      subtitle: "Produktvisualisierung für ein Designobjekt",
      category: "3D",
      year: "2023",
      palette: ["#e8e4dc", "#9b8f7a", "#1a1815"],
      cover: "media/projekte/orbit/cover.jpg",
      info: { "Rolle": "Produktvisualisierung", "Kunde": "Kunde Name", "Software": "Cinema 4D, Octane" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/orbit/01.jpg", size: "half" },
        { type: "image", src: "media/projekte/orbit/02.jpg", size: "half" },
      ],
    },
    {
      slug: "brutal-bloom",
      title: "Brutal Bloom",
      subtitle: "Pflanzen, die aus Beton wachsen",
      category: "Illustration",
      year: "2022",
      palette: ["#b7ff3c", "#4a4f45", "#0f110d"],
      cover: "media/projekte/brutal-bloom/cover.jpg",
      info: { "Rolle": "Illustration", "Software": "Procreate" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
        { type: "image", src: "media/projekte/brutal-bloom/01.jpg" },
      ],
    },
  ],
};
