# 个人信息页面数据持久化问题分析报告

## 问题概述

分析 `pages/profile-info/profile-info.js` 中的保存逻辑，重点关注 `saveProfile` 函数、`onUnload` 函数和数据库操作，以找出数据不持久化的原因。

## 代码分析

### 1. 关键函数分析

#### saveProfile 函数 (409-539行)

**主要功能**：保存用户个人信息到数据库

**关键步骤**：
1. 获取用户 openid
2. 从 `userInfo` 中提取需要保存的字段
3. 保存用户基本信息到 `users` 集合
4. 保存身体信息到 `body_profile` 集合
5. 更新 `initialUserInfo` 以便下次比较
6. 显示保存成功提示（仅主动保存时）

**潜在问题**：
- 数据库操作是异步的，但在页面卸载时可能被中断
- 没有对数据库操作失败进行详细处理
- 在更新 `initialUserInfo` 后，没有等待 `setData` 回调完成

#### onUnload 函数 (64-71行)

**主要功能**：页面卸载时自动保存用户信息

**关键步骤**：
1. 检查用户信息是否有修改
2. 设置 `isActiveSave` 为 false
3. 调用 `saveProfile` 函数保存信息
4. 打印保存完成的日志

**潜在问题**：
- 小程序页面卸载时，异步操作可能会被中断
- 没有处理 `saveProfile` 函数可能抛出的异常

#### hasUserInfoChanged 函数 (76-85行)

**主要功能**：检查用户信息是否有修改

**关键步骤**：
1. 比较 `userInfo` 和 `initialUserInfo` 的各个字段

**潜在问题**：
- 比较 `avatarFileID` 时可能出现不一致，因为 `initialUserInfo` 是在 `loadUserInfo` 中初始化的，而 `userInfo` 中的 `avatarFileID` 是在选择头像时才设置的

### 2. 数据流向分析

1. **页面加载**：`onLoad` 函数调用 `loadUserInfo` 加载用户信息
2. **信息修改**：用户修改信息时，通过 `setData` 更新 `userInfo`
3. **保存触发**：
   - 主动保存：用户点击保存按钮
   - 自动保存：
     - 输入框失去焦点时 (`handleBlur`)
     - 点击其他区域时 (`handleOutsideClick`)
     - 页面卸载时 (`onUnload`)
4. **保存执行**：调用 `saveProfile` 函数保存信息到数据库

### 3. 潜在问题分析

#### 问题1：字段名称冲突

**现象**：在 `hasUserInfoChanged` 函数中，比较了 `userInfo.avatarFileID` 和 `initialUserInfo.avatarFileID`，但在某些情况下可能出现不一致。

**原因**：
- 在 `loadUserInfo` 函数中，`initialUserInfo` 是通过 `{ ...userInfoData }` 复制的，而 `userInfoData` 中包含了 `avatarFileID` 字段
- 然而，在 `userInfo` 中，`avatarFileID` 是在选择头像时才设置的
- 这可能导致比较时出现不一致，特别是当用户没有修改头像时

**影响**：可能导致 `hasUserInfoChanged` 函数返回错误的结果，从而导致不必要的保存操作或应该保存的操作没有执行。

#### 问题2：页面卸载时异步操作中断

**现象**：页面卸载时，`onUnload` 函数中的 `saveProfile` 调用可能没有完成，导致数据没有持久化。

**原因**：
- 小程序的页面卸载时，异步操作可能会被中断
- `onUnload` 函数是异步的，使用了 `async/await`，但小程序的页面生命周期管理可能不等待异步操作完成

**影响**：用户修改的信息可能没有保存到数据库，导致数据丢失。

#### 问题3：异步操作未等待

**现象**：在 `handleOutsideClick` 和 `saveEdit` 函数中，调用 `saveProfile` 时没有使用 `await`，这可能导致异步操作没有完成。

**原因**：
- `saveProfile` 函数是异步的，但在调用时没有使用 `await`
- 这可能导致函数继续执行，而数据库操作没有完成

**影响**：用户修改的信息可能没有保存到数据库，导致数据丢失。

#### 问题4：数据库操作失败处理不完善

**现象**：当数据库操作失败时，只在控制台打印了错误，没有进行其他处理。

