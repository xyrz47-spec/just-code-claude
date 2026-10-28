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

> **"Claude escribe el código. Gemini escribe los textos."**  
> Una **habilidad de código abierto para Claude Code** diseñada para separar tareas de ingeniería: Claude se enfoca en la arquitectura y la lógica del software, mientras delega los textos en lenguaje natural (documentación, READMEs, mensajes de commit y cadenas literales entre comillas `""`) a **Google Gemini** a través de la **API REST de Google Gemini** o la **CLI de Antigravity (`agy`)**.

---

## 📑 Tabla de Contenidos

- [Motivación y Filosofía de Diseño](#-motivación-y-filosofía-de-diseño)
- [Cómo Funciona](#-cómo-funciona)
- [Requisitos Previos](#-requisitos-previos)
- [Guía de Instalación](#-guía-de-instalación)
  - [Recomendado: Instalación con `npx skills`](#recomendado-instalación-con-npx-skills-skillssh)
  - [Alternativa: Instalación vía Git Clone](#alternativa-instalación-vía-git-clone)
- [Configuración y Motores de Ejecución](#-configuración-y-motores-de-ejecución)
  - [Motor 1: API REST Directa de Google Gemini (Estándar Universal)](#motor-1-api-rest-directa-de-google-gemini-estándar-universal)
  - [Motor 2: CLI de Antigravity (`agy`)](#motor-2-cli-de-antigravity-agy)
- [Uso y Flujos de Trabajo](#-uso-y-flujos-de-trabajo)
  - [1. Activar la Habilidad en Claude Code](#1-activar-la-habilidad-en-claude-code)
  - [2. Flujo de Trabajo: Reemplazo de Cadenas en el Código](#2-flujo-de-trabajo-reemplazo-de-cadenas-en-el-código)
  - [3. Flujo de Trabajo: Generación de Documentación y Markdown](#3-flujo-de-trabajo-generación-de-documentación-y-markdown)
  - [4. Flujo de Trabajo: Localización por Lotes e i18n](#4-flujo-de-trabajo-localización-por-lotes-e-i18n)
  - [5. Flujo de Trabajo: Mensajes de Commit y PR en Git](#5-flujo-de-trabajo-mensajes-de-commit-y-pr-en-git)
- [Referencia de Comandos CLI](#-referencia-de-comandos-cli)
- [Verificación y Pruebas](#-verificación-y-pruebas)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Licencia](#-licencia)

---

## 🌟 Motivación y Filosofía de Diseño

En el desarrollo moderno asistido por IA, los diferentes modelos presentan ventajas complementarias:
- **Claude**: Destaca en arquitecturas de software complejas, manipulación de AST, sistemas de tipos TypeScript y razonamiento algorítmico.
- **Google Gemini**: Ofrece una gran fluidez multilingüe, redacción de textos orientados a usuarios y rápida velocidad de generación.

`just-code-claude` integra estas capacidades en un flujo de trabajo estructurado:

```
                       ┌──────────────────────────────┐
                       │    Solicitud del Usuario     │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Lógica y Arquitectura de Código ]    [ Lenguaje Natural y Redacción ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                       (API Gemini o CLI agy)
                   ▼                                     ▼
       Funciones, Tipos, Estado, AST            Documentación, Botones UI,
       y Marcadores de Posición (__AGY__)       Mensajes de Error y Notificaciones
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │  Código Terminado en Producción│
                       └──────────────────────────────┘
```

- **Alcance de Claude**: Arquitectura de sistemas, lógica, algoritmos, gestión de estado, tipado, pruebas, corrección de bugs y ejecución de herramientas.
- **Alcance de Gemini**: Documentación técnica, READMEs, notas de versión, mensajes de commit y cadenas literales (`""` o `''`) legibles para personas.

> **Nota sobre el control de ejecución**: Este proyecto no actúa como un sandbox a nivel de sistema operativo o compilador, sino como una **directiva de flujo de trabajo basada en prompts** (`SKILL.md`) que guía a Claude Code para seguir esta división de tareas de forma metódica.

---

## ⚙️ Requisitos Previos

Para ejecutar los scripts de generación:

- **Entorno de ejecución**: [Node.js](https://nodejs.org) (v18+) o [Python](https://python.org) (v3.8+).
- **Motor de ejecución** (elegir uno):
  1. **Clave de API de Google Gemini (Estándar Universal)**: Obtén una clave gratuita en [Google AI Studio](https://aistudio.google.com/) y configúrala en la variable de entorno `GEMINI_API_KEY`.
  2. **CLI de Antigravity (`agy`)**: Si trabajas en un entorno Antigravity con `agy` autenticado, se detectará automáticamente sin necesidad de una clave adicional.

> **Zero Dependencies**: Tanto `scripts/agy_call.js` (usando `fetch` nativo) como `scripts/agy_call.py` (usando `urllib.request`) tienen **cero dependencias externas**. No se requiere `npm install` ni `pip install`.

---

## 📦 Guía de Instalación

### Recomendado: Instalación con `npx skills` (skills.sh)

Utiliza la herramienta estándar abierta [skills](https://skills.sh/) para instalar sin clonar manualmente:

```bash
# Instalar globalmente para Claude Code (Verificado)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# O instalar únicamente en el repositorio actual
npx skills add xyrz47-spec/just-code-claude -a claude-code
```

---

### Alternativa: Instalación vía Git Clone

#### En Windows (PowerShell):
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### En Linux / macOS (Bash):
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

El script copiará los archivos de la habilidad en `~/.claude/skills/just-code-claude/`.

---

## 🔌 Configuración y Motores de Ejecución

La herramienta de soporte incluye detección automática entre dos motores:

### Motor 1: API REST Directa de Google Gemini (Estándar Universal)
Recomendado para la gran mayoría de desarrolladores y flujos de CI/CD:
1. Obtén una clave de API en [Google AI Studio](https://aistudio.google.com/).
2. Configura la variable de entorno:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="tu-api-key-aqui"

   # Windows PowerShell
   $env:GEMINI_API_KEY="tu-api-key-aqui"
   ```
3. Modelo predeterminado: `gemini-2.5-flash` (personalizable con `-m`).

### Motor 2: CLI de Antigravity (`agy`)
Para usuarios que disponen del entorno de desarrollo Antigravity:
- Si `agy` está disponible en tu `PATH`, se utiliza automáticamente.
- Hereda la autenticación local de tu CLI Antigravity.
- Modelo predeterminado: `gemini-3.8-flash-high` (modelo del entorno Antigravity).

---

## 🚀 Uso y Flujos de Trabajo

### 1. Activar la Habilidad en Claude Code

En Claude Code, escribe:
```text
/just-code-claude
```
O con una instrucción directa:
```text
Activa el modo just-code-claude. Tú construyes la arquitectura y lógica del código, y delegas todos los textos y documentación a Gemini.
```

---

### 2. Flujo de Trabajo: Reemplazo de Cadenas en el Código

#### Paso A: Claude Escribe el Código con Marcadores de Posición
Claude implementa la lógica y la estructura, insertando marcadores: `__AGY__("instrucción"[, "idioma_destino"])` o `__GEMINI__("instrucción"[, "idioma_destino"])`:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("Título de advertencia de sesión a punto de expirar", "Spanish")__</h3>
      <p>__AGY__("Aviso que explica el cierre de sesión en 5 minutos y sugiere extenderla", "Spanish")__</p>
      <button onClick={onExtend}>
        __AGY__("Texto del botón para extender la sesión", "Spanish")__
      </button>
    </div>
  );
}
```

#### Paso B: Ejecución del Script de Reemplazo
Claude ejecuta la herramienta CLI en la terminal:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(O en Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Paso C: Código de Producción Final
Los marcadores de posición se reemplazan directamente por cadenas generadas:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Tu sesión está a punto de caducar"</h3>
      <p>"Por tu seguridad, tu sesión se cerrará automáticamente en 5 minutos por inactividad. Extiende tu sesión para continuar trabajando."</p>
      <button onClick={onExtend}>
        "Mantener sesión iniciada"
      </button>
    </div>
  );
}
```

---

### 3. Flujo de Trabajo: Generación de Documentación y Markdown

Delega la documentación técnica, guías o READMEs a Gemini:

```bash
# Vía API REST de Gemini
node scripts/agy_call.js -p "Escribe una guía de inicio rápido en español para nuestra API REST" -b api -o docs/API_GUIDE.md

# Vía CLI agy (si está instalado)
node scripts/agy_call.js -p "Redacta una descripción general de la arquitectura del sistema" -b agy -o ARCHITECTURE.md
```

---

### 4. Flujo de Trabajo: Localización por Lotes e i18n

Dado un archivo de especificación `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "Botón de acción principal para iniciar sesión",
    "forgot_password": "Enlace de ayuda para recuperar la contraseña",
    "password_hint": "Pista indicando que la contraseña debe tener al menos 8 caracteres"
  }
}
```

Genera diccionarios localizados listos para producción:
```bash
# Generar traducción en español
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# Generar traducción en coreano
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/ko.json --lang Korean
```

---

### 5. Flujo de Trabajo: Mensajes de Commit y PR en Git

Al preparar commits o solicitudes de extracción (Pull Requests):

```bash
# 1. Capturar el diff preparado
git diff --staged > .git_diff.tmp

# 2. Solicitar a agy la redacción del commit en formato Conventional Commits
node scripts/agy_call.js -f .git_diff.tmp -p "Analiza este diff y redacta un mensaje Conventional Commits con un título menor a 50 caracteres y un cuerpo explicativo. Idioma: Español." -o .commit_msg.tmp

# 3. Realizar el commit con el texto generado
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 Referencia de Comandos CLI

```text
Uso: node scripts/agy_call.js [opciones]
 o bien: python scripts/agy_call.py [opciones]

Ejecución de Backend Dual:
  1. Direct Gemini API: Utilizado cuando GEMINI_API_KEY está definido o con -b api.
  2. Antigravity CLI (agy): Detectado automáticamente si está instalado en el equipo.

Opciones:
  -p, --prompt <texto>         Texto de instrucción directo para generar
  -f, --file <ruta>            Leer la instrucción/contexto desde un archivo
  -o, --output <ruta>          Guardar el resultado directamente en un archivo
  -b, --backend <modo>         Motor de backend: 'auto' (predeterminado), 'api' o 'agy'
  -m, --model <nombre>         Nombre del modelo (por defecto api: gemini-2.5-flash, agy: gemini-3.8-flash-high)
  --api-key <clave>            Clave de API de Google Gemini (o variable GEMINI_API_KEY)
  -l, --lang <idioma>          Idioma del resultado generado (ej. English, Korean, Japanese, Spanish)
  -s, --system <texto>         Instrucciones de sistema antepuestas al prompt
  --effort <nivel>             Nivel de razonamiento para agy (low, medium, high)
  --replace-in-file <ruta>     Escanear el archivo de código en busca de marcadores __AGY__("...")
                               o __GEMINI__("...") y reemplazarlos en el lugar por texto real
  --json-strings <ruta>        Generar textos a partir de un mapa JSON de claves y descripciones
  --raw                        Imprimir únicamente el texto sin formato adicional
  -h, --help                   Mostrar este mensaje de ayuda
```

---

## 🧪 Verificación y Pruebas

Comprueba que la generación de texto y el reemplazo en el código funcionan correctamente:

```bash
npm test
# o
node scripts/test_skill.js
```

---

## 📁 Estructura del Repositorio

```
just-code-claude/
├── SKILL.md                 # Definición de la habilidad y reglas de trabajo para Claude Code
├── README.md                # Documentación en inglés
├── README.ko.md             # Documentación en coreano
├── README.ja.md             # Documentación en japonés
├── README.zh-CN.md          # Documentación en chino simplificado
├── README.es.md             # Documentación en español
├── README.fr.md             # Documentación en francés
├── README.de.md             # Documentación en alemán
├── package.json             # Descriptor de paquete NPM
├── install.ps1              # Script de instalación para Windows PowerShell
├── install.sh               # Script de instalación para Linux/macOS
├── scripts/
│   ├── agy_call.js          # Ejecutor Node.js de backend dual (Cero dependencias)
│   ├── agy_call.py          # Ejecutor Python de backend dual (Solo biblioteca estándar)
│   └── test_skill.js        # Suite de pruebas automatizadas de verificación
├── examples/
│   ├── before_code.tsx      # Código de ejemplo con marcadores de posición __AGY__
│   └── ui_spec.json         # Ejemplo de especificación de localización
└── templates/
    └── prompt_templates.md  # Plantillas de prompts para copys de UX y documentación
```

---

## 📄 Licencia

Este proyecto está publicado bajo la [Licencia MIT](LICENSE).
