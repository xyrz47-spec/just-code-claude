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

## ⚖️ Comparativa: Antes vs Después (Before vs After Showcase)

### Escenario 1: Creación de Componentes UI en Frontend
- **❌ Antes (Claude Code Estándar)**: La ventana de chat se satura de largas explicaciones y saludos superfluos, ralentizando la entrega. El código contiene textos ficticios genéricos y robóticos (`"Session Expiring"`, `"Please click OK"`).
- **✅ Después (`just-code-claude`)**: Cero texto conversacional, **entrega inmediata de código puro y limpio**. Gemini 3.8 flash sustituye los textos por copias profesionales de alta conversión (`"Session Expiring in 5 Minutes"`). Ahorro superior al 50% en tokens de contexto.

### Escenario 2: Commits en Git y Releases en GitHub
- **❌ Antes**: Commits vagos (`"update files"`) o resúmenes incompletos y frágiles en el chat.
- **✅ Después**: Gemini 3.8 flash genera mensajes Conventional Commits exhaustivos; Gemini 4 argon sintetiza las diferencias de tags y publica directamente la versión oficial en GitHub con `gh release create`.

---

## 📊 Eficiencia de Tokens y Comparativa de Rendimiento

| Métrica | Claude Code Estándar | Con `just-code-claude` | Beneficio |
| :--- | :--- | :--- | :--- |
| **Consumo de Tokens de Sesión** | ~3,500 tokens (con explicaciones) | ~1,600 tokens (código puro) | **📉 Ahorro de ~54%** |
| **Velocidad de Respuesta (Latencia)**| ~18.2s (tipeando texto largo) | ~7.8s (código inmediato) | **⚡ ~2.3x Más Rápido** |
| **Localización Multilingüe i18n** | Contamina el contexto principal | Procesado en lote vía CLI fuera de banda | **📉 >70% Ahorro de Tokens** |
| **Calidad de Textos UX** | Marcadores genéricos (`"Error"`) | Gemini 4 argon / 3.8 flash | **✨ Nivel Producción Inmediato** |
| **Síntesis de Changelogs** | Listado simple de commits | Análisis profundo y guía de migración | **🚀 Releases de Calidad Empresarial** |

---

## 🛡️ Política de Excepciones para Casos Límite (Seguridad y Alertas Críticas)

Excluir por completo el lenguaje natural podría ocultar advertencias de seguridad críticas o restricciones de tiempo de ejecución. Por ello, se definen **3 excepciones estrictas**:

1. **Alertas Críticas de Sistema y Seguridad (Máx 1–2 líneas)**:
   - Ante errores fatales, credenciales ausentes (`GEMINI_API_KEY`) u operaciones destructivas, Claude DEBE emitir un aviso breve:
     `> [!CRITICAL] Variable GEMINI_API_KEY no configurada. Establézcala antes de continuar.`
2. **Comentarios Técnicos en Código (1 línea)**:
   - Se permiten comentarios breves en el código que expliquen invariantes algorítmicas, bloqueos de concurrencia o regex complejas (`// Concurrency: bloqueo atómico para evitar race condition`).
3. **Diagnóstico y Salida de Comandos**:
   - Se permite reportar textualmente errores de compilación, trazas stderr y códigos de salida de la CLI.

---

## ⚙️ Guía de Configuración para Claude Code

1. **Instalación Global (Recomendada)**: Ejecute `npx just-code-claude` o `.\install.ps1` (Linux/macOS: `bash install.sh`) para inyectar automáticamente `~/.claude/rules/just-code-claude.md` y `~/.claude/CLAUDE.md`.
2. **Configuración por Proyecto**: Copie `rules/just-code-claude.md` a `.claude/rules/` en su repositorio.
3. **Invocación en Sesión**: Escriba `/just-code-claude` o indique: *"Usa 3.8 flash high para redactar textos y releases"*.

---

## 🤖 Modelos Compatibles y Esfuerzo de Razonamiento

| Modelo | Alias CLI | Caso de Uso Principal | Esfuerzo Recomendado |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Por defecto)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | Copias de UI ultrarrápidas, botones, modales, mensajes de commit | `low` o `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Razonamiento profundo, documentos de arquitectura, descripciones de PR, GitHub Releases | `high` o `max` |

---

## 🐙 Integración con Git y GitHub (Commits, PRs y Releases)

> [!IMPORTANT]
> **Comportamiento de Claude Code al crear Releases**:  
> Cuando el usuario solicita a Claude Code *"publica la versión v1.2.0"* o *"crea un GitHub release"*, Claude Code NO redacta las notas de versión con su propio LLM.  
> Conforme a la regla `~/.claude/rules/just-code-claude.md`, Claude Code extrae metadatos de Git (tags, historial de commits y diffs) y delega la redacción a Gemini **`4 argon`** (esfuerzo `high`), publicando luego la versión a través de GitHub CLI (`gh release create`).

### 1. Commit automático en un solo comando (`--commit`)
```bash
just-code-claude --commit -m "3.8 flash" -e medium -p "Context: Implementación de modal de autenticación MFA y flujo de actualización de tokens" -l Spanish
```

### 2. Vista previa del mensaje de commit (`--commit-msg`)
```bash
just-code-claude --commit-msg -m "3.8 flash" -e medium -p "Context: Corrección de condición de carrera en WebSocket heartbeat" -l Spanish
```

### 3. Descripción completa de GitHub PR (`--pr-desc`)
```bash
just-code-claude --pr-desc -m "4 argon" -e high -p "Context: Migración de estado frontend de Redux a Zustand" -o PULL_REQUEST.md -l Spanish
```

### 4. Notas de GitHub Releases y publicación (`--release-notes`, `--release [tag]`)
```bash
# Redactar notas de versión
just-code-claude --release-notes -m "4 argon" -e high -p "Context: Versión v1.2.0" -o RELEASE_NOTES.md -l Spanish

# Publicar release en GitHub
just-code-claude --release v1.2.0 -m "4 argon" -e high -l Spanish
```

---

## 🛡️ Arquitectura de Resiliencia y Optimización de Tokens

Middleware de ingeniería integrado para eliminar el desperdicio de tokens y manejar fallos transitorios en tiempo de ejecución:

1. **Middleware de Filtrado de Ruido (Ahorro de Tokens)**:
   - Excluye automáticamente lockfiles (`package-lock.json`, `Cargo.lock`, `pnpm-lock.yaml`), source maps, bundles minificados (`.min.js`), binarios e imágenes de los diffs de Git, evitando el desperdicio de miles de tokens innecesarios.
   - Trunca diffs individuales gigantes (>400 líneas) con un marcador de resumen para proteger los límites del contexto del LLM.
   - Filtra commits de merge (`--no-merges`) y bots automatizados (`dependabot`, `renovate`) del registro de commits.

2. **Garantía de Rollback Atómico**:
   - Si ocurre un error de red, límite de tasa o fallo de parseo durante `--replace-in-file`, el código fuente original en disco se **restaura al 100% de manera atómica**, evitando corrupciones parciales.

3. **Reintentos con Retroceso Exponencial y Jitter**:
   - Ante errores de red transitorios, caídas de socket o respuestas HTTP 429 (Rate Limit), activa automáticamente hasta 3 reintentos con retrasos exponenciales aleatorios.

4. **Motor de Recuperación de JSON Robusto en 3 Niveles**:
   - Recupera respuestas que contengan bloques markdown, comas finales o caracteres de control no escapados mediante un extractor alternativo con expresiones regulares.

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
