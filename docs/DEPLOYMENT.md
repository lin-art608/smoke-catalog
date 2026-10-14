# 网站发布

2026-10-14 已确认 GitHub 的 main 分支包含提交 d1afd8084a91569689072a04566225b9ac91ada7。

Cloudflare Pages 独立项目：`somke-catalog`。发布目录：`dist`。生产分支标记：`main`。

- 公开地址：https://somke-catalog.pages.dev/
- 本次部署：https://cd351e53.somke-catalog.pages.dev/
- 目标域名：https://smoke.inneros.asia/

公开地址已返回 HTTP 200，首页显示126款、126张立绘。原 InnerOS 项目与 inneros.asia 未修改。

## 域名待完成步骤

Cloudflare 后台：Workers & Pages → somke-catalog → Custom domains → Set up a custom domain，输入 `smoke.inneros.asia`，确认提示的 DNS 记录。

如果后台要求手动添加：类型 CNAME，名称 smoke，目标 somke-catalog.pages.dev，TTL 自动。必须同时在 Pages 项目添加自定义域名，仅创建 CNAME 不构成完整绑定。

已通过 API 将 `smoke.inneros.asia` 添加到正确的 `somke-catalog` 项目。用户最初误加在 `inneros` 项目中的同名子域绑定已移除，`inneros.asia` 根域绑定保留。

用户修正 smoke CNAME 后，2026-10-14 实测 https://smoke.inneros.asia/ 返回 HTTP 200，标题为 Smoke Archive，首页显示126款、126张立绘，HTTPS 校验通过。

## 连接仓库时的25 MiB限制

Cloudflare 的25 MiB是单个静态资源文件上限，不是整个网页总大小。当前最大PNG约2.65 MiB，263个发布文件已经成功直接部署。

Pages 连接仓库时选择构建输出目录 `dist`，构建命令可留空（网页已预构建），生产分支 `main`。

如果使用 Workers 的静态资源部署，同样选择 `dist` 作为资源目录。仓库根目录的 `.assetsignore` 只允许 index.html 与 dist，避免把 .git 的历史打包文件或数据目录误发布为静态资源。dist/.assetsignore 则保护直接以 dist 为资源目录的情形。`.gitignore` 用于禁止缓存与压缩包等未来加入Git，不会取消已跟踪文件。

参考：[Cloudflare Pages 文件限制](https://developers.cloudflare.com/pages/platform/limits/)；[Workers 静态资源忽略规则](https://developers.cloudflare.com/workers/static-assets/binding/)。

## 更新网页

当前采用本地文件直接部署。GitHub 保存源码；仅推送 GitHub 不会自动更新这个 Pages 项目。

更新后运行：

```powershell
node tools/build-current-gallery.mjs
node tools/validate-current-gallery.mjs
npx wrangler pages deploy dist --project-name somke-catalog --branch main
```

Cloudflare 登录凭据留在本机 Wrangler 配置中，没有加入 GitHub 仓库。
