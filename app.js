const Auth = require('./utils/auth');

App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch() {
    this.initCloud();
    this.checkLogin();
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
  }
});