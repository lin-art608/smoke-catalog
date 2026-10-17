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

## 真实排行接口（2026-10-17已接通）

workers/preferences.mjs 提供 /api/preferences，wrangler.jsonc 声明 main、ASSETS 和 PREFERENCES D1绑定；/api/* 交给脚本，其余请求继续静态资产优先。

数据库 smoke-catalog-preferences 专用于烟标站，未使用或修改 InnerOS 数据库。迁移 migrations/0001_preferences.sql 已在远程应用。本地 SQLite 只存开发数据，不导入生产。

用户已明确同意 D1写入与Workers脚本发布授权，官方OAuth成功。2026-10-17已实际发布版本24bd41c8-4309-4de0-8111-cfc48b2286ae；今日/七日/累计接口均200、初始0票，主域名InnerOS仍200。生产检查不制造临时票数。

当前已允许真实匿名浏览器投票，每日一票可改选/撤票；不是跨设备、实名或严格防刷的公众调查。口径及限制在网页规则中公示。具体测试见 docs/2.0/reviews/preferences-live-automated.json。

数据库ID与绑定已写入仓库配置；用户需要在GitHub Desktop点Push origin将本地提交同步到main，后续自动构建才会沿用同一绑定。本轮不代替用户Git推送。本地预览需要Node >=22.13。

## 2026-10-17 独立点赞更新

远程迁移 0002_independent_likes.sql 已成功应用。新增 exhibit_likes 表，旧 preferences 表保留，旧版服务在 Push 前仍可运行。新版 Worker 按访客与条目独立记录点赞，取消仅删除指定条目；排行榜列出全部有人气的记录。旧记录迁移时按访客与条目去重。

本次不需要额外后台操作；直接 Push origin，等待 main 自动部署完成即可。页面缓存版本已更新。更新摘要见 CHANGELOG-2.0.md。
