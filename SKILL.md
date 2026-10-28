---
name: just-code-claude
description: "Strict division of labor: Claude handles 100% of the code architecture and logic, while delegating ALL natural language text generation (documentation, READMEs, guides, commit messages, and in-code string literals inside quotes) to Google Gemini via 'agy' CLI or Direct Gemini API. Triggers when invoked via /just-code-claude, or when instructed to separate coding from text writing."
---

# Just Code, Claude (`/just-code-claude`)

> **"Claude writes code. Gemini writes text."**  
> Claude handles all architecture, logic, algorithms, types, and syntax.  
> Gemini (`agy` CLI or Direct Gemini API) generates all human-facing text, documentation, UI copy, and in-code string literals.

---

## 1. Core Mandate & Behavioral Boundaries

When this skill is active:

1. **FORBIDDEN FOR CLAUDE**:
   - Composing text deliverables: README, documentation, user guides, summaries, release notes, commit messages, and PR descriptions.
   - Composing human-facing text inside code quotes (`""` or `''`): UI button labels, modal dialogs, error messages, form placeholders, toast notifications, and docstrings.
2. **CLAUDE'S EXCLUSIVE RESPONSIBILITIES**:
   - Writing code structure, functions, classes, AST, interfaces, data pipelines, CSS styling, tests, and configuration files.
   - Formulating clear, contextual instructions in English for Gemini with explicit target languages (e.g. `[Instruction in Korean]`, `[Target Language: English]`).
   - Calling the bundled `scripts/agy_call.js` (or `agy` CLI / Direct Gemini API) to retrieve the generated text.
   - Integrating the generated copy into the codebase.

---

## 2. Execution Backends & CLI

The skill provides `scripts/agy_call.js` (Node.js) and `scripts/agy_call.py` (Python) with **zero external dependencies**, supporting two backends:

1. **Antigravity CLI (`agy`)**: Pre-authenticated local agent CLI (`--backend agy`).
2. **Direct Gemini REST API**: Uses `GEMINI_API_KEY` or `--api-key` (`--backend api`).
3. **Auto Detection (default)**: Uses `agy` if installed; falls back to Direct Gemini API if `GEMINI_API_KEY` is set.

### Primary Command Patterns:

#### Pattern A: Direct `agy` Execution
```bash
agy -p "<instruction_prompt>" --model gemini-3.8-flash-high --dangerously-skip-permissions
```

#### Pattern B: Bundled `agy_call.js` (Recommended)
```bash
# 1. Generate text deliverable directly into a file
node scripts/agy_call.js -p "Write an API overview in English" -o docs/API.md

# 2. In-place code string replacement (Automatic)
node scripts/agy_call.js --replace-in-file src/components/Login.tsx --lang English

# 3. Using Direct Gemini API with an API key
node scripts/agy_call.js -p "Write README" --backend api --api-key "$GEMINI_API_KEY" -o README.md

# 4. Batch UI strings / i18n JSON generation
node scripts/agy_call.js --json-strings spec.json -o src/locales/ko.json --lang Korean
```

---

## 3. Standard Operating Workflows

### Workflow 1: Writing Code with In-Code Strings (`""`)

When writing UI components, API error messages, or user-facing strings:

1. **Write the code structure** as normal, but **do not write the actual text** inside string literals. Instead, use the placeholder `__AGY__("instruction", "target_language")` or `__GEMINI__("instruction", "target_language")`:
   ```tsx
   // Example: src/components/CheckoutModal.tsx
   export function CheckoutModal({ onConfirm, onCancel }) {
     return (
       <div className="modal">
         <h2>__AGY__("Trust-inspiring checkout confirmation header", "English")__</h2>
         <p>__AGY__("Clear disclaimer that payments are non-refundable once processed", "English")__</p>
         <button onClick={onConfirm}>
           __AGY__("Complete Payment CTA button", "English")__
         </button>
         <button onClick={onCancel}>
           __AGY__("Cancel and return button", "English")__
         </button>
       </div>
     );
   }
   ```
   *(Note: Target language can also be set globally via `--lang <language>` if omitted per placeholder).*

2. **Execute the automated replacement**:
   ```bash
   node scripts/agy_call.js --replace-in-file src/components/CheckoutModal.tsx
   ```

3. **Result**: The script queries Gemini via `agy` or Direct API, generates polished, professional copy for every placeholder, and replaces them in-place with clean string literals (`"..."`).

---

### Workflow 2: Generating Text Deliverables (Markdown, Docs, Guides)

When tasked with creating documentation or written reports:

1. **Prepare the context & requirements in English**:
   Formulate a prompt describing technical context, target audience, and sections needed, specifying the target language.

2. **Call `agy_call.js`**:
   ```bash
   node scripts/agy_call.js -p "Write a comprehensive Getting Started guide for our CLI tool. Target Audience: Node.js developers. Target Language: English." -o docs/GETTING_STARTED.md
   ```

3. **Verify the file** was generated and confirm its completeness.

---

### Workflow 3: Batch UI Copy & Localization (i18n)

For structured localization dictionaries:

1. Create a `ui_spec.json` describing the keys and instructions in English:
   ```json
   {
     "auth.login.title": "Welcome header encouraging users to sign in securely",
     "auth.login.email_placeholder": "Email input field placeholder with sample domain",
     "auth.login.password_error": "Helpful error message when password is under 8 characters",
     "auth.login.cta": "Primary action button to log in"
   }
   ```

2. Run the batch generator:
   ```bash
   node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish
   ```

3. Gemini outputs a clean JSON file ready for `react-intl`, `i18next`, or backend localization.

---

### Workflow 4: Git Commits & PR Descriptions

When committing code or opening a PR:

1. Stage changes:
   ```bash
   git diff --staged > .git_diff.tmp
   ```

2. Call Gemini to author the commit message:
   ```bash
   node scripts/agy_call.js -f .git_diff.tmp -p "Analyze this git diff and write a Conventional Commits message (feat, fix, etc.) with a concise title under 50 chars and a descriptive body. Target language: English." -o .commit_msg.tmp
   ```

3. Commit using the generated text:
   ```bash
   git commit -F .commit_msg.tmp
   rm .git_diff.tmp .commit_msg.tmp
   ```

---

## 4. Pre-Completion Self-Audit Checklist

Before finishing any turn under `/just-code-claude`, Claude MUST verify:

- [ ] Did I write any markdown, guides, summaries, or documentation directly?  
  👉 **If yes, remove and request Gemini via `agy_call.js` to generate it.**
- [ ] Did I author any UI copy, button labels, error alerts, or modal text inside quotes `""`?  
  👉 **If yes, replace with `__AGY__("...", "<lang>")` and run `agy_call.js --replace-in-file`.**
- [ ] Did Gemini generate 100% of the human-facing language?  
  👉 **Yes. Code logic belongs to Claude; human language belongs to Gemini.**
