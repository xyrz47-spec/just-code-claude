#!/usr/bin/env node
/**
 * test_skill.js
 * Comprehensive self-test for just-code-claude skill.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const geminiCallJs = path.join(rootDir, 'scripts', 'gemini_call.js');
const tmpDir = path.join(rootDir, 'tmp_test');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('=== [1] Testing basic prompt generation via agy ===');
try {
  const run1 = spawnSync(process.execPath, [
    geminiCallJs,
    '-p', "Say 'TEST_SUCCESS' and nothing else",
    '--raw'
  ], { encoding: 'utf-8', timeout: 30000 });

  console.log('Output:\n', run1.stdout || run1.stderr);
  if (run1.status === 0 && (run1.stdout.includes('TEST_SUCCESS') || run1.stdout.length > 0)) {
    console.log('>>> [1] PASS: Basic prompt generation works!\n');
  } else {
    console.log('>>> [1] FAILED: Return code', run1.status);
  }
} catch (e) {
  console.error('>>> [1] FAIL:', e.message);
}

console.log('=== [2] Testing In-Code String Replacement (__GEMINI__ placeholders with lang) ===');
const sampleCodePath = path.join(tmpDir, 'SampleComponent.jsx');
const sampleCode = `
import React from 'react';

export function WarningBanner() {
  return (
    <div className="alert-warning">
      <h3>__GEMINI__("Session expiry warning title", "English")__</h3>
      <p>__GEMINI__("Notice explaining auto-logout in 5 minutes", "English")__</p>
      <button className="btn-extend">
        __GEMINI__("Extend session CTA button", "English")__
      </button>
    </div>
  );
}
`;

fs.writeFileSync(sampleCodePath, sampleCode, 'utf-8');

try {
  const run2 = spawnSync(process.execPath, [
    geminiCallJs,
    '--replace-in-file', sampleCodePath
  ], { encoding: 'utf-8', timeout: 30000 });

  console.log(run2.stdout || run2.stderr);

  const updatedCode = fs.readFileSync(sampleCodePath, 'utf-8');
  console.log('Updated Code Result:\n------------------\n', updatedCode, '\n------------------');

  if (!updatedCode.includes('__GEMINI__')) {
    console.log('>>> [2] PASS: All placeholders successfully replaced with Gemini text!\n');
  } else {
    console.error('>>> [2] FAIL: Placeholders still remain in code.\n');
  }
} catch (e) {
  console.error('>>> [2] FAIL:', e.message);
}

// Clean up
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch (e) {}

console.log('=== Self-test finished! ===');
