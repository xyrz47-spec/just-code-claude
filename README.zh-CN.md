# 克劳德只写代码 (`just-code-claude`)

<p align="center">
  <b>Claude 编写代码，Gemini 编写文本。</b><br>
  将工程逻辑与自然语言生成彻底分离的自动化协作技能
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
> 面向 Claude Code 的开源技能：Claude 专注于软件架构与代码逻辑，而将技术文档、README、Git 提交信息以及代码内部双引号 `""` 中的界面文本委托给 **Google Gemini**（支持 `3.8 flash` 或 `4 argon`，以及推理努力值调节），通过 **Google Gemini REST API** 或 **Antigravity CLI (`agy`)** 自动生成。

---

## 📑 目录

- [设计理念与动机](#-设计理念与动机)
- [支持的模型与推理努力值 (Reasoning Effort)](#-支持的模型与推理努力值-reasoning-effort)
- [详细上下文指令标准 (提示词规范)](#-详细上下文指令标准-提示词规范)
- [前置要求](#-前置要求)
- [安装指南](#-安装指南)
- [配置与执行后端](#-配置与执行后端)
- [主要工作流](#-主要工作流)
- [CLI 命令行参考](#-cli-命令行参考)
- [验证与测试](#-验证与测试)
- [许可证](#-许可证)

---

## 🌟 设计理念与动机

在现代 AI 辅助研发中，各模型优势各异：
- **Claude**：擅长复杂架构、AST 操作、TypeScript 类型系统及高难度算法逻辑。
- **Google Gemini**：在多语言自然文案、用户体验用词及极速文本生成上表现卓越。

`just-code-claude` 将二者长处深度结合，打造全自动分工管道。

---

## 🤖 支持的模型与推理努力值 (Reasoning Effort)

本技能正式支持两个 Google Gemini 模型，并支持自定义推理努力值：

| 模型 | CLI 别名 | 主要应用场景 | 推荐努力值 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(默认)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 极速 UI 文案、按钮标签、弹窗、表单校验、Toast 提示 | `low` 或 `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 深度推理、系统架构规范、完整 API 指南、技术 RFC | `high` 或 `max` |

### 推理努力值 (`-e, --effort`):
- `low`: 微文案、按钮文本、单个标签（近乎零延迟）。
- `medium` *(默认)*: 弹窗、表单报错提示、通知信息、Git 提交说明。
- `high`: 深度技术文档、架构设计全景图、完整 README。
- `xhigh` / `max`: 大型迁移指南、安全白皮书、复杂技术规格。

---

## 🎯 详细上下文指令标准 (提示词规范)

杜绝模糊占位符。Claude 必须提供包含以下 **五大维度** 的详细指令：

1. **Context (界面位置与状态)**: 明确所在组件与交互状态。
2. **Intent (用户意图与行动)**: 期望用户完成的操作或传递的信息。
3. **Tone (语调与风格)**: 亲切、严谨、紧急、激励等品牌语调。
4. **Constraints (约束规范)**: 字数上限、短语数、标点规则。
5. **Target Language (目标语言)**: 显式指定语言代码。

```tsx
<button onClick={onConfirm}>
  __AGY__("Context: 订阅结算弹窗主要 CTA | Intent: 突出 20% 年付优惠并引导付款 | Tone: 自信且明确 | Constraints: 6字以内 | Model: 3.8 flash", "Chinese")__
</button>
```

---

## 📦 安装指南

```bash
# 全局安装至 Claude Code（官方推荐）
npx skills add xyrz47-spec/just-code-claude -g -a claude-code
```

---

## 🛠 CLI 命令行参考

```bash
# 使用 3.8 flash 进行代码内部占位符一键替换
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Chinese

# 使用 4 argon 生成深度架构设计文档
node scripts/agy_call.js -m "4 argon" -e high -p "编写微服务架构概览文档" -o docs/ARCH.md -l Chinese
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源发布。
