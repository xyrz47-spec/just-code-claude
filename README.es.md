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
> Una habilidad de código abierto para Claude Code: Claude se enfoca en la arquitectura y la lógica de programación, mientras delega la documentación técnica, READMEs, mensajes de commit y textos de UI a **Google Gemini** (`3.8 flash` o `4 argon`, con esfuerzo de razonamiento configurable) mediante la **API REST de Gemini** o la **CLI Antigravity (`agy`)**.

---

## 🤖 Modelos Compatibles y Esfuerzo de Razonamiento (Reasoning Effort)

| Modelo | Alias CLI | Caso de Uso Principal | Esfuerzo Recomendado |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Por defecto)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | Copias de UI ultrarrápidas, botones, modales, alertas y toasts | `low` o `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Razonamiento profundo, documentos de arquitectura y especificaciones | `high` o `max` |

### Niveles de Esfuerzo (`-e, --effort`):
- `low`: Microcopia, botones, etiquetas individuales (respuesta instantánea).
- `medium` *(Por defecto)*: Modales, validaciones de formularios, mensajes de commit.
- `high`: Documentación técnica profunda, resúmenes arquitectónicos.
- `xhigh` / `max`: Guías complejas, especificaciones de migración, informes de seguridad.

---

## 🎯 Directivas Detalladas de Contexto

Claude debe proporcionar instrucciones ricas en 5 dimensiones (Contexto, Intención, Tono, Restricciones, Idioma de destino):

```tsx
<button onClick={onConfirm}>
  __AGY__("Context: Modal de pago de suscripción | Intent: Promover suscripción anual con 20% de descuento | Tone: Claro y motivador | Constraints: 3 palabras, Title Case | Model: 3.8 flash", "Spanish")__
</button>
```

---

## 📦 Instalación

```bash
# Instalación global para Claude Code (Recomendado)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code
```

---

## 🛠 Referencia CLI

```bash
# Reemplazar cadenas en código con 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Spanish

# Generar documentación técnica con 4 argon
node scripts/agy_call.js -m "4 argon" -e high -p "Escribe la guía de arquitectura de microservicios" -o docs/ARCH.md -l Spanish
```

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
