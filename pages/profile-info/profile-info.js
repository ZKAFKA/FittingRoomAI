// 导入全局i18n工具
const i18n = require('../../utils/i18n');

Page({
  data: {
    // 用户信息
    userInfo: {
      nickName: '',
      avatarUrl: '',
      gender: '',
      height: '',
      weight: ''
    },
    // 初始用户信息（用于比较是否有修改）
    initialUserInfo: {
      nickName: '',
      avatarUrl: '',
      gender: '',
      height: '',
      weight: ''
    },
    // 默认头像URL
    defaultAvatarUrl: '',
    // 语言数据
    langData: i18n.getLangData(),
    // 提示信息
    showToast: false,
    toastMessage: '',
    // 性别选择弹窗
    showGenderModal: false,
    // 是否是主动保存
    isActiveSave: false,
    // 编辑状态
    editStates: {
      nickName: false,
      height: false,
      weight: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化语言管理
    this.initLanguage();
    // 获取默认头像URL
    this.getAvatarUrl();
    // 加载用户信息
    this.loadUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时重新加载用户信息，确保数据准确性
    this.loadUserInfo();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载时不再执行保存操作，已移至onHide
    console.log('页面卸载');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: async function () {
    // 页面隐藏时检查是否有修改，只有有修改时才保存
    if (this.hasUserInfoChanged()) {
      this.setData({ isActiveSave: false });
      const success = await this.saveProfile();
      console.log('页面隐藏时保存个人信息完成，结果:', success);
    }
  },

  /**
   * 检查用户信息是否有修改
   */
  hasUserInfoChanged() {
    const { userInfo, initialUserInfo } = this.data;
    
    // 比较每个字段
    return userInfo.nickName !== initialUserInfo.nickName ||
           (userInfo.avatarFileID || userInfo.avatarUrl) !== (initialUserInfo.avatarFileID || initialUserInfo.avatarUrl) ||
           userInfo.gender !== initialUserInfo.gender ||
           userInfo.height !== initialUserInfo.height ||
           userInfo.weight !== initialUserInfo.weight;
  },

  /**
   * 初始化语言管理
   */
  initLanguage() {
    // 更新语言数据
    this.updateLanguageData();
    
    // 监听语言变化
    i18n.onLanguageChange(this.onLanguageChange.bind(this));
  },

  /**
   * 更新语言数据
   */
  updateLanguageData() {
    this.setData({
      langData: i18n.getLangData()
    });
  },

  /**
   * 语言变化监听器
   */
  onLanguageChange() {
    this.updateLanguageData();
  },

  /**
   * 获取默认头像URL
   */
  async getAvatarUrl() {
    try {
      const defaultAvatarFileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg';
      const res = await wx.cloud.getTempFileURL({
        fileList: [defaultAvatarFileID]
      });
      if (res.fileList.length > 0 && res.fileList[0].tempFileURL) {
        this.setData({
          defaultAvatarUrl: res.fileList[0].tempFileURL
        });
      }
    } catch (error) {
      console.error('获取默认头像链接失败:', error);
    }
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 加载用户基本信息
        const userRes = await wx.cloud.database().collection('users')
          .where({ openid })
          .get();
        
        let userData = {};
        if (userRes.data.length > 0) {
          userData = userRes.data[0];
        }

        // 加载身体信息
        let height = '';
        let weight = '';
        let gender = '';
        try {
          const bodyRes = await wx.cloud.database().collection('body_profile')
            .where({ openid })
            .get();
          
          if (bodyRes.data.length > 0) {
            height = bodyRes.data[0].height || '';
            weight = bodyRes.data[0].weight || '';
            gender = bodyRes.data[0].gender || '';
          }
        } catch (bodyError) {
          console.error('加载身体信息失败:', bodyError);
        }

        const userInfoData = {
          nickName: userData.customNickName || userData.nickName || '',
          avatarUrl: (userData.customAvatarUrl && userData.customAvatarUrl.indexOf('/assets/images/') === -1) ? userData.customAvatarUrl : (userData.avatarUrl && userData.avatarUrl.indexOf('/assets/images/') === -1) ? userData.avatarUrl : '',
          avatarFileID: userData.customAvatarUrl || userData.avatarUrl, // 保存原始avatarUrl作为fileID
          gender,
          height,
          weight
        };
        
        this.setData({
          userInfo: userInfoData,
          initialUserInfo: { ...userInfoData }
        }, () => {
          console.log('用户信息加载完成:', this.data.userInfo);
          console.log('初始用户信息:', this.data.initialUserInfo);
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  /**
   * 选择头像
   */
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths;
        const openid = wx.getStorageSync('openid');
        
        try {
          wx.showLoading({ title: '上传中...' });
          
          // 生成文件路径
          const timestamp = Date.now();
          const fileExt = tempFilePaths[0].split('.').pop();
          const cloudPath = `user-avatar/${openid}-avatar.${fileExt}`;
          
          // 上传到云存储
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePaths[0]
          });
          
          if (uploadRes.fileID) {
            // 获取临时文件URL
            const urlRes = await wx.cloud.getTempFileURL({
              fileList: [uploadRes.fileID]
            });
            
            if (urlRes.fileList.length > 0 && urlRes.fileList[0].tempFileURL) {
              const avatarUrl = urlRes.fileList[0].tempFileURL;
              
              // 只更新本地数据，不立即更新数据库
              this.setData({
                'userInfo.avatarUrl': avatarUrl,
                'userInfo.avatarFileID': uploadRes.fileID // 保存fileID用于后续保存
              });
              
              wx.hideLoading();
              this.showToast('头像更新成功');
            } else {
              throw new Error('获取头像链接失败');
            }
          } else {
            throw new Error('上传失败');
          }
        } catch (error) {
          console.error('上传头像失败:', error);
          wx.hideLoading();
          this.showToast('上传失败，请重试');
        }
      }
    });
  },

  /**
   * 用户名输入变化
   */
  onNickNameChange(e) {
    console.log('用户名输入变化:', e.detail.value);
    this.setData({
      'userInfo.nickName': e.detail.value
    }, () => {
      console.log('用户名更新完成:', this.data.userInfo.nickName);
    });
  },

  /**
   * 显示性别选择弹窗
   */
  showGenderPicker() {
    this.setData({
      showGenderModal: true
    });
  },

  /**
   * 隐藏性别选择弹窗
   */
  hideGenderModal() {
    this.setData({
      showGenderModal: false
    });
  },

  /**
   * 性别选择
   */
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      'userInfo.gender': gender
    });
  },

  /**
   * 确认性别选择
   */
  confirmGender() {
    this.hideGenderModal();
    this.showToast('性别设置成功');
  },

  /**
   * 处理键盘事件
   */
  async handleKeydown(e) {
    const field = e.currentTarget.dataset.field;
    if (e.keyCode === 13) { // Enter键
      await this.saveEdit(field);
    }
  },

  /**
   * 处理输入框失去焦点
   */
  async handleBlur(e) {
    const field = e.currentTarget.dataset.field;
    await this.saveEdit(field);
  },

  /**
   * 处理点击其他区域
   */
  async handleOutsideClick(e) {
    console.log('点击外部区域:', e);
    // 退出所有编辑状态
    this.setData({
      editStates: {
        nickName: false,
        height: false,
        weight: false
      }
    }, async () => {
      console.log('退出编辑状态完成');
      
      // 立即保存到数据库，避免onUnload时间限制问题
      if (this.hasUserInfoChanged()) {
        console.log('检测到数据变化，立即保存到数据库...');
        this.setData({ isActiveSave: false });
        const success = await this.saveProfile();
        console.log('点击外部区域保存完成，结果:', success);
      }
    });
  },

  /**
   * 身高输入变化
   */
  onHeightChange(e) {
    console.log('身高输入变化:', e.detail.value);
    this.setData({
      'userInfo.height': e.detail.value
    }, () => {
      console.log('身高更新完成:', this.data.userInfo.height);
    });
  },

  /**
   * 体重输入变化
   */
  onWeightChange(e) {
    console.log('体重输入变化:', e.detail.value);
    this.setData({
      'userInfo.weight': e.detail.value
    }, () => {
      console.log('体重更新完成:', this.data.userInfo.weight);
    });
  },

  /**
   * 进入编辑状态
   */
  enterEditState(e) {
    const field = e.currentTarget.dataset.field;
    console.log('进入编辑状态:', field);
    // 退出其他字段的编辑状态
    const editStates = {
      nickName: false,
      height: false,
      weight: false
    };
    // 设置当前字段为编辑状态
    editStates[field] = true;
    this.setData({ editStates }, () => {
      console.log('编辑状态设置完成:', this.data.editStates);
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
      const success = await this.saveProfile();
      console.log('编辑保存完成:', field, '结果:', success);
    }
  },



  /**
   * 阻止弹窗背景滚动
   */
  preventMove() {
    // 空方法，用于阻止弹窗背景滚动
  },

  /**
   * 保存个人信息
   */
  async saveProfile(retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 1000;
    
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        this.showToast('请先登录');
        return false;
      }

      const { nickName, gender, height, weight, avatarFileID } = this.data.userInfo;
      const timestamp = new Date().toISOString();
      
      console.log(`[${timestamp}] 开始保存个人信息:`, {
        openid,
        nickName,
        avatarFileID,
        gender,
        height,
        weight,
        retryCount
      });

      wx.showLoading({ title: '保存中...' });

      // 保存用户基本信息
      const db = wx.cloud.database();
      const userCollection = db.collection('users');
      
      console.log(`[${timestamp}] 查询用户信息...`);
      let userRes;
      try {
        userRes = await userCollection.where({ openid }).get();
        console.log(`[${timestamp}] 查询用户信息结果:`, userRes);
      } catch (userQueryError) {
        console.error(`[${timestamp}] 查询用户信息失败:`, userQueryError);
        throw new Error('查询用户信息失败');
      }
      
      const now = new Date();
      
      const userUpdateData = {
        customNickName: nickName,
        updateTime: now
      };
      
      // 如果有头像文件ID，添加到更新数据中
      if (avatarFileID) {
        userUpdateData.customAvatarUrl = avatarFileID;
      }
      
      try {
        if (userRes.data.length > 0) {
          console.log(`[${timestamp}] 更新用户信息...`);
          console.log(`[${timestamp}] 更新数据:`, userUpdateData);
          await userCollection.doc(userRes.data[0]._id).update({
            data: userUpdateData
          });
          console.log(`[${timestamp}] 更新用户信息成功`);
        } else {
          console.log(`[${timestamp}] 添加用户信息...`);
          console.log(`[${timestamp}] 添加数据:`, {
            openid,
            customNickName: nickName,
            ...(avatarFileID && { customAvatarUrl: avatarFileID }),
            createTime: now,
            updateTime: now
          });
          await userCollection.add({
            data: {
              openid,
              customNickName: nickName,
              ...(avatarFileID && { customAvatarUrl: avatarFileID }),
              createTime: now,
              updateTime: now
            }
          });
          console.log(`[${timestamp}] 添加用户信息成功`);
        }
      } catch (userSaveError) {
        console.error(`[${timestamp}] 保存用户信息失败:`, userSaveError);
        throw new Error('保存用户信息失败');
      }

      // 保存身体信息
      const bodyCollection = db.collection('body_profile');
      
      console.log(`[${timestamp}] 查询身体信息...`);
      let bodyRes;
      try {
        bodyRes = await bodyCollection.where({ openid }).get();
        console.log(`[${timestamp}] 查询身体信息结果:`, bodyRes);
      } catch (bodyQueryError) {
        console.error(`[${timestamp}] 查询身体信息失败:`, bodyQueryError);
        throw new Error('查询身体信息失败');
      }
      
      const saveData = {
        height,
        weight,
        gender,
        updateTime: now
      };

      try {
        if (bodyRes.data.length > 0) {
          console.log(`[${timestamp}] 更新身体信息...`);
          console.log(`[${timestamp}] 更新数据:`, saveData);
          await bodyCollection.doc(bodyRes.data[0]._id).update({
            data: saveData
          });
          console.log(`[${timestamp}] 更新身体信息成功`);
        } else {
          console.log(`[${timestamp}] 添加身体信息...`);
          console.log(`[${timestamp}] 添加数据:`, {
            openid,
            ...saveData,
            createTime: now
          });
          await bodyCollection.add({
            data: {
              openid,
              ...saveData,
              createTime: now
            }
          });
          console.log(`[${timestamp}] 添加身体信息成功`);
        }
      } catch (bodySaveError) {
        console.error(`[${timestamp}] 保存身体信息失败:`, bodySaveError);
        throw new Error('保存身体信息失败');
      }

      // 更新初始用户信息，以便下次比较时能够正确判断是否有修改
      this.setData({
        initialUserInfo: { ...this.data.userInfo }
      }, () => {
        console.log(`[${timestamp}] 初始用户信息更新完成:`, this.data.initialUserInfo);
      });
      
      wx.hideLoading();
      console.log(`[${timestamp}] 个人信息保存成功`);
      
      // 只有在用户主动点击保存时才显示提示，页面卸载时自动保存不显示提示
      if (this.data.isActiveSave) {
        this.showToast('保存成功');
        
        // 延迟返回上一页
        setTimeout(() => {
          this.navigateBack();
        }, 1500);
      }
      
      return true;
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] 保存个人信息失败:`, error);
      
      // 详细的错误类型判断和处理
      let errorMessage = '保存失败，请重试';
      let shouldRetry = false;
      
      if (error.message.includes('网络') || error.message.includes('timeout') || error.message.includes('Network')) {
        errorMessage = '网络连接失败，请检查网络后重试';
        shouldRetry = true;
      } else if (error.message.includes('登录') || error.message.includes('token') || error.message.includes('auth')) {
        errorMessage = '登录已过期，请重新登录';
        shouldRetry = false;
      } else if (error.message.includes('数据库') || error.message.includes('Database')) {
        errorMessage = '数据库错误，请稍后重试';
        shouldRetry = true;
      } else if (error.message.includes('查询')) {
        errorMessage = '数据查询失败，请稍后重试';
        shouldRetry = true;
      } else if (error.message.includes('保存')) {
        errorMessage = '数据保存失败，请稍后重试';
        shouldRetry = true;
      }
      
      wx.hideLoading();
      
      // 错误重试机制
      if (shouldRetry && retryCount < maxRetries) {
        console.log(`[${timestamp}] 尝试重试保存操作，重试次数: ${retryCount + 1}/${maxRetries}`);
        
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        return this.saveProfile(retryCount + 1);
      }
      
      // 显示错误提示
      this.showToast(errorMessage);
      return false;
    }
  },

  /**
   * 显示提示信息
   */
  showToast(message) {
    this.setData({
      showToast: true,
      toastMessage: message
    });

    // 2秒后隐藏提示
    setTimeout(() => {
      this.setData({
        showToast: false
      });
    }, 2000);
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
