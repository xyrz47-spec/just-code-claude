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

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-7C3AED.svg)](https://anthropic.com)
[![Dual Backend](https://img.shields.io/badge/Backend-Antigravity%20CLI%20%7C%20Gemini%20API-4285F4.svg)](https://google.com)

> **"Claude는 코드를 짜고, Gemini는 글을 씁니다."**  
> 엄격한 분업을 강제하는 **Claude Code 전용 스킬**: Claude는 코드 아키텍처, 알고리즘, 로직 작성에 전념하고, 모든 자연어 텍스트 산출물(문서, README, 커밋 메시지 및 코드 안의 `""` 문자열 리터럴)은 **Antigravity CLI (`agy`)** 또는 **Google Gemini 공식 REST API**를 통해 **Google Gemini**가 전담 생성합니다.

---

## 📑 목차

- [왜 just-code-claude인가?](#-왜-just-code-claude인가)
- [동작 원리](#-동작-원리)
- [사전 요구 사항](#-사전-요구-사항)
- [설치 가이드](#-설치-가이드)
  - [방법 1: 글로벌 Claude Code 스킬로 설치 (권장)](#방법-1-글로벌-claude-code-스킬로-설치-권장)
  - [방법 2: 프로젝트 단위 스킬로 설치](#방법-2-프로젝트-단위-스킬로-설치)
- [설정 및 백엔드](#-설정-및-백엔드)
  - [백엔드 1: Antigravity CLI (`agy`)](#백엔드-1-antigravity-cli-agy)
  - [백엔드 2: Google Gemini 공식 REST API](#백엔드-2-google-gemini-공식-rest-api)
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

## 🌟 왜 `just-code-claude`인가?

Claude는 가장 뛰어난 코딩 AI 중 하나로 소프트웨어 아키텍처, 복잡한 상태 관리, AST 조작, 타입 설계에 매우 탁월합니다. 하지만 많은 엔지니어들은 자연스럽고 사용자 친화적인 카피, 현지화된 안내 문구, 세심한 에러 메시지 및 기술 문서를 작성할 때 **Google Gemini**를 선호합니다.

`just-code-claude`는 이러한 강점을 결합하여 자동화된 분업 체계를 구축합니다:

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
                   │                       (agy CLI 또는 Gemini REST API)
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

- **Claude의 영역**: 시스템 아키텍처, 로직, 알고리즘, 상태 관리, 타입, 테스트 코드, 버그 수정 및 CLI 스크립트 오케스트레이션.
- **Gemini의 영역**: 기술 문서 작성, README, 릴리즈 노트, 커밋 메시지 및 사람이 읽는 모든 따옴표(`""`, `''`) 안의 텍스트 리터럴.

---

## ⚙️ 사전 요구 사항

텍스트 생성 스크립트를 실행하려면 다음이 필요합니다:

- **런타임**: [Node.js](https://nodejs.org) (v18 이상 권장) 또는 [Python](https://python.org) (v3.8 이상).
- **실행 백엔드** (둘 중 하나 선택):
  1. **Antigravity CLI (`agy`)**: 설치 및 인증되어 있는 경우 별도의 API 키 없이 즉시 동작합니다.
  2. **Google Gemini API Key**: `agy`가 없는 환경에서는 [Google AI Studio](https://aistudio.google.com/)에서 발급받은 `GEMINI_API_KEY` (또는 `GOOGLE_API_KEY`) 환경변수를 등록하기만 하면 됩니다.

> **참고**: `scripts/agy_call.js`와 `scripts/agy_call.py`는 **외부 패키지 의존성이 전혀 없습니다 (Zero Dependencies)**. Node.js 내장 `fetch` 및 Python 내장 `urllib.request`를 사용하므로 별도의 `npm install`이나 `pip install` 과정이 필요하지 않습니다.

---

## 📦 설치 가이드

### 방법 1: 글로벌 Claude Code 스킬로 설치 (권장)

글로벌로 설치하면 시스템의 **모든** Claude Code 세션에서 `/just-code-claude` 명령어를 즉시 사용할 수 있습니다.

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

설치 스크립트가 해당 스킬을 `~/.claude/skills/just-code-claude/` 디렉터리에 자동으로 배포합니다.

---

### 방법 2: 프로젝트 단위 스킬로 설치

특정 프로젝트 저장소 내에서만 스킬을 사용하고 싶은 경우:

```bash
mkdir -p .claude/skills/just-code-claude
cp -r path/to/just-code-claude/* .claude/skills/just-code-claude/
```

---

## 🔌 설정 및 백엔드

`just-code-claude`는 환경에 따라 자동으로 최적의 백엔드를 감지하는 **듀얼 백엔드**를 지원합니다:

### 백엔드 1: Antigravity CLI (`agy`)
시스템에 Antigravity CLI가 설치되어 있는 경우:
- 자동으로 감지되어 실행됩니다.
- API 키 설정이 필요 없습니다.
- 기본적으로 `--model gemini-3.8-flash-high`를 사용합니다 (필요 시 `gemini-4-argon-high` 지정 가능).

### 백엔드 2: Google Gemini 공식 REST API
직접 클라우드 API를 호출하거나 `agy` CLI가 없는 CI/CD 환경에서 실행할 경우:
1. [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받습니다.
2. 환경변수를 등록합니다:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. 또는 CLI 실행 시 직접 전달할 수도 있습니다: `--api-key "your-key"`.
4. 기본 모델로 `gemini-2.5-flash`를 사용합니다 (`-m` 플래그로 변경 가능).

---

## 🚀 사용법 및 워크플로우

### 1. Claude Code에서 스킬 활성화

Claude Code 대화창에서 명령어를 입력합니다:
```text
/just-code-claude
```
또는 자연어로 지시합니다:
```text
just-code-claude 모드로 작업해줘. 코드 아키텍처와 로직은 네가 짜고, 모든 텍스트 산출물과 UI 카피는 agy를 호출해서 작성해.
```

---

### 2. 코드 내 문자열 치환 워크플로우

#### 1단계: Claude가 플레이스홀더를 포함해 코드 작성
Claude는 로직과 JSX/HTML 구조를 작성하고, 사용자에게 노출될 텍스트 자리에 `__AGY__("지시사항"[, "목표언어"])` 또는 `__GEMINI__("지시사항"[, "목표언어"])` 형태의 플레이스홀더를 배치합니다:

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
*(Python 사용 환경: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### 3단계: 완성된 프로덕션 코드
모든 플레이스홀더가 Gemini가 생성한 정제된 텍스트 리터럴로 즉시 치환됩니다:
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

모든 기술 문서, README, 사용자 가이드 작성을 Gemini에게 위임합니다:

```bash
# Antigravity CLI 사용 (기본 자동 감지)
node scripts/agy_call.js -p "우리 REST 엔드포인트에 대한 시작 가이드 문서를 한국어로 작성해줘" -o docs/API_GUIDE.md

# Gemini API 모드 명시적 사용
node scripts/agy_call.js -p "시스템 아키텍처 개요 문서 작성해줘" -b api -o ARCHITECTURE.md

# agy CLI 직접 호출
agy -p "프로젝트 README 개요 작성해줘" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
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
  1. Antigravity CLI (agy): 설치되어 있으면 자동 감지되어 우선 실행.
  2. Direct Gemini API: GEMINI_API_KEY 환경변수가 설정되어 있거나 agy를 찾을 수 없을 때 자동 실행.

옵션:
  -p, --prompt <text>          생성할 프롬프트 텍스트
  -f, --file <path>            파일에서 프롬프트/문맥 읽기
  -o, --output <path>          생성된 결과를 지정된 파일로 저장
  -b, --backend <mode>         백엔드 엔진 선택: 'auto' (기본값), 'agy', 또는 'api'
  -m, --model <name>           모델 지정 (agy 기본값: gemini-3.8-flash-high, api 기본값: gemini-2.5-flash)
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
├── SKILL.md                 # Claude Code 전용 스킬 정의 및 엄격한 분업 규칙 가이드
├── README.md                # 영문 공식 문서
├── README.ko.md             # 한국어 공식 문서
├── package.json             # NPM 패키지 설정 파일
├── install.ps1              # Windows PowerShell 원클릭 설치 스크립트
├── install.sh               # Linux/macOS 원클릭 설치 스크립트
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
