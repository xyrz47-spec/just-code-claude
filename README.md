# Just Code, Claude (`just-code-claude`)

<p align="center">
  <b>Claude writes code. Gemini writes text.</b><br>
  An automated workflow skill separating engineering logic from human language generation.
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
> An open-source **Claude Code skill** designed to separate engineering tasks: Claude focuses on software architecture and code logic, while delegating natural language deliverables (documentation, READMEs, Git commit messages, PR descriptions, GitHub Release notes, and in-code string literals inside quotes) to **Google Gemini** (`3.8 flash` or `4 argon` with customizable reasoning effort) via the **Google Gemini REST API** or the **Antigravity CLI (`agy`)**.

---

## 📑 Table of Contents

- [Motivation & Design Philosophy](#-motivation--design-philosophy)
- [Supported Models & Reasoning Effort](#-supported-models--reasoning-effort)
- [Detailed Context Directives (Prompting Standard)](#-detailed-context-directives-prompting-standard)
- [Git & GitHub Integration (Commit, PR & Release)](#-git--github-integration-commit-pr--release)
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
  - [5. Git Commits, PRs & GitHub Releases](#5-workflow-git-commits-prs--github-releases)
- [CLI Reference](#-cli-reference)
- [Verification & Testing](#-verification--testing)
- [Repository Structure](#-repository-structure)
- [License](#-license)

---

## 🌟 Motivation & Design Philosophy

In modern AI-assisted engineering workflows, different language models exhibit distinct strengths:
- **Claude** excels at complex software architecture, AST manipulation, TypeScript type systems, and algorithmic reasoning.
- **Google Gemini** offers strong multilingual fluency, natural user-facing phrasing, fast text generation, and deep context comprehension for commit logs, changelogs, and technical release notes.

`just-code-claude` creates an automated collaboration workflow between both models:

```
                       ┌──────────────────────────────┐
                       │         Developer            │
                       │    "Build me a checkout      │
                       │      flow with modals"       │
                       └──────────────┬───────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │         Claude Code          │
                       │  (/just-code-claude active)  │
                       └──────┬────────────────┬──────┘
                              │                │
        [ Code Logic & Architecture ]          [ Human Language & Copy ]
                   │                                     │
              Claude Code                            Google Gemini
                   │                             (3.8 flash / 4 argon)
                   ▼                                     ▼
      Function components, hooks,            UI button labels, toasts,
      data mutations, state machines,        error alerts, docs, READMEs,
      and CSS layout                         commits, PRs, and releases
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │   Polished Production Code   │
                       └──────────────────────────────┘
```

---

## 🤖 Supported Models & Reasoning Effort

The skill is built around two primary Google Gemini models with configurable reasoning effort:

| Model | CLI Alias | Primary Use Case | Recommended Effort |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Default)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | Ultra-fast UI copy, button labels, modal dialogs, form errors, toast banners, Git commit messages | `low` or `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | High-reasoning architectural docs, comprehensive API guides, technical RFCs, GitHub PRs, Release Notes | `high` or `max` |

### Reasoning Effort (`-e, --effort`):
- `low`: Microcopy, buttons, individual string labels (instantaneous response).
- `medium` *(Default)*: Modals, form validations, toast notifications, commit messages.
- `high`: Deep technical documentation, architecture overviews, GitHub PR descriptions, GitHub Release notes.
- `xhigh` / `max`: Comprehensive migration specs, security whitepapers, complex multi-page release dossiers.

---

## 🎯 Detailed Context Directives (Prompting Standard)

To ensure the highest quality copy, Claude is instructed to provide **rich, multi-dimensional context directives** rather than brief or vague placeholders:

### The 5 Dimensions Claude Specifies:
1. **Context**: Specific component, modal, git diff scope, or release milestone.
2. **Intent**: Exact user action, business goal, architectural motivation, or reassurance needed.
3. **Tone**: Desired brand voice (e.g., empathetic, solemn, energetic, professional).
4. **Constraints**: Character limits, Conventional Commits formatting, Title Case vs sentence case.
5. **Target Language**: Explicit destination language (English, Korean, Japanese, Spanish, etc.).

---

## 🐙 Git & GitHub Integration (Commit, PR & Release)

`just-code-claude` includes first-class support for Git and GitHub workflows:

### 1. One-Command Conventional Commit (`--commit`)
Analyzes your staged changes, incorporates developer context directives, calls Gemini, and executes `git commit`:
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Added two-factor authentication dialog and recovery code backup flow" --lang English
```

### 2. Inspect Commit Message First (`--commit-msg`)
Generates an exemplary Conventional Commits message (type, scope, subject <= 50 chars, detailed technical body) without committing immediately:
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: Bug fix for race condition in WebSocket heartbeat" --lang Korean
```

### 3. Comprehensive GitHub PR Descriptions (`--pr-desc`)
Uses **`4 argon`** with high reasoning effort to analyze the entire diff and draft a structured GitHub PR in Markdown:
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: State management migration from Redux to Zustand" -o PULL_REQUEST.md
```

### 4. GitHub Release Notes & Publishing (`--release-notes`, `--release [tag]`)
Analyzes git tags and commits since the previous release, formats an executive-level changelog with highlights, bug fixes, breaking changes, and publishes via GitHub CLI:
```bash
# Generate release notes to file
node scripts/agy_call.js --release-notes -m "4 argon" -e high -p "Context: v1.2.0 milestone release" -o RELEASE_NOTES.md

# Generate and publish GitHub Release for tag
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -p "Context: Production release v1.2.0"
```

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
3. Set optional model and effort defaults:
   ```bash
   export GEMINI_MODEL="gemini-3.8-flash"
   export GEMINI_EFFORT="medium"
   ```

### Backend 2: Antigravity CLI (`agy`)
For users working in an Antigravity environment:
- If `agy` is found on your `PATH` or standard installation path, it is automatically used.
- Uses your local Antigravity CLI authentication.
- Seamlessly passes `--model gemini-3.8-flash` or `--model gemini-4-argon` along with `--effort`.

---

## 🚀 Usage & Workflows

### 1. Activating the Skill in Claude Code

In Claude Code, invoke the skill:
```text
/just-code-claude
```
Or via a prompt:
```text
Activate just-code-claude mode. You build the code architecture and logic, and delegate all copy, documentation, commits, PRs, and releases to Gemini.
```

---

### 2. Workflow: In-Code String Replacement

#### Step A: Claude Writes Code with Rich Placeholders
Claude implements the logic and component structure, inserting detailed directives: `__AGY__("Context: ... | Intent: ... | Tone: ... | Constraints: ...", "Language")`:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>
        __AGY__("Context: Fixed sticky warning banner appearing 5m before token expiry | Intent: Alert user session is ending | Tone: Calm, urgent | Constraints: Under 35 chars, Title Case", "English")__
      </h3>
      <p>
        __AGY__("Context: Expiration banner body | Intent: Explain work is safely autosaved and clicking extend prevents logout | Tone: Reassuring, helpful | Constraints: Single sentence under 70 chars", "English")__
      </p>
      <button onClick={onExtend}>
        __AGY__("Context: Expiration banner primary CTA button | Intent: Trigger token refresh | Tone: Direct | Constraints: 2 words, Title Case", "English")__
      </button>
    </div>
  );
}
```

#### Step B: Automated Replacement
Claude runs the bundled CLI tool:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx -m "3.8 flash" -e medium
```

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

Delegate technical documentation, architecture guides, or READMEs to Gemini (`4 argon` with `high` effort):

```bash
# Architecture specification with 4 argon & high effort
node scripts/agy_call.js -m "4 argon" -e high -p "Context: Event-driven microservices architecture overview. Audience: Senior Backend Engineers. Required Sections: Overview, Sequence Diagram, Failure Modes. Target Language: English." -o docs/ARCHITECTURE.md

# Developer guide with 3.8 flash
node scripts/agy_call.js -m "3.8 flash" -e medium -p "Write an API Getting Started guide in English for our REST endpoints" -o docs/API_GUIDE.md
```

---

### 4. Workflow: Batch i18n Localization

Given an input specification `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "Context: Primary login button | Constraints: 2 words, Title Case",
    "forgot_password": "Context: Password reset link | Tone: Subtle, helpful",
    "password_hint": "Context: Password input helper | Constraints: Under 50 chars"
  }
}
```

Generate production-ready locale files:
```bash
# Generate Spanish translations
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -o src/locales/es.json --lang Spanish

# Generate Korean translations
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -o src/locales/ko.json --lang Korean
```

---

### 5. Workflow: Git Commits, PRs & GitHub Releases

```bash
# Option 1: Commit directly with Conventional Commits
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Added MFA login modal and token refresh logic" --lang English

# Option 2: Generate commit message to file
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -o .commit_msg.tmp
git commit -F .commit_msg.tmp

# Option 3: Generate GitHub PR Description with 4 argon
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Frontend state architecture upgrade" -o PULL_REQUEST.md

# Option 4: Generate GitHub Release Notes
node scripts/agy_call.js --release-notes -m "4 argon" -e high -p "Context: v1.2.0 milestone release" -o RELEASE_NOTES.md

# Option 5: Publish GitHub Release via GitHub CLI
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -p "Context: Official stable v1.2.0 release"
```

---

## 🛠 CLI Reference

```text
Usage: node scripts/agy_call.js [options]
   or: python scripts/agy_call.py [options]

Supported Models:
  - '3.8 flash' (gemini-3.8-flash) [Default]  : Ultra-fast, ideal for UI copy, components, commits
  - '4 argon'   (gemini-4-argon)              : Maximum reasoning depth, architecture docs, PR specs, releases

Reasoning Effort:
  -e, --effort <low|medium|high|xhigh|max>    : Configure reasoning budget / effort (Default: medium)

Git & GitHub Integration:
  --commit-msg                                : Analyze git diff and generate Conventional Commit message
  --commit                                    : Analyze git diff, generate message and execute git commit
  --pr-desc                                   : Analyze git diff and generate GitHub PR description in Markdown
  --release-notes                             : Analyze git tags/log and draft comprehensive GitHub Release Notes
  --release [tag]                             : Generate GitHub Release Notes and publish via GitHub CLI (gh release create)

Execution Backends:
  1. Direct Gemini API: Used when GEMINI_API_KEY is present or with -b api.
  2. Antigravity CLI (agy): Automatically detected if installed on the host.

Options:
  -p, --prompt <text>          Direct prompt text or developer context directives
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write generated output directly to a file
  -m, --model <name>           Choose model: '3.8 flash' or '4 argon'
  -e, --effort <level>         Set reasoning effort: low, medium, high, xhigh, max
  -b, --backend <mode>         Backend engine: 'auto' (default), 'api', or 'agy'
  --api-key <key>              Google Gemini API key (or set GEMINI_API_KEY env var)
  -l, --lang <language>        Target output language (e.g. English, Korean, Japanese, Spanish)
  -s, --system <text>          System instructions prepended to prompt
  --replace-in-file <path>     Scan code file for __AGY__("...") or __GEMINI__("...") placeholders
                               and replace them in-place with generated copy
  --json-strings <path>        Generate copy for a JSON map of keys -> descriptions
  --raw                        Print raw text without extra formatting
  -h, --help                   Show help message
```

---

## 🧪 Verification & Testing

Run the automated self-test to verify generation, model switching, and in-code placeholder replacement on your system:

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
│   ├── agy_call.js          # Node.js dual-backend runner (Git commits/PRs/Releases built-in)
│   ├── agy_call.py          # Python dual-backend runner (Git commits/PRs/Releases built-in)
│   └── test_skill.js        # Automated end-to-end verification test suite
├── examples/
│   ├── before_code.tsx      # Code sample featuring rich __AGY__ placeholders
│   └── ui_spec.json         # Localization specification example
└── templates/
    └── prompt_templates.md  # Detailed prompt templates for UX copy, docs, git commits, and releases
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
