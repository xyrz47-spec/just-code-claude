#!/usr/bin/env python3
"""
agy_call.py
Unified text generation CLI for just-code-claude skill.

Supports two backends:
 1. Antigravity CLI ('agy') - Pre-authenticated local agent CLI
 2. Direct Google Gemini REST API - Uses GEMINI_API_KEY or GOOGLE_API_KEY

Zero external dependencies (uses standard library: urllib.request, subprocess, sys, os, re, json, argparse).
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request


def find_agy_executable() -> str:
    if sys.platform == "win32":
        local_app_data = os.environ.get("LOCALAPPDATA") or os.path.join(os.environ.get("USERPROFILE", ""), "AppData", "Local")
        default_agy_path = os.path.join(local_app_data, "agy", "bin", "agy.exe")
        if os.path.exists(default_agy_path):
            return default_agy_path
        return "agy.exe"
    return "agy"


def run_agy_cli(prompt_text: str, model: str = None, effort: str = None) -> str:
    agy_bin = find_agy_executable()
    chosen_model = model or "gemini-3.8-flash-high"
    cmd = [agy_bin, "-p", prompt_text, "--model", chosen_model, "--dangerously-skip-permissions"]

    if effort:
        cmd.extend(["--effort", effort])

    proc = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    if proc.returncode != 0:
        err_msg = proc.stderr.strip() or proc.stdout.strip()
        raise RuntimeError(f"agy CLI exited with code {proc.returncode}: {err_msg}")

    return proc.stdout.strip()


def run_gemini_api(prompt_text: str, api_key: str, model: str = None) -> str:
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set. Please provide --api-key or set GEMINI_API_KEY in your environment.")

    chosen_model = model or "gemini-2.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{chosen_model}:generateContent?key={urllib.parse.quote(api_key)}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req) as resp:
            resp_body = resp.read().decode("utf-8")
            data = json.loads(resp_body)
            candidates = data.get("candidates", [])
            if not candidates or "content" not in candidates[0]:
                raise ValueError(f"Gemini API returned unexpected response: {resp_body}")
            parts = candidates[0]["content"].get("parts", [])
            if not parts or "text" not in parts[0]:
                raise ValueError(f"No text part found in Gemini API response: {resp_body}")
            return parts[0]["text"].strip()
    except urllib.error.HTTPError as e:
        err_content = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini API HTTP {e.code}: {err_content}")


def execute_generation(prompt_text: str, args) -> str:
    backend = args.backend

    if backend == "api":
        return run_gemini_api(prompt_text, args.api_key, args.model)

    if backend == "agy":
        return run_agy_cli(prompt_text, args.model, args.effort)

    # Auto mode:
    agy_bin = find_agy_executable()
    has_agy = (agy_bin == "agy") or os.path.exists(agy_bin)

    if has_agy:
        try:
            return run_agy_cli(prompt_text, args.model, args.effort)
        except Exception as e:
            if args.api_key:
                print(f"[just-code-claude] agy CLI failed, falling back to Direct Gemini API: {e}", file=sys.stderr)
                return run_gemini_api(prompt_text, args.api_key, args.model)
            raise e
    elif args.api_key:
        return run_gemini_api(prompt_text, args.api_key, args.model)
    else:
        raise RuntimeError("No execution backend available. Either install the 'agy' CLI or set GEMINI_API_KEY for Direct API access.")


def clean_code_block(text: str) -> str:
    match = re.match(r"^```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)\s*```$", text.strip())
    if match:
        return match.group(1).strip()
    return text.strip()


def handle_replace_in_file(file_path: str, args):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern: __AGY__("prompt"[, "lang"]) or __GEMINI__("prompt"[, "lang"])
    pattern = re.compile(r'(?:__AGY__|AGY_TEXT|__GEMINI__|GEMINI_TEXT|GEMINI_STR|__GEMINI_TEXT__)\(\s*(["\'])([\s\S]*?)\1(?:\s*,\s*(["\'])([\s\S]*?)\3)?\s*\)(?:__)?')
    matches = list(pattern.finditer(content))

    if not matches:
        print(f"[just-code-claude] No __AGY__ or __GEMINI__ placeholders found in {file_path}")
        return

    print(f"[just-code-claude] Found {len(matches)} string placeholder(s) in {file_path}. Requesting copy generation...")

    spec = {
        f"item_{i}": {
            "description": m.group(2),
            "language": m.group(4) or args.lang or "infer from context or instructions"
        }
        for i, m in enumerate(matches)
    }

    prompt = f"""You are a world-class software UI/UX copywriter and localization specialist.
