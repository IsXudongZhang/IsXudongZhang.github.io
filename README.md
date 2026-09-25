# Xudong Zhang · Academic Homepage

轻量静态学术主页，使用 HTML、CSS 和原生 JavaScript，可直接部署到 GitHub Pages，无构建步骤或外部字体依赖。

## 页面内容

- 个人资料、导师与实验室、邮箱、Google Scholar 和 GitHub
- 个人介绍中的研究方向（AI4Science：药物发现、抗体发现、虚拟细胞与器官、自动化实验室）与合作联系入口
- 按时间倒序完整展示的动态
- 按年份倒序分组、完整展示的论文
- 研究经历、荣誉奖项和学术服务
- 论文 PDF、代码及可单独查看的完整框架图

现有论文、作者、发表信息与链接沿用原主页。新增研究方向说明及动态来自已有资料，不自动推断新的发表记录。

## 文件结构

```text
index.html           页面内容和论文条目
styles.css           学术排版、响应式布局与打印样式
script.js            移动导航、导航高亮、头像加载回退
likes.js             红心按钮、共享点赞计数和浏览器去重
images/              头像、框架图和 favicon.svg
files/               论文 PDF
CNAME                原有自定义域名配置
```

## 本地预览

在项目目录运行：

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000`。也可直接打开 `index.html`。禁用 JavaScript 时，全部论文、章节导航及历史动态仍可访问。

## 红心点赞

头像下方的红心按钮展示所有访客累计点赞数，使用 [Abacus](https://v2.jasoncameron.dev/abacus) 保存共享计数。正式计数标识为 `xudongzhang.cn/homepage-likes`，不同域名入口共享同一个总数。

- 页面加载只调用 `/get/xudongzhang.cn/homepage-likes`；只有主动点击才调用 `/hit/xudongzhang.cn/homepage-likes`。
- 服务确认成功后显示实心红心并记住当前浏览器的点赞状态，不提供取消点赞。`localStorage` 只用于浏览器去重，不用于生成总数。
- 同源标签页通过 Storage 事件同步状态，并在支持 Web Locks 的浏览器中串行处理提交，避免同时点击重复计数。
- 加载失败显示 `—` 和提示，不伪造数字；提交失败不显示成功，也不自动重试。请求超时为 8 秒。
- 使用原生按钮、键盘焦点和 `aria-pressed`；禁用 JavaScript 或打印时隐藏按钮。
- 这是轻量匿名计数，不是严格的独立访客统计：清除浏览器存储、切换浏览器/域名或主动调用公开接口仍可能重复计数。禁用存储时仅在当前页面防重复。
- 不需要把 API 密钥放入网页；浏览器仅访问计数接口，不加载第三方脚本。请求不携带浏览器凭据或 Referer。
- 计数可用性取决于第三方服务；Abacus 文档注明计数在连续 6 个月未访问后可能过期。正式计数的管理凭据若已创建，仅保存在本机 `.git/homepage-likes-admin.json`，不得加入网站文件或提交。

## 更新资料

直接编辑 `index.html` 中对应的语义化区块：

| 内容 | 位置 |
| --- | --- |
| 个人资料与联系信息 | `.profile` |
| 个人简介、研究方向与合作联系 | `#about` |
| 动态 | `#news` 中的 `.news-list`，全部直接展示 |
| 论文 | `#publications` |
| 经历、荣誉、学术服务 | `#experience`、`#honors`、`#service` |

### 添加论文

1. 在对应 `.publication-year` 中复制一个 `article.publication`；新年份需添加年份分组及 `.year-label` 标题。
2. 为论文设置唯一 `id`，例如 `paper-new-project`。
3. 更新标题、作者、期刊、链接和图片。`strong` 用于突出本人姓名。
4. 把框架图和 PDF 分别放进 `images/` 和 `files/`；注意路径大小写。

框架图采用 `object-fit: contain` 完整显示，点击可打开原图。头像文件为 `images/avatar.jpg`，裁剪由 `.profile-photo img` 控制；加载失败时显示姓名首字母。

### 添加动态

使用 `<time datetime="YYYY-MM">YYYY.MM</time>`，按时间倒序添加到 `#news` 中的 `.news-list`。所有动态直接展示，无需折叠或展开。

## 响应式与无障碍

- 宽屏：个人资料侧栏与正文双栏；足够高的桌面视口固定侧栏。
- 平板（≤980px）：资料移到正文顶部。
- 手机（≤700px）：可折叠导航，增大交互目标。
- 小屏（≤480px）：论文图文采用单栏。
- 使用设备实际宽度，支持缩放、键盘操作、可见焦点、跳转正文及减少动态效果偏好。
- 打印样式隐藏导航，打印完整论文列表。

样式变量位于 `styles.css` 的 `:root`。页面采用系统字体与 Georgia 衬线字体，无需加载第三方字体。

## 部署

推送仓库后，由已配置的 GitHub Pages 发布静态文件。请保留 `CNAME` 以继续使用原有自定义域名。也可将整个目录部署至其他静态网站托管服务。

## 联系图标来源

图标保存于 `images/icons/`，以 18px 显示，随页面从本地加载：

- 邮箱：[Google Material Icons 的 email 图标](https://github.com/google/material-design-icons/blob/master/src/communication/email/materialicons/24px.svg)，Apache 2.0 许可证见 `images/icons/LICENSE-material-icons.txt`。
- Google Scholar：[官方网站图标](https://scholar.google.com/favicon.ico)。
- GitHub：[官方 SVG 图标](https://github.githubassets.com/favicons/favicon.svg)，[品牌使用说明](https://brand.github.com/foundations/logo)。

Google Scholar 和 GitHub 标志的权利归各自品牌所有。
