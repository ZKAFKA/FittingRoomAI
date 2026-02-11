class Feedback {
  static success(message, duration = 2000) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration
    });
  }

  static error(message, duration = 2000) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration
    });
  }

  static info(message, duration = 2000) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration
    });
  }

  static loading(message = '加载中...') {
    wx.showLoading({
      title: message,
      mask: true
    });
  }

  static hideLoading() {
    wx.hideLoading();
  }

  static confirm(options) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: options.title || '提示',
        content: options.content || '',
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        success: (res) => {
          if (res.confirm) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: reject
      });
    });
  }

  static actionSheet(options) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: options.items || [],
        itemColor: options.itemColor || '#000000',
        success: (res) => {
          resolve(res.tapIndex);
        },
        fail: (err) => {
          if (err.errMsg.includes('cancel')) {
            resolve(-1);
          } else {
            reject(err);
          }
        }
      });
    });
  }
}

module.exports = Feedback;