Below is a JSON map of UI text placeholders requiring natural, human copy for source code.
For each item:
- Read the description and target language.
- Craft crisp, professional, production-ready copy appropriate for the user experience.
- Do NOT include surrounding quotes in the values.
- Return ONLY a valid JSON object mapping each key to its final text string. No markdown block, no extra text.

Input specification:
{json.dumps(spec, ensure_ascii=False, indent=2)}
"""

    response = execute_generation(prompt, args)
    clean_json = clean_code_block(response)

    try:
        parsed = json.loads(clean_json)
    except Exception:
        first_b = clean_json.find("{")
        last_b = clean_json.rfind("}")
        if first_b != -1 and last_b != -1:
            parsed = json.loads(clean_json[first_b:last_b + 1])
        else:
            raise ValueError(f"Failed to parse response as JSON: {response}")

    updated_content = content
    for i, m in enumerate(matches):
        key = f"item_{i}"
        quote = m.group(1)
        gen_text = parsed.get(key, m.group(2))
        escaped_text = gen_text.replace("\\", "\\\\").replace(quote, f"\\{quote}")
        replacement = f"{quote}{escaped_text}{quote}"
        updated_content = updated_content.replace(m.group(0), replacement, 1)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"[just-code-claude] Successfully replaced {len(matches)} placeholders in {file_path}!")


def handle_json_strings(spec_path: str, output_path: str, args):
    if not os.path.exists(spec_path):
        raise FileNotFoundError(f"Spec file not found: {spec_path}")

    with open(spec_path, "r", encoding="utf-8") as f:
        spec_content = f.read()

    lang_directive = f"Target language: {args.lang}" if args.lang else "Target language: As specified in keys or English by default."

    prompt = f"""You are an expert technical writer and UI localization specialist.
Below is a JSON specification of keys and their context/descriptions.
Generate production-ready copy for every key.
{lang_directive}
Return ONLY a valid JSON object matching the input structure, without markdown code fences or explanatory text.

Input specification:
{spec_content}
"""

    print("[just-code-claude] Generating UI strings...")
    response = execute_generation(prompt, args)
    clean_json = clean_code_block(response)

    if output_path:
        out_dir = os.path.dirname(output_path)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(clean_json)
        print(f"[just-code-claude] Saved generated strings to {output_path}")
    else:
        print(clean_json)


def main():
    parser = argparse.ArgumentParser(description="Unified text generation CLI for just-code-claude skill.")
    parser.add_argument("-p", "--prompt", help="Direct prompt text to generate")
    parser.add_argument("-f", "--file", help="Read prompt/context from a file")
    parser.add_argument("-o", "--output", help="Write output directly to a file")
    parser.add_argument("-b", "--backend", choices=["auto", "agy", "api"], default="auto", help="Backend engine: 'auto' (default), 'agy', or 'api'")
    parser.add_argument("-m", "--model", help="Model name (default for agy: gemini-3.8-flash-high, for api: gemini-2.5-flash)")
    parser.add_argument("--api-key", default=os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"), help="Google Gemini API key")
    parser.add_argument("-l", "--lang", help="Target output language (e.g. English, Korean, Japanese, Spanish)")
    parser.add_argument("-s", "--system", help="System prompt instructions")
    parser.add_argument("--effort", choices=["low", "medium", "high", "xhigh", "max"], help="Reasoning effort for agy")
    parser.add_argument("--replace-in-file", help="In-place replacement of __AGY__ or __GEMINI__ in code file")
    parser.add_argument("--json-strings", help="Generate copy for a JSON map of keys -> descriptions")
    parser.add_argument("--raw", action="store_true", help="Print raw text without extra formatting")

    args = parser.parse_args()

    if args.replace_in_file:
        handle_replace_in_file(args.replace_in_file, args)
        return

    if args.json_strings:
        handle_json_strings(args.json_strings, args.output, args)
        return

    prompt_text = args.prompt or ""
    if args.file:
        if not os.path.exists(args.file):
            raise FileNotFoundError(f"File not found: {args.file}")
        with open(args.file, "r", encoding="utf-8") as f:
            file_content = f.read()
        prompt_text = f"{prompt_text}\n\n{file_content}" if prompt_text else file_content

    if not prompt_text.strip():
        parser.print_help()
        sys.exit(1)

    if args.lang:
        prompt_text = f"[Target Language: {args.lang}]\n\n{prompt_text}"

    if args.system:
        prompt_text = f"[System Instructions: {args.system}]\n\n{prompt_text}"

    output = execute_generation(prompt_text, args)

    if args.output:
        out_dir = os.path.dirname(args.output)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[just-code-claude] Output successfully written to: {args.output}")
    else:
        if args.raw:
            sys.stdout.write(output)
        else:
            print(output)


if __name__ == "__main__":
    main()
