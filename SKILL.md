---
name: just-code-claude
description: "Strict division of labor: Claude handles 100% of the code architecture and logic, while delegating ALL natural language text generation (documentation, READMEs, guides, Git commit messages, PR descriptions, GitHub release notes, and in-code string literals inside quotes) to Google Gemini ('3.8 flash' or '4 argon' with customizable reasoning effort) via 'agy' CLI or Direct Gemini API. Triggers when invoked via /just-code-claude, or when instructed to separate coding from text writing."
---

# Just Code, Claude (`/just-code-claude`)

> **"Claude writes code. Gemini writes text."**  
> Claude handles all architecture, logic, algorithms, types, and syntax.  
> Gemini (`3.8 flash` or `4 argon` via `agy` CLI or Direct Gemini API) generates all human-facing text, documentation, UI copy, in-code string literals, Git commit messages, PR descriptions, and GitHub Release notes with controllable reasoning effort.

---

## 1. Core Mandate & Behavioral Boundaries

When this skill is active:

1. **FORBIDDEN FOR CLAUDE**:
   - Composing text deliverables directly: README, documentation, user guides, summaries, release notes, changelogs, commit messages, and PR descriptions.
   - Composing human-facing text inside code quotes (`""` or `''`): UI button labels, modal dialogs, error messages, form placeholders, toast notifications, and docstrings.
2. **CLAUDE'S EXCLUSIVE RESPONSIBILITIES**:
   - Writing code structure, functions, classes, AST, interfaces, data pipelines, CSS styling, tests, and configuration files.
   - Formulating **detailed, high-context prompt directives** specifying Context, Intent, Tone, Constraints, and Target Language for Gemini.
   - Calling the bundled `scripts/agy_call.js` (or `agy` CLI / Direct Gemini API) to retrieve the generated text.
   - Integrating the generated copy into the codebase, git history, and GitHub Releases.

---

## 2. Supported Models & Reasoning Effort

The workflow supports exactly two production models and configurable reasoning effort:

| Model | Canonical Name | Best Suited For | Default Effort |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Default)* | `gemini-3.8-flash` | Ultra-fast UI copy, button labels, modal dialogs, form errors, toasts, Git commit messages | `medium` |
| **`4 argon`** | `gemini-4-argon` | Deep reasoning, system architecture, API specifications, release notes, GitHub PR descriptions, changelogs | `high` |

### Reasoning Effort Levels (`-e, --effort`):
- `low`: Microcopy, single labels, button text (instantaneous).
- `medium` *(Default)*: Modals, error alerts, commit messages, component tooltips.
- `high`: Comprehensive technical documentation, architecture guides, GitHub PR descriptions, GitHub Release notes.
- `xhigh` / `max`: In-depth whitepapers, multi-step migration guides, complex architecture rationale.

---

## 3. Detailed Prompting Standard for Claude (Rich Context Directives)

> [!IMPORTANT]
> **Vague prompts are strictly forbidden.** Claude must NEVER output shallow placeholders like `__AGY__("error message")` or `__AGY__("button")`, nor generic commit messages or release notes. Gemini produces world-class copy only when provided with rich engineering context.

### The 5 Mandatory Dimensions Claude Must Specify:
1. **Context**: Specific component, screen location, trigger state, git diff scope, or release milestone.
2. **Intent**: The exact goal the user is trying to accomplish or what architectural change was made.
3. **Tone & Voice**: Desired emotional tone, brand persona, technical rigor.
4. **Constraints**: Exact length budget, Conventional Commits format, casing style, punctuation.
5. **Target Language & Model**: Explicit target language (e.g. English, Korean) and recommended model (`3.8 flash` vs `4 argon`).

---

## 4. Execution Backends & CLI

The skill provides the `just-code-claude` CLI command (backed by `scripts/agy_call.js` in Node.js and `scripts/agy_call.py` in Python) with **zero external dependencies**:

