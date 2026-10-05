# Portfolio – Anleitung

Eine statische Portfolio-Website (HTML/CSS/JS, kein Build-Schritt), gemacht für **GitHub Pages**.

## Ordnerstruktur

```
portfolio/
├── content.js                 ← alle TEXTE (Name, Projekte, Werdegang …)
├── media-original/            ← deine ORIGINAL-Bilder & Videos (bleiben nur auf deinem PC)
│   ├── ueber-mich/            Porträt + Lebenslauf-PDF
│   └── projekte/
│       └── My Little Slime/   ein Ordner pro Projekt
├── medien-aktualisieren.bat   ← Doppelklick nach jeder Bild-Änderung
├── media/  + media.js         automatisch erzeugt – nicht von Hand ändern
├── impressum.html             ← mit deinen Angaben ausfüllen
├── datenschutz.html           ← mit deinen Angaben ausfüllen
├── index.html, assets/        Seite, Design, Logik
└── tools/                     das Medien-Skript
```

## Bilder & Videos hinzufügen

1. Leg die Originale in `media-original/projekte/<Projektname>/`.
   Der Ordner heißt wie der `slug` oder der `title` des Projekts in `content.js`.
   Für jedes Projekt aus `content.js` legt das Skript den Ordner automatisch an.
2. Benenne die Dateien mit einer Nummer vorne:

   | Dateiname                  | Wirkung                                             |
   | -------------------------- | --------------------------------------------------- |
   | `00_cover.jpg`             | Kachel-Bild auf der Startseite + erstes großes Bild |
   | `01_Hauptansicht.jpg`      | Reihenfolge 1, Bildunterschrift „Hauptansicht“      |
   | `03_Turntable.mp4`         | Video (läuft stumm als Loop)                        |
   | `03_Turntable.jpg`         | gleicher Name wie ein Video → dessen Vorschaubild   |

   Ohne `cover` wird das erste Bild zum Kachel-Bild.
3. **Doppelklick auf `medien-aktualisieren.bat`.** Das Skript
   - verkleinert Bilder (max. 2400 px) und speichert sie als WebP in `media/`,
   - schneidet die Kachel quadratisch zu und erstellt kleine Vorschaubilder,
   - entfernt EXIF-/GPS-Daten aus den Bildern,
   - räumt Dateien auf, deren Original du gelöscht hast,
   - zeigt Hinweise, z. B. bei zu großen Videos.
4. `index.html` öffnen und prüfen, dann hochladen (siehe unten).

Ein Ordner, zu dem es in `content.js` noch kein Projekt gibt, erscheint automatisch auf der Seite
(mit dem Ordnernamen als Titel). Texte ergänzt du dann in `content.js` mit dem angezeigten `slug`.

**Porträt & Lebenslauf:** ein Bild und ein PDF in `media-original/ueber-mich/` legen.

**Videos:** möglichst unter 20 MB (z. B. mit [HandBrake](https://handbrake.fr) verkleinern).
GitHub erlaubt max. 100 MB pro Datei. Lange Videos besser auf YouTube/Vimeo hochladen
und in `content.js` als `{ type: "youtube", id: "…" }` eintragen.

**Texte:** `content.js` mit einem Editor öffnen (z. B. VS Code oder Notepad++).
Wenn alles gefüllt ist, dort `showPlaceholderHints: false` setzen.

## Lokal ansehen

Doppelklick auf `index.html` reicht. Wenn du einen kleinen lokalen Server willst:

```bash
python -m http.server 8766
```

Danach im Browser `http://localhost:8766` öffnen.

## Auf GitHub Pages veröffentlichen

1. Kostenloses Konto auf [github.com](https://github.com) anlegen.
2. Neues Repository erstellen und **`<dein-benutzername>.github.io`** nennen (öffentlich).
   Dann ist die Seite später direkt unter `https://<dein-benutzername>.github.io` erreichbar.
3. Den **Inhalt** des Ordners `portfolio/` hochladen (nicht den Ordner selbst), entweder
   über „Add file → Upload files“ im Browser oder per Git:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<dein-benutzername>/<dein-benutzername>.github.io.git
   git push -u origin main
   ```
4. Im Repository: **Settings → Pages → Source: „Deploy from a branch“ → Branch `main` / `/ (root)`** → Save.
5. Nach 1–2 Minuten ist die Seite online.

**Änderungen hochladen – am einfachsten mit [GitHub Desktop](https://desktop.github.com):**
einmal anmelden, „Add existing repository“ → diesen Ordner wählen. Danach nach jeder Änderung:
kurze Notiz eingeben → „Commit to main“ → „Push origin“.

**Eigene Domain (optional):** Unter Settings → Pages → „Custom domain“ eintragen und beim Domain-Anbieter
einen CNAME-Eintrag auf `<dein-benutzername>.github.io` setzen.

## Farben & Schrift anpassen

- Akzentfarbe: `accent` in `content.js`
- Hintergrund-/Textfarben: ganz oben in `assets/css/style.css` unter `:root`
- Schriften: Instrument Serif, Inter, JetBrains Mono (alle SIL Open Font License, lokal eingebunden)
