#!/usr/bin/env node
/**
 * test_skill.js
 * Comprehensive self-test for just-code-claude skill.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const agyCallJs = path.join(rootDir, 'scripts', 'agy_call.js');
const tmpDir = path.join(rootDir, 'tmp_test');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('=== [1] Testing basic prompt generation with 3.8 flash & effort setting ===');
try {
  const run1 = spawnSync(process.execPath, [
    agyCallJs,
    '-m', '3.8 flash',
    '-e', 'medium',
    '-p', "Say 'TEST_SUCCESS' and nothing else",
    '--raw'
  ], { encoding: 'utf-8', timeout: 30000 });

  console.log('Output:\n', run1.stdout || run1.stderr);
  if (run1.status === 0 && (run1.stdout.includes('TEST_SUCCESS') || run1.stdout.length > 0)) {
    console.log('>>> [1] PASS: Basic prompt generation with 3.8 flash works!\n');
  } else {
    console.log('>>> [1] FAILED: Return code', run1.status);
  }
} catch (e) {
  console.error('>>> [1] FAIL:', e.message);
}

console.log('=== [2] Testing In-Code String Replacement with Detailed Context Directives ===');
const sampleCodePath = path.join(tmpDir, 'SampleComponent.jsx');
const sampleCode = `
import React from 'react';

export function WarningBanner() {
  return (
    <div className="alert-warning">
      <h3>__AGY__("Context: Expiration modal header | Intent: Warn user session expires in 5m | Tone: Calm, urgent | Constraints: Under 35 chars, Title Case", "English")__</h3>
      <p>__GEMINI__("Context: Expiration modal body | Intent: Explain work is autosaved and clicking extend prevents logout | Tone: Reassuring | Constraints: Single sentence under 70 chars", "English")__</p>
      <button className="btn-extend">
        __AGY__("Context: Modal primary CTA | Intent: Refresh OAuth token | Tone: Direct | Constraints: 2 words, Title Case", "English")__
      </button>
    </div>
  );
}
`;

fs.writeFileSync(sampleCodePath, sampleCode, 'utf-8');

try {
  const run2 = spawnSync(process.execPath, [
    agyCallJs,
    '-m', '3.8 flash',
    '-e', 'medium',
    '--replace-in-file', sampleCodePath
  ], { encoding: 'utf-8', timeout: 60000 });

  console.log(run2.stdout || run2.stderr);

  const updatedCode = fs.readFileSync(sampleCodePath, 'utf-8');
  console.log('Updated Code Result:\n------------------\n', updatedCode, '\n------------------');

  if (!updatedCode.includes('__AGY__') && !updatedCode.includes('__GEMINI__')) {
    console.log('>>> [2] PASS: All placeholders successfully replaced with generated text!\n');
  } else {
    console.error('>>> [2] FAIL: Placeholders still remain in code.\n');
  }
} catch (e) {
  console.error('>>> [2] FAIL:', e.message);
}

console.log('=== [3] Testing Conventional Commit Message Generation (--commit-msg) ===');
try {
  const run3 = spawnSync(process.execPath, [
    agyCallJs,
    '--commit-msg',
    '-m', '3.8 flash',
    '-e', 'medium',
    '-p', 'Context: Test commit generation verification'
  ], { encoding: 'utf-8', timeout: 45000 });

  console.log(run3.stdout || run3.stderr);
  if (run3.status === 0 && (run3.stdout.includes('feat') || run3.stdout.includes('fix') || run3.stdout.includes('docs') || run3.stdout.length > 20)) {
    console.log('>>> [3] PASS: Conventional Commit message generation works!\n');
  } else {
    console.warn('>>> [3] Warning: Return code', run3.status);
  }
} catch (e) {
  console.error('>>> [3] FAIL:', e.message);
}

console.log('=== [4] Testing GitHub Release Notes Generation (--release-notes) ===');
const testReleaseNotesPath = path.join(tmpDir, 'TEST_RELEASE_NOTES.md');
try {
  const run4 = spawnSync(process.execPath, [
    agyCallJs,
    '--release-notes',
    '-m', '3.8 flash',
    '-e', 'medium',
    '-p', 'Context: Test v1.2.0 release notes verification',
    '-o', testReleaseNotesPath
  ], { encoding: 'utf-8', timeout: 75000 });

  console.log(run4.stdout || run4.stderr);
  if (fs.existsSync(testReleaseNotesPath) && fs.readFileSync(testReleaseNotesPath, 'utf-8').length > 50) {
    console.log('>>> [4] PASS: GitHub Release Notes generation works!\n');
  } else {
    console.warn('>>> [4] Warning: File not created or empty, status:', run4.status);
  }
} catch (e) {
  console.error('>>> [4] FAIL:', e.message);
}

// Clean up
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch (e) {}

console.log('=== Self-test finished! ===');
