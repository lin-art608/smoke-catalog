# 当前主站已迁入main / dist

2026-10-15按负责人要求，主文件为dist/index.html，直接在main修改；预览npm run preview → http://127.0.0.1:4175/ 。构建npm run build、校验npm test。site-v2与下方内容为历史阶段记录，部署以docs/DEPLOYMENT.md为准。

# Smoke Archive 2.0 当前展示版

入口：http://127.0.0.1:4180/ （自动进入site-v2）。运行node tools/serve-v2.mjs。

负责人已选B并通过首批形象方向；随后修改范围：已完成形象保留、不再新增或替换，未完成全部沿用原有立绘。当前126件接入，34张新图＋92张原图；34件虚构故事与92件原作设计札记如实区分。

首页是地图＋省份，省内再展示烟标/角色卡片。搜索、筛选、分页、收藏、并置、角色揭示、图像细看、声明与专题均可操作。G2原型留档，不再是当前展示入口。

当前复现检查：

- node tools/validate-v2-presentation-data.mjs
- node tools/review-v2-hierarchy.mjs
- node tools/review-v2-presentation.mjs

截图与结果见reviews/G6.md及对应JSON。旧阶段脚本用于复现历史提交，不当成当前126件展示版的通用测试。浏览器检查为本机Edge模拟尺寸，不冒充实体手机验收，也不使用停用的computer-use技能。

图像冻结清单：data/2.0/art-freeze.json。新图原生PNG与WebP：site-v2/assets/characters/v2；完整内置image_gen提示词与记录：data/2.0/character-art-jobs.json，余下未生成任务已取消。原有dist及672份基线文件保持不变。

当前功能分支feat/smoke-archive-2.0；本地提交由用户在GitHub Desktop点Push origin同步。没有合并main、部署或开放真实公众投票。G7/G8与全量故事精修不宣称已完成。
