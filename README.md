# Xudong Zhang · Academic Homepage

轻量静态学术主页，使用 HTML、CSS 和原生 JavaScript，可直接部署到 GitHub Pages，无构建步骤或外部字体依赖。

## 页面内容

- 个人资料、导师与实验室、邮箱、Google Scholar 和 GitHub
- 个人介绍中的研究方向（AI4Science：药物发现、抗体发现、虚拟细胞与器官、自动化实验室）与合作联系入口
- 按时间倒序完整展示的动态
- 按年份排列的论文，支持主题筛选及标题、作者、期刊关键词搜索
- 研究经历、荣誉奖项和学术服务
- 论文 PDF、代码及可单独查看的完整框架图

现有论文、作者、发表信息与链接沿用原主页。新增研究方向说明及动态来自已有资料，不自动推断新的发表记录。

## 文件结构

```text
index.html           页面内容和论文条目
styles.css           学术排版、响应式布局与打印样式
script.js            移动导航、论文筛选、搜索、导航高亮
images/              头像、框架图和 favicon.svg
files/               论文 PDF
CNAME                原有自定义域名配置
```

## 本地预览

在项目目录运行：

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000`。也可直接打开 `index.html`。禁用 JavaScript 时，全部论文、章节导航及历史动态仍可访问；筛选和搜索工具仅在 JavaScript 可用时显示。

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
3. 设置 `data-topic`：`Drug Discovery`、`AI for Science` 或 `Computer Vision`。增加类别时，同时增加带匹配 `data-filter` 的筛选按钮。
4. 更新标题、作者、期刊、链接和图片。`strong` 用于突出本人姓名。
5. 把框架图和 PDF 分别放进 `images/` 和 `files/`；注意路径大小写。
6. 更新供屏幕阅读器使用的初始统计文字；启用 JavaScript 后，统计会自动计算。年份标题只展示年份。

框架图采用 `object-fit: contain` 完整显示，点击可打开原图。头像文件为 `images/avatar.jpg`，裁剪由 `.profile-photo img` 控制；加载失败时显示姓名首字母。

### 添加动态

使用 `<time datetime="YYYY-MM">YYYY.MM</time>`，按时间倒序添加到 `#news` 中的 `.news-list`。所有动态直接展示，无需折叠或展开。

## 响应式与无障碍

- 宽屏：个人资料侧栏与正文双栏；足够高的桌面视口固定侧栏。
- 平板（≤980px）：资料移到正文顶部。
- 手机（≤700px）：可折叠导航，增大交互目标。
- 小屏（≤480px）：论文图文采用单栏。
- 使用设备实际宽度，支持缩放、键盘操作、可见焦点、跳转正文及减少动态效果偏好。
- 打印样式隐藏导航和筛选工具，打印完整论文列表，并在打印后恢复筛选状态。

样式变量位于 `styles.css` 的 `:root`。页面采用系统字体与 Georgia 衬线字体，无需加载第三方字体。

## 部署

推送仓库后，由已配置的 GitHub Pages 发布静态文件。请保留 `CNAME` 以继续使用原有自定义域名。也可将整个目录部署至其他静态网站托管服务。
