# Just Code, Claude: Mandatory Text Delegation to Gemini

> **Core Principle**: "Claude writes code. Gemini writes text."  
> Claude handles 100% of the code architecture, logic, syntax, and execution.  
> Claude is **strictly forbidden** from authoring natural language deliverables (GitHub Releases, changelogs, Git commit messages, PR descriptions, documentation, and in-code string literals inside quotes) directly. All text generation MUST be delegated to Google Gemini (`3.8 flash` or `4 argon` with customizable reasoning effort) via the `just-code-claude` CLI or `scripts/agy_call.js`.

---

## 1. GitHub Releases & Changelog Mandate (CRITICAL)

Whenever the user instructs Claude to prepare, draft, or publish a release:
*(e.g., "릴리즈해줘", "v1.2.0 배포해줘", "GitHub release 작성해줘", "태그 달고 릴리즈 올려줘", "draft release notes", "publish a release", "create release")*

1. **NEVER Author Release Notes Directly**:
   - Claude must NOT summarize commits or write the release notes markdown using Claude's own model.
2. **Claude's Engineering Responsibilities**:
   - Inspect the git repository state:
     - Check latest tag: `git describe --tags --abbrev=0` (or `git tag --sort=-v:refname`)
     - Review recent commits: `git log <last-tag>..HEAD --oneline`
     - Review diff statistics: `git diff <last-tag>..HEAD --stat`
   - Formulate detailed **Context Directives**:
     - **Milestone & Tag**: Target version (e.g., `v1.2.0`).
     - **Key Highlights**: Major features implemented, architectural changes, breaking changes.
     - **Target Audience & Tone**: Professional, clear, executive-level technical summary.
     - **Target Language**: Match user's language (e.g., Korean, English, Japanese).
3. **Mandatory Execution via Gemini**:
   - Claude executes the `just-code-claude` CLI using Gemini **`4 argon`** with **`high`** effort:
     ```bash
     # Option A: Draft release notes to file
     just-code-claude --release-notes -m "4 argon" -e high -p "Context: v1.2.0 release. Highlights: Added dual-backend support and GitHub Release workflow." --lang Korean -o RELEASE_NOTES.md

     # Option B: Draft notes and publish directly via GitHub CLI (gh release create)
     just-code-claude --release v1.2.0 -m "4 argon" -e high -p "Context: v1.2.0 official release" --lang Korean
     ```
   - *Path Fallback*: If `just-code-claude` command is not in PATH, use:
     - Windows: `node "$env:USERPROFILE\.claude\skills\just-code-claude\scripts\agy_call.js"` (or `%USERPROFILE%\.claude\skills\...`)
     - Unix/macOS: `node "$HOME/.claude/skills/just-code-claude/scripts/agy_call.js"`
     - Local repo: `node scripts/agy_call.js`
4. **Publishing**:
   - If releasing via GitHub CLI separately, Claude runs:
     ```bash
     gh release create <tag> --notes-file RELEASE_NOTES.md --title "<tag>"
     ```
     Always using the Gemini-synthesized `RELEASE_NOTES.md` file.

---

## 2. Git Commits & Pull Requests Mandate

1. **Git Commit Messages**:
   - Claude stages files (`git add <files>`) but must NEVER write the commit message.
   - Claude executes:
     ```bash
     just-code-claude --commit -m "3.8 flash" -e medium -p "Context: <diff explanation>" --lang <Language>
     ```
     or generates message first via `--commit-msg`.
2. **GitHub Pull Request Descriptions**:
   - Claude analyzes the branch diff and executes:
     ```bash
     just-code-claude --pr-desc -m "4 argon" -e high -p "Context: <PR objectives and impact>" --lang <Language> -o PULL_REQUEST.md
     ```
   - Uses the generated markdown for `gh pr create -F PULL_REQUEST.md`.

---

## 3. In-Code String Literals inside Quotes (`""` or `''`)

- When implementing UI components, alerts, modals, or errors:
  Claude writes detailed placeholders:
  `__AGY__("Context: ... | Intent: ... | Tone: ... | Constraints: ... | Target Language: ...")`
- Claude runs the automated in-place replacement:
  ```bash
  just-code-claude --replace-in-file <path-to-file> -m "3.8 flash" -e medium
  ```

---

## 4. Model Selection Rules
- **`3.8 flash` (`gemini-3.8-flash`)**: Fast UI microcopy, button labels, toasts, Conventional Commits (`effort: medium`).
- **`4 argon` (`gemini-4-argon`)**: Complex synthesis, Release Notes, GitHub Releases, PR descriptions, architectural RFCs (`effort: high` or `max`).
