# 网站发布：当前主站

2026-10-15：按负责人最新要求，直接在main分支维护主站；旧开发分支的成果已经整合，不再创建新分支。新版实际发布入口为dist/index.html，旧站保留为dist/legacy.html。

## 本次修复

原先新版在site-v2，但发布目录仍为dist；原构建脚本还会生成旧版首页。因此，即使main已经合并，发布结果也可能仍是旧站。现在新版入口、shared脚本/样式、34张新图及全部引用资源均在dist之内，不再请求../dist或site-v2。

标准构建命令npm run build，以及原命令node tools/build-current-gallery.mjs、node tools/build-catalog.mjs均检查当前主站，不再重建旧页面。npm test和node tools/validate-current-gallery.mjs也改为检查当前版本。后续直接编辑dist，不从历史site-v2覆盖回来。

原尺寸PNG入口需要可发布的PNG；已移除旧的角色PNG忽略规则。卡片仍只加载WebP，原尺寸图在用户打开链接时才请求。所有126份原图和378份图像变体的内容与冻结哈希一致。

## Git关联部署的配置

|设置|值|
|---|---|
|生产分支|main|
|项目根目录|仓库根目录|
|构建命令|npm run build（或留空，使用已提交的dist）|
|输出/静态资源目录|dist|

在GitHub Desktop保持main，点击Push origin。若Pages/Workers项目已经连接GitHub仓库，按该项目的构建配置触发部署。不要把输出目录填成site-v2或原型路径。

## 原来的直接上传方式

本仓库较早的发布记录使用Cloudflare Pages直接上传，项目名somke-catalog。当前本轮没有修改Cloudflare账户或核验其Git关联状态。若项目仍是直接上传模式，仅push不会自动部署；使用原流程：

    npm run build
    npm test
    npx wrangler pages deploy dist --project-name somke-catalog --branch main

此命令会实际发布，应由负责人在确认后运行；本轮未执行。登录配置不加入Git。

## 本地独立验证

运行npm run preview，在http://127.0.0.1:4175/查看，只提供dist目录。自动浏览器验证：node tools/review-main-deployment.mjs（本机Edge＋Codex所带Playwright）。结果和截图见docs/2.0/reviews/main-deployment-automated.json。

旧域名记录为smoke.inneros.asia、somke-catalog.pages.dev；本轮未查询或修改DNS、绑定、线上内容。
