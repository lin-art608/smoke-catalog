# Smoke Archive · 香烟图鉴

当前本地交付：100款主清单 + 26款地区补充，共126款、126张独立原创立绘，覆盖31个地区。更新日期：2026-10-14。

主网页保留地图、角色剪影揭示、规格与包装来源详情、本地收藏；原画总览提供名称/条码搜索、品牌/地域/支型联合筛选。

打开dist/index.html，或运行 `node tools/serve-current-gallery.mjs` 后访问 http://127.0.0.1:4175/ 。

- 构建：`node tools/build-current-gallery.mjs`（`build-catalog.mjs`同样构建当前图鉴）
- 校验：`node tools/validate-current-gallery.mjs`
- 图片透明与去重：`./tools/check-current-art.ps1`
- 主清单：`data/current-20261013/catalog.json`
- 地区补充：`data/current-20261013/regional-supplement.json`
- 提示词与完成记录：`data/current-20261013/character-jobs.json`
- 图片：`dist/assets/characters/sku-current-20261013/`
- 资料与交付说明：`docs/REGIONAL_SUPPLEMENT_20261014.md`

清单为常见规格与地区代表选集，未证实全国销量排名。明确停产或待上市的条目排除；上市状态、条码和包装来自资料页声明，不等于实时库存或实物认证。包装参考图的高清与转载许可尚未完成认证。澳门条目的地域是企业品牌关联，未认证逐款制造地。

西藏、青海、宁夏本轮缺少可靠现售本地规格证据，页面明确说明资料缺口。所有角色为非官方原创成年人物，事实资料与创作设定分开保存。旧资料与历史进度文件保留回退，不参与当前展示。
