# Gemini Prompt Templates for `just-code-claude`

These templates are used by Claude when preparing prompts for Google Gemini (`3.8 flash` and `4 argon`) via `agy_call.js`.

---

## 1. Git Conventional Commit Messages (`3.8 flash` | Effort: `medium`)

Use with `--commit-msg` or `--commit`:

```bash
# Direct one-command commit:
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: {FEATURE_OR_BUGFIX_MODULE}
Intent: {WHY_THE_CHANGE_WAS_MADE_AND_USER_IMPACT}
Technical Scope: {AFFECTED_FILES_OR_TYPES}
Breaking Changes: {NONE_OR_EXPLANATION}" --lang {TARGET_LANGUAGE}
```

### Example:
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: Added two-factor TOTP authentication dialog and backup codes generator.
Intent: Enforce security compliance for enterprise accounts.
Technical Scope: src/auth/mfa.tsx, api/auth/totp.ts" --lang English
```

---

## 2. GitHub Pull Request Descriptions (`4 argon` | Effort: `high`)

Use with `--pr-desc`:

```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Pull Request for {FEATURE_NAME}.
Problem Solved: {BACKGROUND_PROBLEM_OR_ISSUE_REFERENCE}.
Architecture Highlights: {STRUCTURAL_OR_DATA_CONTRACT_CHANGES}.
Testing Performed: {UNIT_TESTS_E2E_MANUAL_QA}." -o PULL_REQUEST.md --lang {TARGET_LANGUAGE}
```

---

## 3. In-Code UI Strings & Microcopy (`3.8 flash` | Effort: `low` to `medium`)

Use inside `__AGY__("...", "<lang>")` placeholders in React/Vue/Svelte/Mobile components:

```text
Context: {SPECIFIC_COMPONENT_AND_SCREEN_STATE}
Intent: {WHAT_THE_USER_MUST_ACCOMPLISH_OR_UNDERSTAND}
Tone: {EMOTIONAL_TONE_AND_BRAND_VOICE} (e.g., Empathetic, crisp, motivating, enterprise-grade)
Constraints: {LENGTH_BUDGET} (e.g., 2-4 words, single sentence under 60 chars), {CASING} (Title Case / sentence case)
Model: 3.8 flash
Target Language: {TARGET_LANGUAGE}
```

### Example:
```tsx
<button onClick={handleStripeCheckout}>
  __AGY__("Context: Subscription modal primary payment action | Intent: Prompt user to commit to annual subscription with 20% discount | Tone: Confident, motivating | Constraints: 3 words, Title Case | Model: 3.8 flash | Effort: low", "English")__
</button>
```

---

## 4. Technical Documentation & Architectural Specifications (`4 argon` | Effort: `high` to `max`)

For comprehensive guides, API references, READMEs, and technical whitepapers:

```bash
node scripts/agy_call.js -m "4 argon" -e high -p "You are a Principal Software Architect and Lead Technical Writer.
Context: Architectural overview for {SYSTEM_NAME}.
Target Audience: {SENIOR_ENGINEERS_OR_DEVELOPERS}.
Tech Stack: {TECH_STACK}.

Required Sections:
1. Executive Summary & Problem Statement
2. High-Level Architecture (ASCII or Mermaid diagram)
3. Core Data Contracts & REST/gRPC Endpoints
4. Concurrency, Caching & Failure Modes
5. Step-by-Step Developer Quickstart

Tone & Style: Rigorous, precise, production-grade technical English.
Constraints: Clean GitHub-Flavored Markdown with typed code examples.
Target Language: {TARGET_LANGUAGE}." -o docs/{OUTPUT_FILE}.md
```

---

## 5. Empathetic Error Messages & Alerts (`3.8 flash` | Effort: `medium`)

For exception handlers, HTTP 4xx/5xx responses, and toast banners:

```typescript
throw new PaymentRequiredError(
  __AGY__("Context: SaaS file storage upload rejection | Intent: Inform user workspace has reached the 50GB plan limit; guide admin to upgrade tier or delete unneeded assets | Tone: Polite, transparent, constructive | Constraints: 2 short sentences under 110 chars | Model: 3.8 flash | Target Language: English")__
);
```

---

## 6. Batch UI Localization (i18n) (`3.8 flash` or `4 argon` | Effort: `medium`)

For localization dictionaries (`ui_spec.json`):

```bash
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -e medium -o src/locales/ko.json --lang Korean
```
