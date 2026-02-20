# 身体信息框功能 - 实现计划

## [x] Task 1: 在试衣页面添加身体信息框元素
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 在tryon.wxml文件中，在上传人像照片的区域右下角添加一个身体信息框元素
  - 确保身体信息框元素的位置正确，位于两个选项的正中间
  - 添加条件渲染，确保只有当上传人像后才显示身体信息框
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-1.1: 身体信息框仅在上传人像后显示，未上传人像时不显示
  - `human-judgment` TR-1.2: 身体信息框显示在上传人像区域的右下角
- **Notes**: 身体信息框元素应该使用绝对定位来确保其位置正确

## [x] Task 2: 为身体信息框添加样式
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 在tryon.wxss文件中，为身体信息框添加样式
  - 实现毛玻璃特效、边缘弥散光等设计
  - 确保身体信息框样式与背景颜色和小程序整体风格保持一致
  - 添加平滑的过渡效果
- **Acceptance Criteria Addressed**: AC-6, AC-7
- **Test Requirements**:
  - `human-judgment` TR-2.1: 身体信息框样式与背景颜色和小程序整体风格保持一致
  - `human-judgment` TR-2.2: 身体信息框具有毛玻璃特效和边缘弥散光等设计
  - `human-judgment` TR-2.3: 身体信息框的显示和隐藏有平滑的过渡效果
  - `human-judgment` TR-2.4: 身体信息框在不同设备上保持一致的显示效果
- **Notes**: 可以使用backdrop-filter实现毛玻璃特效，使用box-shadow实现边缘弥散光效果

## [x] Task 3: 实现身体信息数据获取功能
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 在tryon.js文件中，实现从profile页面的身体数据获取默认数据的功能
  - 确保身体信息框显示格式为"身高/体重 性别"
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 身体信息框默认数据从profile页面的身体数据获取
  - `human-judgment` TR-3.2: 身体信息框显示格式为"身高/体重 性别"
- **Notes**: 可以通过wx.getStorageSync获取profile页面存储的身体数据

## [x] Task 4: 实现点击身体信息框弹出修改弹窗的功能
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - 在tryon.js文件中，实现点击身体信息框弹出修改弹窗的功能
  - 在tryon.wxml文件中，添加修改身体数据的弹窗，样式与profile页面的body-info-editor一致
  - 确保弹窗的样式与profile页面的body-info-editor一致
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 点击身体信息框可以弹出修改身体数据的弹窗
  - `human-judgment` TR-4.2: 弹窗的样式与profile页面的body-info-editor一致
- **Notes**: 可以参考profile页面的body-info-editor组件的实现

## [x] Task 5: 实现修改身体数据的功能
- **Priority**: P0
- **Depends On**: Task 4
- **Description**:
  - 在tryon.js文件中，实现修改本次试衣的身体数据的功能
  - 确保修改不会上传至用户身体信息数据库，仅作为后续填充prompt使用
  - 确保身体信息框显示修改后的数据
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgment` TR-5.1: 在弹窗中修改身体数据并确认后，身体信息框显示修改后的数据
  - `human-judgment` TR-5.2: 修改不会上传至用户身体信息数据库
- **Notes**: 可以将修改后的身体数据存储在页面的data中，仅在本次试衣中使用

## [x] Task 6: 验证身体信息框功能
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 测试身体信息框的显示和隐藏条件
  - 测试身体信息框的数据显示和格式
  - 测试点击身体信息框弹出修改弹窗的功能
  - 测试修改身体数据的功能
  - 测试身体信息框在不同设备上的显示效果
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**:
  - `human-judgment` TR-6.1: 所有验收标准都已满足
  - `human-judgment` TR-6.2: 身体信息框功能在不同设备上都能正常工作
- **Notes**: 可以使用微信开发者工具的设备模拟功能进行测试