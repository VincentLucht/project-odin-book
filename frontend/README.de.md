[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md) 
[![de](https://img.shields.io/badge/lang-de-blue.svg)](README.de.md) 

# Frontend - Reddnir
Das Frontend für [Reddnir](https://github.com/VincentLucht/project-odin-book) entwickelt mit React und Typescript.

## ✨ Hauptfeatures
**Community-Management:**
- Communities durchsuchen, erstellen und mit benutzerdefinierten Icons und Bannern anpassen
- Community-Flairs erstellen
- Communities beitreten/verlassen
- Community-Mitgliederlisten anzeigen und Moderationstools für autorisierte Benutzer
- Community Einstellungen und Flairs bearbeiten, Mod-Mails und Berichte anzeigen

**Post-Interaktion:**
- Posts innerhalb von Communities mit vollständigen CRUD-Operationen erstellen
- Voting-System mit Upvote/Downvote Funktionalität und Karma Updates
- Mehrere Sortieralgorithmen (neu, beliebt, hot) für Post-Sortierung
- Posts für späteres Anzeigen speichern/entspeichern

**Kommentar-System:**
- Thread-Kommentardiskussionen mit unbegrenzter Antwort-Tiefe
- Erstelle, editiere oder lösche Kommentare
- Kommentare bewerten mit sofortigem UI-Feedback
- Einklappbare Kommentar-Threads für bessere Lesbarkeit
- Antwort-Ketten mit visueller Strukturierung und Verbindungslinien

**Benutzererfahrung:**
- Responsives Design optimiert für Desktop, Tablet und mobile Geräte (bis zu 360px)
- Erweiterte Suchfunktionalität über Posts, Kommentare und Communities
- Benutzerprofilanpassung mit Bio, Avatar und Beschreibung

**Performance & Navigation:**
- Client-side Routing mit React Router für schnelle Navigation
- Optimistische UI-Updates für sofortiges Benutzer Feedback
- Unendliches Scrollen und Virtualisierung für flüssige Performance bei großen Datensätzen

**Social Features:**
- Chat System für direkte Benutzernachrichten
- Benutzer-Karma-Tracking und -Anzeige über Posts und Kommentare
- Umfassende Aktivitäts-Feeds, die Posts, Kommentare und Interaktionen des Benutzers zeigen
- Meldesystem für Inhaltsmoderation

## 🧰 Installation & Setup
### ‼️ Voraussetzungen
Du <u>benötigst</u> 1 Umgebungsvariable: `VITE_API_URL` (URL deines Vite-Ports)

### ⚙️ Installation
Projekt klonen:
```bash
git clone https://github.com/VincentLucht/project-odin-book.git
```

Zum Projektverzeichnis und dann ins Frontend-Verzeichnis wechseln:
```bash
cd project-odin-book
cd frontend
```

Abhängigkeiten installieren:
```bash
npm install
```

Server starten:
```bash
npm run dev
```

## ⚡️ Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=ts,react,tailwind,vite)](https://skillicons.dev)