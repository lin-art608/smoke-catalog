# Smoke Archive 2.0

当前主站直接位于 main 分支的 dist 目录。正式首页为 dist/index.html，不再依赖 site-v2 或原型目录。后续页面修改直接编辑 dist/index.html、dist/shared 下的脚本和样式。

地图首页 → 省份展厅 → 烟标/角色 → 详情。126件档案，34张新立绘和92张原有立绘固定保留，不再生成或替换。

## 本地检查与预览

运行 npm run build 和 npm test；运行 npm run preview 后打开 http://127.0.0.1:4175/ 。这些命令不会把首页覆盖回旧站。

## 部署

已连接 main → Cloudflare Workers 项目 smoke-catalog → https://smoke.inneros.asia/ 。在 GitHub Desktop 提交后点 Push origin，等待该提交自动部署成功即可刷新网页。

发布根目录为仓库根目录，wrangler.jsonc 明确项目名和资产目录；根入口跳至 dist。根 .assetsignore 仅发布入口和 dist。域名使用 smoke.inneros.asia/* 专属路由，主域名与邮件保持独立。旧 Pages 项目 somke-catalog 保留用于回退。完整说明与验证边界见 docs/DEPLOYMENT.md。

原站保留于 dist/legacy.html；site-v2和prototypes只作历史预览，不是部署入口。图片参考许可与清晰度仍按档案标记，角色与故事为非官方原创。公众投票未开放，未提供购买或消费推荐。
