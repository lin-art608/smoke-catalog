# Smoke Archive 2.0 工作区

当前：负责人已选择B深墨展厅；G0–G4完成，G5二十件角色样板已实现并自审，等待美术方向确认。未进入G6。

运行node tools/serve-v2.mjs，在本地查看：

- B版完整样板：http://127.0.0.1:4180/site-v2/
- 二十件角色对照与剪影审阅：http://127.0.0.1:4180/site-v2/art-review.html
- G2双稿归档：http://127.0.0.1:4180/prototypes/2.0/

产品边界见00-product-vision.md；三层模型见SCHEMA.md；角色候选、映射、待人审问题见05-character-bible.md；图片边界见06-image-rights-ledger.md；各阶段检查见reviews/G0.md至G5.md。

复现：在本地服务运行时执行node tools/review-v2-site.mjs（SMOKE_REVIEW_STAGE设为G5）和node tools/review-v2-art-page.mjs。采用本机Edge无头浏览与Playwright模拟尺寸，不冒充实体手机检查，不使用停用的computer-use技能。

新图用内置image_gen生成，原生PNG与WebP位于site-v2/assets/characters/v2，完整提示词和哈希在data/2.0/character-art-jobs.json。G4生成脚本在检测到已接入的v2图时会停止，避免误覆盖美术字段。

672个v1文件按SHA256复核；dist、main、回退分支及G2原型保留。当前功能分支feat/smoke-archive-2.0，仅本地提交，按用户原流程由GitHub Desktop推送。
