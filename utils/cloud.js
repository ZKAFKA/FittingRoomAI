const RequestRetry = require('./requestRetry');
const CacheManager = require('./cache');

class CloudService {
  static async callFunction(name, data, options = {}) {
    const {
      useCache = false,
      cacheKey = null,
      cacheExpire = 300,
      retry = true
    } = options;

    if (useCache && cacheKey) {
      const cached = CacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const requestFn = async () => {
      const res = await wx.cloud.callFunction({
        name,
        data
      });
      
      if (res.result.errCode !== 0) {
        throw new Error(res.result.errMsg || '请求失败');
      }
      
      return res.result;
    };

    const result = retry 
      ? await RequestRetry.request(requestFn, { maxRetries: 3 })
      : await requestFn();

    if (useCache && cacheKey) {
      CacheManager.set(cacheKey, result, cacheExpire);
    }

    return result;
  }

  static async uploadFile(filePath, cloudPath) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: resolve,
        fail: reject
      });
    });
  }

  static async downloadFile(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({
        fileID,
        success: resolve,
        fail: reject
      });
    });
  }

  static async getTempFileURL(fileList) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList,
        success: (res) => resolve(res.fileList),
        fail: reject
      });
    });
  }
}

module.exports = CloudService;