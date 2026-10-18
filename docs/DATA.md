# 当前资料与图片

`data/2.0/exhibits.json` 是126份当前档案的数据源，与 `dist/shared/catalog.js` 的档案数据保持一致。`data/provinces.json` 保存34个地区资料。

- `archive-specs.json`：规格、条码、参考价及来源，与 `dist/shared/archive-specs.js` 同步。
- `image-rights-ledger.json`、`pack-photo-references.json`：包装图片来源与实拍参考记录。
- `cultural-sources.json`、`exhibit.schema.json`：文化资料来源及档案字段说明。
- `character-art-jobs.json`：34张现用新立绘的设计与生成记录，素材路径统一指向 `dist/`。
- `art-freeze.json`：126张现用立绘、378份图片文件的SHA256清单；保留原图、详情WebP和缩略WebP。

当前126张立绘由34张新图与92张原有图片组成。文件名中的 `v1` 表示创作版本；正在使用的92张 `v1` 图片属于当前站点素材，已保留。34个条目被新图替代的旧版图片与旧对照页已移除。

网页通常加载WebP，下载入口使用原始PNG。图片和角色的文件内容未因目录精简而改变。执行 `npm run build` 或 `npm test` 会检查素材存在、源数据同步及立绘哈希。

图片来源、权利和清晰度保持原有记录；角色为非官方原创，规格和条码为资料来源声明。
