# クロードはコードだけを書く (`just-code-claude`)

<p align="center">
  <b>Claudeはコードを書き、Geminiはテキストを書く。</b><br>
  エンジニアリングロジックと自然言語生成を分離する自動化ワークフロースキル
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
> Claude Code向けのオープンソーススキル：Claudeはソフトウェアアーキテクチャとコードロジックに専念し、ドキュメント、README、コミットメッセージ、UIテキスト（ダブルクォート `""` 内の文字列）の生成を **Google Gemini**（`3.8 flash` または `4 argon`、推論努力値の設定に対応）に **Google Gemini REST API** または **Antigravity CLI（`agy`）** 経由で委譲します。

---

## 📑 目次

- [開発の動機と設計思想](#-開発の動機と設計思想)
- [サポートされるモデルと推論努力値（Reasoning Effort）](#-サポートされるモデルと推論努力値reasoning-effort)
- [詳細なコンテキスト指示標準（プロンプト規約）](#-詳細なコンテキスト指示標準プロンプト規約)
- [動作の仕組み](#-動作の仕組み)
- [前提条件](#-前提条件)
- [インストールガイド](#-インストールガイド)
  - [推奨: `npx skills` によるインストール](#推奨-npx-skills-によるインストール-skillssh)
  - [代替方法: Git Clone によるインストール](#代替方法-git-clone-によるインストール)
- [設定と実行バックエンド](#-設定と実行バックエンド)
  - [バックエンド 1: Direct Google Gemini REST API（グローバル標準）](#バックエンド-1-direct-google-gemini-rest-apiグローバル標準)
  - [バックエンド 2: Antigravity CLI（`agy`）](#バックエンド-2-antigravity-cliagy)
- [使い方と主要ワークフロー](#-使い方と主要ワークフロー)
  - [1. Claude Codeでのスキル有効化](#1-claude-codeでのスキル有効化)
  - [2. コード内文字列の自動生成と置換](#2-ワークフロー-コード内文字列の置換)
  - [3. 技術ドキュメントとMarkdownの生成](#3-ワークフロー-技術ドキュメントとmarkdownの生成)
  - [4. 一括UIローカライゼーション（i18n）](#4-ワークフロー-一括uiローカライゼーションi18n)
  - [5. Conventional Gitコミットメッセージ生成](#5-ワークフロー-gitコミットメッセージの作成)
- [CLIリファレンス](#-cliリファレンス)
- [検証とテスト](#-検証とテスト)
- [ディレクトリ構成](#-ディレクトリ構成)
- [ライセンス](#-ライセンス)

---

## 🌟 開発の動機と設計思想

現代のAI支援エンジニアリングでは、各モデルが独自の強みを持っています：
- **Claude**: 複雑なアーキテクチャ設計、AST操作、TypeScript型システム、アルゴリズムの推論において卓越しています。
- **Google Gemini**: 自然なユーザー向けコピーの作成、多言語ローカライゼーション、高速なテキスト生成において優れています。

`just-code-claude` はこの2つのモデルの強みを統合し、自動化された分業ワークフローを提供します。

---

## 🤖 サポートされるモデルと推論努力値（Reasoning Effort）

本スキルは2つの公式モデルと推論努力値の調整に対応しています：

| モデル | CLIエイリアス | 主な用途 | 推奨努力値 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(デフォルト)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 超高速UIコピー、ボタンラベル、モーダルダイアログ、フォームエラー、トースト通知 | `low` または `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 高難度の推論、システムアーキテクチャ設計書、詳細API仕様、技術RFC | `high` または `max` |

### 推論努力値 (`-e, --effort`):
- `low`: マイクロコピー、ボタンテキスト、単一ラベル（即時応答）。
- `medium` *(デフォルト)*: モーダル、フォームバリデーション、通知、Gitコミットメッセージ。
- `high`: 技術ドキュメント、アーキテクチャ概要、総合README。
- `xhigh` / `max`: マイグレーション仕様書、セキュリティホワイトペーパー、詳細ガイド。

---

## 🎯 詳細なコンテキスト指示標準（プロンプト規約）

曖昧なプレースホルダーを防ぐため、Claudeは以下の **5大コンテキスト要素** を指定してGeminiにテキスト生成を依頼します：

1. **Context（画面位置と状態）**: 対象コンポーネント、モーダル、トリガー状態。
2. **Intent（目的とユーザー意図）**: ユーザーに取ってほしいアクションや伝えるべき意図。
3. **Tone（トーン＆マナー）**: 共感的、専門的、緊急、励ましなど。
4. **Constraints（制約事項）**: 文字数制限、単語数、大文字小文字のルール。
5. **Target Language（対象言語）**: 日本語、英語など明示的な言語指定。

```tsx
<button onClick={onConfirm}>
  __AGY__("Context: サブスクリプション支払いモーダルの主アクション | Intent: 20%年間割引を訴求し支払い承認を促す | Tone: 明確で前向き | Constraints: 10文字以内、名詞結び | Model: 3.8 flash", "Japanese")__
</button>
```

---

## ⚙️ 前提条件

- **ランタイム**: [Node.js](https://nodejs.org) (v18+) または [Python](https://python.org) (v3.8+)。
- **実行バックエンド**（いずれか1つ）:
  1. **Google Gemini API Key（世界共通）**: [Google AI Studio](https://aistudio.google.com/) でAPIキーを取得し、環境変数 `GEMINI_API_KEY` を設定。
  2. **Antigravity CLI（`agy`）**: `agy` が設定された環境では追加キー不要で自動連携。

> **Zero Dependencies**: `scripts/agy_call.js` と `scripts/agy_call.py` は外部依存パッケージを一切使用していません。

---

## 📦 インストールガイド

```bash
# Claude Codeのグローバルスキルとしてインストール（推奨）
npx skills add xyrz47-spec/just-code-claude -g -a claude-code
```

---

## 🛠 CLIリファレンス

```bash
# 3.8 flashを使用したUI文字列置換
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Japanese

# 4 argonを使用したアーキテクチャドキュメント生成
node scripts/agy_call.js -m "4 argon" -e high -p "APIアーキテクチャガイドを作成して" -o docs/ARCH.md -l Japanese
```

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) の下で公開されています。
