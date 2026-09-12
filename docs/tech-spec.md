# 技术规范 v1.0

**状态：已确认（2026-08-17）**

---

## 1. 文件结构

```
作品集杂志版/
├── CLAUDE.md                 # AI 助手指引
├── .claude/settings.json     # SessionStart 钩子（每日自动建 devlog）
├── README.md                 # 用户教程（Step 10 创建）
├── favicon.svg
├── index.html                # 首页
├── about.html                # 01 关于我
├── achievements.html         # 02 平台运营成果
├── accounts.html             # 03 运营过的账号
├── works.html                # 04 审美习作
├── docs/
│   ├── requirements.md / design-spec.md / tech-spec.md / dev-plan.md
│   └── content-guide.md      # 用户内容填写指南（Step 8 创建）
├── devlog/                   # 每日开发日志（钩子自动建文件）
└── assets/
    ├── css/style.css         # 唯一样式表
    ├── js/main.js            # 唯一脚本
    ├── images/README.txt     # 真实图片放这里（命名规则与替换方法）
    ├── videos/README.txt     # 视频文件放这里（视频号面板 3 条）
    └── pdf/portfolio.pdf     # 成品 PDF 作品集（按钮下载，覆盖同名即更新）
```

## 2. 路径规则（贯穿所有页面）

- **所有链接一律相对路径**：`about.html`、`assets/css/style.css`、`assets/images/works-01.jpg`
- 禁止 `/` 开头、禁止 `..` 上跳（扁平结构用不上）
- 5 个 HTML 平铺在根目录，各自引用同样的 `assets/...` 相对路径

## 3. 页面骨架模板（每个 HTML 遵循）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>关于我 — 姓名 · 新媒体运营作品集</title> <!-- CONFIG: 基本信息 -->
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="page-about">  <!-- 每页独立 class -->
  <header class="site-header">
    <nav class="site-nav">
      <a class="nav-logo" href="index.html">姓名</a>
      <a href="index.html">首页</a>
      <a href="about.html" class="is-current">关于我</a>  <!-- 当前页硬编码，无需 JS -->
      <a href="achievements.html">运营成果</a>
      <a href="accounts.html">运营账号</a>
      <a href="works.html">审美习作</a>
      <button class="nav-toggle" aria-expanded="false">菜单</button>
    </nav>
  </header>
  <main>…</main>
  <footer class="site-footer">…</footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- 导航 + 页脚在 5 页间复制（零依赖静态站代价），改导航需同步 5 页（README 说明）
- `<html>` 上加 `<script>` 提前写入 `document.documentElement.classList.add('js')`（no-js → js 切换用）

## 4. CSS 架构（style.css 单文件，注释分区）

分区顺序（每区有 `/* ===== 分区名 ===== */` 注释）：

1. **Tokens** — `:root` 设计令牌（颜色/字号/间距）
2. **Reset** — 极简 reset（box-sizing、margin、图片 display:block）
3. **Base** — body 字体、标题默认、a 链接样式、容器类
4. **Typography** — eyebrow / 大标题 / 正文 / v-text / 时间线 / 引言
5. **Grid** — 12 列网格、col-N、section 间距
6. **Components** — header/nav/全屏菜单/footer/KPI 卡/案例行/平台卡/画廊/灯箱/目录行
7. **Utilities** — reveal 动画状态、visually-hidden
8. **Responsive** — 1024 / 768 / 480 断点
9. **Reduced motion** — `@media (prefers-reduced-motion: reduce)` 全部动画关闭

规范：全部用 CSS 变量取值，禁止魔法数字重复；类名 kebab-case。

## 5. JS 架构（main.js 单文件 IIFE）

```js
(function () {
  'use strict';
  function initNav() { /* 汉堡/全屏菜单/滚动阴影/Esc/滚动锁 */ }
  function initReveals() { /* IO 淡入 + --d 级联延迟 */ }
  function initGallery() { /* 仅 about：照片切换器（箭头循环/圆点直达，class 切换） */ }
  function initCounters() { /* 仅 achievements：KPI 计数 1.2s 千分位 */ }
  function initAccordion() { /* 仅 accounts：details 单开模式 + 展开动画 */ }
  function initLightbox() { /* 仅 works：灯箱开合/键盘/焦点，长图 data-long 纵向滚动 */ }
  function init() {
    initNav();
    initReveals();
    initGallery();
    initCounters();
    initAccordion();
    initLightbox();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
```

