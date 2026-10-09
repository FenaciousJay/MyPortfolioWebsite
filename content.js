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
    title: "Jonas Schramme — Portfolio",
    description: "Portfolio von Jonas Schramme, 3D Artist aus Berlin: 3D-Scanning, Photogrammetrie, Game Art und 3D-Design.",
    accent: "#ff5a36",           // Akzentfarbe der ganzen Seite
    showPlaceholderHints: true,  // false = Dateipfade in Platzhaltern ausblenden
    gridLayout: "mosaic",        // TEST: "mosaic" = freies Mosaik, "masonry" = gleich breite Spalten, "square" = quadratisch
    wireframe: true,             // TEST: Wireframe an den Seitenrändern (false = aus)
  },

  /* ---------- Über dich ---------------------------------------------------- */
  person: {
    firstName: "Jonas",
    lastName: "Schramme",
    role: "3D Artist",
    location: "Berlin",
    timezone: "Europe/Berlin",   // für die kleine Uhr oben rechts
    available: true,             // zeigt „Offen für Projekte“ mit grünem Punkt
    availableText: "Offen für neue Projekte",
    intro: "3D Artist mit Schwerpunkt auf 3D-Design, Photogrammetrie und Toolprogrammierung – vom realen Objekt bis zum fertigen digitalen Asset.",
    email: "j.schramme@outlook.com",
    cv: "",        // leer = automatisch aus media-original/ueber-mich/ (kein PDF = Button ausgeblendet)
    portrait: "",  // leer = automatisch aus media-original/ueber-mich/
  },

  socials: [
	{ label: "LinkedIn",   url: "https://www.linkedin.com/" },
    { label: "ArtStation", url: "https://www.artstation.com/" },
    { label: "Sketchfab",    url: "https://sketchfab.com/JonasSchramme" },
	//{ label: "Instagram",  url: "https://www.instagram.com/" },
  ],

  about: {
    statement: "Ich bringe reale Objekte in die digitale Welt – und baue die Werkzeuge dafür gleich mit.",
    text: [
      "Zuletzt war ich als 3D Artist bei der botspot 3D Scan GmbH tätig. Mein Schwerpunkt lag auf der Digitalisierung realer Objekte und der Weiterentwicklung unserer Scanner: von der Konzeptentwicklung über 3D-Druck und die Entwicklung von Beleuchtungs- und Kamerasystemen bis zur Programmierung und Aufbereitung der Scandaten für Website und Kunden.",
      "Meine Laufbahn begann mit der Ausbildung zum 3D Artist an der School for Games (S4G) in Berlin. Bei ZEBROS und der botspot AG habe ich meine Kenntnisse in der Photogrammetrie vertieft, eine leitende Funktion in der Art-Abteilung übernommen und Kunden zu Produkten und technischen Details beraten.",
    ],
    skills: [
      "3D-Scanning & Photogrammetrie", "3D Gaussian Splatting", "Mesh- & Texturaufbereitung (Baking)",
      "Leveldesign & Worldbuilding", "Prototyping in Unity", "Materialien, Animation & VFX",
      "Rendering für Marketing", "3D-Druck & Bauteilentwicklung", "Drohnen-Scans",
    ],
    tools: ["Blender", "Adobe Photoshop", "Substance Painter", "RealityScan", "Unity 3D", "Figma", "Confluence", "MS Office", "Bambu Lab (3D-Druck)"],
  },

  /* ---------- Werdegang / Lebenslauf -------------------------------------- */
  timeline: [
    {
      heading: "Berufserfahrung",
      items: [
        { period: "12/2025 — 06/2026", title: "Innovation Creator", place: "botspot 3D Scan GmbH",
          text: "3D-Scanning, Photogrammetrie & 3D Gaussian Splatting (3DGS) · Aufbereitung von 3D-Modellen (Baking, Mesh, Textur) · 3D-Druck und Entwicklung von Bauteilen · Aufbau der Scanner · KI-gestützte Softwareentwicklung" },
        { period: "12/2022 — 11/2025", title: "Subject-Matter-Expert – 3D-Design & Animation", place: "ZEBROS GmbH",
          text: "Prototypen- & App-Entwicklung in Unity · Leveldesign & Worldbuilding · Meshes, Materialien, Animationen, UI, VFX, Videobearbeitung · 3D-Scans vor Ort – am Boden und aus der Luft per Drohne – inkl. Verarbeitung" },
        { period: "03/2022 — 12/2022", title: "3D Artist – Scanner Industry", place: "botspot AG",
          text: "3D-Scanning & Photogrammetrie · Aufbereitung von 3D-Modellen (Baking, Mesh, Textur) · Rendering für Marketing · Aufbau von Scannern · Kalibrierung vor Ort & Kundeneinweisung" },
        { period: "10/2019 — 03/2022", title: "3D Game Artist – Game Development", place: "Stratosphere Games GmbH",
          text: "Prototypen-Entwicklung in Unity · Leveldesign · Worldbuilding · Meshes, Materialien, Animationen, UI, VFX" },
      ],
    },
    {
      heading: "Ausbildung",
      items: [
        { period: "09/2026", title: "Drechselkurs", place: "Handwerkskammer, Berlin",
          text: "Einführung in Maschienen und Techniken des Drechselhandwerks" },
	    { period: "05/2024", title: "Drohnenführerschein A1/A3", place: "Luftfahrt Bundesamt, Berlin",
          text: "Führerschein für das benutzen von Kleindrohnen" },
		{ period: "09/2017 — 10/2019", title: "Ausbildung zum 3D Artist", place: "S4G School for Games, Berlin",
          text: "Zahlreiche Gruppenprojekte · Pflichtpraktikum bei der Stratosphere Games GmbH" },
      ],
    },
    {
      heading: "Sprachen",
      items: [
        { period: "Muttersprache", title: "Deutsch", place: "", text: "" },
        { period: "Fließend", title: "Englisch", place: "", text: "" },
      ],
    },
  ],

  /* ---------- Projekte ----------------------------------------------------
     Reihenfolge hier = Reihenfolge auf der Seite.

     slug      → kurzer Name für die URL. Schreibweise egal ("The Moon Trilogy" wird zu "the-moon-trilogy"),
                 er verbindet diesen Eintrag mit dem Bilder-Ordner
                 media-original/projekte/<Projektname>/  ("Spaceship on patrol" → "spaceship-on-patrol").
     title     → Titel auf der Seite. Neue Einträge bekommen den Ordnernamen, du kannst ihn frei ändern.
                 Ordner umbenennen? Einfach tun – das Medien-Skript passt slug (und einen
                 unveränderten Titel) hier an.
     category  → eine Kategorie ("3D") oder mehrere: ["2D", "Illustration"]
     featured  → true = Kachel wird im Raster doppelt so groß
     palette   → zwei/drei Farben für den Platzhalter, solange kein Bild da ist
     info      → beliebige Angaben (Rolle, Kunde, Software …) unter der Beschreibung

     Bilder & Videos aus dem Ordner kommen automatisch dazu. Zusätzlich kannst du
     hier unter "media" Dinge ergänzen, die nicht als Datei vorliegen:

       { type: "youtube", url: "https://www.youtube.com/watch?v=…", caption: "" }   (Link einfach aus dem Browser kopieren)
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
      slug: "spaceship-on-patrol",
      title: "Spaceship on Patrol",
      subtitle: "A Star Wars inspired Project",
      category: "3D",
      year: "2025",
      featured: true,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop, Gaea",
       // "Dauer": "4 Wochen",
      },
      description: [
        "A small spaceship of the fighter class. Fast and agile. It has space for just a view people and is equipped with two ballistic weapons on each wing. Here it flies above a planet and makes a break at an outpost somewhere in the mountains.",
        "The Planet: created in Gaea",
		"Spaceship: created & rendered in Blender & overpaint in Photoshop",
      ],
      media: [
	    { type: "youtube", url: "https://www.youtube.com/watch?v=XR4oGzAXbmc", caption: "Turntable"},
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
      ],
    },
	
	{
      slug: "spaceship-fighter-class",
      title: "Spaceship - Fighter Class",   // auf der Seite gilt der Ordnername
      subtitle: "",
      category: "3D",        // z. B. "3D", "Illustration" – erscheint als Filter
      year: "2025",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "",
        "Software": "",
      },
      description: [
        "",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },
	{
      slug: "Camera Objective-Configurator",
      title: "Camera Objective Configurator",
      subtitle: "Calculate Lenses and plan your Objective",
      category: "Tools",
      year: "2026",
      featured: true,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Visual Studio Code, Notepad++, Claude",
       // "Dauer": "4 Wochen",
      },
      description: [
        "The idea came when I started to deepen my Photography and kamera knowledge. Since I couldn't find a good app for such purposes, I startet to build my own. It's still work in progress, But I am happy with the current state.",
		"In this App you can configurate lenses with all important variables. The Light Rays simulate the path the light/ the picture would travel throught the lenses. Objective and Camera Body do adjust automaticaly to the lense sizes. If a setup is good to go, it can be exported as an pdf with all parameters per lense.",
      ],
      media: [
	   // { type: "youtube", url: "https://www.youtube.com/watch?v=XR4oGzAXbmc", caption: "Turntable"},
        { type: "text", title: "Prozess", text: "I startet to program it by myself, but reched my limit when it came to the complex lens calculations. So I took support from ChatGPT and later from Claude as an assistant." },
      ],
    },
	{
      slug: "BOKASSA",
      title: "BOKASSA",
      subtitle: "A bands album cover",
      category: "3D",
      year: "2024",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Awesome band, awesome music. Recreated the cover art of Crimson Riders in 3D.",
        "Added some of my own touches, all done in Blender Eevee.",
		
      ],
      media: [
	    { type: "youtube", url: "https://www.youtube.com/watch?v=tFYIIHddnj8", caption: "Turntable"},
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
      ],
    },
	{
      slug: "Guardian of the forest",
      title: "Guardian of the forest",
      subtitle: "inspired by the BOKASSA project",
      category: "3D",
      year: "2024",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Inspired by the Bokassa album artwork.",
		
      ],
      media: [
	    { type: "youtube", url: "https://www.youtube.com/watch?v=tFYIIHddnj8", caption: "Turntable"},
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
      ],
    },
		{
      slug: "Nuka Cola Tropic Edition",
      title: "Nuka Cola Tropic Edition",
      subtitle: "inspired by the Fallout serie",
      category: "3D",
      year: "2024",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop, SubstancePainter",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Nuka Cola Tropic Edition Just some product design for advertisments.",
		
      ],
      media: [
	    { type: "youtube", url: "https://www.youtube.com/watch?v=A-JvmNwwQkI", caption: "Turntable"},
        { type: "text", title: "Prozess", text: "Ein Zwischentext, z. B. zu Skizzen, Referenzen oder Iterationen." },
      ],          
    },
	{
      slug: "The Perfume",
      title: "The Perfume",
      subtitle: "A small productdesign",
      category: "3D",
      year: "2024",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "3D Perfume Rendering with short animation. A perfume in a transparent bottle with different colors.",
      ],
      media: [
	    { type: "youtube", url: "https://www.youtube.com/watch?v=_v7GGOIQMiM", caption: "Animation"},
      ],
    },
	{
      slug: "Banjo with Stand",
      title: "Banjo with Stand",
      subtitle: "",
      category: "3D",
      year: "2023",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Diffuse, Roughness, Metallic, Normal Midpoly: Banjo = 31.200P Stand = 4444P.",
      ],
      media: [
      ],
    },
	{
      slug: "Trumpet with Damper",
      title: "Trumpet with Damper",
      subtitle: "",
      category: "3D",
      year: "2023",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, SubstancePainter",
       // "Dauer": "4 Wochen",
      },
      description: [
        "A standard trumpet with damper",
	    "Base Color / Metallic / Roughness Mid Poly -> Trumpet with Damper 32k poly",
      ],
      media: [
      ],
    },
	{
      slug: "M.Hohner Harmonica",
      title: "M.Hohner Harmonica",
      subtitle: "The real one",
      category: "3D",
      year: "2021",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "3ds Max, Photoshop, SubstancePainter, Marmoset Toolbag",
       // "Dauer": "4 Wochen",
      },
      description: [
        "3D Perfume Rendering with short animation. A perfume in a transparent bottle with different colors.",
      ],
      media: [
	   
      ],
    },
	{
      slug: "Old Steampunk Camera",
      title: "Old Steampunk Camer",
      subtitle: "",
      category: "3D",
      year: "2018",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "PBR Training Course",
        "Software": "3ds Max, Photoshop, SubstancePainter, Marmoset Toolbag",
       // "Dauer": "4 Wochen",
      },
      description: [
        "One of my first bigger objects. I made it in my steampunk phase. A friend of mine, Emre Karabacak helped me to start with the basics.",
      ],
      media: [
	   
      ],
    },
	{
      slug: "Nuka Cola Refrigerator",
      title: "Nuka Cola Refrigerator",
      subtitle: "",
      category: "3D",
      year: "2022",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "3ds Max, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "A fridge to keep cool our beloved Nuka Cola - Can edition",
      ],
      media: [
	   
      ],
    },
	{
      slug: "Scanned nature - Forest",
      title: "Scanned nature - Forest",
      subtitle: "A collection of scanned nature props",
      category: ["3D", "Photogrammetry"],
      year: "2025",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "3DF Zephyr, Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Some nature scanned by phone and processed in 3df Zephyr. Fir Tree with old Resin Farm and Birdhouse Old Rotted Tree Stump with Moss Mossy Tree Stump with Tree Fungus Pine Cone",
      ],
      media: [
	   { type: "text", title: "Prozess", text: "The photogrammetry process turns overlapping 2D photographs into precise 3D models, point clouds, or maps using computer software and triangulation." },
      ],
    },
	{
      slug: "Scanned Sculptures",
      title: "Sculptures, Figures, Miniatures",
      subtitle: "A collection of scanned Sculptures",
      category: ["3D", "Photogrammetry"],
      year: "2023",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "RealityScan, 3DF Zephyr, Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Some sculptures and figures scanned by phone and processed in 3df Zephyr and RealityScan",
      ],
      media: [
	   { type: "text", title: "Prozess", text: "The photogrammetry process turns overlapping 2D photographs into precise 3D models, point clouds, or maps using computer software and triangulation." },
      ],
    },
	{
      slug: "GEDORE - Tool Cabinet",
      title: "GEDORE - Tool Cabinet",
      subtitle: "A historical GEDORE Toolbox",
      category: ["3D", "Photogrammetry"],
      year: "2024",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "RealityScan, 3DF Zephyr, Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "70s Tool cabinet by Gedore.",
      ],
      media: [
	   { type: "text", title: "Prozess", text: "The photogrammetry process turns overlapping 2D photographs into precise 3D models, point clouds, or maps using computer software and triangulation." },
      ],
    },
    {
      slug: "The Moon Trilogy",
      title: "The Moon Trilogy",
      subtitle: "The Moon Serie.",
      category: "3D",
      year: "2025",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Three parts in different styles.",
        
      ],
      media: [  
	  { type: "youtube", url: "https://www.youtube.com/watch?v=rM2T-_Fh7r4", caption: "Turntable"},], 
    },
    {
      slug: "ape-piaggio",
      title: "Ape Piaggio",   // auf der Seite gilt der Ordnername
      subtitle: "",
      category: "3D",
      year: "2022",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "",
        "Software": "",
      },
      description: [
        "",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },
	{
      slug: "SMERCH",
      title: "BM-30 Smerch 9A52 MLRS",   // auf der Seite gilt der Ordnername
      subtitle: "",
      category: "3D",
      year: "2022",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "",
        "Software": "",
      },
      description: [
        "BM-30 Smerch 9A52 MLRS BM-30 Smerch 9A52 MLRS one of the strongest motorized multirocket launcher systems. Originaly invented by the Sowjet Union around 1980, today mainly used by Russia, Ukraine and China",
		"Lowpoly: 12.750p",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },
    {
      slug: "chino-speakers",
      title: "Chino - Speakers",   // auf der Seite gilt der Ordnername
      subtitle: "",
      category: "3D",
      year: "2024",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "",
        "Software": "",
      },
      description: [
        "",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },
    {
      slug: "snowy-mountain",
      title: "Snowy Mountain",   // auf der Seite gilt der Ordnername
      subtitle: "2d-Excourse",
      category: "2D",        // z. B. "3D", "Illustration" – erscheint als Filter
      year: "2025",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "",
        "Software": "",
      },
      description: [
        "",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },

    {
      slug: "the-wandering-ox",
      title: "The Wandering Ox",   // auf der Seite gilt der Ordnername
      subtitle: "2d-Excourse",
      category: "2D",        // z. B. "3D", "Illustration" – erscheint als Filter
      year: "2025",
      featured: false,     // true = Kachel doppelt so groß
      info: {
        "Rolle": "123",
        "Software": "",
      },
      description: [
        "",
      ],
      media: [],           // z. B. { type: "youtube", url: "https://…" }
    },
    {
      slug: "just-a-cake",
      title: "Just A Cake",   // auf der Seite gilt der Ordnername
      subtitle: "3d manga style shortstory",
      category: "3D",
      year: "2025",
      featured: false,
      palette: ["#3a2cff", "#ff5a36", "#120f2e"],
      info: {
       // "Rolle": "Konzept, Modeling, Lookdev",
        "Kunde": "Personal Project",
        "Software": "Blender, Photoshop",
       // "Dauer": "4 Wochen",
      },
      description: [
        "Short manga story. Dark themed joke scene made in Blender. Shader and animations are done in Blender, editing done in Adobe Premiere. It's all a mix of 3d and 2d hand painted textures & sprites compared with some shader magic.",
        "The sceneries are inspired by the Abara Manga book, which has some amazing visuals.",
		
      ],
      media: [  
	  { type: "youtube", url: "https://www.youtube.com/watch?v=UAFJJuR_f4I", caption: "Turntable"},],           // z. B. { type: "youtube", url: "https://…" }
    },
  ],
};
