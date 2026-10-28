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
> 面向 Claude Code 的开源技能：Claude 专注于软件架构与代码逻辑，而将技术文档、README、**Git 提交信息、PR 说明、GitHub Release 发行注记**以及代码内部双引号 `""` 中的界面文本委托给 **Google Gemini**（支持 `3.8 flash` 或 `4 argon`，以及推理努力值调节），通过 **Google Gemini REST API** 或 **Antigravity CLI (`agy`)** 自动生成。

---

## 🤖 支持的模型与推理努力值 (Reasoning Effort)

| 模型 | CLI 别名 | 主要应用场景 | 推荐努力值 |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(默认)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | 极速 UI 文案、按钮标签、弹窗、Git 提交信息 | `low` 或 `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | 深度推理、系统架构规范、完整 API 指南、GitHub PR 说明、Release 发布注记 | `high` 或 `max` |

---

## 🐙 Git 与 GitHub 深度整合 (Commit, PR & Release)

> [!IMPORTANT]
> **Claude Code 执行 Release 时的行为规范**:  
> 当用户指示 Claude Code “发布 v1.2.0”、“编写 GitHub 规范 Release”时，Claude Code 不会使用自身 LLM 直接编写发布文案。  
> 依据 `~/.claude/rules/just-code-claude.md` 规则，Claude Code 负责提取 Git Tag、日志及 diff 统计信息，并全权交由 Gemini **`4 argon`**（`high` 思考努力值）进行深度综合编写，随后通过 GitHub CLI（`gh release create`）完成正式发布。

### 1. 一键执行规范提交 (`--commit`)
```bash
just-code-claude --commit -m "3.8 flash" -e medium -p "Context: 实现二次验证登录弹窗及令牌自动刷新逻辑" -l Chinese
```

### 2. 预览提交信息 (`--commit-msg`)
```bash
just-code-claude --commit-msg -m "3.8 flash" -e medium -p "Context: 修复 WebSocket 心跳包竞态条件" -l Chinese
```

### 3. 生成 GitHub PR 详细说明 (`--pr-desc`)
```bash
just-code-claude --pr-desc -m "4 argon" -e high -p "Context: 前端状态管理从 Redux 迁移至 Zustand" -o PULL_REQUEST.md -l Chinese
```

### 4. GitHub Release 编写与一键发布 (`--release-notes`, `--release [tag]`)
分析历史 tag 与差异日志，自动梳理亮点功能、修复与破坏性变更，并通过 GitHub CLI 直接发布：
```bash
# 生成 Release 发布注记文件
just-code-claude --release-notes -m "4 argon" -e high -p "Context: v1.2.0 里程碑版本" -o RELEASE_NOTES.md -l Chinese

# 直接调用 GitHub CLI 发布指定 Tag
just-code-claude --release v1.2.0 -m "4 argon" -e high -p "Context: 正式稳定版 v1.2.0" -l Chinese
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

# 一键生成 Release 注记并发布
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l Chinese
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源发布。