- 每个 init 先判元素存在性（`if (!el) return;`），缺组件自动跳过
- 灯箱数据放 DOM（figure 里放 data-full 大图路径），**禁止 fetch/JSON 加载**（file:// 兼容）
- **三重降级兜底**：`prefers-reduced-motion` → 跳过动画直接显示；无 IntersectionObserver → 全部内容直接显示；无 JS → 所有内容本来就在 HTML 里可见
- **折叠展开**用原生 `<details>/<summary>`：无 JS 时原生展开收起行为可用；JS 只做增强（监听 toggle 事件收起其他项实现单开模式 + 动画）
- **灯箱**：每件作品 `<figure class="work">` 内图区为 `<button class="work-btn">`；有真实大图时在 figure 上加 `data-full="assets/images/xxx.jpg"`，长图作品再加 `data-long`（灯箱容器纵向滚动浏览完整长图）；占位阶段灯箱显示大占位块

## 6. CONFIG 系统（可维护性核心）

- 所有可编辑内容用 `<!-- CONFIG: xxx -->` 注释标注，前缀分类：
  - `CONFIG: 基本信息` — 姓名、城市、联系方式
  - `CONFIG: 文字` — 标题、段落、条目
  - `CONFIG: 数字` — 数据（只改 `data-count`，万级以上千分位 JS 自动）
  - `CONFIG: 图片` — 图片文件名
  - `CONFIG: 视频` — 视频文件（accounts 页视频号面板）
  - `CONFIG: 链接` — 邮箱、平台链接
  - `CONFIG: 文字/图片` — works 页作品条目专属组合（标题 / 说明 / 缩略图一条注释覆盖）
- 示例：
  ```html
  <!-- CONFIG: 数字 — 累计粉丝数（data-count 与显示文本两处都改成新数字，千分位动画自动） -->
  <span class="kpi-value" data-count="128000">128,000</span>
  ```
- 图片/视频更换规则：真实文件放入 `assets/images/`（或 `assets/videos/`），ASCII 小写文件名；把占位块换成媒体元素、**class 不变**（`<img class="ph ph--portrait" src="…" alt="…">` / `<video class="ph ph--wide" controls src="…">`），`img.ph, video.ph { display: block; padding: 0; object-fit: cover; }` 自动按原比例裁切填满（display: block 必须覆盖 .ph 的 flex，否则 object-fit 失效）；works 页灯箱大图额外在 figure 上加 `data-full`

## 7. 兼容性矩阵

| 目标 | 要求 |
|------|------|
| 浏览器 | Chrome / Edge / Firefox 最近两个大版本 |
| 移动 | iOS Safari、Android Chrome、微信内置浏览器 |
| 协议 | `file://` 双击可用 + GitHub Pages 可用 |
| CSS 特性 | 全部有静态兜底（clamp 前先写静态值；writing-mode 竖排仅装饰） |
| JS 特性 | ES5/ES6 基础（const/let/箭头），禁 ES modules |

## 8. 命名约定

- 资产文件名：**ASCII 小写 + 连字符**（`works-01.jpg`、`placeholder-16-9.svg`）
- 中文文件名、空格、大写字母禁止（GitHub Pages 大小写敏感）
- CSS 类名 kebab-case；JS 函数 camelCase

## 9. 部署约束（GitHub Pages）

- 仓库结构 = 本文件夹结构，根目录即站点根
- 分支 `main` + Pages 设置 `/ (root)`，或部署到 `<user>.github.io` 仓库
- 无构建步骤、无 npm、无 CI——纯静态推送即上线

## 10. 禁止事项

- ❌ ES modules、fetch、任何网络请求（file:// 全部失效）
- ❌ 外部依赖：CDN、网络字体、框架、图标库
- ❌ 绝对路径（`/assets/...`）——file:// 和 Pages 项目页都会断
- ❌ 内联 style 散落（统一在 style.css 分区）
- ❌ 中文/大写资产文件名
