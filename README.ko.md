# 클로드는 코드만 작성해 (`just-code-claude`)

<p align="center">
  <b>클로드는 코드를 작성하고, 제미나이는 텍스트를 작성합니다.</b><br>
  엔지니어링 로직과 자연어 생성을 분리하는 자동화된 협업 워크플로우 스킬
</p>

<p align="center">
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

> **"Claude writes code. Gemini writes text."**  
> Claude Code를 위한 오픈소스 스킬: 클로드는 소프트웨어 아키텍처와 코드 로직에 집중하고, 기술 문서, README, **GitHub 커밋 메시지, PR 설명, GitHub 릴리스 노트(Changelog)**, 코드 내부의 사용자 안내 텍스트(따옴표 `""` 내부 문자열)는 **Google Gemini**(`3.8 flash` 또는 `4 argon`, 추론 노력치 설정 지원)가 **Google Gemini REST API** 또는 **Antigravity CLI(`agy`)**를 통해 생성하도록 역할을 분담합니다.

---

## 📑 목차

- [개발 동기 및 설계 철학](#-개발-동기-및-설계-철학)
- [지원 모델 및 노력치(Reasoning Effort) 설정](#-지원-모델-및-노력치reasoning-effort-설정)
- [상세 맥락 지침 (프롬프팅 표준)](#-상세-맥락-지침-프롬프팅-표준)
- [Git & GitHub 전용 연동 (커밋, PR, 릴리스)](#-git--github-전용-연동-커밋-pr-릴리스)
- [동작 원리](#-동작-원리)
- [사전 요구사항](#-사전-요구사항)
- [설치 방법](#-설치-방법)
  - [권장: `npx skills`를 통한 설치](#권장-npx-skills를-통한-설치-skillssh)
  - [대안: Git Clone을 통한 설치](#대안-git-clone을-통한-설치)
- [환경 설정 및 실행 백엔드](#-환경-설정-및-실행-백엔드)
  - [백엔드 1: Google Gemini REST API (전 세계 범용)](#백엔드-1-google-gemini-rest-api-전-세계-범용)
  - [백엔드 2: Antigravity CLI (`agy`)](#백엔드-2-antigravity-cli-agy)
- [사용법 및 주요 워크플로우](#-사용법-및-주요-워크플로우)
  - [1. Claude Code에서 스킬 활성화](#1-claude-code에서-스킬-활성화)
  - [2. 코드 내부 문자열 자동 생성 및 치환](#2-워크플로우-코드-내부-문자열-치환)
  - [3. 기술 문서 및 마크다운 생성](#3-워크플로우-기술-문서-및-마크다운-생성)
  - [4. 대량 UI 문자열 및 다국어(i18n) 현지화](#4-워크플로우-대량-ui-현지화-i18n)
  - [5. Git 커밋, PR 설명 및 GitHub 릴리스 작성](#5-워크플로우-git-커밋-pr-설명-및-github-릴리스-작성)
- [CLI 상세 옵션](#-cli-상세-옵션)
- [검증 및 테스트](#-검증-및-테스트)
- [디렉터리 구조](#-디렉터리-구조)
- [라이선스](#-라이선스)

---

## 🌟 개발 동기 및 설계 철학

현대 AI 보조 엔지니어링 환경에서 각 모델은 저마다 뛰어난 강점을 가지고 있습니다:
- **Claude**: 복잡한 소프트웨어 아키텍처, AST 분석 및 코드 조작, TypeScript 타입 시스템, 정밀한 알고리즘 설계에 최적화되어 있습니다.
- **Google Gemini**: 뛰어난 다국어 처리 능력, 자연스러운 사용자 친화적 문장 구성, 빠른 텍스트 생성 속도, 그리고 git 변경점 분석, 릴리스 체인지로그 구성, 기술 문서화에서 탁월한 이해도를 보입니다.

`just-code-claude`는 두 모델의 장점을 결합하여 자동화된 분업 워크플로우를 구현합니다:

```
                       ┌──────────────────────────────┐
                       │          개발자              │
                       │    "모달을 포함한 결제       │
                       │      플로우를 작성해줘"      │
                       └──────────────┬───────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │         Claude Code          │
                       │  (/just-code-claude 활성화)  │
                       └──────┬────────────────┬──────┘
                              │                │
        [ 코드 로직 및 아키텍처 ]              [ 자연어 및 사용자 카피 ]
                   │                                     │
              Claude Code                            Google Gemini
                   │                             (3.8 flash / 4 argon)
                   ▼                                     ▼
      함수형 컴포넌트, 훅,                  UI 버튼 라벨, 토스트 알림,
      데이터 변이, 상태 머신,                에러 메시지, 기술 문서, README,
      CSS 레이아웃 스타일링                   커밋, PR 설명, 릴리스 노트
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │    완성된 프로덕션 코드      │
                       └──────────────────────────────┘
```

---

## 🤖 지원 모델 및 노력치(Reasoning Effort) 설정

본 스킬은 2개의 공식 모델과 세부적인 추론 노력치 조절을 지원합니다:

| 모델 | CLI 별칭 | 주 사용처 | 권장 노력치 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(기본값)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 초고속 UI 카피, 버튼 라벨, 모달 대화상자, 폼 유효성 에러, 토스트 알림, Git 커밋 메시지 | `low` 또는 `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 고난도 추론, 시스템 아키텍처 문서, 상세 API 명세서, 기술 RFC, GitHub PR 설명, GitHub 릴리스 노트 | `high` 또는 `max` |

### 추론 노력치 (`-e, --effort`):
- `low`: 단순 마이크로카피, 버튼 텍스트, 단일 레이블 (지연 시간 최소화).
- `medium` *(기본값)*: 모달 안내문, 폼 검증 에러, 알림창, Git 커밋 메시지.
- `high`: 심층 기술 문서, 아키텍처 다이어그램 설명, GitHub PR 설명, GitHub 릴리스 노트, 종합 README.
- `xhigh` / `max`: 대규모 마이그레이션 명세, 보안 백서, 복합 릴리스 패키지 문서.

---

## 🎯 상세 맥락 지침 (프롬프팅 표준)

단순하고 모호한 플레이스홀더를 방지하기 위해, 클로드는 다음과 같은 **5대 핵심 맥락 지침**을 상세히 구성하여 제미나이에게 전달합니다:

### 클로드가 지정하는 5대 맥락 요소:
1. **Context (위치 및 상태)**: 컴포넌트 위치, 화면 상태, git 변경 범위 및 릴리스 마일스톤.
2. **Intent (사용자 의도 및 목표)**: 사용자가 취해야 할 행동, 변경의 구조적 이유나 목적.
3. **Tone (톤앤매너)**: 공감적, 전문적, 긴급함, 기술적 엄밀성 등 브랜드 보이스.
4. **Constraints (제약사항)**: 글자 수 한도, Conventional Commits 포맷 규격.
5. **Target Language (목표 언어)**: 한국어, 영어, 일본어 등 명시적 언어 코드.

---

## 🐙 Git & GitHub 전용 연동 (커밋, PR, 릴리스)

`just-code-claude`는 Git 커밋, GitHub Pull Request, GitHub 릴리스 작성 작업을 완벽하게 지원합니다:

### 1. 한 번에 커밋 실행 (`--commit`)
스테이징된 diff를 분석하고, 개발자의 맥락 지시를 결합하여 Conventional Commits 메시지를 생성한 뒤 곧바로 `git commit`을 실행합니다:
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: 2단계 인증 모달 및 복구 코드 발급 로직 구현" --lang Korean
```

### 2. 커밋 메시지 사전 검토 (`--commit-msg`)
커밋을 즉시 실행하지 않고 모범적인 Conventional Commits 메시지(제목 50자 이내, 상세 기술 본문)를 생성하여 출력하거나 파일로 저장합니다:
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: 웹소켓 하트비트 레이스 컨디션 해결" --lang Korean
```

### 3. GitHub PR 상세 설명서 생성 (`--pr-desc`)
**`4 argon`** 모델의 깊은 추론 능력을 활용하여 전체 diff를 분석하고 체계적인 마크다운 PR 문서를 생성합니다:
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: Redux에서 Zustand로의 프론트엔드 상태 관리 마이그레이션" -o PULL_REQUEST.md --lang Korean
```

### 4. GitHub 릴리스 노트 생성 및 발행 (`--release-notes`, `--release [tag]`)
이전 태그 이후의 커밋 및 통계를 분석하여 주요 하이라이트, 버그 수정, 브레이킹 체인지가 일목요연하게 정리된 릴리스 노트를 마크다운으로 작성하고 GitHub에 즉시 발행합니다:
```bash
# 릴리스 노트를 파일로 생성
node scripts/agy_call.js --release-notes -m "4 argon" -e high -p "Context: v1.2.0 마일스톤 릴리스" -o RELEASE_NOTES.md --lang Korean

# 릴리스 노트 생성 후 GitHub CLI(gh)를 통해 지정 태그로 즉시 발행
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -p "Context: 공식 안정화 릴리스 v1.2.0" --lang Korean
```

---

## ⚙️ 사전 요구사항

스크립트 실행을 위해 다음 중 하나가 필요합니다:

- **런타임**: [Node.js](https://nodejs.org) (v18+) 또는 [Python](https://python.org) (v3.8+).
- **실행 백엔드** (택 1):
  1. **Google Gemini API Key (전 세계 범용)**: [Google AI Studio](https://aistudio.google.com/)에서 무료 API 키를 발급받아 `GEMINI_API_KEY` 환경 변수를 설정합니다.
  2. **Antigravity CLI (`agy`)**: `agy` CLI가 설치 및 인증된 환경에서는 추가 API 키 없이 로컬 인증 세션을 자동 활용합니다.

> **Zero Dependencies**: `scripts/agy_call.js`(Node.js 내장 `fetch`)와 `scripts/agy_call.py`(Python 표준 `urllib.request`) 모두 **외부 서드파티 의존성이 전혀 없습니다**. `npm install`이나 `pip install` 과정이 필요 없습니다.

---

## 📦 설치 방법

### 권장: `npx skills`를 통한 설치 (skills.sh)

오픈 표준 [skills](https://skills.sh/) CLI를 사용하면 클론 없이 한 줄로 설치할 수 있습니다:

```bash
# Claude Code 전역(Global) 스킬로 설치 (권장)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# 또는 현재 작업 중인 프로젝트 로컬에만 설치
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

설치 스크립트는 파일들을 `~/.claude/skills/just-code-claude/` 경로에 안전하게 복사합니다.

---

## 🔌 환경 설정 및 실행 백엔드

보조 CLI는 두 가지 실행 백엔드를 자동으로 감지하여 지원합니다:

### 백엔드 1: Google Gemini REST API (전 세계 범용)
대다수의 개발자와 CI/CD 파이프라인에 권장되는 표준 방식입니다:
1. [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받습니다.
2. 환경 변수를 설정합니다:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="발급받은-API-키"

   # Windows PowerShell
   $env:GEMINI_API_KEY="발급받은-API-키"
   ```
3. 기본 모델 및 노력치를 환경 변수로 사전 지정할 수도 있습니다:
   ```bash
   export GEMINI_MODEL="gemini-3.8-flash"
   export GEMINI_EFFORT="medium"
   ```

### 백엔드 2: Antigravity CLI (`agy`)
Antigravity 환경에서 작업 중인 사용자를 위한 로컬 백엔드입니다:
- 시스템 `PATH` 또는 기본 설치 경로에서 `agy`가 감지되면 자동으로 우선 활용됩니다.
- `--model gemini-3.8-flash` 또는 `--model gemini-4-argon`과 `--effort` 옵션을 매끄럽게 전달합니다.

---

## 🚀 사용법 및 주요 워크플로우

### 1. Claude Code에서 스킬 활성화

Claude Code 세션에서 스킬을 호출합니다:
```text
/just-code-claude
```
또는 프롬프트로 직접 지시합니다:
```text
just-code-claude 모드를 활성화해줘. 코드는 네가 짜고, 모든 안내 문구, 문서, 커밋 메시지, PR 설명, 릴리스 노트는 제미나이에게 맡겨줘.
```

---

### 2. 워크플로우: 코드 내부 문자열 치환

#### 1단계: 클로드가 상세 지침 플레이스홀더를 포함해 코드 작성
클로드는 구조와 로직을 작성하되, 문자열 위치에 `__AGY__("Context: ... | Intent: ... | Tone: ... | Constraints: ...", "목표언어")`를 배치합니다:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>
        __AGY__("Context: 세션 만료 5분 전 상단 고정 경고 배너 | Intent: 세션 만료 임박 알림 | Tone: 침착하고 명확함 | Constraints: 25자 이내, 제목 스타일", "Korean")__
      </h3>
      <p>
        __AGY__("Context: 배너 본문 설명 | Intent: 작성 중인 내용은 자동 저장되었으며 연장 버튼을 누르면 로그아웃을 방지할 수 있음을 안내 | Tone: 안심시키며 친절함 | Constraints: 한 문장, 50자 이내", "Korean")__
      </p>
      <button onClick={onExtend}>
        __AGY__("Context: 배너 연장 CTA 버튼 | Intent: 토큰 갱신 트리거 | Tone: 명확한 행동 유도 | Constraints: 10자 이내", "Korean")__
      </button>
    </div>
  );
}
```

#### 2단계: 자동 치환 도구 실행
번들 스크립트를 호출하여 플레이스홀더를 치환합니다:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx -m "3.8 flash" -e medium
```

#### 3단계: 프로덕션 코드 완성
플레이스홀더가 제미나이가 작성한 고품질 텍스트로 치환됩니다:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"5분 후 세션이 만료됩니다"</h3>
      <p>"작업 내용은 자동 저장되었습니다. 계속 작업하시려면 세션을 연장해 주세요."</p>
      <button onClick={onExtend}>
        "세션 연장하기"
      </button>
    </div>
  );
}
```

---

### 3. 워크플로우: 기술 문서 및 마크다운 생성

기술 문서, 아키텍처 가이드, README 작성을 제미나이(`4 argon`, `high` 노력치)에 위임합니다:

```bash
# 4 argon 및 high 노력치를 활용한 심층 아키텍처 문서 생성
node scripts/agy_call.js -m "4 argon" -e high -p "Context: 이벤트 기반 마이크로서비스 아키텍처 개요. 대상 독자: 시니어 백엔드 엔지니어. 필수 항목: 개요, 시퀀스 다이어그램, 장애 처리 모드. 목표 언어: 한국어." -o docs/ARCHITECTURE.md

# 3.8 flash를 이용한 빠른 개발자 시작 가이드
node scripts/agy_call.js -m "3.8 flash" -e medium -p "REST API 엔드포인트에 대한 빠른 개발자 시작 가이드를 작성해줘" -l Korean -o docs/API_GUIDE.md
```

---

### 4. 워크플로우: 대량 UI 현지화 (i18n)

`ui_spec.json` 파일에 맥락과 요구사항을 정의합니다:
```json
{
  "auth": {
    "login_cta": "Context: 로그인 버튼 | Constraints: 2단어 이내",
    "forgot_password": "Context: 비밀번호 재설정 링크 | Tone: 부드러움",
    "password_hint": "Context: 비밀번호 입력 안내 | Constraints: 40자 이내"
  }
}
```

명령어 한 줄로 다국어 번역 사전을 생성합니다:
```bash
# 스페인어 로케일 파일 생성
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -o src/locales/es.json --lang Spanish

# 한국어 로케일 파일 생성
node scripts/agy_call.js --json-strings ui_spec.json -m "3.8 flash" -o src/locales/ko.json --lang Korean
```

---

### 5. 워크플로우: Git 커밋, PR 설명 및 GitHub 릴리스 작성

> [!IMPORTANT]
> **클로드 코드가 릴리즈를 수행할 때의 동작 방식**:  
> 사용자가 클로드 코드에 *"v1.2.0 릴리즈해줘"*, *"GitHub 릴리즈 작성해줘"*, *"새 버전 배포해줘"*라고 지시하면, 클로드 코드는 자체 LLM으로 릴리즈 노트를 직접 작성하지 않습니다.  
> 클로드 코드는 `~/.claude/rules/just-code-claude.md` 규칙에 따라 Git 변경 사항(태그, 커밋 로그, diff 통계)을 수집하고, 제미나이 **`4 argon`** (`high` 노력치)에 위임하여 전문적인 릴리즈 노트를 생성한 뒤 GitHub CLI(`gh release create`)로 발행합니다.

```bash
# 옵션 1: Conventional Commits 메시지 자동 생성 및 즉시 커밋 (3.8 flash)
just-code-claude --commit -m "3.8 flash" -e medium -p "Context: MFA 로그인 모달 및 토큰 갱신 로직 추가" --lang Korean

# 옵션 2: 커밋 메시지를 파일로 생성하여 검토
just-code-claude --commit-msg -m "3.8 flash" -e medium -o .commit_msg.tmp
git commit -F .commit_msg.tmp

# 옵션 3: 4 argon을 활용한 종합 GitHub PR 설명 작성
just-code-claude --pr-desc -m "4 argon" -e high -p "Context: 프론트엔드 상태 관리 아키텍처 개선" -o PULL_REQUEST.md --lang Korean

# 옵션 4: 최신 태그/커밋 기반 GitHub 릴리스 노트 작성
just-code-claude --release-notes -m "4 argon" -e high -p "Context: v1.2.0 마일스톤 릴리스" -o RELEASE_NOTES.md --lang Korean

# 옵션 5: 릴리스 노트를 생성하고 GitHub CLI(gh release create)로 즉시 공식 발행
just-code-claude --release v1.2.0 -m "4 argon" -e high -p "Context: 공식 안정화 릴리스 v1.2.0" --lang Korean
```

---

## 🛠 CLI 상세 옵션

```text
사용법: node scripts/agy_call.js [옵션]
   또는: python scripts/agy_call.py [옵션]

지원 모델:
  - '3.8 flash' (gemini-3.8-flash) [기본값]   : 초고속 UI 카피, 컴포넌트 안내문, Git 커밋
  - '4 argon'   (gemini-4-argon)              : 고난도 추론, 아키텍처 설계 문서, PR 명세서, 릴리스 노트

추론 노력치 (Reasoning Effort):
  -e, --effort <low|medium|high|xhigh|max>    : 추론 예산 및 노력치 수준 설정 (기본값: medium)

Git & GitHub 연동:
  --commit-msg                                : git diff를 분석하여 Conventional Commits 메시지 생성
  --commit                                    : git diff 분석 후 메시지를 생성하고 즉시 git commit 실행
  --pr-desc                                   : git diff를 기반으로 마크다운 형식의 GitHub PR 설명 생성
  --release-notes                             : git 태그/커밋 로그를 분석하여 GitHub 릴리스 노트 작성
  --release [tag]                             : GitHub 릴리스 노트를 생성하고 GitHub CLI(gh release create)로 발행

실행 백엔드:
  1. Direct Gemini API: GEMINI_API_KEY가 있거나 -b api 지정 시 사용.
  2. Antigravity CLI (agy): 로컬 머신에 설치되어 있는 경우 자동 감지.

주요 옵션:
  -p, --prompt <text>          생성할 프롬프트 또는 개발자 맥락 지시사항
  -f, --file <path>            파일에서 프롬프트/맥락 읽기
  -o, --output <path>          생성된 결과를 지정한 파일에 직접 저장
  -m, --model <name>           모델 선택: '3.8 flash' 또는 '4 argon'
  -e, --effort <level>         추론 노력치 설정: low, medium, high, xhigh, max
  -b, --backend <mode>         백엔드 엔진: 'auto' (기본값), 'api', 'agy'
  --api-key <key>              Google Gemini API 키 (또는 GEMINI_API_KEY 환경변수)
  -l, --lang <language>        결과물 목표 언어 (예: Korean, English, Japanese, Spanish)
  -s, --system <text>          프롬프트 앞에 추가할 시스템 지시사항
  --replace-in-file <path>     코드 파일 내 __AGY__("...") 플레이스홀더를 감지하여 제자리 치환
  --json-strings <path>        키-설명 매핑 JSON 명세를 읽어 카피 사전 생성
  --raw                        추가 포맷팅 없이 순수 텍스트 출력
  -h, --help                   도움말 출력
```

---

## 🧪 검증 및 테스트

텍스트 생성, 모델 전환, 코드 플레이스홀더 치환, 커밋 및 릴리스 노트 생성이 정상 동작하는지 자체 테스트를 실행할 수 있습니다:

```bash
npm test
# 또는
node scripts/test_skill.js
```

---

## 📁 디렉터리 구조

```
just-code-claude/
├── SKILL.md                 # Claude Code 전용 스킬 정의 및 행동 지침
├── README.md                # 영문 종합 문서
├── README.ko.md             # 한국어 종합 문서
├── README.ja.md             # 일본어 종합 문서
├── README.zh-CN.md          # 중국어 간체 종합 문서
├── README.es.md             # Spanish 종합 문서
├── README.fr.md             # French 종합 문서
├── README.de.md             # German 종합 문서
├── package.json             # NPM 패키지 디스크립터
├── install.ps1              # Windows PowerShell 설치 스크립트
├── install.sh               # Linux/macOS Bash 설치 스크립트
├── scripts/
│   ├── agy_call.js          # Node.js 듀얼 백엔드 러너 (Git 커밋/PR/릴리스 내장 지원)
│   ├── agy_call.py          # Python 듀얼 백엔드 러너 (Git 커밋/PR/릴리스 내장 지원)
│   └── test_skill.js        # 자동화된 통합 기능 검증 테스트 슈트
├── examples/
│   ├── before_code.tsx      # 상세 __AGY__ 플레이스홀더가 적용된 코드 예시
│   └── ui_spec.json         # 대량 현지화용 명세서 예시
└── templates/
    └── prompt_templates.md  # UX 카피, 문서, 커밋 메시지, 릴리스용 프롬프트 템플릿
```

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)에 따라 자유롭게 사용 및 배포할 수 있습니다.
