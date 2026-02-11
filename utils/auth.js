class Auth {
  static async checkPermission(permission) {
    const settings = wx.getStorageSync('userSettings') || {};
    return settings[permission] === true;
  }

  static async requestPermission(permission) {
    return new Promise((resolve) => {
      wx.authorize({
        scope: permission,
        success: () => resolve(true),
        fail: () => {
          wx.showModal({
            title: '权限请求',
            content: '需要您授权才能使用此功能',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    resolve(settingRes.authSetting[permission]);
                  }
                });
              } else {
                resolve(false);
              }
            }
          });
        }
      });
    });
  }

  static async checkLogin() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      await this.login();
    }
    return openid;
  }

  static async login() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: (res) => {
          const { openid, sessionKey } = res.result;
          wx.setStorageSync('openid', openid);
          wx.setStorageSync('sessionKey', sessionKey);
          resolve(openid);
        },
        fail: reject
      });
    });
  }
}

module.exports = Auth;