class CacheManager {
  constructor() {
    this.cachePrefix = 'fittingroom_';
    this.cacheVersion = 'v1';
  }

  set(key, data, expireSeconds = 3600) {
    const cacheKey = this.getCacheKey(key);
    const cacheData = {
      data,
      timestamp: Date.now(),
      expireTime: Date.now() + expireSeconds * 1000
    };
    
    try {
      wx.setStorageSync(cacheKey, cacheData);
    } catch (err) {
      console.error('缓存写入失败:', err);
    }
  }

  get(key) {
    const cacheKey = this.getCacheKey(key);
    
    try {
      const cacheData = wx.getStorageSync(cacheKey);
      
      if (!cacheData) {
        return null;
      }
      
      if (Date.now() > cacheData.expireTime) {
        this.remove(key);
        return null;
      }
      
      return cacheData.data;
    } catch (err) {
      console.error('缓存读取失败:', err);
      return null;
    }
  }

  remove(key) {
    const cacheKey = this.getCacheKey(key);
    try {
      wx.removeStorageSync(cacheKey);
    } catch (err) {
      console.error('缓存删除失败:', err);
    }
  }

  clear() {
    try {
      const res = wx.getStorageInfoSync();
      res.keys.forEach(key => {
        if (key.startsWith(this.cachePrefix)) {
          wx.removeStorageSync(key);
        }
      });
    } catch (err) {
      console.error('缓存清空失败:', err);
    }
  }

  getCacheKey(key) {
    return `${this.cachePrefix}${this.cacheVersion}_${key}`;
  }

  getSize() {
    try {
      const res = wx.getStorageInfoSync();
      return res.currentSize;
    } catch (err) {
      return 0;
    }
  }

  clearExpired() {
    try {
      const res = wx.getStorageInfoSync();
      const now = Date.now();
      
      res.keys.forEach(key => {
        if (key.startsWith(this.cachePrefix)) {
          const cacheData = wx.getStorageSync(key);
          if (cacheData && now > cacheData.expireTime) {
            wx.removeStorageSync(key);
          }
        }
      });
    } catch (err) {
      console.error('清理过期缓存失败:', err);
    }
  }
}

module.exports = new CacheManager();