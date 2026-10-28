# Just Code, Claude! 💻🚫✍️

<p align="left">
  <a href="README.md"><b>English</b></a> •
  <a href="README.ko.md"><b>한국어</b></a> •
  <a href="README.ja.md"><b>日本語</b></a> •
  <a href="README.zh-CN.md"><b>简体中文</b></a> •
  <a href="README.es.md"><b>Español</b></a> •
  <a href="README.fr.md"><b>Français</b></a> •
  <a href="README.de.md"><b>Deutsch</b></a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Target: Claude Code](https://img.shields.io/badge/Agent-Claude%20Code-7C3AED.svg)](https://github.com/xyrz47-spec/just-code-claude)
[![Powered by: Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4.svg)](https://aistudio.google.com/)

> **"Claude는 코드를 짜고, Gemini는 글을 씁니다."**  
> Claude Code를 위한 오픈소스 **엔지니어링 분업 스킬**: Claude는 코드 아키텍처와 로직 작성에 집중하고, 모든 자연어 텍스트 산출물(문서, README, 커밋 메시지 및 코드 내 `""` 문자열 리터럴)은 **Google Gemini REST API** 또는 **Antigravity CLI (`agy`)**를 통해 **Google Gemini**에 위임하여 생성합니다.

---

## 📑 목차

- [기획 의도 및 설계 철학](#-기획-의도-및-설계-철학)
- [동작 원리](#-동작-원리)
- [사전 요구 사항](#-사전-요구-사항)
- [설치 가이드](#-설치-가이드)
  - [추천: `npx skills`를 통한 원클릭 설치](#추천-npx-skills를-통한-원클릭-설치)
  - [대안: Git Clone을 통한 설치](#대안-git-clone을-통한-설치)
- [설정 및 실행 백엔드](#-설정-및-실행-백엔드)
  - [백엔드 1: Google Gemini 공식 REST API (범용 표준)](#백엔드-1-google-gemini-공식-rest-api-범용-표준)
  - [백엔드 2: Antigravity CLI (`agy`)](#백엔드-2-antigravity-cli-agy)
- [사용법 및 워크플로우](#-사용법-및-워크플로우)
  - [1. Claude Code에서 스킬 활성화](#1-claude-code에서-스킬-활성화)
  - [2. 코드 내 문자열 치환 워크플로우](#2-코드-내-문자열-치환-워크플로우)
  - [3. 문서 및 마크다운 생성 워크플로우](#3-문서-및-마크다운-생성-워크플로우)
  - [4. UI 다국어(i18n) 일괄 생성 워크플로우](#4-ui-다국어i18n-일괄-생성-워크플로우)
  - [5. Git 커밋 및 PR 메시지 작성 워크플로우](#5-git-커밋-및-pr-메시지-작성-워크플로우)
- [CLI 명령어 레퍼런스](#-cli-명령어-레퍼런스)
- [동작 검증 및 테스트](#-동작-검증-및-테스트)
- [저장소 구조](#-저장소-구조)
- [라이선스](#-라이선스)

---

## 🌟 기획 의도 및 설계 철학

현대 AI 보조 개발 환경에서 모델마다 각각의 특화된 강점이 있습니다:
- **Claude**: 복잡한 소프트웨어 아키텍처, AST 조작, TypeScript 타입 시스템, 정밀한 알고리즘 설계에 탁월합니다.
- **Google Gemini**: 다국어 표현의 유려함, 친절한 사용자 대상 문구 작성, 빠른 텍스트 생성 속도를 제공합니다.

`just-code-claude`는 이러한 두 모델의 특성을 결합하여 자동화된 분업 워크플로우를 제공합니다:

```
                       ┌──────────────────────────────┐
                       │          사용자 요청          │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
          [ 코드 로직 및 아키텍처 ]               [ 자연어 및 텍스트 카피 ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                       (Gemini API 또는 agy CLI)
                   ▼                                     ▼
        함수, 타입, 상태, AST                  공식 문서, UI 버튼 라벨,
      및 플레이스홀더 (__AGY__)                에러 알림 메시지 및 안내문
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │       완성된 프로덕션 코드    │
                       └──────────────────────────────┘
```

- **Claude의 작업 영역**: 시스템 아키텍처, 로직, 알고리즘, 상태 관리, 타입 정의, 테스트 코드, 버그 수정 및 생성 도구 실행.
- **Gemini의 작업 영역**: 기술 문서 작성, README, 릴리즈 노트, 커밋 메시지 및 사용자가 읽는 코드 내 따옴표(`""`, `''`) 안의 텍스트 리터럴.

> **분업 통제에 대한 안내**: 본 프로젝트는 컴파일러나 OS 레벨의 강제 샌드박스가 아닌, Claude Code 스킬 명세(`SKILL.md`)를 통해 AI 에이전트에게 체계적인 분업 행동 지침을 제공하는 **프롬프트 기반 워크플로우 디렉티브**입니다.

---

## ⚙️ 사전 요구 사항

텍스트 생성 스크립트를 실행하려면 다음이 필요합니다:

- **런타임**: [Node.js](https://nodejs.org) (v18 이상) 또는 [Python](https://python.org) (v3.8 이상).
- **실행 백엔드** (둘 중 하나 선택):
  1. **Google Gemini API Key (범용 표준)**: [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받아 `GEMINI_API_KEY` 환경변수로 등록합니다.
  2. **Antigravity CLI (`agy`)**: Antigravity 환경이 설치되어 있고 `agy` CLI 인증이 완료되어 있는 경우 별도의 API 키 없이 자동 감지되어 동작합니다.

> **Zero Dependencies**: `scripts/agy_call.js`(Node.js 내장 `fetch`)와 `scripts/agy_call.py`(Python 표준 라이브러리 `urllib.request`)는 **외부 패키지 의존성이 전혀 없습니다**. `npm install`이나 `pip install` 과정이 필요하지 않습니다.

---

## 📦 설치 가이드

### 추천: `npx skills`를 통한 원클릭 설치

오픈 에이전트 스킬 표준 도구인 [skills](https://skills.sh/)를 사용하면 직접 clone할 필요 없이 가장 간편하게 설치할 수 있습니다:

```bash
# Claude Code에 글로벌로 설치 (검증 완료)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# 또는 현재 프로젝트에만 로컬로 설치
npx skills add xyrz47-spec/just-code-claude -a claude-code
```

---

### 대안: Git Clone을 통한 설치

#### Windows (PowerShell):
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### Linux / macOS (Bash):
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

설치 스크립트가 해당 스킬 파일을 `~/.claude/skills/just-code-claude/` 디렉터리에 복사합니다.

---

## 🔌 설정 및 실행 백엔드

보조 CLI 스크립트는 두 가지 백엔드를 지원하며 환경에 따라 자동 감지합니다:

### 백엔드 1: Google Gemini 공식 REST API (범용 표준)
일반 개발자 및 CI/CD 환경에서 권장되는 표준 방식입니다:
1. [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받습니다.
2. 환경변수를 등록합니다:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. 기본 모델: `gemini-2.5-flash` (`-m` 플래그로 `gemini-2.0-flash` 등 변경 가능).

### 백엔드 2: Antigravity CLI (`agy`)
Antigravity 개발 환경을 사용하는 개발자를 위한 방식입니다:
- 시스템의 `PATH` 또는 기본 설치 경로에 `agy`가 있으면 자동 감지됩니다.
- 로컬 Antigravity CLI 인증을 그대로 사용합니다.
- 기본 모델: `gemini-3.8-flash-high` (Antigravity 환경 모델).

---

## 🚀 사용법 및 워크플로우

### 1. Claude Code에서 스킬 활성화

Claude Code 대화창에서 명령어를 입력합니다:
```text
/just-code-claude
```
또는 자연어로 지시합니다:
```text
just-code-claude 모드로 작업해줘. 코드 아키텍처와 로직은 네가 짜고, 모든 텍스트 산출물과 UI 카피는 Gemini를 호출해서 작성해.
```

---

### 2. 코드 내 문자열 치환 워크플로우

#### 1단계: Claude가 플레이스홀더를 포함해 코드 작성
Claude는 컴포넌트 구조와 로직을 작성하고, 텍스트 자리에 `__AGY__("지시사항"[, "목표언어"])` 또는 `__GEMINI__("지시사항"[, "목표언어"])` 형태의 플레이스홀더를 배치합니다:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("세션 만료 경고 제목", "Korean")__</h3>
      <p>__AGY__("5분 후 자동 로그아웃 안내 및 세션 연장 권장 설명", "Korean")__</p>
      <button onClick={onExtend}>
        __AGY__("세션 연장하기 버튼 문구", "Korean")__
      </button>
    </div>
  );
}
```

#### 2단계: 자동 치환 스크립트 실행
Claude가 터미널에서 번들된 CLI 스크립트를 실행합니다:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Python 사용 시: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### 3단계: 완성된 프로덕션 코드
모든 플레이스홀더가 Gemini가 생성한 정제된 텍스트로 즉시 치환됩니다:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"로그인 세션이 곧 만료됩니다"</h3>
      <p>"보안을 위해 5분 후 자동으로 로그아웃됩니다. 계속 작업하시려면 세션을 연장해 주세요."</p>
      <button onClick={onExtend}>
        "세션 연장하기"
      </button>
    </div>
  );
}
```

---

### 3. 문서 및 마크다운 생성 워크플로우

기술 문서, README, 사용자 가이드 작성을 Gemini에게 위임합니다:

```bash
# Gemini REST API 사용
node scripts/agy_call.js -p "우리 REST 엔드포인트에 대한 시작 가이드 문서를 한국어로 작성해줘" -b api -o docs/API_GUIDE.md

# agy CLI 사용 (설치되어 있는 경우)
node scripts/agy_call.js -p "시스템 아키텍처 개요 문서 작성해줘" -b agy -o ARCHITECTURE.md
```

---

### 4. UI 다국어(i18n) 일괄 생성 워크플로우

키와 설명이 포함된 명세 파일 `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "로그인을 진행하는 주요 실행 버튼",
    "forgot_password": "비밀번호 재설정 페이지 링크",
    "password_hint": "비밀번호는 최소 8자리 이상이어야 한다는 안내 힌트"
  }
}
```

원하는 언어로 번역/생성된 사전 파일을 일괄 제작합니다:
```bash
# 스페인어 로케일 생성
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# 한국어 로케일 생성
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/ko.json --lang Korean
```

---

### 5. Git 커밋 및 PR 메시지 작성 워크플로우

커밋 메시지나 PR 설명을 작성할 때:

```bash
# 1. 스테이징된 변경사항 캡처
git diff --staged > .git_diff.tmp

# 2. Conventional Commits 형식으로 메시지 생성 요청
node scripts/agy_call.js -f .git_diff.tmp -p "위 diff를 분석하여 50자 이내의 제목과 상세 본문을 갖춘 Conventional Commits 메시지를 작성해줘. 언어: 한국어" -o .commit_msg.tmp

# 3. 생성된 메시지로 커밋
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 CLI 명령어 레퍼런스

```text
Usage: node scripts/agy_call.js [options]
   or: python scripts/agy_call.py [options]

듀얼 백엔드 실행:
  1. Direct Gemini API: GEMINI_API_KEY 환경변수가 설정되어 있거나 -b api 지정 시 사용.
  2. Antigravity CLI (agy): 로컬 머신에 agy가 설치되어 있을 때 자동 감지되어 사용.

옵션:
  -p, --prompt <text>          생성할 프롬프트 텍스트
  -f, --file <path>            파일에서 프롬프트/문맥 읽기
  -o, --output <path>          생성된 결과를 지정된 파일로 저장
  -b, --backend <mode>         백엔드 엔진 선택: 'auto' (기본값), 'api', 또는 'agy'
  -m, --model <name>           모델 지정 (api 기본값: gemini-2.5-flash, agy 기본값: gemini-3.8-flash-high)
  --api-key <key>              Google Gemini API 키 (또는 GEMINI_API_KEY 환경변수)
  -l, --lang <language>        출력 대상 언어 (예: English, Korean, Japanese, Spanish)
  -s, --system <text>          프롬프트 앞에 붙일 시스템 지시문
  --effort <level>             agy 전용 추론 강도 (low, medium, high)
  --replace-in-file <path>     코드 파일 내 __AGY__("...") 또는 __GEMINI__("...") 플레이스홀더를 찾아
                               현지화된 완성본 텍스트로 즉시 인플레이스 치환
  --json-strings <path>        키-설명 구조의 JSON 맵을 읽어 텍스트 카피 일괄 생성
  --raw                        부가 서식 없이 순수 텍스트만 출력
  -h, --help                   도움말 출력
```

---

## 🧪 동작 검증 및 테스트

텍스트 생성 및 코드 내 플레이스홀더 치환 기능이 정상 작동하는지 자체 검증합니다:

```bash
npm test
# 또는
node scripts/test_skill.js
```

---

## 📁 저장소 구조

```
just-code-claude/
├── SKILL.md                 # Claude Code 전용 스킬 정의 및 분업 지침
├── README.md                # 영문 공식 문서
├── README.ko.md             # 한국어 공식 문서
├── README.ja.md             # 일본어 공식 문서
├── README.zh-CN.md          # 중국어(간체) 공식 문서
├── README.es.md             # 스페인어 공식 문서
├── README.fr.md             # 프랑스어 공식 문서
├── README.de.md             # 독일어 공식 문서
├── package.json             # NPM 패키지 설정 파일
├── install.ps1              # Windows PowerShell 설치 스크립트
├── install.sh               # Linux/macOS 설치 스크립트
├── scripts/
│   ├── agy_call.js          # Node.js 듀얼 백엔드 러너 (외부 의존성 0개)
│   ├── agy_call.py          # Python 듀얼 백엔드 러너 (표준 라이브러리 전용)
│   └── test_skill.js        # 엔드투엔드 자동화 검증 테스트 스위트
├── examples/
│   ├── before_code.tsx      # __AGY__ 플레이스홀더가 포함된 코드 예시
│   └── ui_spec.json         # 다국어 사전 생성용 명세 예시
└── templates/
    └── prompt_templates.md  # UX 카피 및 문서화 프롬프트 템플릿
```

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)에 따라 자유롭게 사용 및 수정할 수 있습니다.
