const Auth = require('./utils/auth');
const i18n = require('./utils/i18n');

App({
  globalData: {
    userInfo: null,
    openid: null,
    i18n: i18n
  },

  onLaunch() {
    this.initCloud();
    this.initI18n();
    this.checkLogin();
    wx.cloud.init({
      env: "fittingroom-0g0zcm3w1d2f40c5"
    });
  },

  /**
   * 初始化语言管理工具
   */
  initI18n() {
    console.log('Initializing i18n...');
    // 语言管理工具已经在导入时初始化
    // 这里可以添加额外的初始化逻辑
  },

  onShow() {
    this.checkLogin();
  },

  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'fittingroom-0g0zcm3w1d2f40c5',
        traceUser: true
      });
    }
  },

  async checkLogin() {
    const openid = wx.getStorageSync('openid');
    
    if (openid) {
      this.globalData.openid = openid;
      await this.loadUserInfo();
    } else {
      await this.login();
    }
  },

  async login() {
    try {
      const openid = await Auth.login();
      this.globalData.openid = openid;
      await this.loadUserInfo();
    } catch (error) {
      console.error('登录失败:', error);
    }
  },

  async loadUserInfo() {
    try {
      const db = wx.cloud.database();
      const res = await db.collection('users')
        .where({ openid: this.globalData.openid })
        .get();
      
      if (res.data.length > 0) {
        this.globalData.userInfo = res.data[0];
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  getUserInfo() {
    return this.globalData.userInfo;
  },

  getOpenid() {
    return this.globalData.openid;
  },

  /**
   * 获取语言管理工具实例
   * @returns {object} 语言管理工具实例
   */
  getI18n() {
    return this.globalData.i18n;
  }
});