**原因**：
- `saveProfile` 函数中，使用了 try-catch 捕获错误，但只在控制台打印了错误信息，并显示了一个通用的错误提示
- 没有对具体的错误类型进行处理，也没有尝试重试操作

**影响**：用户可能不知道保存失败的具体原因，也没有机会重新尝试保存。

## 修复建议

### 1. 修复字段名称冲突问题

**建议**：
- 修改 `hasUserInfoChanged` 函数，确保比较的字段一致
- 或者，确保 `initialUserInfo` 和 `userInfo` 具有相同的字段结构

**代码修改**：

```javascript
/**
 * 检查用户信息是否有修改
 */
hasUserInfoChanged() {
  const { userInfo, initialUserInfo } = this.data;
  
  // 比较每个字段
  return userInfo.nickName !== initialUserInfo.nickName ||
         userInfo.gender !== initialUserInfo.gender ||
         userInfo.height !== initialUserInfo.height ||
         userInfo.weight !== initialUserInfo.weight ||
         (userInfo.avatarFileID || userInfo.avatarUrl) !== (initialUserInfo.avatarFileID || initialUserInfo.avatarUrl);
}
```

### 2. 修复页面卸载时异步操作中断问题

**建议**：
- 尽量避免在 `onUnload` 函数中执行耗时的异步操作
- 改为在用户修改信息时立即保存，或者在页面隐藏时保存
- 或者，使用小程序的 `onHide` 函数来保存信息，因为 `onHide` 时异步操作不会被中断

**代码修改**：

```javascript
/**
 * 生命周期函数--监听页面隐藏
 */
onHide: async function () {
  // 页面隐藏时检查是否有修改，只有有修改时才保存
  if (this.hasUserInfoChanged()) {
    this.setData({ isActiveSave: false });
    await this.saveProfile();
    console.log('页面隐藏时保存个人信息完成');
  }
},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {
  // 页面卸载时不再执行保存操作，改为在页面隐藏时保存
  console.log('页面卸载');
}
```

### 3. 修复异步操作未等待问题

**建议**：
- 在调用 `saveProfile` 函数时，使用 `await` 等待异步操作完成
- 或者，使用 Promise 链式调用确保操作完成

**代码修改**：

```javascript
/**
 * 处理点击其他区域
 */
async handleOutsideClick(e) {
  console.log('点击外部区域:', e);
  // 退出所有编辑状态
  this.setData({ editStates: { nickName: false, height: false, weight: false } }, async () => {
    console.log('退出编辑状态完成');
    
    // 立即保存到数据库，避免onUnload时间限制问题
    if (this.hasUserInfoChanged()) {
      console.log('检测到数据变化，立即保存到数据库...');
      this.setData({ isActiveSave: false });
      await this.saveProfile();
    }
  });
},

/**
 * 保存编辑
 */
async saveEdit(field) {
  // 退出编辑状态
  this.setData({ [`editStates.${field}`]: false });
  console.log('编辑完成，退出编辑状态:', field);
  
  // 立即保存到数据库，避免onUnload时间限制问题
  if (this.hasUserInfoChanged()) {
    console.log('检测到数据变化，立即保存到数据库...');
    this.setData({ isActiveSave: false });
    await this.saveProfile();
  }
}
```

### 4. 完善数据库操作失败处理

**建议**：
- 对数据库操作失败进行更详细的处理
- 尝试重试操作，或者提供更具体的错误提示
- 记录错误日志，以便后续分析

**代码修改**：

