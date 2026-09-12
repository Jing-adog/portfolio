# 个人作品集网站 — 使用与部署指南

黑白杂志风个人作品集网站，面向面试官展示新媒体运营能力。共 5 个页面：首页 / 关于我 / 运营成果 / 运营账号 / 审美习作。纯 HTML/CSS/JS 编写，无任何外部依赖。

---

## 1. 本地预览

双击打开 `index.html` 即可在浏览器查看整个网站，无需安装任何软件。5 个页面之间通过导航相互跳转。

---

## 2. 修改内容

### 改文字

1. 用 VS Code 或记事本打开对应 HTML 文件（如 `about.html`）
2. 按 `Ctrl+F` 搜索 `CONFIG`，所有可修改的文字都在 `<!-- CONFIG: xxx -->` 注释附近
3. **只改标签之间的文字**，不要动 `< >` 符号和属性
4. 首页跑马灯有两段相同的文字，改的时候两处要一起改
5. 首页大标题 PORTFOLIO 是拆成字母的，改它需要逐个字母改，建议不改

### 换图片 / 视频

1. 把图片文件放进 `assets/images/`（视频放 `assets/videos/`），文件名用**小写英文 + 数字**，如 `works-01.jpg`，不要用中文和空格
2. 找到对应位置的占位块（页面里灰底灰字的长方块），把它整个换成：

   ```html
   <img class="ph ph--portrait" src="assets/images/works-01.jpg" alt="作品说明">
   ```

   **class 保持不变**（`ph--portrait` 是 3:4，`ph--wide` 是 16:9，`ph--square` 是 1:1，`ph--9x16` 是 9:16），图片会自动按这个比例裁切填满。
3. 换完后，把占位块旁边的说明文字（如「照片占位：个人形象照」）删掉
4. 视频同理：`<video class="ph ph--wide" controls src="assets/videos/xxx.mp4"></video>`

### 更新 PDF 作品集

把你的最新 PDF 改名为 `portfolio.pdf`，覆盖 `assets/pdf/portfolio.pdf` 即可，全站「下载 PDF」按钮不用动。

> 完整教程（含各页速查表、灯箱大图设置、常见问题）见 [docs/content-guide.md](docs/content-guide.md)
>
> **第一次换图/视频**：先看 [docs/embed-guide.md](docs/embed-guide.md) —— 零基础手把手教程，从安装编辑器到每一步点哪里都写清楚了

---

## 3. 部署到 GitHub Pages（免费，约 10 分钟）

### 准备：注册 GitHub 账号

打开 <https://github.com> → Sign up → 按提示注册（邮箱 + 用户名 + 密码）。**用户名记好**，它会在你的网址里出现。

### 方案 A：网页上传（最简单，推荐）

1. 登录 GitHub，点右上角 **+** → **New repository**
2. Repository name 填 `portfolio`（小写英文），选 **Public**，其他不动 → **Create repository**
3. 页面中间会出现一个 **uploading an existing file** 链接，点进去
4. 打开「作品集杂志版」文件夹，**全选（Ctrl+A）所有文件**，一起拖进上传区 → 绿色 **Commit changes** 按钮
5. 进入仓库页面 → **Settings** → 左侧 **Pages**
6. Source 选 **Deploy from a branch**，Branch 选 **main**、文件夹选 **/ (root)** → **Save**
7. 等 1–2 分钟，回到 Settings → Pages 页面，顶部会出现你的网址：
   `https://你的用户名.github.io/portfolio/`

把这个链接发给面试官即可，手机、微信里都能直接打开。

### 方案 B：GitHub Desktop（以后更新更方便）

1. 到 <https://desktop.github.com> 下载安装 GitHub Desktop，登录你的账号
2. File → New repository → 名字填 `portfolio`，本地路径选「作品集杂志版」文件夹 → Create repository
3. 右上角 **Publish repository**（保持 Public）
4. 打开 <https://github.com/你的用户名/portfolio> → Settings → Pages → 同上开启（main 分支 / root）
5. 以后每次改完内容，在 GitHub Desktop 里左下角填一句说明 → **Commit to main** → **Push origin**，网站自动更新

### 以后更新网站

- 方案 A：重新走一遍第 3–4 步（重新上传覆盖同名文件）
- 方案 B：改完文件后 Commit + Push
- 更新后 1–2 分钟内生效；没变化就按 `Ctrl+F5` 强制刷新

---

## 4. 注意事项

- 仓库必须选 **Public**，免费版 GitHub 才支持 Pages
- 所有文件名保持**小写英文**（GitHub 区分大小写，`Works-01.jpg` 和 `works-01.jpg` 是两个文件）
- 单个文件不能超过 100MB（PDF 目前 19.7MB，没问题）
- 网页上传时 `docs`、`devlog` 文件夹和 `.claude` 是开发资料，传不传都不影响网站

---

## 5. 发布前检查清单

- [ ] 所有「照片占位：…」「视频占位・…」等占位说明文字已删除
- [ ] 所有灰底占位块已换成真实图片 / 视频
- [ ] 文字内容已按 CONFIG 注释全部更新
- [ ] PDF 作品集已是最新版
- [ ] 手机（微信内置浏览器）打开链接测试正常
