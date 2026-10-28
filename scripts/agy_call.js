#!/usr/bin/env node
/**
 * agy_call.js
 * Unified text generation CLI for just-code-claude skill.
 * 
 * Supports two backends:
 *  1. Antigravity CLI ('agy') - Pre-authenticated local agent CLI
 *  2. Direct Google Gemini REST API - Uses GEMINI_API_KEY or GOOGLE_API_KEY
 * 
 * Supported Models:
 *  - 3.8 flash: 'gemini-3.8-flash-high' (Default: Fast, agile, ideal for UI copy & components)
 *  - 4 argon:   'gemini-4-argon-high'   (Deep reasoning, complex architecture & release docs)
 * 
 * Reasoning Effort:
 *  - Configurable via -e, --effort <low|medium|high|xhigh|max> or GEMINI_EFFORT env
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function normalizeModel(model) {
  const envModel = process.env.GEMINI_MODEL;
  const raw = (model || envModel || 'gemini-3.8-flash').toString().trim();
  const lower = raw.toLowerCase().replace(/[\s_-]+/g, '');

  // 4 argon: gemini-4-argon
  if (lower.includes('argon') || lower === '4' || lower === '4argon') {
    return 'gemini-4-argon';
  }
  // 3.8 flash: gemini-3.8-flash
  if (lower.includes('flash') || lower.includes('38') || lower.includes('3.8')) {
    return 'gemini-3.8-flash';
  }
  return raw;
}

function normalizeEffort(effort) {
  const envEffort = process.env.GEMINI_EFFORT || process.env.AGY_EFFORT;
  const raw = (effort || envEffort || '').toString().trim().toLowerCase();
  if (!raw) return null;
  const valid = ['low', 'medium', 'high', 'xhigh', 'max'];
  if (valid.includes(raw)) return raw;
  return null;
}

function findAgyExecutable() {
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Local');
    const defaultAgyPath = path.join(localAppData, 'agy', 'bin', 'agy.exe');
    if (fs.existsSync(defaultAgyPath)) {
      return defaultAgyPath;
    }
    return 'agy.exe';
  }
  return 'agy';
}

function parseArgs(args) {
  const options = {
    prompt: null,
    file: null,
    output: null,
    model: null,
    effort: null,
    backend: 'auto', // 'auto', 'agy', 'api'
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null,
    replaceInFile: null,
    jsonStrings: null,
    lang: null,
    system: null,
    help: false,
    raw: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-p' || arg === '--prompt') {
      options.prompt = args[++i];
    } else if (arg === '-f' || arg === '--file') {
      options.file = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i];
    } else if (arg === '-m' || arg === '--model') {
      options.model = args[++i];
    } else if (arg === '-e' || arg === '--effort') {
      options.effort = args[++i];
    } else if (arg === '-l' || arg === '--lang') {
      options.lang = args[++i];
    } else if (arg === '-b' || arg === '--backend') {
      options.backend = args[++i].toLowerCase();
    } else if (arg === '--api-key') {
      options.apiKey = args[++i];
    } else if (arg === '--replace-in-file') {
      options.replaceInFile = args[++i];
    } else if (arg === '--json-strings') {
      options.jsonStrings = args[++i];
    } else if (arg === '-s' || arg === '--system') {
      options.system = args[++i];
    } else if (arg === '--raw') {
      options.raw = true;
    } else if (arg === '-h' || arg === '--help') {
      options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node agy_call.js [options]

Supported Models:
  1. 3.8 flash: 'gemini-3.8-flash-high' (Default) - Ultra-fast, ideal for UI copy, components, toasts
  2. 4 argon:   'gemini-4-argon-high'             - Maximum reasoning depth, architecture docs, guides

Execution Backends:
  1. Antigravity CLI (agy): Automatically detected if installed on host.
  2. Direct Gemini API: Used if GEMINI_API_KEY is present or agy is unavailable.

Options:
  -p, --prompt <text>          Direct prompt text to generate
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write generated output directly to a file
  -m, --model <name>           Choose model: '3.8 flash' (or gemini-3.8-flash-high)
                                         or '4 argon' (or gemini-4-argon-high)
  -e, --effort <level>         Set reasoning effort: low, medium, high, xhigh, max
  -b, --backend <mode>         Backend engine: 'auto' (default), 'agy', or 'api'
  --api-key <key>              Google Gemini API key (or set GEMINI_API_KEY env var)
  -l, --lang <language>        Target output language (e.g. English, Korean, Japanese, Spanish)
  -s, --system <text>          System instructions prepended to prompt
  --replace-in-file <path>     Scan code file for __AGY__("...") or __GEMINI__("...") placeholders
                               and replace them in-place with generated copy
  --json-strings <path>        Generate copy for a JSON map of keys -> descriptions
  --raw                        Print raw text without extra formatting
  -h, --help                   Show this help message

Examples:
  # 1. Generate UI copy with 3.8 flash (fast)
  node agy_call.js -m "3.8 flash" -p "Context: Sign-up CTA button" -l English

  # 2. Generate architectural doc with 4 argon & high effort
  node agy_call.js -m "4 argon" -e high -p "Write an API architecture doc" -o docs/ARCH.md

  # 3. Replace in-code placeholders with rich instructions
  node agy_call.js --replace-in-file src/components/Login.tsx --lang English
`);
}

function runAgyCli(promptText, model, effort) {
  return new Promise((resolve, reject) => {
    const agyBin = findAgyExecutable();
    const chosenModel = normalizeModel(model);
    const chosenEffort = normalizeEffort(effort);
    const args = ['-p', promptText, '--model', chosenModel, '--dangerously-skip-permissions'];

    if (chosenEffort) {
      args.push('--effort', chosenEffort);
    }

    const proc = spawn(agyBin, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString('utf-8');
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString('utf-8');
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`agy CLI exited with code ${code}:\n${stderr || stdout}`));
      }
      resolve(stdout.trim());
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function runGeminiApi(promptText, apiKey, model, effort) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please provide --api-key or set GEMINI_API_KEY in your environment.');
  }

  const chosenModel = normalizeModel(model);
  const chosenEffort = normalizeEffort(effort);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [
      {
        parts: [
          { text: promptText }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7
    }
  };

  const effortBudgets = {
    low: 1024,
    medium: 4096,
    high: 8192,
    xhigh: 16384,
    max: -1
  };
  if (chosenEffort && effortBudgets[chosenEffort] !== undefined) {
    body.generationConfig.thinkingConfig = {
      thinkingBudget: effortBudgets[chosenEffort]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates && data.candidates[0];
  if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
    throw new Error(`Gemini API returned empty response: ${JSON.stringify(data)}`);
  }

  return candidate.content.parts[0].text.trim();
}

async function executeGeneration(promptText, options) {
  const backend = options.backend;
  const model = normalizeModel(options.model);
  const effort = normalizeEffort(options.effort);

  if (backend === 'api') {
    return await runGeminiApi(promptText, options.apiKey, model, effort);
  }

  if (backend === 'agy') {
    return await runAgyCli(promptText, model, effort);
  }

  // Auto mode:
  // 1. If agy executable exists and no explicit api key is prioritized, try agy
  // 2. If agy fails or apiKey is provided, fallback to API
  const agyBin = findAgyExecutable();
  const hasAgy = agyBin === 'agy' || fs.existsSync(agyBin);

  if (hasAgy) {
    try {
      return await runAgyCli(promptText, model, effort);
    } catch (err) {
      if (options.apiKey) {
        console.warn(`[just-code-claude] agy CLI call failed, falling back to Direct Gemini API: ${err.message}`);
        return await runGeminiApi(promptText, options.apiKey, model, effort);
      }
      throw err;
    }
  } else if (options.apiKey) {
    return await runGeminiApi(promptText, options.apiKey, model, effort);
  } else {
    throw new Error("No execution backend available. Either install the 'agy' CLI or set GEMINI_API_KEY for Direct API access.");
  }
}

function cleanCodeBlock(text) {
  const match = text.match(/^```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)\s*```$/);
  if (match) {
    return match[1].trim();
  }
  return text.trim();
}

async function handleReplaceInFile(filePath, options) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Match __AGY__("prompt"[, "lang"]) or __GEMINI__("prompt"[, "lang"]) or GEMINI_TEXT / AGY_TEXT
  const regex = /(?:__AGY__|AGY_TEXT|__GEMINI__|GEMINI_TEXT|GEMINI_STR|__GEMINI_TEXT__)\(\s*(["'])([\s\S]*?)\1(?:\s*,\s*(["'])([\s\S]*?)\3)?\s*\)(?:__)?/g;

  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      full: match[0],
      quote: match[1],
      description: match[2],
      langOverride: match[4] || null,
      index: match.index,
    });
  }

  if (matches.length === 0) {
    console.log(`[just-code-claude] No __AGY__ or __GEMINI__ placeholders found in ${filePath}`);
    return;
  }

  console.log(`[just-code-claude] Found ${matches.length} string placeholder(s) in ${filePath}. Requesting generation...`);

  const spec = {};
  matches.forEach((m, idx) => {
    spec[`item_${idx}`] = {
      description: m.description,
      language: m.langOverride || options.lang || 'infer from context or instructions',
    };
  });

  const prompt = `You are a world-class software UI/UX copywriter, localization specialist, and technical writer.
Below is a JSON map of UI text placeholders requiring natural, human copy for source code.
For each item:
- Read the detailed context, user intent, tone, constraints, and target language specified in the description.
- Follow all constraints (length, casing, tone, audience) strictly.
- Craft crisp, professional, production-ready copy appropriate for the user experience.
- Do NOT include surrounding quotes in the values.
- Return ONLY a valid JSON object mapping each key to its final text string. No markdown block, no extra text.

Input specification:
${JSON.stringify(spec, null, 2)}
`;

  const response = await executeGeneration(prompt, options);
  const cleanJson = cleanCodeBlock(response);

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      parsed = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
    } else {
      throw new Error(`Failed to parse response as JSON:\n${response}`);
    }
  }

  let updatedContent = content;
  // Replace each occurrence
  matches.forEach((m, idx) => {
    const key = `item_${idx}`;
    const generatedText = parsed[key] || m.description;
    const escaped = generatedText.replace(/\\/g, '\\\\').replace(new RegExp(m.quote, 'g'), `\\${m.quote}`);
    const replacement = `${m.quote}${escaped}${m.quote}`;
    updatedContent = updatedContent.replace(m.full, replacement);
  });

  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`[just-code-claude] Successfully replaced ${matches.length} placeholders in ${filePath}!`);
}

async function handleJsonStrings(specPath, outputPath, options) {
  if (!fs.existsSync(specPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  const specContent = fs.readFileSync(specPath, 'utf-8');
  const langDirective = options.lang ? `Target language: ${options.lang}` : 'Target language: As specified in keys or English by default.';

  const prompt = `You are an expert technical writer and UI localization specialist.
Below is a JSON specification of keys and their context/descriptions.
Generate production-ready copy for every key.
${langDirective}
Return ONLY a valid JSON object matching the input structure, without markdown code fences or explanatory text.

Input specification:
${specContent}
`;

  console.log('[just-code-claude] Generating UI strings...');
  const response = await executeGeneration(prompt, options);
  const cleanJson = cleanCodeBlock(response);

  if (outputPath) {
    const outDir = path.dirname(outputPath);
    if (outDir && !fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, cleanJson, 'utf-8');
    console.log(`[just-code-claude] Saved generated strings to ${outputPath}`);
  } else {
    console.log(cleanJson);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.replaceInFile) {
    try {
      await handleReplaceInFile(options.replaceInFile, options);
      process.exit(0);
    } catch (err) {
      console.error(`[just-code-claude] Error: ${err.message}`);
      process.exit(1);
    }
  }

  if (options.jsonStrings) {
    try {
      await handleJsonStrings(options.jsonStrings, options.output, options);
      process.exit(0);
    } catch (err) {
      console.error(`[just-code-claude] Error: ${err.message}`);
      process.exit(1);
    }
  }

  let promptText = options.prompt || '';
  if (options.file) {
    if (!fs.existsSync(options.file)) {
      console.error(`[just-code-claude] File not found: ${options.file}`);
      process.exit(1);
    }
    const fileContent = fs.readFileSync(options.file, 'utf-8');
    promptText = promptText ? `${promptText}\n\n${fileContent}` : fileContent;
  }

  if (!promptText.trim()) {
    printHelp();
    process.exit(1);
  }

  if (options.lang) {
    promptText = `[Target Language: ${options.lang}]\n\n${promptText}`;
  }

  if (options.system) {
    promptText = `[System Instructions: ${options.system}]\n\n${promptText}`;
  }

  try {
    const output = await executeGeneration(promptText, options);

    if (options.output) {
      const outDir = path.dirname(options.output);
      if (outDir && !fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(options.output, output, 'utf-8');
      console.log(`[just-code-claude] Output successfully written to: ${options.output}`);
    } else {
      if (options.raw) {
        process.stdout.write(output);
      } else {
        console.log(output);
      }
    }
  } catch (err) {
    console.error(`[just-code-claude] Execution failed: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  executeGeneration,
  runAgyCli,
  runGeminiApi,
  handleReplaceInFile,
  handleJsonStrings,
  normalizeModel,
  normalizeEffort,
};
