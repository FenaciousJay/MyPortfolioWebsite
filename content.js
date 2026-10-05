/* ==========================================================================
   INHALT DEINER WEBSITE
   --------------------------------------------------------------------------
   Hier stehen alle TEXTE deiner Seite.

   Bilder & Videos musst du hier NICHT eintragen:
   1. Originale in  media-original/projekte/<projekt>/  legen
      (Dateinamen mit Nummer für die Reihenfolge, z. B. "01_Hauptansicht.jpg",
       der Text nach der Nummer wird zur Bildunterschrift, "cover" = Kachelbild)
   2. medien-aktualisieren.bat doppelklicken – fertig.
   Porträt und Lebenslauf-PDF kommen nach  media-original/ueber-mich/.

   Tipps:
   - Texte stehen in "Anführungszeichen". Ein Komma nach jedem Eintrag nicht vergessen.
   - In längeren Texten (description, about.text, timeline text) darfst du
     einfaches HTML verwenden, z. B. <a href="https://...">Link</a> oder <em>kursiv</em>.
   - Fehlt ein Bild, zeigt die Seite einen farbigen Platzhalter mit einem Hinweis,
     in welchen Ordner die Bilder gehören.
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
    cv: "",        // leer = automatisch aus media-original/ueber-mich/ (kein PDF = Button ausgeblendet)
    portrait: "",  // leer = automatisch aus media-original/ueber-mich/
  },

  socials: [
    { label: "ArtStation", url: "https://www.artstation.com/" },
    { label: "Instagram",  url: "https://www.instagram.com/" },
    { label: "LinkedIn",   url: "https://www.linkedin.com/" },
    { label: "Behance",    url: "https://www.behance.net/" },
  ],

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

     slug      → kurzer Name für die URL, nur a-z, 0-9 und Bindestrich.
                 Der Bilder-Ordner heißt genauso (oder wie der Titel):
                 media-original/projekte/<slug>/
     featured  → true = Kachel wird im Raster doppelt so groß
     palette   → zwei/drei Farben für den Platzhalter, solange kein Bild da ist
     info      → beliebige Angaben (Rolle, Kunde, Software …) unter der Beschreibung

     Bilder & Videos aus dem Ordner kommen automatisch dazu. Zusätzlich kannst du
     hier unter "media" Dinge ergänzen, die nicht als Datei vorliegen:

       { type: "youtube", id: "VIDEO-ID", caption: "" }
       { type: "vimeo",   id: "123456", caption: "" }
       { type: "embed",   url: "https://sketchfab.com/models/.../embed", label: "Sketchfab", caption: "" }
       { type: "compare", before: "media/projekte/<slug>/04-wireframe.webp",
                          after: "media/projekte/<slug>/01-render.webp",
                          beforeLabel: "Wireframe", afterLabel: "Render" }   (Pfade: siehe media/)
       { type: "text",    title: "Prozess", text: "..." }   (erscheint als Absatz im Textbereich)

     Projekte, die nur als Ordner existieren, erscheinen automatisch (am Ende der Liste).
     YouTube/Vimeo/Embeds laden erst nach Klick (datenschutzfreundlich).
     ------------------------------------------------------------------------ */
  projects: [
    {
      slug: "my-little-slime",
      title: "My Little Slime",
      subtitle: "Kurze Unterzeile zum Projekt",
      category: "3D",
      year: "2025",
      featured: true,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
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
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
      ],
    },
    {
      slug: "kintsugi",
      title: "Kintsugi",
      subtitle: "Studie über Bruch, Gold und Reparatur",
      category: "Lookdev",
      year: "2025",
      palette: ["#d6a84f", "#2b2118", "#0e0b08"],
      info: { "Rolle": "Shading, Lighting", "Software": "Blender, Cycles" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [],
    },
    {
      slug: "stillleben-no-7",
      title: "Stillleben No. 7",
      subtitle: "Klassische Komposition, digitales Licht",
      category: "Illustration",
      year: "2024",
      palette: ["#7a9e7e", "#e8d8c3", "#1c241d"],
      info: { "Rolle": "Illustration", "Software": "Photoshop, Procreate" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [],
    },
    {
      slug: "signal-noise",
      title: "Signal / Noise",
      subtitle: "Ein Motion-Loop über Datenrauschen",
      category: "Motion",
      year: "2024",
      featured: true,
      palette: ["#00e0b8", "#0a2a3a", "#06090c"],
      info: { "Rolle": "Motion Design", "Kunde": "Musiklabel", "Software": "Houdini, After Effects" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
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
      info: { "Rolle": "Simulation, Rendering", "Software": "Houdini, Redshift" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [
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
      info: { "Rolle": "Concept Art", "Software": "Blender, Photoshop" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [],
    },
    {
      slug: "orbit",
      title: "Orbit",
      subtitle: "Produktvisualisierung für ein Designobjekt",
      category: "3D",
      year: "2023",
      palette: ["#e8e4dc", "#9b8f7a", "#1a1815"],
      info: { "Rolle": "Produktvisualisierung", "Kunde": "Kunde Name", "Software": "Cinema 4D, Octane" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [],
    },
    {
      slug: "brutal-bloom",
      title: "Brutal Bloom",
      subtitle: "Pflanzen, die aus Beton wachsen",
      category: "Illustration",
      year: "2022",
      palette: ["#b7ff3c", "#4a4f45", "#0f110d"],
      info: { "Rolle": "Illustration", "Software": "Procreate" },
      description: ["Projektbeschreibung hier einfügen."],
      media: [],
    },
  ],
};
