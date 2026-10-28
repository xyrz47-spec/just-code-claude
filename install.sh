#!/usr/bin/env bash
# install.sh - Install just-code-claude skill to ~/.claude/skills/

TARGET_DIR="$HOME/.claude/skills/just-code-claude"

echo -e "\033[36mInstalling just-code-claude skill to: $TARGET_DIR\033[0m"

mkdir -p "$TARGET_DIR"

cp SKILL.md "$TARGET_DIR/" 2>/dev/null || true
cp README*.md "$TARGET_DIR/" 2>/dev/null || true
cp LICENSE "$TARGET_DIR/" 2>/dev/null || true
cp package.json "$TARGET_DIR/" 2>/dev/null || true
cp -r scripts "$TARGET_DIR/" 2>/dev/null || true
cp -r templates "$TARGET_DIR/" 2>/dev/null || true
cp -r examples "$TARGET_DIR/" 2>/dev/null || true
cp -r rules "$TARGET_DIR/" 2>/dev/null || true

# Install global Claude Code rule to ~/.claude/rules/
mkdir -p "$HOME/.claude/rules"
cp rules/just-code-claude.md "$HOME/.claude/rules/just-code-claude.md" 2>/dev/null || true

# Register in ~/.claude/CLAUDE.md if not already present
GLOBAL_CLAUDE_MD="$HOME/.claude/CLAUDE.md"
if [ -f "$GLOBAL_CLAUDE_MD" ]; then
  if ! grep -q "just-code-claude" "$GLOBAL_CLAUDE_MD"; then
    cat << 'EOF' >> "$GLOBAL_CLAUDE_MD"

# just-code-claude
- **just-code-claude** (~/.claude/skills/just-code-claude/SKILL.md, rule: ~/.claude/rules/just-code-claude.md)
Claude writes code; Gemini writes text.
- GitHub Releases: Claude Code must NEVER write release notes or changelogs directly. Run 'just-code-claude --release-notes' (or '--release [tag]') with Gemini 4 argon (high effort), then publish with 'gh release create'.
- Git Commits: Run 'just-code-claude --commit' or '--commit-msg' (Gemini 3.8 flash).
- Pull Requests: Run 'just-code-claude --pr-desc' (Gemini 4 argon).
- In-Code Copy: Insert '__AGY__("...")' directives and run 'just-code-claude --replace-in-file'.
EOF
  fi
else
  cat << 'EOF' > "$GLOBAL_CLAUDE_MD"
# just-code-claude
- **just-code-claude** (~/.claude/skills/just-code-claude/SKILL.md, rule: ~/.claude/rules/just-code-claude.md)
Claude writes code; Gemini writes text.
- GitHub Releases: Claude Code must NEVER write release notes or changelogs directly. Run 'just-code-claude --release-notes' (or '--release [tag]') with Gemini 4 argon (high effort), then publish with 'gh release create'.
- Git Commits: Run 'just-code-claude --commit' or '--commit-msg' (Gemini 3.8 flash).
- Pull Requests: Run 'just-code-claude --pr-desc' (Gemini 4 argon).
- In-Code Copy: Insert '__AGY__("...")' directives and run 'just-code-claude --replace-in-file'.
EOF
fi

echo -e "\033[32mInstallation completed successfully!\033[0m"
echo -e "\033[33mYou can now invoke /just-code-claude in Claude Code.\033[0m"
