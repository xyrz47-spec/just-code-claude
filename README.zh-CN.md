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

> **“Claude 负责写代码，Gemini 负责写文本。”**  
> 专为 **Claude Code** 打造的严格分工技能：Claude 专注于代码架构、算法与逻辑编写，而所有自然语言文本产出物（文档、README、提交信息以及代码中引号 `""` 包含的字符串字面量）均通过 **Antigravity CLI (`agy`)** 或 **Google Gemini 官方 REST API** 委托给 **Google Gemini** 全权生成。

---

## 📑 目录

- [为什么选择 just-code-claude？](#-为什么选择-just-code-claude)
- [运行机制](#-运行机制)
- [环境准备](#-环境准备)
- [安装指南](#-安装指南)
  - [方式 1: 安装为全局 Claude Code 技能（推荐）](#方式-1-安装为全局-claude-code-技能推荐)
  - [方式 2: 安装为项目级技能](#方式-2-安装为项目级技能)
- [配置与后端引擎](#-配置与后端引擎)
  - [后端 1: Antigravity CLI (`agy`)](#后端-1-antigravity-cli-agy)
  - [后端 2: Google Gemini 官方 REST API](#后端-2-google-gemini-官方-rest-api)
- [使用方法与工作流](#-使用方法与工作流)
  - [1. 在 Claude Code 中激活技能](#1-在-claude-code-中激活技能)
  - [2. 代码内字符串替换工作流](#2-代码内字符串替换工作流)
  - [3. 文档与 Markdown 生成工作流](#3-文档与-markdown-生成工作流)
  - [4. 批量 UI 多语言（i18n）生成工作流](#4-批量-ui-多语言i18n生成工作流)
  - [5. Git 提交与 PR 说明生成工作流](#5-git-提交与-pr-说明生成工作流)
- [CLI 命令行参考](#-cli-命令行参考)
- [验证与测试](#-验证与测试)
- [仓库目录结构](#-仓库目录结构)
- [开源许可证](#-开源许可证)

---

## 🌟 为什么选择 `just-code-claude`？

Claude 是目前最出色的编程 AI 之一，在软件架构设计、复杂状态管理、AST 操作以及类型系统构建方面表现极其优异。然而，在撰写自然流畅、亲切友好的用户文案、本土化提示语、细腻的错误通知和技术文档时，许多开发者更倾向于使用 **Google Gemini**。

`just-code-claude` 将两者的优势结合，建立起全自动化的协同分工机制：

```
                       ┌──────────────────────────────┐
                       │          用户任务需求         │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
          [ 代码逻辑与架构设计 ]                   [ 自然语言与文本撰写 ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                       (agy CLI 或 Gemini REST API)
                   ▼                                     ▼
        函数、类型、状态、AST                   官方文档、UI 按钮文案、
      及占位符 (__AGY__)                       错误提示与交互通知
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │        最终生产就绪代码       │
                       └──────────────────────────────┘
```

- **Claude 的职责领域**：系统架构、逻辑实现、算法设计、状态管理、类型声明、测试用例编写、Bug 修复及脚本调度编排。
- **Gemini 的职责领域**：技术文档编写、README、发布说明、Git 提交信息以及所有供人类阅读的引号（`""`, `''`）内文本字符串字面量。

---

## ⚙️ 环境准备

运行文本生成脚本需要以下运行环境：

- **运行环境**：[Node.js](https://nodejs.org)（推荐 v18+）或 [Python](https://python.org)（v3.8+）。
- **执行后端**（二选一即可）：
  1. **Antigravity CLI (`agy`)**：如果已在本地安装并完成鉴权，开箱即用，无需配置任何 API Key。
  2. **Google Gemini API Key**：在没有 `agy` 的环境中，只需配置在 [Google AI Studio](https://aistudio.google.com/) 获取的 `GEMINI_API_KEY`（或 `GOOGLE_API_KEY`）环境变量即可。

> **注意**：`scripts/agy_call.js` 与 `scripts/agy_call.py` **没有任何外部包依赖（Zero Dependencies）**。分别使用 Node.js 原生内置的 `fetch` 和 Python 内置的标准库 `urllib.request`，无需执行 `npm install` 或 `pip install`。

---

## 📦 安装指南

### 方式 1: 安装为全局 Claude Code 技能（推荐）

全局安装后，系统内 **所有** Claude Code 会话均可随时通过 `/just-code-claude` 命令调用本技能。

#### Windows 系统 (PowerShell):
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### Linux / macOS 系统 (Bash):
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

安装脚本会自动将技能文件部署至 `~/.claude/skills/just-code-claude/` 目录下。

---

### 方式 2: 安装为项目级技能

若仅希望在当前特定代码仓库中使用：

```bash
mkdir -p .claude/skills/just-code-claude
cp -r path/to/just-code-claude/* .claude/skills/just-code-claude/
```

---

## 🔌 配置与后端引擎

`just-code-claude` 支持无缝的 **双后端引擎**，并能根据当前环境自动检测选择：

### 后端 1: Antigravity CLI (`agy`)
当本地已安装 Antigravity CLI 时：
- 自动识别并优先调用。
- 无需配置 API Key。
- 默认采用 `--model gemini-3.8-flash-high`（支持按需指定 `gemini-4-argon-high`）。

### 后端 2: Google Gemini 官方 REST API
适用于直接调用云端 API 或在没有 `agy` 的 CI/CD 自动化流水线中运行：
1. 从 [Google AI Studio](https://aistudio.google.com/) 获取 API Key。
2. 配置环境变量：
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. 亦可在运行命令行时直接传入参数：`--api-key "your-key"`。
4. 默认采用 `gemini-2.5-flash` 模型（可通过 `-m` 参数自定义）。

---

## 🚀 使用方法与工作流

### 1. 在 Claude Code 中激活技能

在 Claude Code 交互对话框中输入命令：
```text
/just-code-claude
```
或直接使用自然语言提示：
```text
请切换至 just-code-claude 模式工作。你负责编写代码架构与逻辑，所有文本产出和 UI 文案请调用 agy 委托 Gemini 生成。
```

---

### 2. 代码内字符串替换工作流

#### 步骤 A: Claude 编写带有占位符的代码
Claude 编写业务逻辑与 JSX/HTML 结构，在需要展示给用户的文本位置使用 `__AGY__("指示描述"[, "目标语言"])` 或 `__GEMINI__("指示描述"[, "目标语言"])` 格式放置占位符：

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("会话即将过期警告标题", "Chinese")__</h3>
      <p>__AGY__("提示用户5分钟后将自动登出并建议点击延长的说明", "Chinese")__</p>
      <button onClick={onExtend}>
        __AGY__("延长会话操作按钮文字", "Chinese")__
      </button>
    </div>
  );
}
```

#### 步骤 B: 运行自动替换工具
Claude 在终端中运行内置的 CLI 脚本：
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Python 环境下可执行：`python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### 步骤 C: 最终生成的生产代码
文件内的所有占位符将被 Gemini 生成的高质量自然文本就地替换：
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"您的登录会话即将过期"</h3>
      <p>"为了保护您的账号安全，系统将在5分钟后自动登出。如需继续使用，请延长会话时间。"</p>
      <button onClick={onExtend}>
        "延长会话时间"
      </button>
    </div>
  );
}
```

---

### 3. 文档与 Markdown 生成工作流

将所有技术文档、项目说明以及用户操作手册委托给 Gemini 编写：

```bash
# 使用 Antigravity CLI（默认自动检测）
node scripts/agy_call.js -p "请为我们的 REST API 接口撰写一份中文快速入门指南" -o docs/API_GUIDE.md

# 显式指定使用 Gemini API 模式
node scripts/agy_call.js -p "撰写系统整体架构设计概览文档" -b api -o ARCHITECTURE.md

# 直接调用 agy CLI
agy -p "撰写项目 README 核心概览" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
```

---

### 4. 批量 UI 多语言（i18n）生成工作流

准备包含键值与需求描述的规范文件 `ui_spec.json`：
```json
{
  "auth": {
    "login_cta": "用于执行登录操作的主要按钮文案",
    "forgot_password": "用于找回密码的引导链接文本",
    "password_hint": "提示密码长度至少需要8位的辅助说明文字"
  }
}
```

一键批量生成目标语言的本地化字典文件：
```bash
# 生成西班牙语字典
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# 生成中文简体字典
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/zh-CN.json --lang "Simplified Chinese"
```

---

### 5. Git 提交与 PR 说明生成工作流

编写规范的提交信息或 Pull Request 描述：

```bash
# 1. 暂存当前代码变更
git diff --staged > .git_diff.tmp

# 2. 调用 agy 编写 Conventional Commits 格式信息
node scripts/agy_call.js -f .git_diff.tmp -p "请分析以上 diff 变更，编写符合 Conventional Commits 规范的提交信息（包含50字以内标题及详细说明正文）。语言：中文" -o .commit_msg.tmp

# 3. 使用生成的文本完成提交
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 CLI 命令行参考

```text
Usage: node scripts/agy_call.js [options]
   or: python scripts/agy_call.py [options]

双引擎后端运行机制:
  1. Antigravity CLI (agy): 本地已安装时自动检测并优先运行。
  2. Direct Gemini API: 设置了 GEMINI_API_KEY 环境变量或未检测到 agy 时自动切换使用。

选项参数:
  -p, --prompt <text>          要生成内容的提示词文本
  -f, --file <path>            从指定文件中读取提示词或上下文内容
  -o, --output <path>          将生成的结果直接写入保存至指定文件
  -b, --backend <mode>         指定执行引擎: 'auto' (默认值), 'agy', 或 'api'
  -m, --model <name>           指定模型名称 (agy 默认: gemini-3.8-flash-high, api 默认: gemini-2.5-flash)
  --api-key <key>              Google Gemini API Key (亦可使用 GEMINI_API_KEY 环境变量)
  -l, --lang <language>        生成的目标语言 (如 English, Korean, Japanese, Chinese, Spanish)
  -s, --system <text>          预先附加在提示词前的系统角色指令
  --effort <level>             agy 专用推理深度级别 (low, medium, high)
  --replace-in-file <path>     扫描代码文件中的 __AGY__("...") 或 __GEMINI__("...") 占位符
                               并直接就地替换为生成的成品文本
  --json-strings <path>        读取键值描述的 JSON 规范文件并批量生成文案
  --raw                        仅输出纯文本结果，不附加额外格式化修饰
  -h, --help                   显示帮助文档
```

---

## 🧪 验证与测试

在本地环境中运行自动化自测脚本，验证文本生成与代码占位符替换机制是否正常：

```bash
npm test
# 或
node scripts/test_skill.js
```

---

## 📁 仓库目录结构

```
just-code-claude/
├── SKILL.md                 # Claude Code 专用技能定义与严格分工指引
├── README.md                # 英文官方主文档
├── README.ko.md             # 韩文官方文档
├── README.ja.md             # 日文官方文档
├── README.zh-CN.md          # 简体中文官方文档
├── package.json             # NPM 模块描述文件
├── install.ps1              # Windows PowerShell 一键安装脚本
├── install.sh               # Linux/macOS 一键安装脚本
├── scripts/
│   ├── agy_call.js          # Node.js 双引擎执行器 (无任何外部依赖)
│   ├── agy_call.py          # Python 双引擎执行器 (仅使用原生标准库)
│   └── test_skill.js        # 端到端自动化自测套件
├── examples/
│   ├── before_code.tsx      # 包含 __AGY__ 占位符的代码示例
│   └── ui_spec.json         # 多语言字典生成规范示例
└── templates/
    └── prompt_templates.md  # UX 文案与技术文档撰写提示词模板
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
