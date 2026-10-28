#!/usr/bin/env node
/**
 * bin/cli.js
 * npx installer and runner for just-code-claude skill.
 * 
 * Usage:
 *   npx just-code-claude                  # Installs skill globally to ~/.claude/skills/just-code-claude
 *   npx just-code-claude install          # Explicit install
 *   npx just-code-claude install --local  # Installs locally to .claude/skills/just-code-claude
 *   npx just-code-claude status           # Checks installation status
 *   npx just-code-claude uninstall        # Uninstalls skill
 *   npx just-code-claude [options]        # Run agy_call directly
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function getGlobalClaudeSkillsDir() {
  const home = os.homedir();
  return path.join(home, '.claude', 'skills', 'just-code-claude');
}

function getLocalClaudeSkillsDir() {
  return path.join(process.cwd(), '.claude', 'skills', 'just-code-claude');
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkill(isLocal = false) {
  const targetDir = isLocal ? getLocalClaudeSkillsDir() : getGlobalClaudeSkillsDir();
  const scope = isLocal ? 'local repository (.claude/skills)' : 'global environment (~/.claude/skills)';

  console.log(`\n📦 Installing 'just-code-claude' skill into ${scope}...`);
  console.log(`📂 Target directory: ${targetDir}\n`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Files to copy
  const rootFiles = [
    'SKILL.md',
    'package.json',
    'LICENSE',
    'README.md',
    'README.ko.md',
    'README.ja.md',
    'README.zh-CN.md',
    'README.es.md',
    'README.fr.md',
    'README.de.md'
  ];

  for (const file of rootFiles) {
    const src = path.join(rootDir, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${file}`);
    }
  }

  // Directories to copy
  const dirs = ['scripts', 'templates', 'examples', 'rules'];
  for (const dir of dirs) {
    const srcDir = path.join(rootDir, dir);
    const destDir = path.join(targetDir, dir);
    if (fs.existsSync(srcDir)) {
      copyDirRecursive(srcDir, destDir);
      console.log(`  ✓ Copied directory ${dir}/`);
    }
  }

  // Install global Claude Code rule and register in CLAUDE.md
  if (!isLocal) {
    const home = os.homedir();
    const rulesDir = path.join(home, '.claude', 'rules');
    if (!fs.existsSync(rulesDir)) {
      fs.mkdirSync(rulesDir, { recursive: true });
    }
    const ruleSrc = path.join(rootDir, 'rules', 'just-code-claude.md');
    if (fs.existsSync(ruleSrc)) {
      fs.copyFileSync(ruleSrc, path.join(rulesDir, 'just-code-claude.md'));
      console.log('  ✓ Installed global rule ~/.claude/rules/just-code-claude.md');
    }

    const claudeMdPath = path.join(home, '.claude', 'CLAUDE.md');
    const directive = `
# just-code-claude
- **just-code-claude** (~/.claude/skills/just-code-claude/SKILL.md, rule: ~/.claude/rules/just-code-claude.md)
Claude writes code; Gemini writes text.
- GitHub Releases: Claude Code must NEVER write release notes or changelogs directly. Run 'just-code-claude --release-notes' (or '--release [tag]') with Gemini 4 argon (high effort), then publish with 'gh release create'.
- Git Commits: Run 'just-code-claude --commit' or '--commit-msg' (Gemini 3.8 flash).
- Pull Requests: Run 'just-code-claude --pr-desc' (Gemini 4 argon).
- In-Code Copy: Insert '__AGY__("...")' directives and run 'just-code-claude --replace-in-file'.
`;
    if (fs.existsSync(claudeMdPath)) {
      const existing = fs.readFileSync(claudeMdPath, 'utf-8');
      if (!existing.includes('just-code-claude')) {
        fs.appendFileSync(claudeMdPath, directive, 'utf-8');
        console.log('  ✓ Registered in ~/.claude/CLAUDE.md');
      }
    } else {
      fs.writeFileSync(claudeMdPath, directive.trimStart(), 'utf-8');
      console.log('  ✓ Created ~/.claude/CLAUDE.md');
    }
  }

  console.log(`\n🎉 Installation successful!`);
  console.log(`--------------------------------------------------`);
  console.log(`💬 How to use:`);
  console.log(`   Open Claude Code and type:`);
  console.log(`   /just-code-claude`);
  console.log(`\n💡 Claude will now write code while delegating all`);
  console.log(`   prose, docs, and in-code strings to Gemini!`);
  console.log(`--------------------------------------------------\n`);
}

function uninstallSkill(isLocal = false) {
  const targetDir = isLocal ? getLocalClaudeSkillsDir() : getGlobalClaudeSkillsDir();

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    console.log(`\n🗑️  Successfully removed just-code-claude from: ${targetDir}\n`);
  } else {
    console.log(`\nℹ️  just-code-claude is not installed at: ${targetDir}\n`);
  }
}

function checkStatus() {
  const globalDir = getGlobalClaudeSkillsDir();
  const localDir = getLocalClaudeSkillsDir();

  console.log(`\n🔍 just-code-claude installation status:`);
  console.log(`   - Global (~/.claude/skills): ${fs.existsSync(globalDir) ? '✅ Installed (' + globalDir + ')' : '❌ Not installed'}`);
  console.log(`   - Local  (.claude/skills): ${fs.existsSync(localDir) ? '✅ Installed (' + localDir + ')' : '❌ Not installed'}\n`);
}

function printCliHelp() {
  console.log(`
just-code-claude - Claude writes code, Gemini writes text.

Usage:
  npx just-code-claude                     Install skill globally (default)
  npx just-code-claude install             Install skill globally
  npx just-code-claude install --local     Install skill into current repo's .claude/skills/
  npx just-code-claude status              Check installation status
  npx just-code-claude uninstall           Uninstall skill globally
  npx just-code-claude uninstall --local   Uninstall skill from current repo

Direct Execution Options (forwarded to agy_call):
  just-code-claude -p "<prompt>" -o <output>
  just-code-claude --replace-in-file <file> [--lang <language>]
  just-code-claude --json-strings <spec.json> -o <output>
  just-code-claude --commit-msg [-m "3.8 flash"] [-e medium] [--lang <language>]
  just-code-claude --commit [-m "3.8 flash"] [-e medium] [--lang <language>]
  just-code-claude --pr-desc [-m "4 argon"] [-e high] [--lang <language>] [-o PULL_REQUEST.md]
  just-code-claude --release-notes [-m "4 argon"] [-e high] [--lang <language>] [-o RELEASE_NOTES.md]
  just-code-claude --release [tag] [-m "4 argon"] [-e high] [--lang <language>]
`);
}

// Forward to agy_call.js
function forwardToAgyCall(args) {
  const agyCallScript = path.join(rootDir, 'scripts', 'agy_call.js');
  const child = spawn(process.execPath, [agyCallScript, ...args], {
    stdio: 'inherit'
  });
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

const args = process.argv.slice(2);
const firstArg = args[0];

if (!firstArg || firstArg === 'install') {
  const isLocal = args.includes('--local');
  installSkill(isLocal);
} else if (firstArg === 'uninstall') {
  const isLocal = args.includes('--local');
  uninstallSkill(isLocal);
} else if (firstArg === 'status') {
  checkStatus();
} else if (firstArg === '-h' || firstArg === '--help' || firstArg === 'help') {
  printCliHelp();
} else {
  // If user passes flags like -p, --replace-in-file, forward to agy_call.js
  forwardToAgyCall(args);
}
