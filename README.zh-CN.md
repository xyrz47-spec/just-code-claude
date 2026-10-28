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

> **“Claude 负责写代码，Gemini 负责写文本。”**  
> 面向 Claude Code 的开源**研发分工技能**：Claude 专注于系统架构与代码逻辑实现，而所有自然语言文本产出物（技术文档、README、提交信息以及代码中引号 `""` 包含的字符串字面量）均通过 **Google Gemini REST API** 或 **Antigravity CLI (`agy`)** 委托给 **Google Gemini** 生成。

---

## 📑 目录

- [立项初衷与设计理念](#-立项初衷与设计理念)
- [运行机制](#-运行机制)
- [环境准备](#-环境准备)
- [安装指南](#-安装指南)
  - [推荐方式: 通过 `npx skills` 一行命令安装](#推荐方式-通过-npx-skills-一行命令安装)
  - [备选方式: 通过 Git Clone 安装](#备选方式-通过-git-clone-安装)
- [配置与后端引擎](#-配置与后端引擎)
  - [后端 1: Google Gemini 官方 REST API (通用标准)](#后端-1-google-gemini-官方-rest-api-通用标准)
  - [后端 2: Antigravity CLI (`agy`)](#后端-2-antigravity-cli-agy)
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

## 🌟 立项初衷与设计理念

在现代 AI 辅助研发流程中，不同的大语言模型具备各自的特长：
- **Claude**：在复杂软件架构搭建、AST 语法树重构、TypeScript 类型系统以及算法推导方面极为出色。
- **Google Gemini**：在跨语种表达自然度、用户端友好提示语撰写以及快速文本生成方面表现突出。

`just-code-claude` 将二者的特长进行结合，提供自动化的协同分工工作流：

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
                   │                       (Gemini API 或 agy CLI)
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

- **Claude 的分工范畴**：系统架构、核心逻辑、算法实现、状态管理、类型声明、测试用例编写、Bug 修复及工具脚本调用。
- **Gemini 的分工范畴**：技术文档编写、README、发布日志、Git 提交说明以及所有供人类阅读的代码内字符串字面量（`""`, `''`）。

> **关于约束机制的说明**：本项目不是操作系统级或编译器级的沙盒限制，而是通过 Claude Code 技能规范（`SKILL.md`）向 AI 智能体提供明确分工指南的**提示词工作流指令**。

---

## ⚙️ 环境准备

运行文本生成脚本需要：

- **运行环境**：[Node.js](https://nodejs.org)（推荐 v18+）或 [Python](https://python.org)（v3.8+）。
- **执行引擎**（任选其一）：
  1. **Google Gemini API Key (通用标准)**：在 [Google AI Studio](https://aistudio.google.com/) 免费申请 API Key 并配置为 `GEMINI_API_KEY` 环境变量。
  2. **Antigravity CLI (`agy`)**：如果你在 Antigravity 环境下工作且已完成 `agy` CLI 鉴权，工具将自动检测并调用，无需额外配置 Key。

> **Zero Dependencies**：`scripts/agy_call.js`（Node.js 原生 `fetch`）与 `scripts/agy_call.py`（Python 原生 `urllib.request`）**无任何第三方依赖**，无需运行 `npm install` 或 `pip install`。

---

## 📦 安装指南

### 推荐方式: 通过 `npx skills` 一行命令安装

使用开源 Agent 技能标准工具 [skills](https://skills.sh/) 即可快速安装，无需手动 clone：

```bash
# 全局安装至 Claude Code (已实测验证)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# 或仅为当前项目安装
npx skills add xyrz47-spec/just-code-claude -a claude-code
```

---

### 备选方式: 通过 Git Clone 安装

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

脚本会自动将技能部署至 `~/.claude/skills/just-code-claude/` 目录。

---

## 🔌 配置与后端引擎

辅助命令行工具支持两种后端引擎，并具备自动环境检测能力：

### 后端 1: Google Gemini 官方 REST API (通用标准)
绝大多数开发者与 CI/CD 流水线的推荐模式：
1. 在 [Google AI Studio](https://aistudio.google.com/) 获取 API Key。
2. 配置环境变量：
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="your-api-key-here"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-api-key-here"
   ```
3. 默认模型：`gemini-2.5-flash`（可通过 `-m` 自定义，如 `gemini-2.0-flash`）。

### 后端 2: Antigravity CLI (`agy`)
适用于 Antigravity 开发环境用户：
- 检测到 `PATH` 或默认安装路径中的 `agy` 时自动生效。
- 直接继承本地 Antigravity 登录鉴权。
- 默认模型：`gemini-3.8-flash-high`（Antigravity 环境模型）。

---

## 🚀 使用方法与工作流

### 1. 在 Claude Code 中激活技能

在 Claude Code 中输入命令：
```text
/just-code-claude
```
或直接使用自然语言指令：
```text
请切换至 just-code-claude 模式工作。你负责编写代码架构与逻辑，所有文本产出和 UI 文案请调用 Gemini 委托生成。
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
Claude 在终端中运行内置 CLI 工具：
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Python 环境：`python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

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

将技术文档、项目说明以及用户操作手册委托给 Gemini 编写：

```bash
# 使用 Gemini REST API
node scripts/agy_call.js -p "请为我们的 REST API 接口撰写一份中文快速入门指南" -b api -o docs/API_GUIDE.md

# 使用 agy CLI（如已安装）
node scripts/agy_call.js -p "撰写系统整体架构设计概览文档" -b agy -o ARCHITECTURE.md
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
  1. Direct Gemini API: 设置了 GEMINI_API_KEY 环境变量或传入 -b api 时调用。
  2. Antigravity CLI (agy): 本地环境检测到 agy 时自动生效。

选项参数:
  -p, --prompt <text>          要生成内容的提示词文本
  -f, --file <path>            从指定文件中读取提示词或上下文内容
  -o, --output <path>          将生成的结果直接写入保存至指定文件
  -b, --backend <mode>         指定执行引擎: 'auto' (默认值), 'api', 或 'agy'
  -m, --model <name>           指定模型名称 (api 默认: gemini-2.5-flash, agy 默认: gemini-3.8-flash-high)
  --api-key <key>              Google Gemini API Key (亦可使用 GEMINI_API_KEY 环境变量)
  -l, --lang <language>        生成的目标语言 (如 English, Korean, Japanese, Chinese, Spanish)
  -s, --system <text>          预先附加在提示词前的系统角色指令
  --effort <level>             agy 专用推理深度级别 (low, medium, high)
  --replace-in-file <path>     扫描代码文件中的 __AGY__("...") 或 __GEMINI__("...") 占位符
                               并直接就地替换为生成的成品文本
  --json-strings <path>        读取键值描述的 JSON 规范文件并批量生成文案
  --raw                        仅输出纯文本结果，不附加额外修饰
  -h, --help                   显示帮助信息
```

---

## 🧪 验证与测试

运行自动化自测脚本，验证文本生成与代码占位符替换机制是否正常：

```bash
npm test
# 或
node scripts/test_skill.js
```

---

## 📁 仓库目录结构

```
just-code-claude/
├── SKILL.md                 # Claude Code 专用技能定义与分工指引
├── README.md                # 英文官方主文档
├── README.ko.md             # 韩文官方文档
├── README.ja.md             # 日文官方文档
├── README.zh-CN.md          # 简体中文官方文档
├── README.es.md             # 西班牙文官方文档
├── README.fr.md             # 法文官方文档
├── README.de.md             # 德文官方文档
├── package.json             # NPM 模块描述文件
├── install.ps1              # Windows PowerShell 安装脚本
├── install.sh               # Linux/macOS 安装脚本
├── scripts/
│   ├── agy_call.js          # Node.js 双引擎执行器 (无任何外部依赖)
│   ├── agy_call.py          # Python 双引擎执行器 (仅使用原生标准库)
│   └── test_skill.js        # 端到端自动化自测套件
├── examples/
│   ├── before_code.tsx      # 包含 __AGY__ 占位符的代码示例
│   └── ui_spec.json         # 多语言字典生成规范示例
└── templates/
    └── prompt_templates.md  # 提示词模板
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
