# Gemini Prompt Templates for `just-code-claude`

These templates are used by Claude when preparing prompts for Google Gemini (`3.8 flash` and `4 argon`) via `agy_call.js`.

---

## 1. In-Code UI Strings & Microcopy (`3.8 flash` | Effort: `low` to `medium`)

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

## 2. Technical Documentation & Architectural Specifications (`4 argon` | Effort: `high` to `max`)

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

## 3. Empathetic Error Messages & Alerts (`3.8 flash` | Effort: `medium`)

For exception handlers, HTTP 4xx/5xx responses, and toast banners:

```text
Context: {ERROR_SCENARIO_AND_TRIGGER} (e.g., Cloud storage upload quota exceeded)
Intent: {EXPLAIN_ROOT_CAUSE_WITHOUT_JARGON_AND_PROVIDE_RECOVERY_STEPS}
Tone: Empathetic, helpful, constructive, zero finger-pointing
Constraints: Maximum 2 sentences, under 120 characters total
Model: 3.8 flash
Target Language: {TARGET_LANGUAGE}
```

### Example:
```typescript
throw new PaymentRequiredError(
  __AGY__("Context: SaaS file storage upload rejection | Intent: Inform user workspace has reached the 50GB plan limit; guide admin to upgrade tier or delete unneeded assets | Tone: Polite, transparent, constructive | Constraints: 2 short sentences under 110 chars | Model: 3.8 flash | Target Language: English")__
);
```

---

## 4. Conventional Git Commit Messages (`3.8 flash` | Effort: `medium`)

For authoring standardized commit messages from staged diffs:

```bash
git diff --staged > .git_diff.tmp
node scripts/agy_call.js -m "3.8 flash" -e medium -f .git_diff.tmp -p "Context: Staged git changes for this pull request.
Intent: Author a high-quality Conventional Commits message (feat, fix, refactor, docs, test, chore).
Structure:
- Line 1: Type and concise imperative subject (under 50 characters, no trailing period).
- Blank line.
- Body: 2-4 bullet points explaining 'Why this change was made' and 'Architectural implications'.
Constraints: Strictly follow Conventional Commits 1.0.0. No fluff.
Target Language: English." -o .commit_msg.tmp
```

---

## 5. Batch UI Localization (i18n) (`3.8 flash` or `4 argon` | Effort: `medium`)

For localization dictionaries (`ui_spec.json`):

```json
{
  "auth.mfa.heading": {
    "context": "Two-factor authentication challenge modal",
    "intent": "Instruct user to enter 6-digit TOTP authenticator code",
    "tone": "Direct, secure, reassuring",
    "constraints": "Under 45 characters, Title Case"
  },
  "auth.mfa.resend_prompt": {
    "context": "Bottom helper link for SMS/authenticator retry",
    "intent": "Guide user on what to do if code was not received",
    "tone": "Helpful, non-intrusive",
    "constraints": "Under 50 characters"
  }
}
```

Execute:
```bash
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -e medium -o src/locales/ko.json --lang Korean
```
