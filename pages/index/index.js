Page({
  data: {
    userInfo: null,
    tryonCount: 0,
    wardrobeCount: 0,
    inspirationCount: 0,
    recentTryons: [],
    recommendedInspirations: [],
    loading: true,
    error: null
  },

  onLoad() {
    this.loadPageData();
  },

  onShow() {
    this.loadPageData();
    this.updateTabBar();
  },

  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0,
        isTryonPage: false
      });
    }
  },

  async loadPageData() {
    try {
      this.setData({ loading: true, error: null });
      
      await this.loadUserInfo();
      await this.loadStats();
      await this.loadRecentTryons();
      await this.loadRecommendedInspirations();
      
      this.setData({ loading: false });
    } catch (error) {
      console.error('加载页面数据失败:', error);
      this.setData({ 
        loading: false, 
        error: '加载失败，请稍后重试' 
      });
    }
  },

  async loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 检查 avatarUrl 是否为本地路径，如果是则不使用
      if (userInfo.avatarUrl && userInfo.avatarUrl.indexOf('/assets/images/') !== -1) {
        userInfo.avatarUrl = '';
      }
      this.setData({ userInfo });
    }
  },

  async loadStats() {
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) return;

      const userRes = await wx.cloud.callFunction({
        name: 'login'
      });

      if (userRes.result.success) {
        const userStats = userRes.result.stats || { totalTryOn: 0, totalShares: 0, totalLikes: 0 };
        this.setData({ tryonCount: userStats.totalTryOn });
      }

      const wardrobeRes = await wx.cloud.callFunction({
        name: 'initWardrobe',
        data: { action: 'count' }
      });
      if (wardrobeRes.result.success) {
        this.setData({ wardrobeCount: wardrobeRes.result.count || 0 });
      }

      const inspirationRes = await wx.cloud.callFunction({
        name: 'initInspirations',
        data: { action: 'count' }
      });
      if (inspirationRes.result.success) {
        this.setData({ inspirationCount: inspirationRes.result.count || 0 });
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  },

  async loadRecentTryons() {
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) return;

      const res = await wx.cloud.database().collection('tryon_records')
        .where({ openid })
        .orderBy('createTime', 'desc')
        .limit(3)
        .get();

      this.setData({ recentTryons: res.data || [] });
    } catch (error) {
      console.error('加载最近试衣记录失败:', error);
    }
  },

  async loadRecommendedInspirations() {
    try {
      const res = await wx.cloud.database().collection('inspirations')
        .where({ type: 'official' })
        .orderBy('popularity', 'desc')
        .limit(3)
        .get();

      this.setData({ recommendedInspirations: res.data || [] });
    } catch (error) {
      console.error('加载推荐灵感失败:', error);
    }
  },

  startTryon() {
    wx.navigateTo({
      url: '/pages/tryon/tryon'
    });
  },

  goToWardrobe() {
    wx.switchTab({
      url: '/pages/wardrobe/wardrobe'
    });
  },

  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  goToInspirations() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  viewTryonDetail(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/history-detail/history-detail?id=${recordId}`
    });
  },

  refreshPage() {
    this.loadPageData();
  },

  handleError() {
    this.setData({ error: null });
    this.loadPageData();
  }
});