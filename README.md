# KI Mastery PWA 🤖

Dein persönliches KI-Lernprogramm als Progressive Web App.

## Features
- 4-Wochen-Lernplan für Claude & KI Grundlagen
- XP-System mit 10 Levels
- 🔥 Streak-Tracking
- 8 Achievements
- Interaktives Quiz
- Tagesaufgaben basierend auf Wochentag
- **Installierbar** als PWA auf dem Handy
- **Offline-fähig** via Service Worker
- Alle Daten lokal gespeichert (kein Account nötig)

## Lokal starten

```bash
# Option 1: Python (bereits auf Windows verfügbar)
python -m http.server 3000
# Dann: http://localhost:3000

# Option 2: VS Code Live Server Extension
# Rechtsklick auf index.html → "Open with Live Server"
```

> ⚠️ Muss über HTTP/HTTPS laufen (nicht direkt als Datei öffnen) damit Service Worker und PWA funktionieren.

## Deployment auf GitHub Pages (kostenlos & live in 2 Minuten)

1. Neues GitHub Repository erstellen: `kimastery-pwa`
2. Alle Dateien hochladen (oder `git push`)
3. Repository Settings → Pages → Source: **GitHub Actions**
4. GitHub Actions läuft automatisch → deine App ist live unter:
   `https://DEIN-USERNAME.github.io/kimastery-pwa/`
5. Auf dem Handy öffnen → Browser-Banner "Zum Startbildschirm hinzufügen" → installiert!

## Projektstruktur

```
kimastery-pwa/
├── index.html          # Haupt-App (alle Screens)
├── manifest.json       # PWA-Manifest
├── sw.js               # Service Worker (Offline)
├── css/
│   └── style.css       # Alle Styles (Dark Mode, Animationen)
├── js/
│   ├── data.js         # Lernplan, Quiz, Achievements
│   ├── state.js        # Zustand + localStorage
│   ├── ui.js           # Rendering-Funktionen
│   └── app.js          # Navigation + PWA-Install
├── icons/
│   ├── icon-192.png    # PWA Icon
│   └── icon-512.png    # PWA Icon (groß)
└── .github/
    └── workflows/
        └── deploy.yml  # Automatisches Deployment
```

## Daten & Datenschutz
Alle Daten (XP, Streak, Fortschritt) werden ausschließlich im `localStorage` des Browsers gespeichert. Es gibt keinen Server, keine Datenbank, keinen Account. Komplett privat.

## Version 2 — Geplante Features
- Mehr Phasen (Phase 2–4)
- Push-Notifications für tägliche Erinnerungen
- Statistik-Charts
- Themen-Wechsler (verschiedene Farbschemas)
- Social Sharing von Achievements

---
Erstellt mit Claude · KI Mastery v1.0
