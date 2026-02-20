# 全局语言支持扩展 - 验证清单

## 核心页面验证

- [ ] 试衣页面 (pages/tryon/tryon.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 历史页面 (pages/history/history.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 历史详情页面 (pages/history-detail/history-detail.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 个人中心页面 (pages/profile/profile.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 衣橱页面 (pages/wardrobe/wardrobe.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

## 其他页面验证

- [ ] 关于页面 (pages/about/about.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 身体信息页面 (pages/body-profile/body-profile.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 预览页面 (pages/preview/preview.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 试衣设置页面 (pages/tryon-settings/tryon-settings.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 上传衣物页面 (pages/upload-cloth/upload-cloth.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 上传照片页面 (pages/upload-photo/upload-photo.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

- [ ] 衣橱详情页面 (pages/wardrobe-detail/wardrobe-detail.wxml)
  - [ ] 页面标题使用 langData
  - [ ] 所有按钮文本使用 langData
  - [ ] 所有提示文本使用 langData
  - [ ] 语言切换时文本立即更新

## 配置和功能验证

- [ ] 全局语言管理工具 (utils/i18n.js)
  - [ ] 能正确初始化
  - [ ] 能正确加载保存的语言设置
  - [ ] 能正确切换语言
  - [ ] 能正确持久化语言设置
  - [ ] 能正确通知所有监听器语言变化

- [ ] App 集成 (app.js)
  - [ ] 能正确集成语言管理工具
  - [ ] 应用启动时能正确初始化语言设置
  - [ ] 能正确提供全局访问语言管理工具的方法

- [ ] 自定义标签栏 (custom-tab-bar/index.js)
  - [ ] 能正确使用语言管理工具
  - [ ] 标签栏文本能随语言切换而更新

- [ ] 语言配置文件
  - [ ] 简体中文配置文件完整
  - [ ] 繁体中文配置文件完整
  - [ ] 英文配置文件完整
  - [ ] 所有页面的文本都有对应的翻译

- [ ] 功能验证
  - [ ] 语言切换操作响应迅速，无明显延迟
  - [ ] 语言设置能正确持久化存储
  - [ ] 关闭并重新打开应用后，语言设置保持不变
  - [ ] 所有页面的语言支持正常工作

## 测试场景

- [ ] 场景 1: 首次启动应用
  - [ ] 应用能自动检测系统语言并设置为对应语言
  - [ ] 所有页面显示正确的语言文本

- [ ] 场景 2: 在设置页面切换语言
  - [ ] 所有页面的文本立即更新为所选语言
  - [ ] 标签栏文本立即更新为所选语言
  - [ ] 语言切换操作响应迅速，无明显延迟

- [ ] 场景 3: 关闭并重新打开应用
  - [ ] 应用保持上次选择的语言设置
  - [ ] 所有页面显示正确的语言文本

- [ ] 场景 4: 在不同页面间切换
  - [ ] 所有页面都显示正确的语言文本
  - [ ] 语言设置在页面间保持一致

## 性能和用户体验

- [ ] 语言切换操作响应时间不超过 1 秒
- [ ] 语言管理工具不影响应用启动速度
- [ ] 语言管理工具不影响应用运行性能
- [ ] 语言切换操作流畅，无卡顿现象

## 错误处理

- [ ] 语言配置文件缺失时，应用能使用默认语言
- [ ] 语言切换失败时，应用能保持当前语言设置
- [ ] 本地存储失败时，应用能使用默认语言设置