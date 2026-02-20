// 导入语言管理工具
const i18n = require('../utils/i18n');

Component({
  data: {
    active: 0,
    i18n: i18n,
    langData: i18n.getLangData()
  },

  attached() {
    // 初始化语言管理工具
    this.initLanguage();
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const urls = [
        '/pages/tryon/tryon',
        '/pages/profile/profile'
      ];
      
      // 切换到对应页面
      wx.switchTab({
        url: urls[index]
      });
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
    }
  },

  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      
      let active = 0;
      
      if (route.includes('tryon')) {
        active = 0;
      } else if (route.includes('profile')) {
        active = 1;
      }
      
      this.setData({ active });
      // 页面显示时更新语言数据
      this.updateLanguageData();
    }
  }
});