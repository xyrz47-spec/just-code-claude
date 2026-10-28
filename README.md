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

> **"Claude writes code. Gemini writes text."**  
> A dedicated **Claude Code skill** that strictly enforces a division of labor: Claude handles all code architecture, algorithms, and logic, while delegating 100% of natural language text generation (documentation, READMEs, commit messages, and in-code string literals inside quotes) to **Google Gemini** via the **Antigravity CLI (`agy`)** or the **Direct Google Gemini REST API**.

---

## 📑 Table of Contents

- [Why just-code-claude?](#-why-just-code-claude)
- [How It Works](#-how-it-works)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
  - [Method 1: Global Claude Code Skill (Recommended)](#method-1-global-claude-code-skill-recommended)
  - [Method 2: Project-Level Skill](#method-2-project-level-skill)
- [Configuration & Backends](#-configuration--backends)
  - [Backend 1: Antigravity CLI (`agy`)](#backend-1-antigravity-cli-agy)
  - [Backend 2: Direct Google Gemini API](#backend-2-direct-google-gemini-api)
- [Usage & Workflows](#-usage--workflows)
  - [1. Activating the Skill](#1-activating-the-skill-in-claude-code)
  - [2. In-Code String Replacement](#2-workflow-in-code-string-replacement)
  - [3. Documentation & Markdown Generation](#3-workflow-generating-documentation--markdown)
  - [4. Batch UI Strings & i18n Localization](#4-workflow-batch-i18n-localization)
  - [5. Git Commit & PR Messages](#5-workflow-git-commit--pr-messages)
- [CLI Reference](#-cli-reference)
- [Verification & Testing](#-verification--testing)
- [Repository Structure](#-repository-structure)
- [License](#-license)

---

## 🌟 Why `just-code-claude`?

Claude is one of the most capable programming models available—outstanding at software architecture, complex state management, AST manipulations, and type safety. However, many developers prefer **Google Gemini** for natural, user-friendly copy, localized marketing descriptions, empathetic error messages, and documentation.

`just-code-claude` formalizes this partnership into an automated workflow:

```
                       ┌──────────────────────────────┐
                       │         User Request         │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Code Logic & Architecture ]          [ Human Language & Copy ]
                   │                                     │
             Claude Code                            Google Gemini
                   │                         (via 'agy' CLI or Gemini API)
                   ▼                                     ▼
      Functions, Types, State, AST              Documentation, UI Labels,
      & Placeholders (__AGY__)                  Error Messages & Copy
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │  Finished Production Code    │
                       └──────────────────────────────┘
```

- **Claude's Domain**: System architecture, logic, algorithms, state management, types, testing, bug fixes, and orchestrating generation scripts.
- **Gemini's Domain**: Technical writing, documentation, release notes, commit messages, and every string literal (`""` or `''`) intended for human eyes.

---

## ⚙️ Prerequisites

To run the text generation scripts, ensure you have:

- **Runtime**: [Node.js](https://nodejs.org) (v18+ recommended) or [Python](https://python.org) (v3.8+).
- **Execution Backend** (choose either one):
  1. **Antigravity CLI (`agy`)**: If installed and authenticated, works out-of-the-box with zero API key configuration.
  2. **Google Gemini API Key**: If you don't have `agy`, simply export `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) obtained from [Google AI Studio](https://aistudio.google.com/).

> **Note**: Both `scripts/agy_call.js` and `scripts/agy_call.py` have **zero external dependencies** (using native `fetch` in Node.js and `urllib.request` in Python). No `npm install` or `pip install` required!

---

## 📦 Installation Guide

### Recommended: Install via `npx skills` (skills.sh)

You can install `just-code-claude` instantly using the official [skills](https://skills.sh/) CLI without cloning:

```bash
# Install globally for Claude Code
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# Or install globally for all detected AI agents
npx skills add xyrz47-spec/just-code-claude -g

# Or install only into the current project
npx skills add xyrz47-spec/just-code-claude
```

---

### Alternative: Install via Git Clone

#### On Windows (PowerShell):
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### On Linux / macOS (Bash):
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

---

## 🔌 Configuration & Backends

`just-code-claude` provides seamless **dual-backend** support with automatic detection:

### Backend 1: Antigravity CLI (`agy`)
If you have the Antigravity CLI installed:
- It is detected automatically.
- No API keys needed.
- Uses `--model gemini-3.8-flash-high` by default (or `gemini-4-argon-high`).

### Backend 2: Direct Google Gemini API
If you prefer direct cloud API calls or are running in an environment without `agy`:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Set the environment variable:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. Or pass it directly via CLI: `--api-key "your-key"`.
4. Uses `gemini-2.5-flash` by default (or any model specified via `-m`).

---

## 🚀 Usage & Workflows

### 1. Activating the Skill in Claude Code

In any Claude Code session, trigger the skill by typing:
```text
/just-code-claude
```
Or with a natural prompt:
```text
Activate just-code-claude mode. You build the code architecture, and call agy for all text deliverables and UI copy.
```

---

### 2. Workflow: In-Code String Replacement

#### Step A: Claude Writes Code with Placeholders
Claude implements the logic and JSX/HTML, placing human-facing text inside `__AGY__("instruction"[, "target_language"])` or `__GEMINI__("instruction"[, "target_language"])`:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("Session expiry warning title", "English")__</h3>
      <p>__AGY__("Notice explaining auto-logout in 5 minutes with extension advice", "English")__</p>
      <button onClick={onExtend}>
        __AGY__("Extend session CTA button", "English")__
      </button>
    </div>
  );
}
```

#### Step B: Automated Replacement
Claude runs the bundled CLI tool:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Or use Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Step C: Final Production Code
The file is updated in-place with polished, production copy:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Your session is about to expire"</h3>
      <p>"For your security, you will be automatically signed out in 5 minutes. Please extend your session to keep working."</p>
      <button onClick={onExtend}>
        "Extend Session"
      </button>
    </div>
  );
}
```

---

### 3. Workflow: Generating Documentation & Markdown

Delegate all technical documentation, READMEs, and user guides to Gemini:

```bash
# Using Antigravity CLI (default auto)
node scripts/agy_call.js -p "Write an API Getting Started guide in English for our REST endpoints" -o docs/API_GUIDE.md

# Using Direct Gemini API explicitly
node scripts/agy_call.js -p "Write an architectural overview in English" -b api -o ARCHITECTURE.md

# Direct agy execution
agy -p "Write project README overview" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
```

---

### 4. Workflow: Batch i18n Localization

Given an input specification `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "Primary action button to log in",
    "forgot_password": "Link text for resetting credentials",
    "password_hint": "Hint indicating password must be at least 8 characters"
  }
}
```

Generate clean, production-ready locale files:
```bash
# Generate Spanish translations
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# Generate Korean translations
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/ko.json --lang Korean
```

---

### 5. Workflow: Git Commit & PR Messages

When preparing commits or pull requests:

```bash
# 1. Capture staged diff
git diff --staged > .git_diff.tmp

# 2. Call agy to author the Conventional Commit message
node scripts/agy_call.js -f .git_diff.tmp -p "Analyze this diff and draft a Conventional Commits message with a concise title under 50 chars and a descriptive body. Target language: English." -o .commit_msg.tmp

# 3. Commit using the generated text
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 CLI Reference

```text
Usage: node scripts/agy_call.js [options]
   or: python scripts/agy_call.py [options]

Dual-Backend Execution:
  1. Antigravity CLI (agy): Automatically detected if installed.
  2. Direct Gemini API: Automatically used if GEMINI_API_KEY is present or agy is unavailable.

Options:
  -p, --prompt <text>          Direct prompt text to generate
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write generated output directly to a file
  -b, --backend <mode>         Backend engine: 'auto' (default), 'agy', or 'api'
  -m, --model <name>           Model name (default for agy: gemini-3.8-flash-high, for api: gemini-2.5-flash)
  --api-key <key>              Google Gemini API key (or set GEMINI_API_KEY env var)
  -l, --lang <language>        Target output language (e.g. English, Korean, Japanese, Spanish)
  -s, --system <text>          System instructions prepended to prompt
  --effort <level>             Reasoning effort for agy (low, medium, high)
  --replace-in-file <path>     Scan code file for __AGY__("...") or __GEMINI__("...") placeholders
                               and replace them in-place with generated copy
  --json-strings <path>        Generate copy for a JSON map of keys -> descriptions
  --raw                        Print raw text without extra formatting
  -h, --help                   Show help message
```

---

## 🧪 Verification & Testing

Verify that both text generation and in-code placeholder replacement work properly on your system:

```bash
npm test
# or
node scripts/test_skill.js
```

---

## 📁 Repository Structure

```
just-code-claude/
├── SKILL.md                 # Skill definition and strict behavioral guidelines for Claude Code
├── README.md                # Comprehensive documentation
├── package.json             # NPM package descriptor
├── install.ps1              # One-click Windows PowerShell installer
├── install.sh               # One-click Linux/macOS installer
├── scripts/
│   ├── agy_call.js          # Node.js dual-backend runner (Zero external dependencies)
│   ├── agy_call.py          # Python dual-backend runner (Standard library only)
│   └── test_skill.js        # Automated end-to-end verification test suite
├── examples/
│   ├── before_code.tsx      # Code sample featuring __AGY__ placeholders
│   └── ui_spec.json         # Localization specification example
└── templates/
    └── prompt_templates.md  # Best-practice prompt templates for UX copy & docs
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
