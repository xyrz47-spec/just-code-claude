#!/usr/bin/env node
/**
 * gemini_call.js
 * CLI wrapper that invokes Gemini via 'agy' CLI for the just-code-claude skill.
 * 
 * Capabilities:
 *  1. Single prompt (-p, --prompt)
 *  2. File-based prompt (-f, --file)
 *  3. Output to file (-o, --output)
 *  4. In-code string replacement (--replace-in-file <file>)
 *     Replaces __GEMINI__("prompt"[, "lang"]) with Gemini-generated text.
 *  5. JSON string dictionary (--json-strings <file>)
 *  6. Target language specification (--lang <language>)
 *  7. Model selection (-m, --model, default: gemini-3.8-flash-high)
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
    model: 'gemini-3.8-flash-high',
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
Usage: node gemini_call.js [options]

Options:
  -p, --prompt <text>          Direct prompt text to send to Gemini
  -f, --file <path>            Read prompt/context from a file
  -o, --output <path>          Write Gemini's output directly to a file
  -m, --model <name>           Gemini model (default: gemini-3.8-flash-high)
  -l, --lang <language>        Target output language (e.g. English, Korean, Japanese, Spanish)
  -s, --system <text>          System instructions prepended to prompt
  --effort <level>             Reasoning effort (low, medium, high)
  --replace-in-file <path>     Scan code file for __GEMINI__("...") placeholders
                               and replace them in-place with Gemini text
  --json-strings <path>        Generate copy for a JSON map of keys -> descriptions
  --raw                        Print raw text without extra formatting
  -h, --help                   Show this help message

Examples:
  # 1. Generate documentation
  node gemini_call.js -p "Write an API overview in English" -o docs/API.md

  # 2. In-code string replacement (with global target language)
  node gemini_call.js --replace-in-file src/components/Login.tsx --lang Korean

  # 3. Batch UI strings
  node gemini_call.js --json-strings ui_spec.json -o src/locales/en.json --lang English
`);
}

function runAgy(promptText, model, effort) {
  return new Promise((resolve, reject) => {
    const agyBin = findAgyExecutable();
    const args = ['-p', promptText, '--model', model, '--dangerously-skip-permissions'];

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
        return reject(new Error(`agy exited with code ${code}:\n${stderr || stdout}`));
      }
      resolve(stdout.trim());
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

function cleanCodeBlock(text) {
  const match = text.match(/^```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)\s*```$/);
  if (match) {
    return match[1].trim();
  }
  return text.trim();
}

async function handleReplaceInFile(filePath, model, effort, defaultLang) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Match __GEMINI__("prompt"[, "lang"]) or GEMINI_TEXT(...)
  const regex = /(?:__GEMINI__|GEMINI_TEXT|GEMINI_STR|__GEMINI_TEXT__)\(\s*(["'])([\s\S]*?)\1(?:\s*,\s*(["'])([\s\S]*?)\3)?\s*\)(?:__)?/g;

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
    console.log(`[just-code-claude] No __GEMINI__ or GEMINI_TEXT placeholders found in ${filePath}`);
    return;
  }

  console.log(`[just-code-claude] Found ${matches.length} string placeholder(s) in ${filePath}. Requesting Gemini via agy...`);

  const spec = {};
  matches.forEach((m, idx) => {
    spec[`item_${idx}`] = {
      description: m.description,
      language: m.langOverride || defaultLang || 'infer from context or instructions',
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

  const response = await runAgy(prompt, model, effort);
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
      throw new Error(`Failed to parse Gemini response as JSON: ${response}`);
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

async function handleJsonStrings(specPath, outputPath, model, effort, defaultLang) {
  if (!fs.existsSync(specPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  const specContent = fs.readFileSync(specPath, 'utf-8');
  const langDirective = defaultLang ? `Target language: ${defaultLang}` : 'Target language: As specified in keys or English by default.';

  const prompt = `You are an expert technical writer and UI localization specialist.
Below is a JSON specification of keys and their context/descriptions.
Generate production-ready copy for every key.
${langDirective}
Return ONLY a valid JSON object matching the input structure, without markdown code fences or explanatory text.

Input specification:
${specContent}
`;

  console.log(`[just-code-claude] Generating UI strings via Gemini (agy)...`);
  const response = await runAgy(prompt, model, effort);
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
      await handleReplaceInFile(options.replaceInFile, options.model, options.effort, options.lang);
      return;
    }

    if (options.jsonStrings) {
      await handleJsonStrings(options.jsonStrings, options.output, options.model, options.effort, options.lang);
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

    const output = await runAgy(promptText, options.model, options.effort);

    if (options.output) {
      const dir = path.dirname(options.output);
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(options.output, output, 'utf-8');
      console.log(`[just-code-claude] Gemini output successfully written to: ${options.output}`);
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
