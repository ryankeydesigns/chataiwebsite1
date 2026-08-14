# 大学生个人网站

一个轻量、响应式的中文个人主页，适合大学生展示个人介绍、技能、项目、校园经历与联系方式。

## 功能

- 响应式单页布局
- 深色 / 浅色主题切换
- 移动端导航
- 滚动进入动画
- 无框架、无需构建，可直接部署到 GitHub Pages

## 修改个人资料

打开 `index.html`，搜索以下占位内容并替换：

- `Ryan`、`RY`
- `你的大学 · 你的专业`
- 项目标题与介绍
- `hello@example.com`
- 社交账号链接

## 本地预览

直接打开 `index.html`，或运行：

```bash
python3 -m http.server 8000
```

随后访问 `http://localhost:8000`。

## 部署

在仓库的 **Settings → Pages** 中，将 Source 设为 **Deploy from a branch**，选择 `main` 分支和根目录 `/ (root)`。
