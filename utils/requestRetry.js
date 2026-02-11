class RequestRetry {
  static async request(requestFn, options = {}) {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoffMultiplier = 2
    } = options;

    let lastError;
    let delay = retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          break;
        }

        console.warn(`请求失败，${delay}ms后重试 (${attempt + 1}/${maxRetries})`, error);

        await this.sleep(delay);
        delay *= backoffMultiplier;
      }
    }

    throw lastError;
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = RequestRetry;