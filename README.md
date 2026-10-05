# Portfolio – Anleitung

Eine statische Portfolio-Website (HTML/CSS/JS, kein Build-Schritt), gemacht für **GitHub Pages**.

## Ordnerstruktur

```
portfolio/
├── index.html          Startseite (musst du nicht anfassen)
├── content.js          ← ALLE Texte, Projekte, Lebenslauf: hier bearbeiten
├── impressum.html      ← mit deinen Angaben ausfüllen
├── datenschutz.html    ← mit deinen Angaben ausfüllen
├── media/              ← deine Bilder, Videos, Lebenslauf-PDF
│   ├── lebenslauf.pdf
│   ├── ueber-mich/portrait.jpg
│   └── projekte/<projekt-slug>/cover.jpg, 01.jpg, …
└── assets/             Design, Logik, Schriften
```

## Inhalte einfügen

1. Öffne `content.js` in einem Texteditor (z. B. VS Code oder Notepad++).
2. Trag deinen Namen, deine Texte, deinen Werdegang und deine Projekte ein.
3. Leg die Bilder in `media/` ab, mit genau dem Pfad, den du in `content.js` angibst.
   Fehlende Bilder zeigt die Seite als farbigen Platzhalter mit dem erwarteten Pfad an.
4. Wenn alles gefüllt ist: in `content.js` `showPlaceholderHints: false` setzen.

**Empfohlene Bildgrößen**

| Was                      | Format                        | Größe                         |
| ------------------------ | ----------------------------- | ----------------------------- |
| Cover (Raster-Kachel)    | quadratisch, JPG/WebP         | 1200 × 1200 px                |
| Bilder auf Projektseiten | beliebig, JPG/WebP            | 2400 px breit (max. ~1 MB)    |
| Porträt                  | 4:5 hochkant                  | 1000 × 1250 px                |
| Video-Loops              | MP4 (H.264), ohne Ton         | möglichst < 10 MB             |

Tipp: Mit [squoosh.app](https://squoosh.app) kannst du Bilder verkleinern, ohne sichtbaren Qualitätsverlust.
GitHub erlaubt max. 100 MB pro Datei. Längere Videos besser auf YouTube/Vimeo hochladen und einbetten.

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

Änderungen: einfach Dateien erneut hochladen bzw. `git add . && git commit -m "Update" && git push`.

**Eigene Domain (optional):** Unter Settings → Pages → „Custom domain“ eintragen und beim Domain-Anbieter
einen CNAME-Eintrag auf `<dein-benutzername>.github.io` setzen.

## Farben & Schrift anpassen

- Akzentfarbe: `accent` in `content.js`
- Hintergrund-/Textfarben: ganz oben in `assets/css/style.css` unter `:root`
- Schriften: Instrument Serif, Inter, JetBrains Mono (alle SIL Open Font License, lokal eingebunden)
