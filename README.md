# 妆配小程序 MVP（WeChat Mini Program）

## 1. 当前版本定位
- 主场景：婚礼跟妆
- 轻场景：约会妆 / 拍摄妆 / 面试妆
- 当前业务模式：免费撮合（不接入支付）

## 2. 技术结构
- `app.js / app.json / app.wxss`：全局配置与主题
- `components/luxury-header`：统一头部（返回、右侧动作）
- `components/bottom-nav`：双角色底部导航
- `data/mock.js`：MVP 演示数据
- `utils/store.js`：本地状态仓库（跨页面数据同步）
- `pages/*`：按场景拆分页面

## 3. 页面分层
### C 端（新娘）
- `role-select` 角色选择
- `home` 首页
- `checklist` 备婚清单
- `ai-match-entry / flow / loading / result` AI 匹配流程
- `artist-detail` 化妆师详情
- `booking-form` 预约表单
- `bookings` 我的订单
- `order-detail` 订单详情
- `chat` 沟通页
- `profile / saved-artists / settings` 个人中心相关

### B 端（化妆师 CRM）
- `crm` 日程总览
- `crm-clients` 客户列表
- `crm-client-detail` 客户详情与备注
- `crm-appointment-detail` 预约详情与会话备注
- `crm-profile` 化妆师主页

## 4. 本地运行
1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择：`D:\\jzmx\\UI\\miniprogram4\\miniapp`
4. AppID 可先用测试号（或无 AppID 体验模式）
5. 编译后从 `pages/role-select/index` 进入

## 5. 近期建议（下一迭代）
1. 接入真实后端（用户、订单、预约、消息）
2. AI 匹配问卷改为可配置（后台可调权重）
3. 日程页接入日历视图与冲突检测
4. 引入埋点（匹配完成率、预约转化率、复购率）
5. 支付能力预留接口保持关闭，待许可证完善后再上线

## 6. 云开发接入（本次已落地）
### 已实现
- `app.js` 启动时支持 `wx.cloud.init` 初始化（可切本地 / 云开发模式）
- 本地 `store` 写入后异步上云快照（云函数：`data-api`）
- 启动时可拉取云端最新快照覆盖本地数据（按 `updatedAt` 比较）
- AI 匹配支持云函数兜底（云函数：`ai-match`）
- 设置页新增「后端与云开发」配置区（环境 ID、模式、手动同步）

### 使用步骤
1. 在微信开发者工具中创建并绑定云环境
2. 打开设置页，填入云环境 ID 并保存
3. 在开发者工具上传并部署云函数：
   - `cloudfunctions/data-api`
   - `cloudfunctions/ai-match`
4. 部署完成后点击设置页「立即同步」验证联通性

## 7. 交付校验文档
- UI 对齐清单：`D:\jzmx\UI\miniprogram4\docs\ui-parity-checklist.md`
- 素材合规说明：`D:\jzmx\UI\miniprogram4\docs\assets-compliance.md`
