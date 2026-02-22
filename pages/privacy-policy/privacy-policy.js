// 隐私政策页面
Page({
  data: {
    loading: true
  },

  onLoad() {
    // 模拟加载过程，实现平滑过渡效果
    setTimeout(() => {
      this.setData({
        loading: false
      });
    }, 500);
  },

  onShow() {
    // 页面显示时的动画效果
    wx.setNavigationBarTitle({
      title: '隐私政策'
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1,
      success: () => {
        console.log('返回成功');
      },
      fail: (err) => {
        console.error('返回失败:', err);
        // 如果返回失败，尝试跳转到设置页面
        wx.redirectTo({
          url: '/pages/settings/settings'
        });
      }
    });
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: '隐私政策 - FittingRoomAI',
      path: '/pages/privacy-policy/privacy-policy'
    };
  }
});
