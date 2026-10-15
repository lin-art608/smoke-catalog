# v1基线与v2工作区盘点

基线提交：92820bdea6a4fa902db685bfbad0fb0b7ecdea74。当前分支feat/smoke-archive-2.0，回退分支archive/v1-before-2.0。G0检查时工作区干净，main与基线相同。

| 资源 | 实测 |
| --- | --- |
| 已跟踪基线文件 | 672 |
| 主清单 / 地区补充 | 100 / 26 |
| 省级入口 / 有收录地区 | 34 / 31 |
| 原始角色PNG | 126 |
| 角色WebP（含缩略图） | 252 |
| 当前包装样本 | 126 |
| 新角色v2 | 0，G5以后 |
| 公众票数 | 未开放 |

原包装质量声明分布：{"source-thumbnail-not-HD":124,"supplier-reference-not-HD-certified":2}。许可全部待确认；不能由文件格式和像素数推断授权。

旧页面：dist/index.html（地域/地图主站）、dist/current-gallery.html（搜索及原画总览）、根index.html（跳转入口）。旧页面与所有原资产均未修改。

旧数据：data/current-20261013下的catalog、regional-supplement、character-jobs、web-portraits、分类与验证报告。已阅读README、三份docs、实际页面脚本、地图交互与六件原始包装。

新工作区：prototypes/2.0（原型）、data/2.0（种子/模型/许可/哈希）、docs/2.0（规划/审查/截图）、tools/prepare-v2.mjs、serve-v2.mjs、review-v2.mjs。新目录不在dist内，生产入口不引用它们。

已有能力：本地收藏、地图、搜索、剪影、WebP、详情细看。缺口：来源核验和授权高清、20件精修故事、v2多形态角色、公众投票后端、符号热区与比较的正式实现。

资产映射表：data/2.0/baseline-manifest.json记录每个v1文件的原路径、字节数和SHA256；image-rights-ledger.json将126件ID对应到包装及原来源；seeds.json映射六件v1角色与v2候选设定。

本地预览：node tools/serve-v2.mjs → http://127.0.0.1:4180/prototypes/2.0/ 。同一服务的/dist/index.html为冻结旧版。未发布、未合并、未更改线上域名。
