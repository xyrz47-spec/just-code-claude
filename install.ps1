# install.ps1 - Install just-code-claude skill to ~/.claude/skills/
$targetDir = Join-Path $HOME ".claude\skills\just-code-claude"

Write-Host "Installing just-code-claude skill to: $targetDir" -ForegroundColor Cyan

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$filesToCopy = @(
    "SKILL.md",
    "README.md",
    "README.ko.md",
    "README.ja.md",
    "README.zh-CN.md",
    "README.es.md",
    "README.fr.md",
    "README.de.md",
    "LICENSE",
    "package.json"
)

foreach ($f in $filesToCopy) {
    if (Test-Path $f) {
        Copy-Item -Path $f -Destination $targetDir -Force
        Write-Host "  -> Copied $f" -ForegroundColor Green
    }
}

$dirsToCopy = @("scripts", "templates", "examples", "rules")
foreach ($d in $dirsToCopy) {
    if (Test-Path $d) {
        Copy-Item -Path $d -Destination $targetDir -Recurse -Force
        Write-Host "  -> Copied directory $d" -ForegroundColor Green
    }
}

# Install global Claude Code rule to ~/.claude/rules/
$globalRulesDir = Join-Path $HOME ".claude\rules"
if (-not (Test-Path $globalRulesDir)) {
    New-Item -ItemType Directory -Path $globalRulesDir -Force | Out-Null
}
$ruleSrc = Join-Path $PSScriptRoot "rules\just-code-claude.md"
if (Test-Path $ruleSrc) {
    Copy-Item -Path $ruleSrc -Destination (Join-Path $globalRulesDir "just-code-claude.md") -Force
    Write-Host "  -> Installed global rule to ~/.claude/rules/just-code-claude.md" -ForegroundColor Green
}

# Update ~/.claude/CLAUDE.md if not already present
$globalClaudeMd = Join-Path $HOME ".claude\CLAUDE.md"
$directive = @"

# just-code-claude
- **just-code-claude** (~/.claude/skills/just-code-claude/SKILL.md, rule: ~/.claude/rules/just-code-claude.md)
Claude writes code; Gemini writes text.
- GitHub Releases: Claude Code must NEVER write release notes or changelogs directly. Run 'just-code-claude --release-notes' (or '--release [tag]') with Gemini 4 argon (high effort), then publish with 'gh release create'.
- Git Commits: Run 'just-code-claude --commit' or '--commit-msg' (Gemini 3.8 flash).
- Pull Requests: Run 'just-code-claude --pr-desc' (Gemini 4 argon).
- In-Code Copy: Insert '__AGY__("...")' directives and run 'just-code-claude --replace-in-file'.
- Edge Cases: 1-2 line critical security/runtime warnings and technical inline code comments are permitted.
"@

if (Test-Path $globalClaudeMd) {
    $currentContent = Get-Content -Raw $globalClaudeMd
    if ($currentContent -notmatch "just-code-claude") {
        Add-Content -Path $globalClaudeMd -Value $directive
        Write-Host "  -> Registered in ~/.claude/CLAUDE.md" -ForegroundColor Green
    }
} else {
    Set-Content -Path $globalClaudeMd -Value $directive.TrimStart()
    Write-Host "  -> Created ~/.claude/CLAUDE.md" -ForegroundColor Green
}

Write-Host "`nInstallation completed successfully!" -ForegroundColor Green
Write-Host "You can now invoke `/just-code-claude` in Claude Code." -ForegroundColor Yellow
