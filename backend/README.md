[![de](https://img.shields.io/badge/lang-de-blue.svg)](README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](README.en.md) 

# Backend - Reddnir
Die Backend-API für [Reddnir](https://github.com/VincentLucht/project-odin-book) entwickelt mit Node.js, Express und TypeScript.

## ✨ Hauptfeatures
**API-Architektur:**
- 100+ sichere REST-Endpunkte mit umfassender Eingabevalidierung
- Rollenbasierte Zugriffskontrolle für ordnungsgemäße Autorisierung auf allen Routen
- Strukturierte Fehlerbehandlung mit konsistenten Antwortformaten
- Umfassende Sicherheits-Middleware

**Datenbankmanagement:**
- PostgreSQL-Datenbank mit Prisma ORM für typsichere Datenbankoperationen
- Komplexes relationales Schema für Communities, Posts, Kommentare, Benutzer und Moderation
- Raw SQL Queries für fortgeschrittene Queries und Leistungsoptimierung
- Datenbankmigrationen und Seeding für Entwicklungs- und Produktionsumgebungen

**Authentifizierung & Sicherheit:**
- JWT-basierte Authentifizierung
- Passwort-Hashing mit bcrypt und Salt-Rounds
- CORS-Konfiguration für sichere Cross-Origin-Anfragen

**Community-System:**
- Community-Erstellung, -Verwaltung und Datenschutzkontrollen (öffentlich, eingeschränkt, privat)
- Mitgliederverwaltung mit Beitritts-/Verlassen-Funktionalität
- Moderationstools einschließlich Benutzersperren, Berichtsbehandlung und Mod-Mail
- Benutzerdefinierte Community-Einstellungen mit Icon- und Banner-Upload-Unterstützung

**Content-Management:**
- Post-CRUD-Operationen mit Voting-System und Karma-Berechnung
- Thread-Kommentarsystem mit unbegrenzten Antwort-Ebenen
- Content-Sortieralgorithmen (neu, beliebt, hot)
- Speichern/Entspeichern-Funktionalität

**Benutzerverwaltung:**
- Benutzerregistrierung via Username und email
- Profilanpassung mit Bio, Avatar und Beschreibung
- Karma-Tracking über Posts und Kommentare
- Benutzeraktivitäts-Feeds und Interaktionsverlauf

## 🧰 Installation & Setup
### ‼️ Voraussetzungen
Du **benötigst** 2 environment Variablen:
- `DATABASE_URL` (PostgreSQL-Connection String)
- `SECRET_KEY` (für password hashing)

### ⚙️ Installation
Projekt klonen:
```bash
git clone https://github.com/VincentLucht/project-odin-book.git
```

Öffne das directory und gehe anschließend in den Backend Ordner:
```bash
cd project-odin-book
cd backend
```

Dependencies installieren:
```bash
npm install
```

Datenbank einrichten:
```bash
npm prisma migrate dev
```

Server starten:
```bash
npm run dev
```

Führe den Seed-Script aus (optional):
```bash
npm run db
```

## ⚡️ Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=ts,nodejs,express,postgres,prisma)](https://skillicons.dev)