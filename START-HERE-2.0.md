# 当前主站入口

现在直接在 main 分支修改主站，不再创建开发分支。

- 主文件：dist/index.html
- 页面逻辑与样式：dist/shared/
- 图片：dist/assets/
- 本地预览：npm run preview，然后打开 http://127.0.0.1:4175/
- 检查：npm run build 与 npm test
- 部署：生产分支main、输出目录dist。

GitHub Desktop中Current Branch应为main；本次改动已本地提交，点Push origin即可同步GitHub。如部署平台未连接GitHub，需要按docs/DEPLOYMENT.md执行原有手动上传流程，push本身不会代替上传。

34张新图、92张原图保持不变。旧站保留在dist/legacy.html。site-v2与A/B原型是历史预览，后续以dist主文件为准。
