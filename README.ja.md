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

> **「Claudeはコードを書き、Geminiは文章を書く。」**  
> 厳格な分業を強制する **Claude Code 専用スキル**: Claudeはコード設計、アルゴリズム、ロジック作成に専념し、すべての自然言語テキスト（ドキュメント、README、コミットメッセージ、コード内の `""` 文字列リテラル）は **Antigravity CLI (`agy`)** または **Google Gemini 公式 REST API** を介して **Google Gemini** が生成します。

---

## 📑 目次

- [なぜ just-code-claude なのか？](#-なぜ-just-code-claude-なのか)
- [動作の仕組み](#-動作の仕組み)
- [事前要件](#-事前要件)
- [インストールガイド](#-インストールガイド)
  - [方法 1: グローバル Claude Code スキルとしてインストール（推奨）](#方法-1-グローバル-claude-code-スキルとしてインストール推奨)
  - [方法 2: プロジェクト単位のスキルとしてインストール](#方法-2-プロジェクト単位のスキルとしてインストール)
- [設定とバックエンド](#-設定とバックエンド)
  - [バックエンド 1: Antigravity CLI (`agy`)](#バックエンド-1-antigravity-cli-agy)
  - [バックエンド 2: Google Gemini 公式 REST API](#バックエンド-2-google-gemini-公式-rest-api)
- [使い方とワークフロー](#-使い方とワークフロー)
  - [1. Claude Code でスキルを有効化](#1-claude-code-でスキルを有効化)
  - [2. コード内文字列置換ワークフロー](#2-コード内文字列置換ワークフロー)
  - [3. ドキュメントおよび Markdown 生成ワークフロー](#3-ドキュメントおよび-markdown-生成ワークフロー)
  - [4. UI 多言語（i18n）一括生成ワークフロー](#4-ui-多言語i18n一括生成ワークフロー)
  - [5. Git コミットおよび PR メッセージ作成ワークフロー](#5-git-コミットおよび-pr-メッセージ作成ワークフロー)
- [CLI コマンドリファレンス](#-cli-コマンドリファレンス)
- [動作確認とテスト](#-動作確認とテスト)
- [リポジトリ構成](#-リポジトリ構成)
- [ライセンス](#-ライセンス)

---

## 🌟 なぜ `just-code-claude` なのか？

Claude は最も優れたプログラミング AI のひとつであり、ソフトウェアアーキテクチャ、複雑な状態管理、AST 操作、型設計に非常に優れています。しかし、多くの開発者は、自然でユーザーフレンドリーなテキスト、ローカライズされた表現、丁寧なエラーメッセージ、公式ドキュメントを作成する際には **Google Gemini** を好みます。

`just-code-claude` はこの強みを融合し、自動化された分業体制を確立します:

```
                       ┌──────────────────────────────┐
                       │          ユーザーの要求        │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
          [ コードロジック & 設計 ]                [ 自然言語 & テキスト ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                       (agy CLI または Gemini REST API)
                   ▼                                     ▼
        関数、型、状態、AST                     公式ドキュメント、UI ボタン、
      およびプレースホルダー (__AGY__)            エラー通知メッセージ & コピー
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │        完成した本番コード      │
                       └──────────────────────────────┘
```

- **Claude の領域**: システムアーキテクチャ、ロジック、アルゴリズム、状態管理、型定義、テストコード、バグ修正、およびスクリプトオーケストレーション。
- **Gemini の領域**: 技術ドキュメント、README、リリースノート、コミットメッセージ、および人間が読むすべての引用符（`""`, `''`）内のテキストリテラル。

---

## ⚙️ 事前要件

テキスト生成スクリプトを実行するには、以下が必要です:

- **ランタイム**: [Node.js](https://nodejs.org)（v18 以上推奨）または [Python](https://python.org)（v3.8 以上）。
- **実行バックエンド**（いずれかを選択）:
  1. **Antigravity CLI (`agy`)**: インストールおよび認証済みの場合、追加の API キー設定なしで即座に動作します。
  2. **Google Gemini API キー**: `agy` がない環境では、[Google AI Studio](https://aistudio.google.com/) で取得した `GEMINI_API_KEY`（または `GOOGLE_API_KEY`）環境変数を設定するだけで利用可能です。

> **備考**: `scripts/agy_call.js` と `scripts/agy_call.py` は **外部パッケージへの依存が一切ありません（Zero Dependencies）**。Node.js 組み込みの `fetch` および Python 組み込みの `urllib.request` を使用しているため、事前の `npm install` や `pip install` は不要です。

---

## 📦 インストールガイド

### 推奨: `npx skills` (skills.sh) によるインストール

リポジトリを clone することなく、公式 [skills](https://skills.sh/) CLI を使用して1行で即座にインストールできます:

```bash
# Claude Code にグローバルインストール
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# または検出されたすべての AI エージェントにグローバルインストール
npx skills add xyrz47-spec/just-code-claude -g

# 現在のプロジェクトにのみインストール
npx skills add xyrz47-spec/just-code-claude
```

---

### 代替手段: Git Clone によるインストール

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

---

## 🔌 設定とバックエンド

`just-code-claude` は、環境に応じて最適なエンジンを自動検出する **デュアルバックエンド** をサポートしています:

### バックエンド 1: Antigravity CLI (`agy`)
システムに Antigravity CLI がインストールされている場合:
- 自動的に検出され実行されます。
- API キーの設定は不要です。
- デフォルトで `--model gemini-3.8-flash-high` を使用します（必要に応じて `gemini-4-argon-high` を指定可能）。

### バックエンド 2: Google Gemini 公式 REST API
直接クラウド API を呼び出す場合や、CI/CD などの `agy` がない環境で実行する場合:
1. [Google AI Studio](https://aistudio.google.com/) から API キーを取得します。
2. 環境変数を設定します:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. または、CLI 実行時に直接渡すこともできます: `--api-key "your-key"`。
4. デフォルトで `gemini-2.5-flash` を使用します（`-m` フラグで変更可能）。

---

## 🚀 使い方とワークフロー

### 1. Claude Code でスキルを有効化

Claude Code のプロンプトでコマンドを入力します:
```text
/just-code-claude
```
または自然言語で指示します:
```text
just-code-claude モードで作業してください。コード設計とロジックはあなたが書き、すべてのテキスト成果物と UI コピーは agy を呼び出して作成してください。
```

---

### 2. コード内文字列置換ワークフロー

#### ステップ A: Claude がプレースホルダーを含めてコードを作成
Claude はロジックと JSX/HTML 構造を記述し、ユーザーに表示されるテキスト部分に `__AGY__("指示内容"[, "対象言語"])` または `__GEMINI__("指示内容"[, "対象言語"])` の形式でプレースホルダーを配置します:

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("セッション期限切れの警告タイトル", "Japanese")__</h3>
      <p>__AGY__("5分後に自動ログアウトされる案内とセッション延長を促す説明", "Japanese")__</p>
      <button onClick={onExtend}>
        __AGY__("セッション延長ボタンのテキスト", "Japanese")__
      </button>
    </div>
  );
}
```

#### ステップ B: 自動置換スクリプトを実行
Claude がターミナルで付属の CLI ツールを実行します:
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Python 環境: `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### ステップ C: 完成した本番コード
すべてのプレースホルダーが、Gemini によって生成された自然な日本語テキストリテラルにインプレースで置換されます:
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"セッションの有効期限がまもなく切れます"</h3>
      <p>"セキュリティ保護のため、操作がない場合は5分後に自動的にログアウトされます。作業を続けるにはセッションを延長してください。"</p>
      <button onClick={onExtend}>
        "セッションを延長する"
      </button>
    </div>
  );
}
```

---

### 3. ドキュメントおよび Markdown 生成ワークフロー

すべての技術文書、README、ユーザーガイドの作成を Gemini に委任します:

```bash
# Antigravity CLI を使用（デフォルトの自動検出）
node scripts/agy_call.js -p "REST エンドポイントの入門ガイドを日本語で作成してください" -o docs/API_GUIDE.md

# Gemini API モードを明示的に使用
node scripts/agy_call.js -p "システムアーキテクチャの概要ドキュメントを作成してください" -b api -o ARCHITECTURE.md

# agy CLI を直接呼び出し
agy -p "プロジェクト README の概要を作成してください" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
```

---

### 4. UI 多言語（i18n）一括生成ワークフロー

キーと説明が含まれた仕様ファイル `ui_spec.json`:
```json
{
  "auth": {
    "login_cta": "ログインを実行する主要なアクションボタン",
    "forgot_password": "パスワード再設定ページへのリンク",
    "password_hint": "パスワードは8文字以上である必要があるという案内ヒント"
  }
}
```

指定した言語に対応する翻訳/辞書ファイルを一括生成します:
```bash
# スペイン語ロケールを生成
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# 日本語ロケールを生成
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/ja.json --lang Japanese
```

---

### 5. Git コミットおよび PR メッセージ作成ワークフロー

コミットメッセージや PR の説明を作成する場合:

```bash
# 1. ステージされた変更内容を取得
git diff --staged > .git_diff.tmp

# 2. Conventional Commits 形式でメッセージ生成を依頼
node scripts/agy_call.js -f .git_diff.tmp -p "上記の diff を分析し、50文字以内のタイトルと詳細な本文を含む Conventional Commits メッセージを作成してください。言語: 日本語" -o .commit_msg.tmp

# 3. 生成されたテキストでコミット
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 CLI コマンドリファレンス

```text
Usage: node scripts/agy_call.js [options]
   or: python scripts/agy_call.py [options]

デュアルバックエンド実行:
  1. Antigravity CLI (agy): インストールされている場合、自動検出されて優先実行。
  2. Direct Gemini API: GEMINI_API_KEY 環境変数が設定されている場合、または agy が見つからない場合に自動実行。

オプション:
  -p, --prompt <text>          生成するプロンプトテキスト
  -f, --file <path>            ファイルからプロンプト/文脈を読み込む
  -o, --output <path>          生成された結果を指定ファイルに出力
  -b, --backend <mode>         バックエンドエンジンの選択: 'auto'（デフォルト）、'agy'、または 'api'
  -m, --model <name>           モデルの指定（agy デフォルト: gemini-3.8-flash-high、api デフォルト: gemini-2.5-flash）
  --api-key <key>              Google Gemini API キー（または GEMINI_API_KEY 環境変数）
  -l, --lang <language>        出力対象の言語（例: English, Korean, Japanese, Spanish）
  -s, --system <text>          プロンプトの先頭に付加するシステム指示
  --effort <level>             agy 専用の推論レベル（low, medium, high）
  --replace-in-file <path>     コード内の __AGY__("...") または __GEMINI__("...") プレースホルダーをスキャンし、
                               生成されたテキストでその場で置換
  --json-strings <path>        キーと説明の JSON マップからコピーを一括生成
  --raw                        装飾なしで純粋なテキストのみを出力
  -h, --help                   ヘルプメッセージを表示
```

---

## 🧪 動作確認とテスト

テキスト生成およびコード内プレースホルダーの自動置換が正常に機能するかセルフテストを実行します:

```bash
npm test
# または
node scripts/test_skill.js
```

---

## 📁 リポジトリ構成

```
just-code-claude/
├── SKILL.md                 # Claude Code 専用のスキル定義および厳格な分業ルールガイド
├── README.md                # 英語の公式ドキュメント
├── README.ko.md             # 韓国語の公式ドキュメント
├── README.ja.md             # 日本語の公式ドキュメント
├── package.json             # NPM パッケージ設定ファイル
├── install.ps1              # Windows PowerShell ワンクリックインストーラー
├── install.sh               # Linux/macOS ワンクリックインストーラー
├── scripts/
│   ├── agy_call.js          # Node.js デュアルバックエンドランナー（外部依存 0）
│   ├── agy_call.py          # Python デュアルバックエンドランナー（標準ライブラリのみ）
│   └── test_skill.js        # エンドツーエンド自動検証テストスイート
├── examples/
│   ├── before_code.tsx      # __AGY__ プレースホルダーを含むコードサンプル
│   └── ui_spec.json         # 多言語辞書生成用の仕様例
└── templates/
    └── prompt_templates.md  # UX コピーおよびドキュメント作成用プロンプトテンプレート
```

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
