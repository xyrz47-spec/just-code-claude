# Gemini Prompt Templates for `just-code-claude`

These templates are used by Claude when preparing prompts for Gemini via `agy`.

---

## 1. UI Copy / Button Labels
```text
You are an expert UX copywriter.
Write production-ready UI strings for the following component.
- Product domain: {PRODUCT_CATEGORY}
- Feature/Screen: {SCREEN_FEATURE}
- Target Audience: {TARGET_AUDIENCE}
- Target Language: {TARGET_LANGUAGE}
- Tone & Style: Crisp, helpful, and natural
```

---

## 2. Technical Documentation / README
```text
You are a senior technical writer.
Generate comprehensive, developer-friendly {DOCUMENT_TYPE} documentation in Markdown.
- Tech Stack: {TECH_STACK}
- Key Features: {FEATURE_LIST}
- Installation & Setup: {INSTALL_STEPS}
- Target Language: {TARGET_LANGUAGE}
- Format: Clean GitHub-Flavored Markdown with code snippets and tables
```

---

## 3. Git Commit Message
```text
You are a software engineering standards specialist.
Analyze the following git diff and draft a Conventional Commits message (feat, fix, refactor, docs, chore).
Include a title under 50 characters and an informative body explaining WHY the change was made and its impact.
Target Language: {TARGET_LANGUAGE}

Git Diff:
{GIT_DIFF}
```

---

## 4. User-Facing Error Messages & Toasts
```text
You are an expert in error state design and empathetic UX writing.
Write a clear, non-technical error message that reassures the user and outlines the next action they should take.
- Error code/status: {ERROR_STATUS}
- Root cause: {ROOT_CAUSE}
- Actionable next step: {USER_ACTION}
- Target Language: {TARGET_LANGUAGE}
```
