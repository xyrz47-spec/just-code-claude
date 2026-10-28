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
> 面向 Claude Code 的开源技能：Claude 专注于软件架构与代码逻辑，而将技术文档、README、**Git 提交信息、PR 说明**以及代码内部双引号 `""` 中的界面文本委托给 **Google Gemini**（支持 `3.8 flash` 或 `4 argon`，以及推理努力值调节），通过 **Google Gemini REST API** 或 **Antigravity CLI (`agy`)** 自动生成。

---

## 🤖 支持的模型与推理努力值 (Reasoning Effort)

| 模型 | CLI 别名 | 主要应用场景 | 推荐努力值 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(默认)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 极速 UI 文案、按钮标签、弹窗、Git 提交信息 | `low` 或 `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 深度推理、系统架构规范、完整 API 指南、GitHub PR 说明 | `high` 或 `max` |

---

## 🐙 Git 与 GitHub 深度整合 (Commit & PR)

### 1. 一键执行规范提交 (`--commit`)
自动分析暂存区差异，生成 Conventional Commits 规范信息并直接执行 `git commit`：
```bash
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -p "Context: 实现二次验证登录弹窗及令牌自动刷新逻辑" -l Chinese
```

### 2. 预览提交信息 (`--commit-msg`)
无需立即提交，直接生成严格遵循规范（标题小于50字符，正文附技术原由）的提交信息：
```bash
node scripts/agy_call.js --commit-msg -m "3.8 flash" -e medium -p "Context: 修复 WebSocket 心跳包竞态条件" -l Chinese
```

### 3. 生成 GitHub PR 详细说明 (`--pr-desc`)
调用 **`4 argon`** 进行深度推理，根据完整差异输出排版精美的 Markdown 格式 PR 说明：
```bash
node scripts/agy_call.js --pr-desc -m "4 argon" -e high -p "Context: 前端状态管理从 Redux 迁移至 Zustand" -o PULL_REQUEST.md -l Chinese
```

---

## 🛠 CLI 命令行参考

```bash
# 使用 3.8 flash 进行代码内部占位符一键替换
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l Chinese

# 使用 4 argon 生成深度架构设计文档
node scripts/agy_call.js -m "4 argon" -e high -p "编写微服务架构概览文档" -o docs/ARCH.md -l Chinese

# 一键自动生成提交信息并完成提交
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l Chinese
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源发布。
