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

echo -e "\033[32mInstallation completed successfully!\033[0m"
echo -e "\033[33mYou can now invoke /just-code-claude in Claude Code.\033[0m"