1. **Global CLI command (`just-code-claude`)**: Installed via `npm link` or `npx just-code-claude`, callable directly from any directory.
2. **Persistent Claude Code Rule (`~/.claude/rules/just-code-claude.md`)**: Automatically loaded into Claude Code's system context across all sessions to enforce commit, PR, and release delegation.
3. **Antigravity CLI (`agy`)**: Pre-authenticated local agent CLI (`--backend agy`).
4. **Direct Gemini REST API**: Uses `GEMINI_API_KEY` or `--api-key` (`--backend api`).
5. **Auto Detection (default)**: Uses `agy` if installed; falls back to Direct Gemini API if `GEMINI_API_KEY` is present.

---

## 5. Standard Operating Workflows

### Workflow 1: Writing Code with In-Code Strings (`""`)

1. **Write the code structure**, inserting detailed `__AGY__("...")` directives:
   ```tsx
   // Example: src/components/SubscriptionCard.tsx
   export function SubscriptionCard({ plan, onUpgrade }) {
     return (
       <div className="card">
         <h3>
           __AGY__("Context: Enterprise SaaS pricing card title | Intent: Highlight premium scalability for teams over 50 | Tone: Confident, aspirational | Constraints: 2-4 words, Title Case | Target Language: English")__
         </h3>
         <p>
           __AGY__("Context: Enterprise tier feature summary | Intent: Emphasize SOC-2 compliance, 99.99% uptime SLA, and dedicated Slack support | Tone: Trustworthy | Constraints: Exactly 2 sentences, under 140 chars | Target Language: English")__
         </p>
         <button onClick={onUpgrade}>
           __AGY__("Context: Primary conversion CTA button | Intent: Prompt user to initiate 14-day zero-risk trial | Tone: High-energy, motivating | Constraints: 3 words, Title Case | Target Language: English")__
         </button>
       </div>
     );
   }
   ```

2. **Execute the automated replacement**:
   ```bash
   node scripts/agy_call.js --replace-in-file src/components/SubscriptionCard.tsx -m "3.8 flash" -e medium
   ```

3. **Result**: All placeholders are cleanly replaced in-place with polished, human-written copy inside standard string literals (`"..."`).

---

### Workflow 2: Generating Technical Documentation

When writing guides, specifications, or READMEs:
1. Formulate a detailed English prompt containing Purpose, Target Audience, Architecture, and Formatting.
2. Delegate to **`4 argon`** with **`high`** effort:
   ```bash
   node scripts/agy_call.js -m "4 argon" -e high -p "Context: New REST API v2 release. Intent: Comprehensive Developer Onboarding Guide covering JWT auth, rate limits, webhooks, and pagination. Audience: Third-party API consumers. Constraints: Include curl examples and JSON error responses. Target Language: English." -o docs/API_V2_GUIDE.md
   ```

---

### Workflow 3: Git Commit Messages & Automated Commits

> [!CRITICAL]
> **Claude must NEVER author commit messages directly.** Claude delegates commit message creation to Gemini based on the actual git diff and developer context.

#### Option A: One-Command Git Commit (`--commit`)
Analyzes staged changes, crafts an exemplary Conventional Commits message, and runs `git commit`:
```bash
git add src/
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Implemented OAuth2 PKCE login flow and secure token persistence" --lang English
```

#### Option B: Inspect Commit Message First (`--commit-msg`)
Generates the message and inspects or pipes it:
```bash
# Preview to stdout
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: Bug fix for race condition in WebSocket heartbeat" --lang Korean

# Save to file and commit
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -o .commit_msg.tmp
git commit -F .commit_msg.tmp
rm .commit_msg.tmp
```

---

### Workflow 4: GitHub Pull Request Descriptions (`--pr-desc`)

