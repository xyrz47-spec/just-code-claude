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
> Claude Code向けのオープンソーススキル：Claudeはソフトウェアアーキテクチャとコードロジックに専念し、ドキュメント、README、**Gitコミットメッセージ、PR概要**、UIテキスト（ダブルクォート `""` 内の文字列）の生成を **Google Gemini**（`3.8 flash` または `4 argon`、推論努力値の設定に対応）に **Google Gemini REST API** または **Antigravity CLI（`agy`）** 経由で委譲します。

---

## 🤖 サポートされるモデルと推論努力値

| モデル | CLIエイリアス | 主な用途 | 推奨努力値 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(デフォルト)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 超高速UIコピー、ボタンラベル、モーダル、Gitコミットメッセージ | `low` または `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 高難度推論、システムアーキテクチャ設計書、詳細API仕様、GitHub PR概要 | `high` または `max` |

---

## 🐙 Git & GitHub 統合（コミット & PR作成）

### 1. ワンコマンドでコミット作成 (`--commit`)
ステージングされたdiffを分析し、Conventional Commitsに準拠したメッセージを生成して直ちに `git commit` を実行します：
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: MFAログインモーダルおよびトークン更新ロジックの実装" -l Japanese
```

### 2. コミットメッセージの事前確認 (`--commit-msg`)
コミットを実行せずに、50文字以内のタイトルと技術的背景を含む詳細なメッセージを生成します：
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: WebSocketハートビートの競合状態を修正" -l Japanese
```

### 3. GitHub PR概要の生成 (`--pr-desc`)
**`4 argon`** の深い推論能力を活用し、diff全体からMarkdown形式の構造化されたPR説明書を作成します：
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: ReduxからZustandへのフロントエンド状態管理移行" -o PULL_REQUEST.md -l Japanese
```

---

## 🛠 CLIリファレンス

```bash
# 3.8 flashを使用したUI文字列置換
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Japanese

# 4 argonを使用したアーキテクチャドキュメント生成
node scripts/agy_call.js -m "4 argon" -e high -p "APIアーキテクチャガイドを作成して" -o docs/ARCH.md -l Japanese

# Gitコミット自動作成
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l Japanese
```

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) の下で公開されています。
