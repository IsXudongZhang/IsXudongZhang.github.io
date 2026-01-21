# Academic Homepage

个人学术主页网站，展示研究内容、出版物、新闻动态等信息。

## 文件结构

```
.
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── images/             # 图片文件夹
│   ├── avatar.jpg      # 个人头像（推荐：正方形，至少300x300px）
│   ├── AMG_framework.png
│   ├── Molormer_framework.png
│   ├── DeepFusion_framework.png
│   ├── TransFusionNet_framework.png
│   └── AMDE_framework.png
└── files/              # PDF文件文件夹（可选）
    ├── AMG.pdf
    ├── molormer.pdf
    ├── deepfusion.pdf
    ├── TransFusionNet.pdf
    └── AMDE.pdf
```

## 如何添加个人头像

1. 准备您的个人头像照片（建议格式：JPG或PNG，正方形图片）
2. 推荐尺寸：至少 300x300 像素（正方形）
3. 将图片保存到 `images/` 文件夹中，命名为 `avatar.jpg` 或 `avatar.png`
4. 头像会自动显示在页面顶部，如果图片不存在，会显示姓名首字母占位符

**注意：** 头像会自动裁剪为圆形，建议使用正方形图片以获得最佳效果。

## 如何添加模型框架图

1. 准备您的模型框架图（建议格式：PNG或JPG，宽度建议800-1200px）
2. 将图片保存到 `images/` 文件夹中，命名格式为：`[论文名称]_framework.png`
   - 例如：`AMG_framework.png`、`Molormer_framework.png` 等
3. 图片会自动显示在对应论文的摘要下方
4. 如果图片不存在，会自动隐藏（不会显示错误）

### 当前支持的框架图位置

- `images/AMG_framework.png` - AMG论文框架图
- `images/Molormer_framework.png` - Molormer论文框架图
- `images/DeepFusion_framework.png` - DeepFusion论文框架图
- `images/TransFusionNet_framework.png` - TransFusionNet论文框架图
- `images/AMDE_framework.png` - AMDE论文框架图

## 部署方法

### 方法1：GitHub Pages（推荐）

1. 在GitHub上创建一个新仓库
2. 将所有文件上传到仓库
3. 在仓库设置中启用GitHub Pages
4. 选择主分支作为源
5. 访问 `https://[your-username].github.io/[repository-name]/`

### 方法2：Netlify

1. 访问 [Netlify](https://www.netlify.com/)
2. 将项目文件夹拖拽到Netlify部署区域
3. 自动部署完成，获得一个免费域名

### 方法3：Vercel

1. 访问 [Vercel](https://vercel.com/)
2. 导入GitHub仓库或直接上传文件夹
3. 自动部署完成

### 方法4：传统Web服务器

1. 将所有文件上传到您的Web服务器
2. 确保 `index.html` 在网站根目录
3. 通过浏览器访问您的域名

### 方法5：本地预览

#### 方式1：使用Python（推荐）

在项目目录下打开终端，运行：

```bash
# Python 3（推荐）
python3 -m http.server 8000

# 或者如果python3命令不可用
python -m http.server 8000

# Python 2（如果只有Python 2）
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问：`http://localhost:8000`

#### 方式2：使用Node.js

如果已安装Node.js，可以使用 `http-server`：

```bash
# 安装http-server（只需安装一次）
npm install -g http-server

# 在项目目录下运行
http-server -p 8000
```

然后在浏览器中访问：`http://localhost:8000`

#### 方式3：直接打开文件

直接在浏览器中打开 `index.html` 文件即可预览（某些功能可能需要本地服务器，如图片加载等）。

## 自定义修改

### 修改个人信息

编辑 `index.html` 文件中的相应部分：
- 姓名和标题：在 `<header>` 部分
- 个人介绍：在 `#about` 部分
- 新闻动态：在 `#news` 部分
- 出版物：在 `#publications` 部分

### 修改样式

编辑 `styles.css` 文件，可以修改：
- 颜色主题（`:root` 变量）
- 字体大小和样式
- 布局和间距
- 响应式断点

### 添加新论文

在 `#publications` 部分复制一个现有的 `.publication` div，然后修改：
- 论文标题
- 作者列表
- 发表信息
- 链接
- 摘要
- 框架图路径（如果需要）

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

1. 确保所有图片路径正确
2. PDF文件链接需要放在 `files/` 文件夹中
3. 建议图片大小控制在2MB以内以加快加载速度
4. 定期备份您的文件

## 许可证

个人使用，请根据需要进行修改。
