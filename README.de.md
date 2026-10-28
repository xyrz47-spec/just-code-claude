# Claude schreibt nur Code (`just-code-claude`)

<p align="center">
  <b>Claude schreibt den Code. Gemini schreibt den Text.</b><br>
  Ein automatisierter Workflow-Skill zur Trennung von Entwicklungslogik und Textgenerierung.
</p>

<p align="center">
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

> **"Claude writes code. Gemini writes text."**  
> Ein Open-Source-Skill für Claude Code: Claude konzentriert sich auf Architektur und Codelogik, während technische Dokumentationen, READMEs, **Git-Commit-Nachrichten, PR-Beschreibungen, GitHub Release Notes** und UI-Texte an **Google Gemini** (`3.8 flash` oder `4 argon`, mit einstellbarem Denkaufwand) über die **Google Gemini REST API** oder die **Antigravity CLI (`agy`)** delegiert werden.

---

## 🤖 Unterstützte Modelle & Denkaufwand (Reasoning Effort)

| Modell | CLI-Alias | Hauptanwendungsbereich | Empfohlener Aufwand |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Standard)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | Ultraschnelle UI-Texte, Buttons, Modale, Git-Commit-Nachrichten | `low` oder `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Tiefe Logik, Systemarchitektur, API-Spezifikationen, GitHub PRs, GitHub Release Notes | `high` oder `max` |

---

## 🐙 Git & GitHub Integration (Commit, PR & Release)

### 1. Ein-Klick-Commit (`--commit`)
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Implementierung von MFA-Login-Dialog und Token-Refresh" -l German
```

### 2. Commit-Nachricht vorab prüfen (`--commit-msg`)
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: Behebung von Race Condition beim WebSocket Heartbeat" -l German
```

### 3. Vollständige GitHub PR-Beschreibung (`--pr-desc`)
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Migration des Frontend-State-Managements von Redux zu Zustand" -o PULL_REQUEST.md -l German
```

### 4. GitHub Release Notes & Veröffentlichung (`--release-notes`, `--release [tag]`)
```bash
# Release Notes in Markdown-Datei generieren
node scripts/agy_call.js --release-notes -m "4 argon" -e high -p "Context: Meilenstein-Release v1.2.0" -o RELEASE_NOTES.md -l German

# GitHub Release direkt veröffentlichen
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l German
```

---

## 🛠 CLI-Referenz

```bash
# In-Code Textersetzung mit 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l German

# Technische Dokumentation mit 4 argon erstellen
node scripts/agy_call.js -m "4 argon" -e high -p "Schreibe die Microservices-Architekturübersicht" -o docs/ARCH.md -l German

# Git-Commit automatisch erstellen
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l German

# GitHub Release veröffentlichen
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l German
```

---

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.
