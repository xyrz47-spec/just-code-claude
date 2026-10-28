#!/usr/bin/env python3
"""
gemini_call.py
Python CLI wrapper that invokes Gemini via 'agy' CLI for the just-code-claude skill.
Zero external dependencies (uses standard library: subprocess, sys, os, re, json, argparse).
"""

import argparse
import json
import os
import re
import subprocess
import sys


def find_agy_executable() -> str:
    if sys.platform == "win32":
        local_app_data = os.environ.get("LOCALAPPDATA") or os.path.join(os.environ.get("USERPROFILE", ""), "AppData", "Local")
        default_agy_path = os.path.join(local_app_data, "agy", "bin", "agy.exe")
        if os.path.exists(default_agy_path):
            return default_agy_path
        return "agy.exe"
    return "agy"


def run_agy(prompt_text: str, model: str = "gemini-3.8-flash-high", effort: str = None) -> str:
    agy_bin = find_agy_executable()
    cmd = [agy_bin, "-p", prompt_text, "--model", model, "--dangerously-skip-permissions"]

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
        raise RuntimeError(f"agy exited with code {proc.returncode}: {err_msg}")

    return proc.stdout.strip()


def clean_code_block(text: str) -> str:
    match = re.match(r"^```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)\s*```$", text.strip())
    if match:
        return match.group(1).strip()
    return text.strip()


def handle_replace_in_file(file_path: str, model: str, effort: str = None, default_lang: str = None):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern: __GEMINI__("prompt"[, "lang"])
    pattern = re.compile(r'(?:__GEMINI__|GEMINI_TEXT|GEMINI_STR|__GEMINI_TEXT__)\(\s*(["\'])([\s\S]*?)\1(?:\s*,\s*(["\'])([\s\S]*?)\3)?\s*\)(?:__)?')
    matches = list(pattern.finditer(content))

    if not matches:
        print(f"[just-code-claude] No __GEMINI__ or GEMINI_TEXT placeholders found in {file_path}")
        return

    print(f"[just-code-claude] Found {len(matches)} string placeholder(s) in {file_path}. Requesting Gemini via agy...")

    spec = {
        f"item_{i}": {
            "description": m.group(2),
            "language": m.group(4) or default_lang or "infer from context or instructions"
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

    response = run_agy(prompt, model, effort)
    clean_json = clean_code_block(response)

    try:
        parsed = json.loads(clean_json)
    except Exception:
        first_b = clean_json.find("{")
        last_b = clean_json.rfind("}")
        if first_b != -1 and last_b != -1:
            parsed = json.loads(clean_json[first_b:last_b + 1])
        else:
            raise ValueError(f"Failed to parse Gemini response as JSON: {response}")

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


def handle_json_strings(spec_path: str, output_path: str, model: str, effort: str = None, default_lang: str = None):
    if not os.path.exists(spec_path):
        raise FileNotFoundError(f"Spec file not found: {spec_path}")

    with open(spec_path, "r", encoding="utf-8") as f:
        spec_content = f.read()

    lang_directive = f"Target language: {default_lang}" if default_lang else "Target language: As specified in keys or English by default."

    prompt = f"""You are an expert technical writer and UI localization specialist.
Below is a JSON specification of keys and their context/descriptions.
Generate production-ready copy for every key.
{lang_directive}
Return ONLY a valid JSON object matching the input structure, without markdown code fences or explanatory text.

Input specification:
{spec_content}
"""

    print("[just-code-claude] Generating UI strings via Gemini (agy)...")
    response = run_agy(prompt, model, effort)
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
    parser = argparse.ArgumentParser(description="Invoke Gemini via 'agy' for just-code-claude skill.")
    parser.add_argument("-p", "--prompt", help="Direct prompt text to send to Gemini")
    parser.add_argument("-f", "--file", help="Read prompt/context from a file")
    parser.add_argument("-o", "--output", help="Write Gemini's output to a file")
    parser.add_argument("-m", "--model", default="gemini-3.8-flash-high", help="Gemini model")
    parser.add_argument("-l", "--lang", help="Target output language (e.g. English, Korean, Japanese, Spanish)")
    parser.add_argument("-s", "--system", help="System prompt instructions")
    parser.add_argument("--effort", choices=["low", "medium", "high", "xhigh", "max"], help="Reasoning effort")
    parser.add_argument("--replace-in-file", help="In-place replacement of __GEMINI__ or GEMINI_TEXT in code file")
    parser.add_argument("--json-strings", help="Generate copy for a JSON map of keys -> descriptions")
    parser.add_argument("--raw", action="store_true", help="Print raw text without extra formatting")

    args = parser.parse_args()

    if args.replace_in_file:
        handle_replace_in_file(args.replace_in_file, args.model, args.effort, args.lang)
        return

    if args.json_strings:
        handle_json_strings(args.json_strings, args.output, args.model, args.effort, args.lang)
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

    output = run_agy(prompt_text, args.model, args.effort)

    if args.output:
        out_dir = os.path.dirname(args.output)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[just-code-claude] Gemini output successfully written to: {args.output}")
    else:
        if args.raw:
            sys.stdout.write(output)
        else:
            print(output)


if __name__ == "__main__":
    main()