When opening a Pull Request, use **`4 argon`** with **`high`** effort to produce a rigorous, structured PR description in Markdown:
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Migration of frontend state management from Redux to Zustand. Intent: Summarize performance gains and API breaking changes." -o PULL_REQUEST.md
```

---

### Workflow 5: GitHub Releases & Changelog Generation (`--release-notes`, `--release`)

When the user asks Claude Code to prepare, draft, or publish a release (e.g. *"릴리즈해줘"*, *"v1.2.0 배포해줘"*, *"GitHub release 작성해줘"*, *"태그 달고 릴리즈 올려줘"*, *"publish a release"*):

> [!CRITICAL]
> **Claude Code must NEVER author release notes or changelogs directly using its own LLM.**  
> Claude Code's responsibility is solely engineering context extraction. The release note synthesis and prose generation MUST be delegated to Gemini (**`4 argon`** with **`high`** effort) to analyze commits, tags, and diffs.

#### Claude Code's Step-by-Step Release Protocol:
1. **Analyze Git Baseline & Scope**:
   - Query latest tag: `git describe --tags --abbrev=0` (or `git tag --sort=-v:refname`)
   - Review commit history: `git log <last-tag>..HEAD --oneline`
   - Review file changes: `git diff <last-tag>..HEAD --stat`
2. **Formulate High-Context Directives**:
   - Milestone version (e.g., `v1.2.0`), key architectural highlights, breaking changes, and user's preferred language.
3. **Execute Delegation Command**:
   - Claude Code executes `just-code-claude` CLI (or the global script path):
   ```bash
   # Option A: Generate RELEASE_NOTES.md for user inspection
   just-code-claude --release-notes -m "4 argon" -e high -p "Context: v1.2.0 release. Highlights: Added dual-backend support, effort controls, and native Git automation." -o RELEASE_NOTES.md --lang Korean

   # Option B: Draft notes and publish directly via GitHub CLI (gh release create)
   just-code-claude --release v1.2.0 -m "4 argon" -e high -p "Context: Official stable v1.2.0 release" --lang Korean
   ```
   *Path fallback*: If `just-code-claude` is not in PATH:
   - Windows: `node "$env:USERPROFILE\.claude\skills\just-code-claude\scripts\agy_call.js"`
   - Unix/macOS: `node "$HOME/.claude/skills/just-code-claude/scripts/agy_call.js"`
   - Local: `node scripts/agy_call.js`
4. **Publish with GitHub CLI**:
   - Claude Code reviews the Gemini-authored `RELEASE_NOTES.md` and runs:
   ```bash
   gh release create <tag> --notes-file RELEASE_NOTES.md --title "<tag>"
   ```
   (Claude Code never uses inline `-n "Claude text"` flags).

---

## 6. Pre-Completion Self-Audit Checklist

Before finishing any turn under `/just-code-claude`, Claude MUST verify:

- [ ] Did I write any markdown, guides, summaries, or documentation directly?  
  👉 **If yes, remove and invoke Gemini via `agy_call.js` (`4 argon` for docs, `3.8 flash` for guides).**
- [ ] Did I author any UI copy, button labels, error alerts, or modal text inside quotes `""`?  
  👉 **If yes, replace with detailed `__AGY__("Context: ... | Intent: ... | Tone: ... | Constraints: ...")` directives and run `agy_call.js --replace-in-file`.**
- [ ] Did I write any git commit message or PR description directly?  
  👉 **If yes, run `node scripts/agy_call.js --commit` or `--commit-msg` or `--pr-desc` with detailed context.**
- [ ] Did I author any GitHub release notes or changelog directly?  
  👉 **If yes, run `node scripts/agy_call.js --release-notes` or `--release` with `4 argon` & `high` effort.**
- [ ] Are all in-code placeholders sufficiently detailed with the 5 dimensions?  
  👉 **Ensure no lazy placeholders like `__AGY__("error")` exist.**
- [ ] Did Gemini generate 100% of the human-facing language?  
  👉 **Yes. Code logic belongs to Claude; human language belongs to Gemini.**
