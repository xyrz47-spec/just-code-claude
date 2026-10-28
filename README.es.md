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

> **"Claude escribe el código. Gemini escribe los textos."**  
> Una **habilidad dedicada para Claude Code** que impone una división estricta del trabajo: Claude se encarga de la arquitectura, algoritmos y lógica del código, delegando el 100% de la generación de textos en lenguaje natural (documentación, READMEs, mensajes de commit y cadenas literales entre comillas `""` en el código) a **Google Gemini** a través de la **CLI de Antigravity (`agy`)** o la **API REST directa de Google Gemini**.

---

## 📑 Tabla de Contenidos

- [¿Por qué just-code-claude?](#-por-qué-just-code-claude)
- [Cómo Funciona](#-cómo-funciona)
- [Requisitos Previos](#-requisitos-previos)
- [Guía de Instalación](#-guía-de-instalación)
  - [Método 1: Habilidad Global de Claude Code (Recomendado)](#método-1-habilidad-global-de-claude-code-recomendado)
  - [Método 2: Habilidad a Nivel de Proyecto](#método-2-habilidad-a-nivel-de-proyecto)
- [Configuración y Motores Backend](#-configuración-y-motores-backend)
  - [Backend 1: CLI de Antigravity (`agy`)](#backend-1-cli-de-antigravity-agy)
  - [Backend 2: API REST Directa de Google Gemini](#backend-2-api-rest-directa-de-google-gemini)
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

## 🌟 ¿Por qué `just-code-claude`?

Claude es uno de los modelos de programación más potentes: sobresale en arquitectura de software, gestión de estados complejos, transformaciones AST y diseño tipado. Sin embargo, muchos desarrolladores prefieren **Google Gemini** para la redacción de textos amigables para el usuario, descripciones localizadas, mensajes de error empáticos y documentación técnica.

`just-code-claude` formaliza esta colaboración en un flujo de trabajo automatizado:

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
                   │                       (vía CLI agy o API de Gemini)
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

- **Dominio de Claude**: Arquitectura de sistemas, lógica, algoritmos, gestión de estado, tipado, pruebas, corrección de bugs y orquestación de scripts.
- **Dominio de Gemini**: Redacción técnica, documentación, notas de versión, mensajes de commit y cada cadena literal entre comillas (`""` o `''`) orientada a usuarios.

---

## ⚙️ Requisitos Previos

Para ejecutar las herramientas de generación, asegúrate de tener:

- **Entorno de ejecución**: [Node.js](https://nodejs.org) (v18+ recomendado) o [Python](https://python.org) (v3.8+).
- **Motor de ejecución** (elige cualquiera de los dos):
  1. **CLI de Antigravity (`agy`)**: Si ya está instalado y autenticado en tu equipo, funciona de forma inmediata sin necesidad de claves de API adicionales.
  2. **Clave de API de Google Gemini**: En entornos sin `agy`, simplemente exporta la variable `GEMINI_API_KEY` (o `GOOGLE_API_KEY`) obtenida en [Google AI Studio](https://aistudio.google.com/).

> **Nota**: `scripts/agy_call.js` y `scripts/agy_call.py` cuentan con **cero dependencias externas (Zero Dependencies)**. Utilizan la función nativa `fetch` en Node.js y la biblioteca estándar `urllib.request` en Python, por lo que no requieren `npm install` ni `pip install`.

---

## 📦 Guía de Instalación

### Recomendado: Instalar mediante `npx skills` (skills.sh)

Puedes instalar `just-code-claude` al instante utilizando la herramienta oficial [skills](https://skills.sh/) sin clonar el repositorio:

```bash
# Instalar globalmente para Claude Code
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# O instalar globalmente para todos los agentes de IA detectados
npx skills add xyrz47-spec/just-code-claude -g

# O instalar únicamente en el proyecto actual
npx skills add xyrz47-spec/just-code-claude
```

---

### Alternativa: Instalar mediante Git Clone

## 🔌 Configuración y Motores Backend

`just-code-claude` cuenta con soporte para **dos motores backend** con detección automática:

### Backend 1: CLI de Antigravity (`agy`)
Si la CLI de Antigravity está instalada:
- Se detecta y ejecuta automáticamente.
- No se requiere configurar ninguna clave de API.
- Utiliza `--model gemini-3.8-flash-high` de forma predeterminada (admite `gemini-4-argon-high`).

### Backend 2: API REST Directa de Google Gemini
Ideal para llamadas directas a la nube o en entornos de CI/CD sin `agy`:
1. Obtén una clave de API en [Google AI Studio](https://aistudio.google.com/).
2. Configura la variable de entorno:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="tu-api-key-aqui"

   # Windows PowerShell
   $env:GEMINI_API_KEY="tu-api-key-aqui"
   ```
3. O pásala directamente en la línea de comandos: `--api-key "tu-clave"`.
4. Utiliza el modelo `gemini-2.5-flash` por defecto (personalizable con `-m`).

---

## 🚀 Uso y Flujos de Trabajo

### 1. Activar la Habilidad en Claude Code

En cualquier sesión de Claude Code, escribe:
```text
/just-code-claude
```
O mediante lenguaje natural:
```text
Activa el modo just-code-claude. Tú te encargas de la arquitectura y la lógica del código, y llamas a agy para todos los textos y copys de la interfaz.
```

---

### 2. Flujo de Trabajo: Reemplazo de Cadenas en el Código

#### Paso A: Claude Escribe el Código con Marcadores de Posición
Claude implementa la lógica y la estructura JSX/HTML, insertando marcadores `__AGY__("instrucción"[, "idioma_destino"])` o `__GEMINI__("instrucción"[, "idioma_destino"])`:

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
Claude ejecuta el script CLI en la terminal:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(En Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Paso C: Código de Producción Final
Todos los marcadores de posición son reemplazados directamente por cadenas generadas por Gemini:
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

Delega toda la documentación técnica, guías y READMEs a Gemini:

```bash
# Usando la CLI de Antigravity (detección automática)
node scripts/agy_call.js -p "Escribe una guía de inicio rápido en español para nuestra API REST" -o docs/API_GUIDE.md

# Usando la API de Gemini explícitamente
node scripts/agy_call.js -p "Redacta una descripción general de la arquitectura del sistema" -b api -o ARCHITECTURE.md

# Ejecución directa de agy
agy -p "Escribe la descripción general del README del proyecto" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
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

Genera diccionarios localizados listos para usar:
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
  1. Antigravity CLI (agy): Detectado automáticamente si está instalado.
  2. Direct Gemini API: Utilizado automáticamente si GEMINI_API_KEY está definido o no se encuentra agy.

Opciones:
  -p, --prompt <texto>         Texto de instrucción directo para generar
  -f, --file <ruta>            Leer la instrucción/contexto desde un archivo
  -o, --output <ruta>          Guardar el resultado directamente en un archivo
  -b, --backend <modo>         Motor de backend: 'auto' (predeterminado), 'agy' o 'api'
  -m, --model <nombre>         Nombre del modelo (por defecto agy: gemini-3.8-flash-high, api: gemini-2.5-flash)
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
├── SKILL.md                 # Definición de la habilidad y reglas de división de trabajo
├── README.md                # Documentación oficial en inglés
├── README.ko.md             # Documentación oficial en coreano
├── README.ja.md             # Documentación oficial en japonés
├── README.zh-CN.md          # Documentación oficial en chino simplificado
├── README.es.md             # Documentación oficial en español
├── package.json             # Descriptor de paquete NPM
├── install.ps1              # Instalador con un clic para Windows PowerShell
├── install.sh               # Instalador con un clic para Linux/macOS
├── scripts/
│   ├── agy_call.js          # Ejecutor Node.js de backend dual (Cero dependencias)
│   ├── agy_call.py          # Ejecutor Python de backend dual (Solo biblioteca estándar)
│   └── test_skill.js        # Suite de pruebas automatizadas de verificación de extremo a extremo
├── examples/
│   ├── before_code.tsx      # Código de ejemplo con marcadores de posición __AGY__
│   └── ui_spec.json         # Ejemplo de especificación de localización
└── templates/
    └── prompt_templates.md  # Plantillas de prompts para copys de UX y documentación
```

---

## 📄 Licencia

Este proyecto está publicado bajo la [Licencia MIT](LICENSE).
