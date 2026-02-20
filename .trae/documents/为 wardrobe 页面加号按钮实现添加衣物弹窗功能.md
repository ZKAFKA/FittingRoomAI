# 为 wardrobe 页面加号按钮实现添加衣物弹窗功能

## 一、修改 wardrobe.wxml 文件

### 1. 更新弹窗样式
- 修改 `modal-overlay` 类，将背景蒙版设为黑色
- 修改 `modal-content` 类，添加淡紫色边框发光效果，光的颜色为 #8b5cf6

### 2. 更新弹窗内容
- 修改衣服标签输入框的 placeholder，设置为 "为该件衣物标注，默认为空"
- 添加 AI 处理状态显示区域，用于显示 AI 处理进度和结果
- 修改弹窗底部按钮，在 AI 处理完成后显示 "重新上传" 和 "加入衣橱" 两个按钮

## 二、修改 wardrobe.js 文件

### 1. 添加数据状态
- 添加 `showAddClothModal` 状态，控制弹窗显示/隐藏
- 添加 `newClothImage` 状态，存储用户选择的图片
- 添加 `newClothCategory` 状态，存储用户选择的衣物类型
- 添加 `newClothTags` 状态，存储用户输入的标签
- 添加 `tagList` 状态，存储标签列表
- 添加 `aiProcessing` 状态，控制 AI 处理状态
- 添加 `aiProcessedImage` 状态，存储 AI 处理后的图片

### 2. 实现事件处理函数
- `showAddModal()`: 显示添加衣物弹窗
- `hideAddModal()`: 隐藏添加衣物弹窗
- `chooseImage()`: 选择并上传图片
- `selectNewCategory(e)`: 选择衣物类型
- `onTagInput(e)`: 处理标签输入
- `confirmAddCloth()`: 确认上传衣物，调用 AI 模型处理
- `generateImage()`: 调用云函数 generateImage-5lZKRP 处理图片
- `reUploadImage()`: 重新上传图片
- `addToWardrobe()`: 将处理后的衣物加入衣橱

### 3. 实现 AI 处理逻辑
- 调用云函数 generateImage-5lZKRP，传入图片和 prompt
- 实现 prompt 设计，用于去除衣物背景，将背景变为白色
- 处理 AI 模型返回的结果，更新 UI 状态

### 4. 实现加入衣橱逻辑
- 将处理后的图片上传到云存储中每个用户独立的衣橱文件夹
- 将衣物信息保存到数据库中
- 更新衣橱页面显示

## 三、关键流程记录

### 1. 弹窗显示流程
1. 用户点击加号按钮
2. 调用 `showAddModal()` 函数
3. 设置 `showAddClothModal` 为 true，显示弹窗

### 2. 图片上传流程
1. 用户点击上传图片区域
2. 调用 `chooseImage()` 函数
3. 调用 `wx.chooseImage()` 选择图片
4. 设置 `newClothImage` 为选择的图片路径

### 3. AI 处理流程
1. 用户点击确认上传按钮
2. 调用 `confirmAddCloth()` 函数
3. 检查衣物类型是否已选择
4. 调用 `generateImage()` 函数
5. 调用云函数 generateImage-5lZKRP，传入图片和 prompt
6. 处理 AI 模型返回的结果，设置 `aiProcessedImage` 和 `aiProcessing` 状态
7. 更新弹窗底部按钮为 "重新上传" 和 "加入衣橱"

### 4. 加入衣橱流程
1. 用户点击 "加入衣橱" 按钮
2. 调用 `addToWardrobe()` 函数
3. 将处理后的图片上传到云存储
4. 将衣物信息保存到数据库
5. 隐藏弹窗，刷新衣橱页面

## 四、技术要点

### 1. 弹窗样式设计
- 使用 CSS 阴影实现淡紫色边框发光效果
- 确保弹窗在各种屏幕尺寸下的适配

### 2. AI 模型调用
- 正确调用云函数 generateImage-5lZKRP
- 设计有效的 prompt 去除衣物背景

### 3. 云存储操作
- 为每个用户创建独立的衣橱文件夹
- 上传和管理用户的衣物图片

### 4. 数据库操作
- 存储用户的衣物信息，包括图片路径、类型、标签等
- 确保数据的安全性和隐私性

## 五、预期效果

用户点击 wardrobe 页面的加号按钮后，会弹出一个带有淡紫色边框发光效果的弹窗，背景为黑色蒙版。用户可以上传图片、选择衣物类型、添加标签，然后点击确认上传。系统会调用 AI 模型去除衣物背景，处理完成后，用户可以选择重新上传或加入衣橱。加入衣橱后，衣物会显示在用户的衣橱页面中。