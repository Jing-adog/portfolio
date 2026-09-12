# 杂志风个人作品集 — AI 助手指引

## 项目概述

杂志风多页面个人作品集网站，面向面试官展示新媒体运营能力（自我介绍、平台运营成果、运营账号、个人作品）。

- **产品形态：** 多页面静态网站（5 个 HTML 页面），纯前端 HTML/CSS/JS，零依赖
- **设计风格：** 杂志编辑风 — 大标题、高级排版、图文编排、大量留白、发丝线；黑白 + 单一蓝点缀
- **部署方式：** GitHub Pages（本地双击 index.html 同样可用）

## 关键文件路径

| 文件 | 路径 | 用途 |
|------|------|------|
| 需求文档 | [docs/requirements.md](docs/requirements.md) | 全部用户需求：页面板块、字段、风格、非功能需求 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | UI/UX 规格：配色、字体、网格、组件、动效、占位图、无障碍 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术架构：文件结构、CSS/JS 架构、CONFIG 系统、兼容性、禁止事项 |
| 开发计划 | [docs/dev-plan.md](docs/dev-plan.md) | 11 步开发计划，每步有任务清单和验证标准 |
| 内容填写指南 | [docs/content-guide.md](docs/content-guide.md) | 给用户看的逐页内容填写教程（Step 8 时创建） |
| 首页 | [index.html](index.html) | 首页（Step 2 起创建） |
| 关于我 | [about.html](about.html) | 01 关于我 |
| 运营成果 | [achievements.html](achievements.html) | 02 平台运营成果 |
| 运营账号 | [accounts.html](accounts.html) | 03 运营过的账号 |
| 个人作品 | [works.html](works.html) | 04 个人作品 |
| 样式 | [assets/css/style.css](assets/css/style.css) | 唯一样式表（Step 1 起创建） |
| 脚本 | [assets/js/main.js](assets/js/main.js) | 唯一脚本（IIFE，零模块） |
| 图片 | [assets/images/](assets/images/) | 真实图片 + placeholders/ 占位图 |
| 开发日志 | [devlog/](devlog/) | 每日开发记录（每次启动自动创建当日文件） |

## 工作原则

1. **每次只做一个 Step**，完成并验证后再进入下一步
2. **修改页面前先确认**当前版本能正常打开（file:// 双击）
3. **所有视觉元素**需符合 docs/design-spec.md 的杂志风规格
4. **所有可编辑内容**使用 `<!-- CONFIG: xxx -->` 注释标注，方便非技术用户 Ctrl+F 搜索修改
5. **装饰不能遮挡信息** — 文字区域保持清晰
6. **不要跳过步骤**，严格按 docs/dev-plan.md 的依赖顺序执行

## 标准开发流程

每次写代码时，按以下流程：

```
1. 打开 docs/dev-plan.md → 找到当前要做的 Step
2. 打开相关的规范文档（design-spec.md / tech-spec.md）→ 确认规格
3. 编写代码
4. 对照 Step 的"验证标准"逐条验证
5. 更新 devlog/YYYY-MM-DD.md 记录完成情况
6. 更新 docs/dev-plan.md 勾选完成的 task
```

## 每日维护

### 每次对话开始时
- 检查 docs/dev-plan.md 确认当前进度
- 检查 devlog/ 当日日志（系统钩子会自动创建当日文件）

### 每次对话结束时
- 更新 devlog/ 当日日志：完成事项、待办事项、遇到的问题

### 每完成一个 Step 后
- 在 docs/dev-plan.md 中勾选完成项
- 在日志中记录验证结果
- 如有偏离规范的情况，同步更新对应的 spec 文档

### 遇到需求变更时
- 先更新 docs/requirements.md
- 再同步更新 docs/design-spec.md 和 docs/tech-spec.md
- 最后评估是否需要调整 docs/dev-plan.md 的步骤

## 风格红线（不可违反）

- ❌ 杂志编辑风跑偏（变成涂鸦拼贴风、极简风、科技风、3D 风）
- ❌ 引入第二个强调色（蓝色 #2779A7 是唯一强调色）
- ❌ 小字正文使用强调色（accent 仅用于大字与图形元素）
- ❌ 装饰元素遮挡主要信息内容

## 技术禁止事项

- ❌ 一次性写完整文件（逐步构建，每步验证）
- ❌ 跳过验证步骤
- ❌ 引入外部依赖（CDN、npm 包、网络字体）
- ❌ 使用 ES modules 或 fetch（file:// 协议兼容性）
- ❌ 使用 `/` 开头的绝对路径（file:// 与 GitHub Pages 项目页都会失效）
- ❌ 资产文件使用中文名或大写字母（GitHub Pages 大小写敏感）
