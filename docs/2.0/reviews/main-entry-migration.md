# 主分支与部署入口迁移

2026-10-15负责人明确要求“直接在主文件里改，不要创建分支……我push”，替代此前的分支隔离约定。

先fetch确认origin/main已有合并提交8d51113；本地切回main并快进同步，未创建分支、未覆盖远端提交。

新版迁入dist/index.html及dist/shared，34张新图复制到dist/assets/characters/v2，所有图像内容保持冻结。旧首页以legacy.html留在同一目录，其余旧资源保留。根入口仍可以转到dist，便于根目录或dist两种静态托管。

构建/校验入口改为当前主站检查，不再执行旧首页生成；新增零依赖package.json与标准build/test/preview命令。移除原生PNG排除规则，避免原图链接在线404。

当前权威可编辑主文件为dist；site-v2与原型保留历史，不参与标准构建。检查npm run build、npm test，以及只托管dist的三档浏览器回归。原126份图像/378变体内容不变。

旧基线的dist/index.html、根index.html、README、构建/校验/预览脚本和部署说明按本次要求调整；历史G0–G6的“所有672文件未改”是当时记录，不再作为本次主入口迁移的约束。图片冻结仍有效。

本轮仅本地修改和提交，没有push、部署、DNS或Cloudflare配置修改。
