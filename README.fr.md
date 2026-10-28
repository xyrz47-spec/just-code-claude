# Claude ne fait que coder (`just-code-claude`)

<p align="center">
  <b>Claude écrit le code. Gemini écrit le texte.</b><br>
  Compétence automatisée pour séparer la logique d'ingénierie de la génération de texte en langage naturel.
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
> Une compétence open source pour Claude Code : Claude gère l'architecture et la logique du code, tandis qu'il délègue la documentation, les README, **les messages de commit Git, les descriptions de PR** et les textes d'interface utilisateur à **Google Gemini** (`3.8 flash` ou `4 argon`, avec contrôle de l'effort de raisonnement) via l'**API REST Google Gemini** ou la **CLI Antigravity (`agy`)**.

---

## 🤖 Modèles Supportés et Effort de Raisonnement

| Modèle | Alias CLI | Cas d'Utilisation Principal | Effort Recommandé |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Par défaut)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | UI copy ultra-rapide, boutons, modales, messages de commit | `low` ou `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Raisonnement approfondi, architecture système, descriptions de PR | `high` ou `max` |

---

## 🐙 Intégration Git & GitHub (Commits & PR)

### 1. Commit automatique en une seule commande (`--commit`)
Analyse le diff indexé (staged), rédige un message selon Conventional Commits et exécute directement `git commit` :
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Implémentation du modal MFA et de l'actualisation de token" -l French
```

### 2. Prévisualisation du message de commit (`--commit-msg`)
Génère un message sans exécuter le commit immédiatement :
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: Correction d'une race condition sur WebSocket heartbeat" -l French
```

### 3. Description complète de GitHub PR (`--pr-desc`)
Exploite **`4 argon`** pour analyser l'ensemble des modifications et produire une description Markdown structurée pour votre PR :
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Migration du state management de Redux vers Zustand" -o PULL_REQUEST.md -l French
```

---

## 🛠 Référence CLI

```bash
# Remplacement de texte in-code avec 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l French

# Génération de documentation technique avec 4 argon
node scripts/agy_call.js -m "4 argon" -e high -p "Rédige le guide d'architecture des microservices" -o docs/ARCH.md -l French

# Créer un commit automatiquement
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l French
```

---

## 📄 Licence

Ce projet est distribué sous la [Licence MIT](LICENSE).
