# 烟标档案

当前维护和发布的唯一项目为 `somke-catalog`，正式网站：https://smoke.inneros.asia/ 。

126份档案、34个地区入口。当前使用34张新立绘和92张原有立绘；126份原图及网页展示图均保留。省份页爱心用于本地收藏，详情点赞进入累计人气榜；立绘支持放大与原图下载。

## 目录

- `dist/`：当前网页、脚本、样式及正在使用的图片。
- `data/2.0/`：当前档案、规格、图片来源、设计记录与立绘完整性清单。
- `data/provinces.json`：省份资料。
- `workers/`、`migrations/`：排行榜接口及数据库迁移。
- `tools/`：当前构建、预览与验证工具。
- `docs/`：维护与发布说明。

## 本地运行

需要 Node.js 22.13 或以上版本。

```powershell
npm run build
npm test
npm run preview
```

预览地址：http://127.0.0.1:4175/ 。预览服务运行期间，可在另一个终端执行 `npm run test:ui`，检查手机与桌面交互。浏览器测试使用独立测试数据库，不写入生产或本地收藏数据。

## 发布

主分支 `main` 推送后由 Cloudflare Workers 项目 `smoke-catalog` 自动部署。当前修改直接维护 `dist/index.html` 和 `dist/shared/`；构建命令只校验当前版本，不生成旧站。

2026-10-18 已清理历史原型、旧站、重复图片、旧截图及一次性迭代工具。历史版本通过 Git 历史恢复。发布细节见 [部署说明](docs/DEPLOYMENT.md)，资料维护见 [数据说明](docs/DATA.md)。
