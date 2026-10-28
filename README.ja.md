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

> **「Claudeはコードを書き、Geminiは文章を書く。」**  
> Claude Code のためのオープンソース**エンジニアリング分業スキル**：Claude はソフトウェアアーキテクチャやコードロジックの記述に専念し、すべての自然言語テキスト（ドキュメント、README、コミットメッセージ、コード内の `""` 文字列リテラル）の生成を **Google Gemini REST API** または **Antigravity CLI (`agy`)** を介して **Google Gemini** に委任します。

---

## 📑 目次

- [開発背景と設計思想](#-開発背景と設計思想)
- [動作の仕組み](#-動作の仕組み)
- [事前要件](#-事前要件)
- [インストールガイド](#-インストールガイド)
  - [推奨: `npx skills` によるワンコマンドインストール](#推奨-npx-skills-によるワンコマンドインストール)
  - [代替手段: Git Clone によるインストール](#代替手段-git-clone-によるインストール)
- [設定と実行バックエンド](#-設定と実行バックエンド)
  - [バックエンド 1: Google Gemini 公式 REST API (汎用標準)](#バックエンド-1-google-gemini-公式-rest-api-汎用標準)
  - [バックエンド 2: Antigravity CLI (`agy`)](#バックエンド-2-antigravity-cli-agy)
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

## 🌟 開発背景と設計思想

現代の AI 支援開発において、モデルごとに異なる強みがあります：
- **Claude**: 複雑なソフトウェアアーキテクチャ、AST 操作、TypeScript 型システム、精密なアルゴリズム設計に優れています。
- **Google Gemini**: 多言語での自然な表現力、ユーザー向けの丁寧なコピーライティング、高速なテキスト生成に強みを持っています。

`just-code-claude` はこの2つのモデルの特性を組み合わせ、自動化された分業ワークフローを提供します：

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
                   │                       (Gemini API または agy CLI)
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

- **Claude の領域**: システムアーキテクチャ、ロジック、アルゴリズム、状態管理、型定義、テストコード、バグ修正、およびスクリプト実行。
- **Gemini の領域**: 技術ドキュメント、README、リリースノート、コミットメッセージ、および人間が読むすべての引用符（`""`, `''`）内のテキストリテラル。

> **分業の強制力について**: 本プロジェクトはコンパイラや OS レベルの制約ではなく、Claude Code スキル仕様（`SKILL.md`）を通じて AI エージェントに行動指針を与える**プロンプトベースのワークフロー指示**です。

---

## ⚙️ 事前要件

テキスト生成スクリプトを実行するには、以下が必要です:

- **ランタイム**: [Node.js](https://nodejs.org)（v18 以上推奨）または [Python](https://python.org)（v3.8 以上）。
- **実行バックエンド**（いずれかを選択）:
  1. **Google Gemini API キー (汎用標準)**: [Google AI Studio](https://aistudio.google.com/) で API キーを取得し、`GEMINI_API_KEY` 環境変数を設定します。
  2. **Antigravity CLI (`agy`)**: Antigravity 環境が設定されており、`agy` CLI の認証が完了している場合は、API キー設定なしで自動的に認識されます。

> **Zero Dependencies**: `scripts/agy_call.js`（Node.js 内蔵 `fetch`）および `scripts/agy_call.py`（Python 標準ライブラリ `urllib.request`）は**外部パッケージへの依存が一切ありません**。`npm install` や `pip install` は不要です。

---

## 📦 インストールガイド

### 推奨: `npx skills` によるワンコマンドインストール

オープンなエージェントスキル標準ツールである [skills](https://skills.sh/) を使用することで、リポジトリを手動で clone することなく簡単に導入できます:

```bash
# Claude Code にグローバルインストール (動作確認済み)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# 現在のプロジェクトにのみインストールする場合
npx skills add xyrz47-spec/just-code-claude -a claude-code
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

インストールスクリプトが自動的に `~/.claude/skills/just-code-claude/` にスキルファイルを配置します。

---

## 🔌 設定と実行バックエンド

CLI ツールは2つのバックエンドをサポートしており、環境に応じて自動判定します:

### バックエンド 1: Google Gemini 公式 REST API (汎用標準)
多くの開発者および CI/CD 環境に推奨される標準的な方法です:
1. [Google AI Studio](https://aistudio.google.com/) から API キーを取得します。
2. 環境変数を設定します:
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. デフォルトモデル: `gemini-2.5-flash`（`-m` フラグで `gemini-2.0-flash` などに変更可能）。

### バックエンド 2: Antigravity CLI (`agy`)
Antigravity 開発環境を使用している開発者向け:
- システムの `PATH` または標準パスに `agy` があれば自動的に検出されます。
- ローカルの Antigravity CLI 認証をそのまま利用します。
- デフォルトモデル: `gemini-3.8-flash-high`（Antigravity 環境モデル）。

---

## 🚀 使い方とワークフロー

### 1. Claude Code でスキルを有効化

Claude Code のプロンプトでコマンドを入力します:
```text
/just-code-claude
```
または自然言語で指示します:
```text
just-code-claude モードで作業してください。コード設計とロジックはあなたが書き、すべてのテキスト成果物と UI コピーは Gemini を呼び出して作成してください。
```

---

### 2. コード内文字列置換ワークフロー

#### ステップ A: Claude がプレースホルダーを含めてコードを作成
Claude はロジックと JSX/HTML 構造を記述し、テキスト部分に `__AGY__("指示内容"[, "対象言語"])` または `__GEMINI__("指示内容"[, "対象言語"])` の形式でプレースホルダーを配置します:

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
すべてのプレースホルダーが、Gemini によって生成された自然な日本語テキストにその場で置換されます:
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

技術文書、README、ユーザーガイドの作成を Gemini に委任します:

```bash
# Gemini REST API を使用
node scripts/agy_call.js -p "REST エンドポイントの入門ガイドを日本語で作成してください" -b api -o docs/API_GUIDE.md

# agy CLI を使用（インストールされている場合）
node scripts/agy_call.js -p "システムアーキテクチャの概要ドキュメントを作成してください" -b agy -o ARCHITECTURE.md
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
  1. Direct Gemini API: GEMINI_API_KEY 環境変数が設定されている場合、または -b api 指定時に実行。
  2. Antigravity CLI (agy): ローカル環境に agy がインストールされている場合に自動検出されて実行。

オプション:
  -p, --prompt <text>          生成するプロンプトテキスト
  -f, --file <path>            ファイルからプロンプト/文脈を読み込む
  -o, --output <path>          生成された結果を指定ファイルに出力
  -b, --backend <mode>         バックエンドエンジンの選択: 'auto'（デフォルト）、'api'、または 'agy'
  -m, --model <name>           モデル指定（api デフォルト: gemini-2.5-flash、agy デフォルト: gemini-3.8-flash-high）
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

テキスト生成およびコード内プレースホルダーの自動置換が正常に機能するかテストを実行します:

```bash
npm test
# または
node scripts/test_skill.js
```

---

## 📁 リポジトリ構成

```
just-code-claude/
├── SKILL.md                 # Claude Code 専用のスキル定義および分業ルールガイド
├── README.md                # 英語の公式ドキュメント
├── README.ko.md             # 韓国語の公式ドキュメント
├── README.ja.md             # 日本語の公式ドキュメント
├── README.zh-CN.md          # 中国語(簡体字)の公式ドキュメント
├── README.es.md             # スペイン語の公式ドキュメント
├── README.fr.md             # フランス語の公式ドキュメント
├── README.de.md             # ドイツ語の公式ドキュメント
├── package.json             # NPM パッケージ設定ファイル
├── install.ps1              # Windows PowerShell インストーラー
├── install.sh               # Linux/macOS インストーラー
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
