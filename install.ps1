# install.ps1 - Install just-code-claude skill to ~/.claude/skills/
$targetDir = Join-Path $HOME ".claude\skills\just-code-claude"

Write-Host "Installing just-code-claude skill to: $targetDir" -ForegroundColor Cyan

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$filesToCopy = @(
    "SKILL.md",
    "README.md",
    "package.json"
)

foreach ($f in $filesToCopy) {
    if (Test-Path $f) {
        Copy-Item -Path $f -Destination $targetDir -Force
        Write-Host "  -> Copied $f" -ForegroundColor Green
    }
}

$dirsToCopy = @("scripts", "templates", "examples")
foreach ($d in $dirsToCopy) {
    if (Test-Path $d) {
        Copy-Item -Path $d -Destination $targetDir -Recurse -Force
        Write-Host "  -> Copied directory $d" -ForegroundColor Green
    }
}

Write-Host "`nInstallation completed successfully!" -ForegroundColor Green
Write-Host "You can now invoke `/just-code-claude` in Claude Code." -ForegroundColor Yellow
