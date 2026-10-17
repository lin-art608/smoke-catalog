# 网站发布：当前主站

## 已接通的正式发布链路（2026-10-17）

GitHub 仓库 lin-art608/somke-catalog 的 main → Cloudflare Workers 项目 smoke-catalog → 专属路由 smoke.inneros.asia/*。

- 已核验仓库连接、生产分支 main、自动构建未禁用；最新提交 8228a72 已由 Git 推送触发并部署成功。
- 已在后台保存 smoke.inneros.asia/* 路由，仅匹配烟标子域名，不使用 *.inneros.asia/*。
- 原有 smoke CNAME → somke-catalog.pages.dev 保留并开启代理，Worker 路由优先提供新版静态文件；旧 Pages 项目保留作回退。
- 主域名 @ → inneros.pages.dev 及邮件 MX/TXT 记录均未修改；已访问确认 InnerOS 主站 HTTP 200。
- 当前发布根目录为仓库根目录，根 index.html 跳转至 dist/index.html，浏览器实际到达 /dist/。网页源文件仍只维护 dist。

## 后续操作

1. 在 main 修改 dist 下的页面、脚本或样式。
2. npm run build / npm test 检查后，在 GitHub Desktop 提交并点 Push origin。
3. Cloudflare 的 smoke-catalog 自动构建并部署；等最新提交显示成功，再刷新 https://smoke.inneros.asia/。

后台当前构建命令 npm run build，部署命令 npx wrangler deploy，根目录 /。根 wrangler.jsonc 明确 name=smoke-catalog、assets.directory=.，避免把仓库拼写 somke-catalog 当成 Worker 名称创建或更新其他项目。根 .assetsignore 仅允许发布 index.html 和 dist；配置、源码数据、Git 历史均不作为网页资产。

路由在后台管理，wrangler.jsonc 不声明 route/routes，不用空 routes 数组覆盖后台设置。参考 Cloudflare 官方 Wrangler 配置与路由说明：
https://developers.cloudflare.com/workers/wrangler/configuration/
https://developers.cloudflare.com/workers/configuration/routing/routes/

本次没有额外推送测试提交；核验了已有 Git 触发部署、保存后的路由以及正式站点路径。新增发布配置需由负责人按既定流程 Push origin。

## 已完成验证

正式域名根入口返回 200 并跳转 dist；暖纸首页、34 个省份、江苏9件剪影与烟盒、完整立绘及原尺寸图、详情声明均通过手机浏览器检查，无脚本或资源错误。新旧立绘保持冻结。

## 回退

在 smoke-catalog 的域页面移除 smoke.inneros.asia/* 专属路由，可恢复由原有 Pages 项目提供同一子域名。不要删除主域名记录、不要修改邮件记录、不要删除旧 Pages 项目。

## 备用手动发布

旧 Pages 项目 somke-catalog 没有 Git 连接。手动发布 Pages 不会替代 Workers 正式发布链路；需要回退时可使用原有 Pages 发布方法：

    npx wrangler pages deploy dist --project-name somke-catalog --branch main

登录配置与密钥不加入 Git。原型 site-v2 / prototypes 保留历史参考，勿作为生产输出。本地 npm run preview 仅提供 dist： http://127.0.0.1:4175/ 。

## 本轮排行接口准备

角色优先与地域主题更新同时新增 workers/preferences.mjs，wrangler.jsonc 声明 main 和 ASSETS，/api/* 交给脚本。尚未获补充云端权限，未创建或绑定 D1；无 PREFERENCES 绑定时接口明确503，绝不伪造排名。真实排行接通后须先执行 migrations/0001_preferences.sql。详细状态见 docs/2.0/reviews/region-experience.md。

本地预览需要 Node >=22.13，SQLite 数据只在 .cache，标记本地预览并不导入线上。
