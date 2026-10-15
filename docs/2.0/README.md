# Smoke Archive 2.0 工作区

当前交付范围：G0基线、G1信息与六件内容种子、G2两套可点击视觉原型。当前关口：等待负责人选择A暖白策展或B深墨展厅，尚未进入G3。

运行`node tools/serve-v2.mjs`，打开 http://127.0.0.1:4180/prototypes/2.0/ 。目录已在本次会话启动本地预览服务。

- `INVENTORY.md`：旧版盘点、回退、路径与资产映射。
- `00-product-vision.md`、`IA.md`、`SCHEMA.md`：产品边界、页面树、三层内容模型。
- `STYLE-GUIDE.md`：双方向布局、视觉令牌、动效与手机规则。
- `04-curation-samples.md`：六件叙事与类型候选。
- `06-image-rights-ledger.md`：授权与高清边界，逐件数据位于data/2.0。
- `07-voting-spec.md`、`08-release-checklist.md`：后续投票与人工关口。
- `reviews/G0.md`、`G1.md`、`G2.md`：每阶段已做、截图、决策、通过/失败和下一步。
- `reviews/automated-results.json`：自动检测的实际结果。

复现：先运行本地服务，再运行`node tools/review-v2.mjs`。测试脚本使用本机Edge无头模式与Codex自带Playwright，仅本地浏览，不使用之前停用的computer-use技能。截图为浏览器模拟尺寸，不能冒充实体手机验收。

`tools/prepare-v2.mjs`生成种子快照、126条许可台账；已有baseline-manifest不覆盖。所有v1文件按SHA256复核，旧dist与main不变。此目录和prototypes都不被生产入口引用；没有运行发布。
