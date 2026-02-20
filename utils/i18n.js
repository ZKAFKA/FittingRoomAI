// 导入语言配置文件
const zhCN = require('../languages/zh-CN');
const zhTW = require('../languages/zh-TW');
const en = require('../languages/en');
const ja = require('../languages/ja');
const ko = require('../languages/ko');
const fr = require('../languages/fr');
const es = require('../languages/es');
const de = require('../languages/de');
const ru = require('../languages/ru');
const ar = require('../languages/ar');
const pt = require('../languages/pt');
const it = require('../languages/it');
const hi = require('../languages/hi');

class I18n {
  constructor() {
    this.languages = {
      'zh-CN': zhCN,
      'zh-TW': zhTW,
      'en': en,
      'ja': ja,
      'ko': ko,
      'fr': fr,
      'es': es,
      'de': de,
      'ru': ru,
      'ar': ar,
      'pt': pt,
      'it': it,
      'hi': hi
    };
    this.currentLanguage = this.getLanguage();
    this.listeners = [];
  }

  /**
   * 获取当前语言设置
   * 优先从本地存储获取，否则自动检测系统语言
   */
  getLanguage() {
    // 尝试从本地存储获取语言设置
    const savedLanguage = wx.getStorageSync('language');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // 自动检测系统语言
    return this.detectSystemLanguage();
  }

  /**
   * 检测系统语言
   */
  detectSystemLanguage() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const systemLanguage = systemInfo.language;
      console.log('System language:', systemLanguage);
      
      // 根据系统语言设置应用语言
      if (systemLanguage.startsWith('zh-CN')) {
        return 'zh-CN';
      } else if (systemLanguage.startsWith('zh-TW') || systemLanguage.startsWith('zh-HK')) {
        return 'zh-TW';
      } else if (systemLanguage.startsWith('en')) {
        return 'en';
      } else if (systemLanguage.startsWith('ja')) {
        return 'ja';
      } else if (systemLanguage.startsWith('ko')) {
        return 'ko';
      } else if (systemLanguage.startsWith('fr')) {
        return 'fr';
      } else if (systemLanguage.startsWith('es')) {
        return 'es';
      } else if (systemLanguage.startsWith('de')) {
        return 'de';
      } else if (systemLanguage.startsWith('ru')) {
        return 'ru';
      } else if (systemLanguage.startsWith('ar')) {
        return 'ar';
      } else if (systemLanguage.startsWith('pt')) {
        return 'pt';
      } else if (systemLanguage.startsWith('it')) {
        return 'it';
      } else if (systemLanguage.startsWith('hi')) {
        return 'hi';
      } else {
        // 默认使用英文
        return 'en';
      }
    } catch (error) {
      console.error('Error detecting system language:', error);
      // 出错时默认使用英文
      return 'en';
    }
  }

  /**
   * 设置语言
   * @param {string} langCode 语言代码
   */
  setLanguage(langCode) {
    if (this.languages[langCode]) {
      this.currentLanguage = langCode;
      // 持久化存储语言设置
      wx.setStorageSync('language', langCode);
      // 通知所有监听器语言已变化
      this.notifyListeners();
      console.log('Language set to:', langCode);
    } else {
      console.error('Invalid language code:', langCode);
    }
  }

  /**
   * 获取当前语言的翻译数据
   * @returns {object} 语言翻译数据
   */
  getLangData() {
    return this.languages[this.currentLanguage] || this.languages['en'];
  }

  /**
   * 获取翻译文本
   * @param {string} key 翻译键
   * @param {string} defaultValue 默认值
   * @returns {string} 翻译文本
   */
  t(key, defaultValue = '') {
    const keys = key.split('.');
    let value = this.getLangData();
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value || defaultValue;
  }

  /**
   * 监听语言变化
   * @param {function} listener 监听器函数
   */
  onLanguageChange(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  /**
   * 移除语言变化监听器
   * @param {function} listener 监听器函数
   */
  offLanguageChange(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器语言已变化
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentLanguage, this.getLangData());
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }

  /**
   * 获取所有支持的语言
   * @returns {object} 支持的语言列表
   */
  getSupportedLanguages() {
    return Object.keys(this.languages);
  }

  /**
   * 获取语言名称
   * @param {string} langCode 语言代码
   * @returns {string} 语言名称
   */
  getLanguageName(langCode) {
    const languageNames = {
      'zh-CN': '简体中文',
      'zh-TW': '繁体中文',
      'en': 'English',
      'ja': '日本語',
      'ko': '한국어',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch',
      'ru': 'Русский',
      'ar': 'العربية',
      'pt': 'Português',
      'it': 'Italiano',
      'hi': 'हिन्दी'
    };
    return languageNames[langCode] || langCode;
  }
}

// 导出单例实例
module.exports = new I18n();
