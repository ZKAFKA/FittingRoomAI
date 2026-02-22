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
    // 默认头像云存储地址
    defaultAvatarUrl: '',
    // 语言数据
    langData: i18n.getLangData(),
    // 提示信息
    showToast: false,
    toastMessage: '',
    // 性别选择弹窗
    showGenderModal: false,
    // 注销确认弹窗
    showLogoutModal: false,
    // 是否是主动保存
    isActiveSave: false,
    // 编辑状态
    editStates: {
      height: false,
      weight: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 初始化语言管理
    this.initLanguage();
    // 获取默认头像URL
    await this.getAvatarUrl();
    // 加载用户信息
    await this.loadUserInfo();
    // 注意：不再自动调用 syncWechatNickName，因为 wx.getUserProfile 必须由用户点击触发
    // 用户昵称已在登录时通过云函数保存到数据库
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    // 页面显示时重新加载用户信息，确保数据准确性
    await this.loadUserInfo();
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
    
    console.log('比较用户信息变化:');
    console.log('当前用户信息:', userInfo);
    console.log('初始用户信息:', initialUserInfo);
    console.log('gender变化:', userInfo.gender !== initialUserInfo.gender);
    console.log('height变化:', userInfo.height !== initialUserInfo.height);
    console.log('weight变化:', userInfo.weight !== initialUserInfo.weight);
    
    // 比较可修改的字段（排除昵称和头像，因为这些字段不可修改）
    const hasChanged = userInfo.gender !== initialUserInfo.gender ||
           userInfo.height !== initialUserInfo.height ||
           userInfo.weight !== initialUserInfo.weight;
    
    console.log('用户信息是否有变化:', hasChanged);
    return hasChanged;
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
    const defaultAvatarFileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg';
    
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: [defaultAvatarFileID]
      });
      if (res.fileList.length > 0 && res.fileList[0].tempFileURL) {
        this.setData({
          defaultAvatarUrl: res.fileList[0].tempFileURL
        });
        console.log('默认头像URL获取成功:', res.fileList[0].tempFileURL);
      } else {
        // 如果获取失败，直接使用云存储地址作为默认值
        this.setData({
          defaultAvatarUrl: defaultAvatarFileID
        });
        console.log('默认头像URL获取失败，使用云存储地址作为默认值:', defaultAvatarFileID);
      }
    } catch (error) {
      console.error('获取默认头像链接失败:', error);
      // 发生错误时，直接使用云存储地址作为默认值
      this.setData({
        defaultAvatarUrl: defaultAvatarFileID
      });
      console.log('获取默认头像失败，使用云存储地址作为默认值:', defaultAvatarFileID);
    }
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const openid = wx.getStorageSync('openid');
      console.log('加载用户信息时的openid:', openid);
      
      if (openid) {
        // 加载用户基本信息
        console.log('开始查询用户信息...');
        const userRes = await wx.cloud.database().collection('users')
          .where({ openid })
          .get();
        console.log('用户信息查询结果:', userRes);
        
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

        // 默认头像云存储地址
        const defaultAvatarFileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg';
        
        // 检查并修复用户数据中的头像地址
        let avatarUrl = userData.customAvatarUrl || userData.avatarUrl;
        let avatarFileID = userData.customAvatarUrl || userData.avatarUrl;
        
        // 如果头像地址是本地地址，替换为默认的云存储地址
        if (avatarUrl && avatarUrl.includes('/assets/images/')) {
          avatarUrl = defaultAvatarFileID;
          avatarFileID = defaultAvatarFileID;
          console.log('修复本地头像地址为云存储地址:', avatarUrl);
        }
        
        const userInfoData = {
          nickName: userData.nickName || '',
          avatarUrl: avatarUrl || defaultAvatarFileID,
          avatarFileID: avatarFileID || defaultAvatarFileID, // 保存原始avatarUrl作为fileID
          gender,
          height,
          weight
        };
        
        console.log('加载的用户数据:', userData);
        console.log('构建的用户信息:', userInfoData);
        
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

  // 头像和昵称修改功能已删除，用户头像不可修改，用户昵称同步微信账号昵称


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
    
    // 强制保存到数据库，不依赖hasUserInfoChanged的判断
    console.log('强制保存到数据库，字段:', field);
    console.log('当前用户信息:', this.data.userInfo);
    this.setData({ isActiveSave: false });
    const success = await this.saveProfile();
    console.log('编辑保存完成:', field, '结果:', success);
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
      console.log('获取到的openid:', openid);
      
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
      
      // 测试数据库连接
      const db = wx.cloud.database();
      console.log('数据库连接成功:', db);

      wx.showLoading({ title: '保存中...' });

      // 保存用户基本信息
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
      
      // 默认头像云存储地址
      const defaultAvatarFileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg';
      
      const userUpdateData = {
        updateTime: now
      };
      
      try {
        if (userRes.data.length > 0) {
          console.log(`[${timestamp}] 更新用户信息...`);
          console.log(`[${timestamp}] 用户ID:`, userRes.data[0]._id);
          console.log(`[${timestamp}] 更新数据:`, userUpdateData);
          const updateResult = await userCollection.doc(userRes.data[0]._id).update({
            data: userUpdateData
          });
          console.log(`[${timestamp}] 更新用户信息结果:`, updateResult);
          console.log(`[${timestamp}] 更新用户信息成功`);
        } else {
          console.log(`[${timestamp}] 添加用户信息...`);
          console.log(`[${timestamp}] 添加数据:`, {
            openid,
            createTime: now,
            updateTime: now
          });
          const addResult = await userCollection.add({
            data: {
              openid,
              createTime: now,
              updateTime: now
            }
          });
          console.log(`[${timestamp}] 添加用户信息结果:`, addResult);
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
      await new Promise((resolve) => {
        this.setData({
          initialUserInfo: { ...this.data.userInfo }
        }, () => {
          console.log(`[${timestamp}] 初始用户信息更新完成:`, this.data.initialUserInfo);
          resolve();
        });
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
  },

  /**
   * 显示头像不支持修改的提示
   */
  showAvatarNotSupported() {
    wx.showModal({
      title: '提示',
      content: '根据相关规定，微信小程序暂不支持修改用户头像',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 显示用户名不支持修改的提示
   */
  showNicknameNotSupported() {
    wx.showModal({
      title: '提示',
      content: '根据相关规定，微信小程序暂不支持修改用户名',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 显示注销确认弹窗
   */
  showLogoutConfirm() {
    this.setData({
      showLogoutModal: true
    });
  },

  /**
   * 隐藏注销确认弹窗
   */
  hideLogoutModal() {
    this.setData({
      showLogoutModal: false
    });
  },

  /**
   * 确认注销账户
   */
  async confirmLogout() {
    try {
      wx.showLoading({ title: '注销中...' });
      
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        wx.hideLoading();
        this.showToast('未登录或登录已过期');
        return;
      }
      
      // 调用云函数删除用户数据
      const result = await wx.cloud.callFunction({
        name: 'deleteUser',
        data: {}
      });
      
      console.log('注销结果:', result);
      
      if (result.result && result.result.success) {
        // 清除本地存储
        wx.clearStorageSync();
        
        wx.hideLoading();
        
        // 跳转到profile页面
        wx.redirectTo({
          url: '/pages/profile/profile'
        });
      } else {
        wx.hideLoading();
        const errorMsg = result.result && result.result.error ? result.result.error : '注销失败';
        this.showToast(errorMsg);
      }
    } catch (error) {
      wx.hideLoading();
      console.error('注销失败:', error);
      this.showToast('注销失败，请稍后重试');
    }
  }
});
