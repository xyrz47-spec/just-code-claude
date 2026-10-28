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

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-7C3AED.svg)](https://anthropic.com)
[![Dual Backend](https://img.shields.io/badge/Backend-Antigravity%20CLI%20%7C%20Gemini%20API-4285F4.svg)](https://google.com)

> **„Claude schreibt den Code. Gemini schreibt die Texte.“**  
> Ein dedizierter **Claude Code Skill**, der eine strikte Arbeitsteilung erzwingt: Claude übernimmt Architektur, Algorithmen und Codelogik, während 100 % der Texterstellung in natürlicher Sprache (Dokumentation, READMEs, Commit-Nachrichten und Zeichenketten in Anführungszeichen `""` im Code) an **Google Gemini** über das **Antigravity CLI (`agy`)** oder die **direkte Google Gemini REST-API** delegiert werden.

---

## 📑 Inhaltsverzeichnis

- [Warum just-code-claude?](#-warum-just-code-claude)
- [Funktionsweise](#-funktionsweise)
- [Voraussetzungen](#-voraussetzungen)
- [Installationsanleitung](#-installationsanleitung)
  - [Methode 1: Globaler Claude Code Skill (Empfohlen)](#methode-1-globaler-claude-code-skill-empfohlen)
  - [Methode 2: Skill auf Projektebene](#methode-2-skill-auf-projektebene)
- [Konfiguration & Backends](#-konfiguration--backends)
  - [Backend 1: Antigravity CLI (`agy`)](#backend-1-antigravity-cli-agy)
  - [Backend 2: Direkte Google Gemini REST-API](#backend-2-direkte-google-gemini-rest-api)
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

## 🌟 Warum `just-code-claude`?

Claude ist eines der leistungsfähigsten KI-Modelle für Entwickler – herausragend in Softwarearchitektur, komplexem Zustandsmanagement, AST-Transformationen und Typsystemen. Viele Entwickler bevorzugen jedoch **Google Gemini** für flüssige, benutzerfreundliche Texte, lokalisierte Formulierungen, durchdachte Fehlermeldungen und technische Dokumentationen.

`just-code-claude` formalisiert diese Stärken in einem automatisierten Workflow:

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
                   │                       (über agy CLI oder Gemini API)
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

- **Claudes Bereich**: Systemarchitektur, Logik, Algorithmen, State Management, Typisierung, Tests, Fehlerbehebungen und Skript-Orchestrierung.
- **Geminis Bereich**: Technische Dokumentation, READMEs, Release Notes, Commit-Nachrichten und jedes für Menschen sichtbare Textliteral in Anführungszeichen (`""` oder `''`).

---

## ⚙️ Voraussetzungen

Zur Ausführung der Generierungsskripte wird Folgendes benötigt:

- **Laufzeitumgebung**: [Node.js](https://nodejs.org) (v18+ empfohlen) oder [Python](https://python.org) (v3.8+).
- **Ausführungs-Backend** (wähle eine Option):
  1. **Antigravity CLI (`agy`)**: Falls auf deinem System installiert und authentifiziert, funktioniert es sofort ohne zusätzliche API-Keys.
  2. **Google Gemini API-Key**: In Umgebungen ohne `agy` muss lediglich die Umgebungsvariable `GEMINI_API_KEY` (oder `GOOGLE_API_KEY`) aus dem [Google AI Studio](https://aistudio.google.com/) gesetzt werden.

> **Hinweis**: Sowohl `scripts/agy_call.js` als auch `scripts/agy_call.py` besitzen **keinerlei externe Abhängigkeiten (Zero Dependencies)**. Sie nutzen das native `fetch` von Node.js bzw. die Standardbibliothek `urllib.request` in Python. Kein `npm install` oder `pip install` erforderlich!

---

## 📦 Installationsanleitung

### Methode 1: Globaler Claude Code Skill (Empfohlen)

Bei globaler Installation steht `/just-code-claude` in **allen** Claude Code Sitzungen auf deinem Rechner zur Verfügung.

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

Das Skript installiert den Skill automatisch unter `~/.claude/skills/just-code-claude/`.

---

### Methode 2: Skill auf Projektebene

Wenn der Skill nur innerhalb eines bestimmten Projekts genutzt werden soll:

```bash
mkdir -p .claude/skills/just-code-claude
cp -r path/to/just-code-claude/* .claude/skills/just-code-claude/
```

---

## 🔌 Konfiguration & Backends

`just-code-claude` bietet nahtlose **Dual-Backend-Unterstützung** mit automatischer Erkennung:

### Backend 1: Antigravity CLI (`agy`)
Wenn das Antigravity CLI installiert ist:
- Wird es automatisch erkannt und bevorzugt ausgeführt.
- Keine API-Key-Konfiguration notwendig.
- Standardmäßig wird `--model gemini-3.8-flash-high` verwendet (kann auf Wunsch auf `gemini-4-argon-high` geändert werden).

### Backend 2: Direkte Google Gemini REST-API
Ideal für direkte Cloud-Aufrufe oder in CI/CD-Pipelines ohne `agy`:
1. Hole einen API-Key im [Google AI Studio](https://aistudio.google.com/).
2. Setze die Umgebungsvariable:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="dein-api-key-hier"

   # Windows PowerShell
   $env:GEMINI_API_KEY="dein-api-key-hier"
   ```
3. Alternativ kann der Key direkt beim Aufruf übergeben werden: `--api-key "dein-key"`.
4. Nutzt standardmäßig `gemini-2.5-flash` (über `-m` anpassbar).

---

## 🚀 Nutzung & Workflows

### 1. Skill in Claude Code aktivieren

Gib in Claude Code den folgenden Befehl ein:
```text
/just-code-claude
```
Oder verwende eine natürliche Anweisung:
```text
Aktiviere den just-code-claude Modus. Du übernimmst die Codelogik und Architektur, und rufst agy für alle Textinhalte und UI-Texte auf.
```

---

### 2. Workflow: String-Ersetzung im Code

#### Schritt A: Claude schreibt Code mit Platzhaltern
Claude implementiert die Logik und JSX/HTML-Struktur und platziert sichtbare Texte in `__AGY__("Anweisung"[, "Zielsprache"])` oder `__GEMINI__("Anweisung"[, "Zielsprache"])`:

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
Claude führt das mitgelieferte CLI-Skript im Terminal aus:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(In Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Schritt C: Fertiger Produktionscode
Alle Platzhalter werden an Ort und Stelle durch die von Gemini erzeugten Texte ersetzt:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Ihre Sitzung läuft bald ab"</h3>
      <p>"Zu Ihrer Sicherheit werden Sie in 5 Minuten automatisch abgemeldet. Bitte verlängern Sie Ihre Sitzung, um fortzufahren."</p>
      <button onClick={onExtend}>
        "Sitzung verlängern"
      </button>
    </div>
  );
}
```

---

### 3. Workflow: Erstellung von Dokumentation & Markdown

Delegiere technische Dokumentationen, READMEs und Benutzeranleitungen an Gemini:

```bash
# Mit Antigravity CLI (Standard: Automatische Erkennung)
node scripts/agy_call.js -p "Schreibe einen API-Leitfaden für Entwickler auf Deutsch" -o docs/API_GUIDE.md

# Explizite Nutzung der Gemini API
node scripts/agy_call.js -p "Verfasse eine Übersicht zur Systemarchitektur" -b api -o ARCHITECTURE.md

# Direkter agy CLI-Aufruf
agy -p "Erstelle eine README-Projektübersicht" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
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
  1. Antigravity CLI (agy): Automatisch erkannt, falls lokal vorhanden.
  2. Direct Gemini API: Automatisch verwendet, wenn GEMINI_API_KEY gesetzt ist oder agy fehlt.

Optionen:
  -p, --prompt <Text>          Direkter Prompt-Text zur Generierung
  -f, --file <Pfad>            Prompt/Kontext aus Datei einlesen
  -o, --output <Pfad>          Ausgabe direkt in Datei schreiben
  -b, --backend <Modus>        Backend-Engine: 'auto' (Standard), 'agy' oder 'api'
  -m, --model <Name>           Modellname (Standard für agy: gemini-3.8-flash-high, für api: gemini-2.5-flash)
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

Teste die Textgenerierung und Platzhalter-Ersetzung auf deinem System:

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
├── install.ps1              # 1-Klick-Installationsskript für Windows (PowerShell)
├── install.sh               # 1-Klick-Installationsskript für Linux/macOS (Bash)
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
