---
name: just-code-claude
description: "Strict division of labor: Claude handles 100% of the code architecture and logic, while delegating ALL natural language text generation (documentation, READMEs, guides, commit messages, and in-code string literals inside quotes) to Google Gemini ('3.8 flash' or '4 argon' with customizable reasoning effort) via 'agy' CLI or Direct Gemini API. Triggers when invoked via /just-code-claude, or when instructed to separate coding from text writing."
---

# Just Code, Claude (`/just-code-claude`)

> **"Claude writes code. Gemini writes text."**  
> Claude handles all architecture, logic, algorithms, types, and syntax.  
> Gemini (`3.8 flash` or `4 argon` via `agy` CLI or Direct Gemini API) generates all human-facing text, documentation, UI copy, and in-code string literals with controllable reasoning effort.

---

## 1. Core Mandate & Behavioral Boundaries

When this skill is active:

1. **FORBIDDEN FOR CLAUDE**:
   - Composing text deliverables: README, documentation, user guides, summaries, release notes, commit messages, and PR descriptions.
   - Composing human-facing text inside code quotes (`""` or `''`): UI button labels, modal dialogs, error messages, form placeholders, toast notifications, and docstrings.
2. **CLAUDE'S EXCLUSIVE RESPONSIBILITIES**:
   - Writing code structure, functions, classes, AST, interfaces, data pipelines, CSS styling, tests, and configuration files.
   - Formulating **detailed, high-context prompt directives** specifying Context, Intent, Tone, Constraints, and Target Language for Gemini.
   - Calling the bundled `scripts/agy_call.js` (or `agy` CLI / Direct Gemini API) to retrieve the generated text.
   - Integrating the generated copy into the codebase.

---

## 2. Supported Models & Reasoning Effort

The workflow supports exactly two production models and configurable reasoning effort:

| Model | Canonical Name | Best Suited For | Default Effort |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Default)* | `gemini-3.8-flash-high` | Ultra-fast UI copy, button labels, modal dialogs, form errors, toasts | `medium` |
| **`4 argon`** | `gemini-4-argon-high` | Deep reasoning, system architecture, API specifications, release notes | `high` |

### Reasoning Effort Levels (`-e, --effort`):
- `low`: Microcopy, single labels, button text (instantaneous).
- `medium` *(Default)*: Modals, error alerts, commit messages, component tooltips.
- `high`: Comprehensive technical documentation, guides, multi-locale translation dictionaries.
- `xhigh` / `max`: In-depth whitepapers, multi-step migration guides, complex architecture rationale.

---

## 3. Detailed Prompting Standard for Claude (Rich Context Directives)

> [!IMPORTANT]
> **Vague prompts are strictly forbidden.** Claude must NEVER output shallow placeholders like `__AGY__("error message")` or `__AGY__("button")`. Gemini produces world-class copy only when provided with rich engineering context.

### The 5 Mandatory Dimensions Claude Must Specify:
1. **Context**: Specific component, screen location, trigger state, and surrounding UI.
2. **Intent**: The exact goal the user is trying to accomplish or what information they must absorb.
3. **Tone & Voice**: Desired emotional tone, brand persona, and level of empathy or urgency.
4. **Constraints**: Exact length budget, casing style (Title Case, sentence case), punctuation, and tone restrictions.
5. **Target Language & Model**: Explicit target language (e.g. English, Korean) and recommended model (`3.8 flash` vs `4 argon`).

### Before / After Examples:

| Anti-Pattern (Vague & Shallow ❌) | Required Standard (Rich & Contextual ✅) |
| :--- | :--- |
| `__AGY__("Delete button")` | `__AGY__("Context: Danger Zone account deletion dialog primary action. Intent: User is about to permanently delete organization data. Tone: Solemn, unambiguous, urgent. Constraints: 2-3 words, Title Case. Target Language: English")` |
| `__AGY__("Session expired message")` | `__AGY__("Context: Fixed sticky warning banner appearing 5 minutes before OAuth token expiration. Intent: Reassure user work is autosaved, prompt them to click extend to remain logged in. Tone: Empathetic, calm, constructive. Constraints: Single sentence under 70 characters. Target Language: Korean")` |
| `__AGY__("Login error")` | `__AGY__("Context: B2B SaaS SSO login form. Intent: Inform user that corporate SAML identity provider rejected credentials, provide contact info for workspace IT admin. Tone: Professional, non-blaming, technical-yet-accessible. Constraints: Max 2 sentences under 120 characters. Target Language: Japanese")` |

