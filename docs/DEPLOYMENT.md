# 部署与维护

主项目：`somke-catalog`。发布链路：GitHub `lin-art608/somke-catalog` 的 `main` → Cloudflare Workers `smoke-catalog` → https://smoke.inneros.asia/ 。

## 日常发布

1. 修改 `dist/` 中的当前网页；数据源保存在 `data/2.0/`。
2. 执行 `npm run build`、`npm test`；界面有变动时另运行预览和 `npm run test:ui`。
3. 本地提交后在 GitHub Desktop 点击 **Push origin**，等待自动部署成功。

后台构建命令为 `npm run build`，部署命令为 `npx wrangler deploy`，根目录为仓库根目录。根 `index.html` 跳转 `dist/`；`.assetsignore` 只发布根入口与 `dist/`，不发布数据源、工具、Git 历史和本地缓存。

`wrangler.jsonc` 固定项目名 `smoke-catalog`，静态资源绑定为 `ASSETS`，排行榜数据库绑定为 `PREFERENCES`。`/api/*` 先经过 Worker，其余请求由静态资源服务。

## 域名

专属路由 `smoke.inneros.asia/*` 在 Cloudflare 后台管理，配置文件不声明空 routes。保留主域名与邮件配置；仅维护烟标站子域名。旧 Pages 项目可由后台单独管理，本地不再维护旧版副本。

## 数据库

数据库为 `smoke-catalog-preferences`。`0001_preferences.sql` 和 `0002_independent_likes.sql` 已在远程应用，后续仍需保留迁移文件。

新版按访客与角色独立记录点赞，取消只影响指定角色；排行榜按累计点赞排序、同票并列。旧投票迁移后按访客与角色去重，原表保留。

增加迁移时，发布新 Worker 前运行：

```powershell
npx wrangler d1 migrations apply smoke-catalog-preferences --remote
```

本地预览只使用 `.cache/local-preferences.sqlite`，不导入生产。浏览器自动测试使用内存数据库。登录状态与密钥不提交 Git。

## 历史恢复

早期原型、旧站入口和旧迭代截图已从当前目录移除。需要参考历史版本时，从 Git 历史查看对应提交，不重新复制一套发布目录。
