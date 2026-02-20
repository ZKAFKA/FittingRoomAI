// 导入全局i18n工具
const i18n = require('../../utils/i18n');

Page({
  data: {
    // 页面状态
    notificationsEnabled: true,
    currentLanguage: 'English',
    currentLanguageCode: 'en',
    currentMeasurementUnits: 'cm / kg',
    showLanguageModal: false,
    // 当前语言数据
    langData: i18n.getLangData()
  },

  onLoad() {
    // 页面加载时初始化数据
    this.initLanguage();
    this.loadSettings();
  },

  onShow() {
    // 页面显示时更新数据
    this.updateTabBar();
  },

  /**
   * 更新底部导航栏
   */
  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1, // Profile tab index
        isSettingsPage: true
      });
    }
  },

  /**
   * 初始化语言设置
   */
  initLanguage() {
    // 使用全局i18n实例
    this.updateLanguageData();
    
    // 监听语言变化
    i18n.onLanguageChange(this.onLanguageChange.bind(this));
  },

  /**
   * 更新语言数据
   */
  updateLanguageData() {
    const langCode = i18n.getLanguage();
    const languageName = i18n.getLanguageName(langCode);
    
    this.setData({
      currentLanguageCode: langCode,
      currentLanguage: languageName,
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
   * 设置语言
   */
  setLanguage(langCode) {
    // 使用全局i18n实例设置语言
    i18n.setLanguage(langCode);
    
    // 语言变化会通过监听器自动更新
  },

  /**
   * 加载设置数据
   */
  loadSettings() {
    // 这里可以从本地存储或服务器加载设置
    console.log('Loading settings...');
  },

  /**
   * 处理 Profile 选项点击
   */
  async handleProfileTap() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/profile-info/profile-info' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 处理 Security 选项点击
   */
  handleSecurityTap() {
    console.log('Security tapped');
    // 这里可以导航到安全设置页面
    wx.showToast({ title: '开发中...', icon: 'none' });
  },

  /**
   * 处理通知开关状态变化
   */
  handleNotificationChange(e) {
    const enabled = e.detail.value;
    this.setData({ notificationsEnabled: enabled });
    console.log('Notifications enabled:', enabled);
    // 这里可以保存通知设置
  },

  /**
   * 处理 Language 选项点击
   */
  handleLanguageTap() {
    console.log('Language tapped');
    // 显示语言选择弹窗
    this.setData({ showLanguageModal: true });
  },

  /**
   * 处理 Measurement Units 选项点击
   */
  handleMeasurementUnitsTap() {
    console.log('Measurement Units tapped');
    // 这里可以导航到单位选择页面
    wx.showToast({ title: '开发中...', icon: 'none' });
  },

  /**
   * 处理 Privacy Policy 选项点击
   */
  handlePrivacyPolicyTap() {
    console.log('Privacy Policy tapped');
    // 这里可以导航到隐私政策页面
    wx.showToast({ title: '开发中...', icon: 'none' });
  },

  /**
   * 处理 Help Center 选项点击
   */
  handleHelpCenterTap() {
    console.log('Help Center tapped');
    // 这里可以导航到帮助中心页面
    wx.showToast({ title: '开发中...', icon: 'none' });
  },

  /**
   * 显示语言选择弹窗
   */
  showLanguageModal() {
    this.setData({ showLanguageModal: true });
  },

  /**
   * 隐藏语言选择弹窗
   */
  hideLanguageModal() {
    this.setData({ showLanguageModal: false });
  },

  /**
   * 选择语言
   */
  selectLanguage(e) {
    const langCode = e.currentTarget.dataset.lang;
    console.log('Select language:', langCode);
    
    // 设置语言
    this.setLanguage(langCode);
    
    // 隐藏弹窗
    this.hideLanguageModal();
    
    // 显示成功提示
    wx.showToast({ title: i18n.t('common.success', '成功'), icon: 'success' });
  },

  /**
   * 阻止弹窗背景滚动
   */
  preventMove() {
    // 阻止遮罩层滚动
  },

  /**
   * 检查登录状态，未登录则触发微信授权
   */
  checkLogin() {
    return new Promise((resolve, reject) => {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 已登录
        resolve();
      } else {
        // 未登录，显示授权提示
        wx.showModal({
          title: '登录授权',
          content: '请授权登录以使用完整功能',
          showCancel: true,
          cancelText: '取消',
          confirmText: '授权登录',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 用户确认授权
              this.loginWithWechat().then(resolve).catch(reject);
            } else {
              // 用户取消授权
              reject(new Error('用户取消授权'));
            }
          },
          fail: () => {
            reject(new Error('显示授权弹窗失败'));
          }
        });
      }
    });
  },

  /**
   * 微信登录并获取用户信息
   */
  loginWithWechat() {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. 微信登录
        const loginRes = await wx.login({
          timeout: 10000
        });
        
        if (!loginRes.code) {
          throw new Error('登录失败：' + loginRes.errMsg);
        }
        
        // 2. 获取用户信息
        const userInfoRes = await wx.getUserProfile({
          desc: '用于完善用户资料'
        });
        
        if (!userInfoRes.userInfo) {
          throw new Error('获取用户信息失败');
        }
        
        const { nickName, avatarUrl } = userInfoRes.userInfo;
        
        // 3. 调用云函数获取openid
        const cloudRes = await wx.cloud.callFunction({
          name: 'login',
          data: {
            code: loginRes.code
          }
        });
        
        const openid = cloudRes.result.openid;
        if (!openid) {
          throw new Error('获取openid失败');
        }
        
        // 4. 存储openid
        wx.setStorageSync('openid', openid);
        
        // 5. 同步用户信息到数据库
        await this.syncUserInfo(openid, nickName, avatarUrl);
        
        resolve();
      } catch (error) {
        console.error('微信登录失败:', error);
        reject(error);
      }
    });
  },

  /**
   * 同步用户信息到数据库
   */
  async syncUserInfo(openid, nickName, avatarUrl) {
    try {
      const db = wx.cloud.database();
      const userCollection = db.collection('users');
      
      // 检查用户是否已存在
      const userRes = await userCollection.where({ openid }).get();
      
      if (userRes.data.length > 0) {
        // 更新现有用户
        await userCollection.doc(userRes.data[0]._id).update({
          data: {
            nickName,
            // 保持用户头像设置不变，使用默认头像
            updateTime: db.serverDate()
          }
        });
      } else {
        // 创建新用户记录
        await userCollection.add({
          data: {
            openid,
            nickName,
            // 使用默认头像
            avatarUrl: 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg',
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      
      // 同步身体信息
      await this.syncBodyInfo(openid);
      
    } catch (error) {
      console.error('同步用户信息失败:', error);
      // 静默失败，不影响登录流程
    }
  },

  /**
   * 同步身体信息
   */
  async syncBodyInfo(openid) {
    try {
      const db = wx.cloud.database();
      const bodyCollection = db.collection('body_profile');
      
      // 检查身体信息是否已存在
      const bodyRes = await bodyCollection.where({ openid }).get();
      
      if (bodyRes.data.length === 0) {
        // 创建默认身体信息
        await bodyCollection.add({
          data: {
            openid,
            height: '',
            weight: '',
            gender: '',
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      
    } catch (error) {
      console.error('同步身体信息失败:', error);
    }
  }
});