---

## 4. Execution Backends & CLI

The skill provides `scripts/agy_call.js` (Node.js) and `scripts/agy_call.py` (Python) with **zero external dependencies**:

1. **Antigravity CLI (`agy`)**: Pre-authenticated local agent CLI (`--backend agy`).
2. **Direct Gemini REST API**: Uses `GEMINI_API_KEY` or `--api-key` (`--backend api`).
3. **Auto Detection (default)**: Uses `agy` if installed; falls back to Direct Gemini API if `GEMINI_API_KEY` is present.

### Primary Command Patterns:

```bash
# 1. UI string replacement with 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium --lang English

# 2. Comprehensive architecture documentation with 4 argon & high effort
node scripts/agy_call.js -m "4 argon" -e high -p "Write an API architectural guide for our event-driven microservices. Target Audience: Senior Backend Engineers." -o docs/ARCHITECTURE.md

# 3. Generating localized UI dictionary
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/ko.json -m "3.8 flash" --lang Korean

# 4. Conventional commit authoring from staged diff
git diff --staged > .git_diff.tmp
node scripts/agy_call.js -f .git_diff.tmp -m "3.8 flash" -e medium -p "Context: Staged git changes. Intent: Write Conventional Commits message (feat/fix/refactor) with title under 50 chars and bulleted technical body. Target Language: English." -o .commit_msg.tmp
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

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
           __AGY__("Context: Enterprise SaaS pricing card title. Intent: Highlight premium scalability for teams over 50. Tone: Confident, aspirational. Constraints: 2-4 words, Title Case. Target Language: English")__
         </h3>
         <p>
           __AGY__("Context: Enterprise tier feature summary paragraph. Intent: Emphasize SOC-2 compliance, 99.99% uptime SLA, and dedicated Slack support. Tone: Trustworthy, professional. Constraints: Exactly 2 sentences, under 140 chars. Target Language: English")__
         </p>
         <button onClick={onUpgrade}>
           __AGY__("Context: Primary conversion CTA button on subscription card. Intent: Prompt user to initiate 14-day zero-risk trial. Tone: High-energy, motivating. Constraints: 3 words, Title Case. Target Language: English")__
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
1. Formulate a detailed English prompt containing:
   - Purpose & Scope
   - Target Audience
   - Required Sections & Diagrams
   - Code snippet guidelines
2. Delegate to **`4 argon`** with **`high`** effort:
   ```bash
   node scripts/agy_call.js -m "4 argon" -e high -p "Context: New REST API v2 release. Intent: Comprehensive Developer Onboarding Guide covering JWT auth, rate limits, webhooks, and pagination. Audience: Third-party API consumers. Constraints: Include curl examples and JSON error responses. Target Language: English." -o docs/API_V2_GUIDE.md
   ```

---

## 6. Pre-Completion Self-Audit Checklist

Before finishing any turn under `/just-code-claude`, Claude MUST verify:

- [ ] Did I write any markdown, guides, summaries, or documentation directly?  
  👉 **If yes, remove and invoke Gemini via `agy_call.js` (`4 argon` for docs, `3.8 flash` for guides).**
- [ ] Did I author any UI copy, button labels, error alerts, or modal text inside quotes `""`?  
  👉 **If yes, replace with detailed `__AGY__("Context: ... | Intent: ... | Tone: ... | Constraints: ...")` directives and run `agy_call.js --replace-in-file`.**
- [ ] Are all in-code placeholders sufficiently detailed with the 5 dimensions?  
  👉 **Ensure no lazy placeholders like `__AGY__("error")` exist.**
- [ ] Did Gemini generate 100% of the human-facing language?  
  👉 **Yes. Code logic belongs to Claude; human language belongs to Gemini.**
