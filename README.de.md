# Just Code, Claude! 💻🚫✍️

<p align="left">
  <a href="README.md"><b>English</b></a> •
  <a href="README.ko.md"><b>한국어</b></a> •
  <a href="README.ja.md"><b>日本語</b></a> •
  <a href="README.zh-CN.md"><b>简体中文</b></a> •
  <a href="README.es.md"><b>Español</b></a> •
  <a href="README.fr.md"><b>Français</b></a> •
  <a href="README.de.md"><b>Deutsch</b></a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Target: Claude Code](https://img.shields.io/badge/Agent-Claude%20Code-7C3AED.svg)](https://github.com/xyrz47-spec/just-code-claude)
[![Powered by: Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4.svg)](https://aistudio.google.com/)

> **„Claude schreibt den Code. Gemini schreibt die Texte.“**  
> Ein Open-Source **Claude Code Skill**, der eine strukturierte Arbeitsteilung vorsieht: Claude konzentriert sich auf Softwarearchitektur und Codelogik, während die Erstellung von Texten in natürlicher Sprache (Dokumentation, READMEs, Commit-Nachrichten und Stringliterale in Anführungszeichen `""`) an **Google Gemini** über die **Google Gemini REST-API** oder das **Antigravity CLI (`agy`)** delegiert wird.

---

## 📑 Inhaltsverzeichnis

- [Motivation & Designphilosophie](#-motivation--designphilosophie)
- [Funktionsweise](#-funktionsweise)
- [Voraussetzungen](#-voraussetzungen)
- [Installationsanleitung](#-installationsanleitung)
  - [Empfohlen: Installation über `npx skills`](#empfohlen-installation-über-npx-skills-skillssh)
  - [Alternative: Installation über Git Clone](#alternative-installation-über-git-clone)
- [Konfiguration & Ausführungs-Backends](#-konfiguration--ausführungs-backends)
  - [Backend 1: Direkte Google Gemini REST-API (Universeller Standard)](#backend-1-direkte-google-gemini-rest-api-universeller-standard)
  - [Backend 2: Antigravity CLI (`agy`)](#backend-2-antigravity-cli-agy)
- [Nutzung & Workflows](#-nutzung--workflows)
  - [1. Skill in Claude Code aktivieren](#1-skill-in-claude-code-aktivieren)
  - [2. Workflow: String-Ersetzung im Code](#2-workflow-string-ersetzung-im-code)
  - [3. Workflow: Erstellung von Dokumentation & Markdown](#3-workflow-erstellung-von-dokumentation--markdown)
  - [4. Workflow: Batch-Lokalisierung & i18n](#4-workflow-batch-lokalisierung--i18n)
  - [5. Workflow: Git-Commits und PR-Nachrichten](#5-workflow-git-commits-und-pr-nachrichten)
- [CLI-Referenz](#-cli-referenz)
- [Verifizierung & Tests](#-verifizierung--tests)
- [Repository-Struktur](#-repository-struktur)
- [Lizenz](#-lizenz)

---

## 🌟 Motivation & Designphilosophie

In modernen KI-gestützten Entwicklungsworkflows verfügen verschiedene Modelle über spezifische Stärken:
- **Claude**: Herausragend in komplexer Softwarearchitektur, AST-Manipulation, TypeScript-Typsystemen und algorithmischer Logik.
- **Google Gemini**: Hohe sprachliche Natürlichkeit bei mehrsprachigen Texten, benutzerfreundliche Formulierungen und schnelle Generierungszeiten.

`just-code-claude` verbindet diese Eigenschaften in einem automatisierten Workflow:

```
                       ┌──────────────────────────────┐
                       │      Benutzeranforderung     │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Codelogik & Architektur ]            [ Natürliche Sprache & Texte ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                         (Gemini API oder agy CLI)
                   ▼                                     ▼
       Funktionen, Typen, State, AST            Dokumentation, UI-Schaltflächen,
       & Platzhalter (__AGY__)                  Fehlermeldungen & Hinweistexte
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │     Fertiger Produktionscode │
                       └──────────────────────────────┘
```

- **Claudes Bereich**: Systemarchitektur, Logik, Algorithmen, State Management, Typisierung, Tests, Fehlerbehebung und Skriptausführung.
- **Geminis Bereich**: Technische Dokumentation, READMEs, Release Notes, Commit-Nachrichten und vom Menschen gelesene Stringliterale (`""` oder `''`).

> **Hinweis zur Durchsetzung**: Dieses Projekt fungiert nicht als Betriebssystem- oder Compiler-Sandbox, sondern als eine **prompt-basierte Workflow-Direktive** (`SKILL.md`), die Claude Code systematisch zu dieser Aufgabenteilung anleitet.

---

## ⚙️ Voraussetzungen

Zur Ausführung der Generierungsskripte:

- **Laufzeitumgebung**: [Node.js](https://nodejs.org) (v18+) oder [Python](https://python.org) (v3.8+).
- **Ausführungs-Backend** (wähle eine Option):
  1. **Google Gemini API-Key (Universeller Standard)**: Kostenlosen API-Key im [Google AI Studio](https://aistudio.google.com/) erstellen und als Umgebungsvariable `GEMINI_API_KEY` setzen.
  2. **Antigravity CLI (`agy`)**: Falls in einer Antigravity-Umgebung mit vorkonfiguriertem `agy` CLI gearbeitet wird, wird dieses ohne zusätzlichen API-Key automatisch verwendet.

> **Zero Dependencies**: `scripts/agy_call.js` (natives `fetch`) und `scripts/agy_call.py` (`urllib.request`) haben **keine externen Abhängigkeiten**. Es ist kein `npm install` oder `pip install` nötig.

---

## 📦 Installationsanleitung

### Empfohlen: Installation über `npx skills` (skills.sh)

Über das offizielle Tool [skills](https://skills.sh/) lässt sich der Skill ohne manuelles Klonen installieren:

```bash
# Global für Claude Code installieren (Verifiziert)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# Oder nur im aktuellen Projekt installieren
npx skills add xyrz47-spec/just-code-claude -a claude-code
```

---

### Alternative: Installation über Git Clone

#### Unter Windows (PowerShell):
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### Unter Linux / macOS (Bash):
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

Das Installationsskript kopiert die Skill-Dateien direkt nach `~/.claude/skills/just-code-claude/`.

---

## 🔌 Konfiguration & Ausführungs-Backends

Das CLI-Hilfswerkzeug unterstützt zwei Backends mit automatischer Erkennung:

### Backend 1: Direkte Google Gemini REST-API (Universeller Standard)
Für die meisten Entwickler und CI/CD-Pipelines empfohlen:
1. API-Key im [Google AI Studio](https://aistudio.google.com/) erstellen.
2. Umgebungsvariable setzen:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="dein-api-key-hier"

   # Windows PowerShell
   $env:GEMINI_API_KEY="dein-api-key-hier"
   ```
3. Standardmodell: `gemini-2.5-flash` (über `-m` anpassbar).

### Backend 2: Antigravity CLI (`agy`)
Für Nutzer in der Antigravity-Entwicklungsumgebung:
- Wird automatisch verwendet, wenn `agy` im `PATH` vorhanden ist.
- Verwendet die lokale Antigravity CLI-Authentifizierung.
- Standardmodell: `gemini-3.8-flash-high` (Antigravity-Umgebungsmodell).

---

## 🚀 Nutzung & Workflows

### 1. Skill in Claude Code aktivieren

Gib in Claude Code den folgenden Befehl ein:
```text
/just-code-claude
```
Oder verwende eine direkte Anweisung:
```text
Aktiviere den just-code-claude Modus. Du erstellst Codelogik und Architektur und delegierst alle Texte und Dokumentationen an Gemini.
```

---

### 2. Workflow: String-Ersetzung im Code

#### Schritt A: Claude schreibt Code mit Platzhaltern
Claude implementiert Logik und Komponentenstruktur und platziert Platzhalter: `__AGY__("Anweisung"[, "Zielsprache"])` oder `__GEMINI__("Anweisung"[, "Zielsprache"])`:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("Warnhinweis-Titel für ablaufende Sitzung", "German")__</h3>
      <p>__AGY__("Hinweis, dass die Abmeldung in 5 Minuten erfolgt, mit Aufforderung zur Verlängerung", "German")__</p>
      <button onClick={onExtend}>
        __AGY__("Beschriftung der Schaltfläche zum Verlängern", "German")__
      </button>
    </div>
  );
}
```

#### Schritt B: Automatische Ersetzung ausführen
Claude führt das mitgelieferte CLI-Tool im Terminal aus:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Oder in Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Schritt C: Fertiger Produktionscode
Die Platzhalter werden direkt durch generierten Text ersetzt:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Ihre Sitzung läuft bald ab"</h3>
      <p>"Zu Ihrer Sicherheit werden Sie in 5 Minuten bei Inaktivität automatisch abgemeldet."</p>
      <button onClick={onExtend}>
        "Angemeldet bleiben"
      </button>
    </div>
  );
}
```

---

### 3. Workflow: Erstellung von Dokumentation & Markdown

Delegiere technische Dokumentationen oder Anleitungen an Gemini:

```bash
# Über die direkte Gemini REST-API
node scripts/agy_call.js -p "Schreibe einen API-Leitfaden auf Deutsch für unsere REST-Endpunkte" -b api -o docs/API_GUIDE.md

# Über das agy CLI (falls installiert)
node scripts/agy_call.js -p "Verfasse eine Übersicht zur Systemarchitektur" -b agy -o ARCHITECTURE.md
```

---

### 4. Workflow: Batch-Lokalisierung & i18n

Ausgehend von einer Spezifikationsdatei `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "Hauptaktions-Schaltfläche zum Anmelden",
    "forgot_password": "Hilfelink zum Zurücksetzen des Passworts",
    "password_hint": "Hinweis, dass das Passwort mindestens 8 Zeichen lang sein muss"
  }
}
```

Erzeuge fertige Lokalisierungsdateien:
```bash
# Spanische Übersetzung generieren
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# Deutsche Übersetzung generieren
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/de.json --lang German
```

---

### 5. Workflow: Git-Commits und PR-Nachrichten

Beim Vorbereiten von Commits oder Pull Requests:

```bash
# 1. Bereitgestellte Änderungen erfassen
git diff --staged > .git_diff.tmp

# 2. agy aufrufen, um eine Conventional-Commits-Nachricht zu formulieren
node scripts/agy_call.js -f .git_diff.tmp -p "Analysiere diesen Diff und erstelle eine Conventional-Commits-Nachricht mit maximal 50 Zeichen im Titel und aussagekräftigem Text. Sprache: Deutsch." -o .commit_msg.tmp

# 3. Commit mit dem generierten Text ausführen
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 CLI-Referenz

```text
Verwendung: node scripts/agy_call.js [Optionen]
       oder: python scripts/agy_call.py [Optionen]

Dual-Backend-Ausführung:
  1. Direct Gemini API: Wird verwendet, wenn GEMINI_API_KEY gesetzt ist oder mit -b api.
  2. Antigravity CLI (agy): Automatisch erkannt, falls lokal vorhanden.

Optionen:
  -p, --prompt <Text>          Direkter Prompt-Text zur Generierung
  -f, --file <Pfad>            Prompt/Kontext aus Datei einlesen
  -o, --output <Pfad>          Ausgabe direkt in Datei schreiben
  -b, --backend <Modus>        Backend-Engine: 'auto' (Standard), 'api' oder 'agy'
  -m, --model <Name>           Modellname (Standard für api: gemini-2.5-flash, für agy: gemini-3.8-flash-high)
  --api-key <Key>              Google Gemini API-Key (oder GEMINI_API_KEY Umgebungsvariable)
  -l, --lang <Sprache>         Zielsprache (z. B. English, Korean, Japanese, German, Spanish)
  -s, --system <Text>          Systemanweisungen, die dem Prompt vorangestellt werden
  --effort <Stufe>             Reasoning-Stufe für agy (low, medium, high)
  --replace-in-file <Pfad>     Durchsucht Quellcodedatei nach __AGY__("...") oder __GEMINI__("...")
                               und ersetzt diese direkt durch generierte Strings
  --json-strings <Pfad>        Liest JSON-Spezifikation und erzeugt lokalisierte Key-Value-Paare
  --raw                        Gibt nur reinen Text ohne zusätzliche Formatierung aus
  -h, --help                   Hilfe anzeigen
```

---

## 🧪 Verifizierung & Tests

Führe den automatisierten Test durch:

```bash
npm test
# oder
node scripts/test_skill.js
```

---

## 📁 Repository-Struktur

```
just-code-claude/
├── SKILL.md                 # Skill-Definition und Regeln für Claude Code
├── README.md                # Englische Originaldokumentation
├── README.ko.md             # Koreanische Dokumentation
├── README.ja.md             # Japanische Dokumentation
├── README.zh-CN.md          # Chinesische Dokumentation (Vereinfacht)
├── README.es.md             # Spanische Dokumentation
├── README.fr.md             # Französische Dokumentation
├── README.de.md             # Deutsche Dokumentation
├── package.json             # NPM-Paketdatei
├── install.ps1              # Windows PowerShell Installationsskript
├── install.sh               # Linux/macOS Installationsskript
├── scripts/
│   ├── agy_call.js          # Node.js Dual-Backend Runner (0 externe Abhängigkeiten)
│   ├── agy_call.py          # Python Dual-Backend Runner (ausschließlich Standardbibliothek)
│   └── test_skill.js        # Automatisierte End-to-End-Testsuite
├── examples/
│   ├── before_code.tsx      # Code-Beispiel mit __AGY__ Platzhaltern
│   └── ui_spec.json         # Lokalisierungs-Spezifikation
└── templates/
    └── prompt_templates.md  # Prompt-Vorlagen für UX-Copywriting und Dokumentation
```

---

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) veröffentlicht.
