#!/usr/bin/env node
/**
 * agy_call.js
 * Unified text generation CLI for just-code-claude skill.
 * 
 * Supports two backends:
 *  1. Antigravity CLI ('agy') - Pre-authenticated local agent CLI
 *  2. Direct Google Gemini REST API - Uses GEMINI_API_KEY or GOOGLE_API_KEY
 * 
 * Capabilities:
 *  - Single prompt (-p, --prompt)
 *  - File-based prompt (-f, --file)
 *  - Output to file (-o, --output)
 *  - In-code string replacement (--replace-in-file <file>)
 *    Replaces __AGY__("prompt"[, "lang"]) and __GEMINI__("prompt"[, "lang"])
 *  - Batch UI localization (--json-strings <spec.json>)
 *  - Target language control (--lang <language>)
 *  - Backend selection (--backend <auto|agy|api>)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    backend: 'auto', // 'auto', 'agy', 'api'
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null,
    replaceInFile: null,
    jsonStrings: null,
    lang: null,
    system: null,
    effort: null,
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
    } else if (arg === '--effort') {
      options.effort = args[++i];
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

Dual-Backend Execution:
  1. Antigravity CLI (agy): Automatically detected if installed.
  2. Direct Gemini API: Automatically used if GEMINI_API_KEY is present or agy is unavailable.

Options:
  -p, --prompt <text>          Direct prompt text to generate
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write generated output directly to a file
  -b, --backend <mode>         Backend engine: 'auto' (default), 'agy', or 'api'
  -m, --model <name>           Model name (default for agy: gemini-3.8-flash-high, for api: gemini-2.5-flash)
  --api-key <key>              Google Gemini API key (or set GEMINI_API_KEY env var)
  -l, --lang <language>        Target output language (e.g. English, Korean, Japanese, Spanish)
  -s, --system <text>          System instructions prepended to prompt
  --effort <level>             Reasoning effort for agy (low, medium, high)
  --replace-in-file <path>     Scan code file for __AGY__("...") or __GEMINI__("...") placeholders
                               and replace them in-place with generated copy
  --json-strings <path>        Generate copy for a JSON map of keys -> descriptions
  --raw                        Print raw text without extra formatting
  -h, --help                   Show this help message

Examples:
  # 1. Generate text deliverable via agy CLI
  node agy_call.js -p "Write an API overview in English" -o docs/API.md

  # 2. Generate text via Direct Gemini API
  node agy_call.js -p "Write project README" -b api --api-key "AIza..." -o README.md

  # 3. In-code string replacement in component
  node agy_call.js --replace-in-file src/components/Login.tsx --lang English

  # 4. Batch UI strings / localization
  node agy_call.js --json-strings ui_spec.json -o src/locales/ko.json --lang Korean
`);
}

function runAgyCli(promptText, model, effort) {
  return new Promise((resolve, reject) => {
    const agyBin = findAgyExecutable();
    const chosenModel = model || 'gemini-3.8-flash-high';
    const args = ['-p', promptText, '--model', chosenModel, '--dangerously-skip-permissions'];

    if (effort) {
      args.push('--effort', effort);
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

async function runGeminiApi(promptText, apiKey, model) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please provide --api-key or set GEMINI_API_KEY in your environment.');
  }

  const chosenModel = model || 'gemini-2.5-flash';
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

  if (backend === 'api') {
    return await runGeminiApi(promptText, options.apiKey, options.model);
  }

  if (backend === 'agy') {
    return await runAgyCli(promptText, options.model, options.effort);
  }

  // Auto mode:
  // 1. If agy executable exists and no explicit api key is prioritized, try agy
  // 2. If agy fails or apiKey is provided, fallback to API
  const agyBin = findAgyExecutable();
  const hasAgy = agyBin === 'agy' || fs.existsSync(agyBin);

  if (hasAgy) {
    try {
      return await runAgyCli(promptText, options.model, options.effort);
    } catch (err) {
      if (options.apiKey) {
        console.warn(`[just-code-claude] agy CLI call failed, falling back to Direct Gemini API: ${err.message}`);
        return await runGeminiApi(promptText, options.apiKey, options.model);
      }
      throw err;
    }
  } else if (options.apiKey) {
    return await runGeminiApi(promptText, options.apiKey, options.model);
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

  const prompt = `You are a world-class software UI/UX copywriter and localization specialist.
Below is a JSON map of UI text placeholders requiring natural, human copy for source code.
For each item:
- Read the description and target language.
- Craft crisp, professional, production-ready copy appropriate for the user experience.
- Do NOT include surrounding quotes in the values.
- Return ONLY a valid JSON object mapping each key to its final text string. No markdown block, no extra text.

Input specification:
${JSON.stringify(spec, null, 2)}
`;

  const response = await executeGeneration(prompt, options);
  const cleanJsonStr = cleanCodeBlock(response);
  let parsed;
  try {
    parsed = JSON.parse(cleanJsonStr);
  } catch (err) {
    const firstBrace = cleanJsonStr.indexOf('{');
    const lastBrace = cleanJsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      parsed = JSON.parse(cleanJsonStr.substring(firstBrace, lastBrace + 1));
    } else {
      throw new Error(`Failed to parse response as JSON: ${response}`);
    }
  }

  let updatedContent = content;
  matches.forEach((m, idx) => {
    const key = `item_${idx}`;
    const generatedText = parsed[key] !== undefined ? parsed[key] : m.description;
    const escapedText = generatedText.replace(/\\/g, '\\\\').replace(new RegExp(m.quote, 'g'), `\\${m.quote}`);
    const replacement = `${m.quote}${escapedText}${m.quote}`;
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

  console.log(`[just-code-claude] Generating UI strings...`);
  const response = await executeGeneration(prompt, options);
  const cleanJson = cleanCodeBlock(response);

  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, cleanJson, 'utf-8');
    console.log(`[just-code-claude] Saved generated strings to ${outputPath}`);
  } else {
    console.log(cleanJson);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || process.argv.length <= 2) {
    printHelp();
    process.exit(0);
  }

  try {
    if (options.replaceInFile) {
      await handleReplaceInFile(options.replaceInFile, options);
      return;
    }

    if (options.jsonStrings) {
      await handleJsonStrings(options.jsonStrings, options.output, options);
      return;
    }

    let promptText = options.prompt || '';
    if (options.file) {
      if (!fs.existsSync(options.file)) {
        throw new Error(`File not found: ${options.file}`);
      }
      const fileContent = fs.readFileSync(options.file, 'utf-8');
      promptText = promptText ? `${promptText}\n\n${fileContent}` : fileContent;
    }

    if (!promptText.trim()) {
      console.error('Error: No prompt provided. Use -p or -f to specify the prompt.');
      process.exit(1);
    }

    if (options.lang) {
      promptText = `[Target Language: ${options.lang}]\n\n${promptText}`;
    }

    if (options.system) {
      promptText = `[System Instructions: ${options.system}]\n\n${promptText}`;
    }

    const output = await executeGeneration(promptText, options);

    if (options.output) {
      const dir = path.dirname(options.output);
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
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
    console.error(`[just-code-claude ERROR] ${err.message}`);
    process.exit(1);
  }
}

main();
