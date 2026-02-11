## 实现计划

### 1. 分析当前代码结构
- Wardrobe 页面已存在 `category-nav` 元素，与试衣页面结构类似
- 需要在 `category-nav` 元素下方添加呼吸灯效果

### 2. 实现呼吸灯效果
- 在 `wardrobe.wxss` 文件中为 `category-nav` 元素添加 `::after` 伪元素
- 复制试衣页面的呼吸灯效果样式，包括：
  - 线性渐变背景
  - `breathing` 动画
  - 适当的 z-index 设置

### 3. 样式代码修改
- 修改文件：`pages/wardrobe/wardrobe.wxss`
- 在 `category-nav` 样式后添加以下代码：
  ```css
  .category-nav::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20rpx;
    right: 20rpx;
    height: 1rpx;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(123, 97, 255, 0.3) 20%, 
      rgba(123, 97, 255, 0.8) 50%, 
      rgba(123, 97, 255, 0.3) 80%, 
      transparent 100%);
    animation: breathing 5s ease-in-out infinite;
    z-index: 1;
  }
  
  @keyframes breathing {
    0%, 100% {
      opacity: 0.4;
      box-shadow: 0 0 10rpx rgba(123, 97, 255, 0.3);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 20rpx rgba(123, 97, 255, 0.6);
    }
  }
  ```

### 4. 验证效果
- 确保呼吸灯效果在导航栏下方正确显示
- 验证动画效果流畅自然
- 确保不影响其他元素的显示和交互

### 5. 响应式考虑
- 呼吸灯效果应在不同屏幕尺寸下保持一致
- 确保在各种设备上都能正确显示