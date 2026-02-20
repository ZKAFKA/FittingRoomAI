# Tryon页面开始试衣按钮 - 产品需求文档

## Overview
- **Summary**: 在tryon页面底部添加一个"开始试衣"按钮，实现从人像照片和选中衣物生成试衣效果的功能
- **Purpose**: 提供便捷的试衣功能入口，简化用户操作流程，提升试衣体验
- **Target Users**: 使用FittingRoomAI+微信小程序的用户

## Goals
- 在tryon页面底部添加"开始试衣"按钮，位置固定在tabbar上方20rpx
- 实现点击按钮后的完整试衣流程，包括条件检查、prompt生成、图片生成和结果展示
- 确保按钮在各种屏幕尺寸下的响应式显示
- 提供良好的用户交互反馈和错误处理

## Non-Goals (Out of Scope)
- 修改现有的tabbar布局和样式
- 改变其他页面的功能和布局
- 添加新的权限请求

## Background & Context
- 当前tryon页面已实现了人像照片上传和衣物选择功能
- 系统已集成了混元生图3.0大模型用于图片生成
- 云存储功能已可用，用于存储生成的试衣结果

## Functional Requirements
- **FR-1**: 添加"开始试衣"按钮，包含指定的样式和交互效果
- **FR-2**: 实现点击按钮后的条件检查（人像照片和衣物选择）
- **FR-3**: 根据选中衣物品类生成对应的prompt
- **FR-4**: 调用hunyuanGenerateImage函数生成试衣效果
- **FR-5**: 将生成结果保存至云存储空间
- **FR-6**: 在上传图片区域反显示生成的试衣结果
- **FR-7**: 添加重新上传按钮和长按保存功能
- **FR-8**: 清除已选中衣物的勾选状态

## Non-Functional Requirements
- **NFR-1**: 按钮在各种屏幕尺寸下保持响应式显示
- **NFR-2**: 实现完整的错误处理机制
- **NFR-3**: 保证图片加载和生成过程中的用户体验
- **NFR-4**: 所有状态变化添加平滑过渡效果

## Constraints
- **Technical**: 微信小程序环境，使用现有混元生图API
- **Dependencies**: 依赖云存储功能和hunyuanGenerateImage函数

## Assumptions
- hunyuanGenerateImage函数已实现并可调用
- 云存储功能已配置完成
- 用户已授权相关权限

## Acceptance Criteria

### AC-1: 按钮布局与样式
- **Given**: 用户打开tryon页面
- **When**: 页面加载完成
- **Then**: 底部显示"开始试衣"按钮，位置固定在tabbar上方20rpx，尺寸宽度80%，高度50rpx，采用渐变色背景，圆角xl，粗体字体，字号lg，添加primary-glow效果
- **Verification**: `human-judgment`

### AC-2: 按钮交互效果
- **Given**: 用户与按钮交互
- **When**: 用户hover或点击按钮
- **Then**: hover时亮度提升10%，active时缩放至0.98倍，所有状态变化添加平滑过渡效果
- **Verification**: `human-judgment`

### AC-3: 条件检查
- **Given**: 用户点击"开始试衣"按钮
- **When**: 系统检查用户是否已上传人像照片和选中衣物
- **Then**: 若任一条件未满足，显示对应提示信息；若条件齐全，继续生成流程
- **Verification**: `programmatic`

### AC-4: 图片生成与存储
- **Given**: 条件检查通过
- **When**: 系统调用hunyuanGenerateImage函数
- **Then**: 生成试衣上身结果并保存至云存储空间tryon-results下的用户独立文件夹，保存时长3个月
- **Verification**: `programmatic`

### AC-5: 结果展示
- **Given**: 图片生成完成
- **When**: 系统处理生成结果
- **Then**: 在上传图片区域反显生成的试衣结果，左下角添加重新上传按钮，支持长按保存，清除已选中衣物的勾选状态
- **Verification**: `programmatic`

### AC-6: 响应式显示
- **Given**: 用户在不同屏幕尺寸的设备上访问页面
- **When**: 页面加载或屏幕尺寸变化
- **Then**: 按钮在各种屏幕尺寸下保持正确的布局和样式
- **Verification**: `human-judgment`

### AC-7: 错误处理
- **Given**: 试衣过程中发生错误
- **When**: 系统捕获错误
- **Then**: 显示友好的错误提示，不影响页面其他功能
- **Verification**: `programmatic`

## Open Questions
- [ ] hunyuanGenerateImage函数的具体参数和返回值格式
- [ ] 云存储的具体配置和访问方式
- [ ] 图片生成的具体时长和性能优化策略