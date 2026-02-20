const i18n = require('../../utils/i18n');

Page({
  data: {
    // 语言相关状态
    i18n: i18n,
    langData: i18n.getLangData()
  },

  onLoad() {
    // 初始化语言管理
    this.initLanguage();
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
});