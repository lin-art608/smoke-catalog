# 三层内容模型

数据源：`data/2.0/seeds.json`；机器结构：`data/2.0/exhibit.schema.json`。原型快照由`node tools/prepare-v2.mjs`同步到`prototypes/2.0/shared/seeds.js`。

| 分区 | 字段 | 当前规则 |
| --- | --- | --- |
| 身份 | id、name、brand、provinceId、region、packagingVersion | 沿用v1，不以地域关联证明制造地；版本未知为null |
| 包装 | packFront、imageRights、imageResolution | 许可与清晰度单独保存，均不自动升级 |
| 事实 | observations[3]、observationEvidence、sourceReferences | 精确描述可见颜色、形状、位置；记录本地照片与检查日期 |
| 解读 | reading、themes | 明确为编辑的构图阅读，非官方释义 |
| 创作 | type、alternative、translations[3]、lore、loreKind | 两个候选方向；三组具体映射；120–250字原创短篇 |
| 角色图 | portrait、preview、characterStatus | 保留v1布局占位，不能声称已生成v2 |
| 民间说法 | folkSayings | 本批为空；缺少来源不补造 |
| 延伸 | relatedIds[2–4] | 同主题优先，然后补充不同视觉作品 |
| 互动 | votes.status、votes.count | G7前not-open和null，不显示虚构热度 |

来源确定性使用`source-claim-not-independently-verified`，指继承原资料声明，非本轮新近线上核验。可见观察只以本地图片为依据，不由模糊照片推断历史、官方含义或许可。

图片许可为`permission-unconfirmed`，`publicReplacementAllowed=false`；高清认证为`hdVerified=false`。像素数、AI超分或文件大小不能自动改变许可和高清认证。

后续G4可扩充结构化`brandHistory[]`、`symbolism[]`、有证据的`folkSayings[]`；后续G5可增加v2资产ID和两套剪影候选评分。公众计票字段必须由G7后服务端提供，禁止客户端样板数字进入生产榜单。
