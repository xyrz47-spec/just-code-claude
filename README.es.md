# Claude solo programa (`just-code-claude`)

<p align="center">
  <b>Claude escribe código. Gemini escribe texto.</b><br>
  Habilidad automatizada para separar la lógica de ingeniería de la generación de lenguaje natural.
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
> Una habilidad de código abierto para Claude Code: Claude se enfoca en la arquitectura y la lógica de programación, mientras delega la documentación técnica, READMEs, **mensajes de commit en Git, descripciones de PR, notas de versión de GitHub Releases** y textos de UI a **Google Gemini** (`3.8 flash` o `4 argon`, con esfuerzo de razonamiento configurable) mediante la **API REST de Gemini** o la **CLI Antigravity (`agy`)**.

---

## 🤖 Modelos Compatibles y Esfuerzo de Razonamiento

| Modelo | Alias CLI | Caso de Uso Principal | Esfuerzo Recomendado |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Por defecto)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | Copias de UI ultrarrápidas, botones, modales, mensajes de commit | `low` o `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Razonamiento profundo, documentos de arquitectura, descripciones de PR, GitHub Releases | `high` o `max` |

---

## 🐙 Integración con Git y GitHub (Commits, PRs y Releases)

### 1. Commit automático en un solo comando (`--commit`)
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Implementación de modal de autenticación MFA y flujo de actualización de tokens" -l Spanish
```

### 2. Vista previa del mensaje de commit (`--commit-msg`)
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: Corrección de condición de carrera en WebSocket heartbeat" -l Spanish
```

### 3. Descripción completa de GitHub PR (`--pr-desc`)
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Migración de estado frontend de Redux a Zustand" -o PULL_REQUEST.md -l Spanish
```

### 4. Notas de GitHub Releases y publicación (`--release-notes`, `--release [tag]`)
```bash
# Redactar notas de versión
node scripts/agy_call.js --release-notes -m "4 argon" -e high -p "Context: Versión v1.2.0" -o RELEASE_NOTES.md -l Spanish

# Publicar release en GitHub
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l Spanish
```

---

## 🛠 Referencia CLI

```bash
# Reemplazar cadenas en código con 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Spanish

# Generar documentación técnica con 4 argon
node scripts/agy_call.js -m "4 argon" -e high -p "Escribe la guía de arquitectura de microservicios" -o docs/ARCH.md -l Spanish

# Crear commit automáticamente
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l Spanish

# Publicar GitHub Release
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l Spanish
```

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
