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

> **"Claude writes code. Gemini writes text."**  
> An open-source **Claude Code skill** designed to separate engineering tasks: Claude focuses on software architecture and code logic, while delegating natural language deliverables (documentation, READMEs, commit messages, and in-code string literals inside quotes) to **Google Gemini** via the **Google Gemini REST API** or the **Antigravity CLI (`agy`)**.

---

## 📑 Table of Contents

- [Motivation & Design Philosophy](#-motivation--design-philosophy)
- [How It Works](#-how-it-works)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
  - [Recommended: Install via `npx skills`](#recommended-install-via-npx-skills-skillssh)
  - [Alternative: Install via Git Clone](#alternative-install-via-git-clone)
- [Configuration & Execution Backends](#-configuration--execution-backends)
  - [Backend 1: Direct Google Gemini REST API (Universal)](#backend-1-direct-google-gemini-rest-api-universal)
  - [Backend 2: Antigravity CLI (`agy`)](#backend-2-antigravity-cli-agy)
- [Usage & Workflows](#-usage--workflows)
  - [1. Activating the Skill in Claude Code](#1-activating-the-skill-in-claude-code)
  - [2. In-Code String Replacement](#2-workflow-in-code-string-replacement)
  - [3. Documentation & Markdown Generation](#3-workflow-generating-documentation--markdown)
  - [4. Batch UI Strings & i18n Localization](#4-workflow-batch-i18n-localization)
  - [5. Git Commit & PR Messages](#5-workflow-git-commit--pr-messages)
- [CLI Reference](#-cli-reference)
- [Verification & Testing](#-verification--testing)
- [Repository Structure](#-repository-structure)
- [License](#-license)

---

## 🌟 Motivation & Design Philosophy

In modern AI-assisted engineering workflows, different language models exhibit distinct strengths:
- **Claude** excels at complex software architecture, AST manipulation, TypeScript type systems, and algorithmic reasoning.
- **Google Gemini** offers strong multilingual fluency, natural user-facing phrasing, and fast text generation.

`just-code-claude` creates an automated collaboration workflow between both models:

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
                   │                         (Gemini API or 'agy' CLI)
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

- **Claude's Scope**: System architecture, logic, algorithms, state management, types, tests, debugging, and executing the copy generation tool.
- **Gemini's Scope**: Technical documentation, READMEs, release notes, commit messages, and string literals (`""` or `''`) intended for human reading.

> **Note on Enforcement**: As a Claude Code skill (`SKILL.md`), this operates as an **instructional workflow directive** for the AI agent rather than a hard compiler or OS-level sandbox. It guides Claude to follow this division of labor systematically.

---

## ⚙️ Prerequisites

To run the generation scripts:

- **Runtime**: [Node.js](https://nodejs.org) (v18+) or [Python](https://python.org) (v3.8+).
- **Execution Backend** (choose one):
  1. **Google Gemini API Key (Universal)**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/) and set the `GEMINI_API_KEY` environment variable.
  2. **Antigravity CLI (`agy`)**: If you work in an Antigravity environment with `agy` already installed and authenticated, it is automatically detected without needing an extra API key.

> **Zero Dependencies**: Both `scripts/agy_call.js` (Node.js native `fetch`) and `scripts/agy_call.py` (Python `urllib.request`) have **zero third-party dependencies**. No `npm install` or `pip install` is required.

---

## 📦 Installation Guide

### Recommended: Install via `npx skills` (skills.sh)

Using the open standard [skills](https://skills.sh/) CLI is the fastest way to install without cloning manually:

```bash
# Install globally for Claude Code (Verified)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# Or install locally for the current repository only
npx skills add xyrz47-spec/just-code-claude -a claude-code
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

The script copies the skill files directly into `~/.claude/skills/just-code-claude/`.

---

## 🔌 Configuration & Execution Backends

The helper CLI supports two execution backends with automatic detection:

### Backend 1: Direct Google Gemini REST API (Universal)
Recommended for most developers and CI/CD pipelines:
1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. Set your environment variable:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. Default model: `gemini-2.5-flash` (or specify via `-m`, e.g. `-m gemini-2.0-flash`).

### Backend 2: Antigravity CLI (`agy`)
For users working in an Antigravity environment:
- If `agy` is found on your `PATH` or standard installation path, it is automatically used.
- Uses your local Antigravity CLI authentication.
- Default model: `gemini-3.8-flash-high` (Antigravity environment model).

---

## 🚀 Usage & Workflows

### 1. Activating the Skill in Claude Code

In Claude Code, invoke the skill:
```text
/just-code-claude
```
Or via a prompt:
```text
Activate just-code-claude mode. You build the code architecture and logic, and delegate all copy and documentation to Gemini.
```

---

### 2. Workflow: In-Code String Replacement

#### Step A: Claude Writes Code with Placeholders
Claude implements the logic and component structure, inserting placeholders: `__AGY__("instruction"[, "target_language"])` or `__GEMINI__("instruction"[, "target_language"])`:

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
*(Or in Python: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Step C: Final Production Code
The placeholders are replaced in-place with generated copy:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Your session is about to expire"</h3>
      <p>"For your security, you will be automatically logged out in 5 minutes due to inactivity."</p>
      <button onClick={onExtend}>
        "Extend Session"
      </button>
    </div>
  );
}
```

---

### 3. Workflow: Generating Documentation & Markdown

Delegate technical documentation, guides, or READMEs to Gemini:

```bash
# Via Direct Gemini API
node scripts/agy_call.js -p "Write an API Getting Started guide in English for our REST endpoints" -b api -o docs/API_GUIDE.md

# Or via agy CLI (if installed)
node scripts/agy_call.js -p "Write an architectural overview in English" -b agy -o ARCHITECTURE.md
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

Generate production-ready locale files:
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
  1. Direct Gemini API: Used when GEMINI_API_KEY is present or with -b api.
  2. Antigravity CLI (agy): Automatically detected if installed on the host.

Options:
  -p, --prompt <text>          Direct prompt text to generate
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write generated output directly to a file
  -b, --backend <mode>         Backend engine: 'auto' (default), 'api', or 'agy'
  -m, --model <name>           Model name (default for api: gemini-2.5-flash, for agy: gemini-3.8-flash-high)
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

Run the automated self-test to verify generation and in-code placeholder replacement on your system:

```bash
npm test
# or
node scripts/test_skill.js
```

---

## 📁 Repository Structure

```
just-code-claude/
├── SKILL.md                 # Skill definition and instructional guidelines for Claude Code
├── README.md                # English documentation
├── README.ko.md             # Korean documentation
├── README.ja.md             # Japanese documentation
├── README.zh-CN.md          # Simplified Chinese documentation
├── README.es.md             # Spanish documentation
├── README.fr.md             # French documentation
├── README.de.md             # German documentation
├── package.json             # NPM package descriptor
├── install.ps1              # Windows PowerShell installation script
├── install.sh               # Linux/macOS installation script
├── scripts/
│   ├── agy_call.js          # Node.js dual-backend runner (Zero dependencies)
│   ├── agy_call.py          # Python dual-backend runner (Standard library only)
│   └── test_skill.js        # Automated end-to-end verification test suite
├── examples/
│   ├── before_code.tsx      # Code sample featuring __AGY__ placeholders
│   └── ui_spec.json         # Localization specification example
└── templates/
    └── prompt_templates.md  # Prompt templates for UX copy and documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