```javascript
/**
 * 保存个人信息
 */
async saveProfile() {
  try {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      this.showToast('请先登录');
      return;
    }

    const { nickName, gender, height, weight, avatarFileID } = this.data.userInfo;
    console.log('开始保存个人信息:', { openid, nickName, avatarFileID, gender, height, weight });

    wx.showLoading({ title: '保存中...' });

    // 保存用户基本信息
    const db = wx.cloud.database();
    const userCollection = db.collection('users');
    
    console.log('查询用户信息...');
    const userRes = await userCollection.where({ openid }).get();
    console.log('查询用户信息结果:', userRes);
    
    const now = new Date();
    
    const userUpdateData = { customNickName: nickName, updateTime: now };
    
    // 如果有头像文件ID，添加到更新数据中
    if (avatarFileID) {
      userUpdateData.customAvatarUrl = avatarFileID;
    }
    
    if (userRes.data.length > 0) {
      console.log('更新用户信息...');
      console.log('更新数据:', userUpdateData);
      await userCollection.doc(userRes.data[0]._id).update({ data: userUpdateData });
      console.log('更新用户信息成功');
    } else {
      console.log('添加用户信息...');
      console.log('添加数据:', { openid, customNickName: nickName, ...(avatarFileID && { customAvatarUrl: avatarFileID }), createTime: now, updateTime: now });
      await userCollection.add({ data: { openid, customNickName: nickName, ...(avatarFileID && { customAvatarUrl: avatarFileID }), createTime: now, updateTime: now } });
      console.log('添加用户信息成功');
    }

    // 保存身体信息
    const bodyCollection = db.collection('body_profile');
    
    console.log('查询身体信息...');
    const bodyRes = await bodyCollection.where({ openid }).get();
    console.log('查询身体信息结果:', bodyRes);
    
    const saveData = { height, weight, gender, updateTime: now };

    if (bodyRes.data.length > 0) {
      console.log('更新身体信息...');
      console.log('更新数据:', saveData);
      await bodyCollection.doc(bodyRes.data[0]._id).update({ data: saveData });
      console.log('更新身体信息成功');
    } else {
      console.log('添加身体信息...');
      console.log('添加数据:', { openid, ...saveData, createTime: now });
      await bodyCollection.add({ data: { openid, ...saveData, createTime: now } });
      console.log('添加身体信息成功');
    }

    // 更新初始用户信息，以便下次比较时能够正确判断是否有修改
    await new Promise((resolve) => {
      this.setData({ initialUserInfo: { ...this.data.userInfo } }, () => {
        console.log('初始用户信息更新完成:', this.data.initialUserInfo);
        resolve();
      });
    });
    
    wx.hideLoading();
    console.log('个人信息保存成功');
    
    // 只有在用户主动点击保存时才显示提示，页面卸载时自动保存不显示提示
    if (this.data.isActiveSave) {
      this.showToast('保存成功');
      
      // 延迟返回上一页
      setTimeout(() => { this.navigateBack(); }, 1500);
    }
  } catch (error) {
    console.error('保存个人信息失败:', error);
    wx.hideLoading();
    
    // 根据错误类型显示不同的提示
    if (error.errCode === -1) {
      this.showToast('网络错误，请检查网络连接后重试');
    } else if (error.errCode === 10003) {
      this.showToast('登录已过期，请重新登录');
    } else {
      this.showToast('保存失败，请重试');
    }
    
    // 尝试重新保存
    setTimeout(async () => {
      if (this.hasUserInfoChanged()) {
        console.log('尝试重新保存个人信息...');
        await this.saveProfile();
      }
    }, 2000);
  }
}
```

### 5. 其他优化建议

1. **添加保存状态标记**：
   - 添加一个 `isSaving` 标记，避免重复保存操作
   - 在保存过程中禁用相关按钮，防止用户重复点击

2. **添加本地缓存**：
   - 在数据库操作失败时，将数据保存到本地缓存
   - 下次页面加载时，检查本地缓存并尝试重新保存

3. **优化数据库操作**：
   - 使用事务或批量操作，确保数据的一致性
   - 减少数据库操作次数，提高性能

4. **添加日志记录**：
   - 记录保存操作的详细日志，以便后续分析问题
   - 可以使用小程序的日志接口或云函数来记录日志

## 总结

通过分析 `pages/profile-info/profile-info.js` 中的保存逻辑，发现了以下可能导致数据不持久化的问题：

1. **字段名称冲突**：`hasUserInfoChanged` 函数中比较 `avatarFileID` 时可能出现不一致
2. **页面卸载时异步操作中断**：小程序页面卸载时，异步操作可能会被中断
3. **异步操作未等待**：调用 `saveProfile` 函数时没有使用 `await`，可能导致异步操作没有完成
4. **数据库操作失败处理不完善**：对数据库操作失败的处理不够详细

通过实施上述修复建议，可以解决这些问题，确保用户个人信息能够正确持久化到数据库中。