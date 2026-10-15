# Smoke Archive 2.0

当前主站直接位于 main 分支的 dist 目录。正式首页为 dist/index.html，不再依赖 site-v2 或原型目录。后续页面修改直接编辑 dist/index.html、dist/shared 下的脚本和样式。

地图首页 → 省份展厅 → 烟标/角色 → 详情。126件档案，34张新立绘和92张原有立绘固定保留，不再生成或替换。

## 本地检查与预览

运行 npm run build 和 npm test；运行 npm run preview 后打开 http://127.0.0.1:4175/ 。这些命令不会把首页覆盖回旧站。

## 部署

生产分支 main，构建命令 npm run build，输出目录 dist。也可省略构建命令，直接发布已提交的dist文件。完整说明见 docs/DEPLOYMENT.md。

GitHub Desktop保持main，本地提交完成后点Push origin。Git关联部署与手动上传是两种方式；如果Pages项目仍是直接上传模式，仅push不会自动更新该项目。

原站保留于 dist/legacy.html；site-v2和prototypes只作历史预览，不是部署入口。图片参考许可与清晰度仍按档案标记，角色与故事为非官方原创。公众投票未开放，未提供购买或消费推荐。
