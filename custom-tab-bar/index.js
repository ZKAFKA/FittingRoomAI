Component({
  data: {
    active: 0,
    isTryonPage: false
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const urls = [
        '/pages/index/index',
        '/pages/tryon/tryon',
        '/pages/profile/profile'
      ];
      
      // 获取当前页面
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage.route;
      
      // 如果当前已经在试衣页面，点击中间按钮应该触发开始试衣
      if (index === 1 && currentRoute.includes('tryon')) {
        // 尝试调用试衣页面的startTryon方法
        if (currentPage.startTryon) {
          currentPage.startTryon();
        }
      } else {
        // 切换到其他页面
        wx.switchTab({
          url: urls[index]
        });
      }
    }
  },

  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      
      let active = 0;
      let isTryonPage = false;
      
      if (route.includes('tryon')) {
        active = 1;
        isTryonPage = true;
      } else if (route.includes('profile')) {
        active = 2;
        isTryonPage = false;
      } else {
        isTryonPage = false;
      }
      
      this.setData({ active, isTryonPage });
    }
  }
});