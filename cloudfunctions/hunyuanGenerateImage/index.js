const cloud = require('wx-server-sdk');
const axios = require('axios');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 腾讯云 API 配置
const TENCENT_CLOUD_CONFIG = {
  SECRET_ID: process.env.TENCENT_CLOUD_SECRET_ID || '请填写您的腾讯云 SECRET_ID',
  SECRET_KEY: process.env.TENCENT_CLOUD_SECRET_KEY || '请填写您的腾讯云 SECRET_KEY',
  REGION: process.env.TENCENT_CLOUD_REGION || 'ap-guangzhou',
  API_URL: 'https://aiart.tencentcloudapi.com'
};

// 生成签名
try {
  function generateSignature(params, timestamp, secretKey) {
    const paramStr = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    const signStr = `POST${'\n'}${'*/*'}${'\n'}application/json${'\n'}${timestamp}${'\n'}/`;
    const hash = crypto.createHmac('sha1', secretKey).update(signStr).digest('base64');
    return hash;
  }
} catch (error) {
  console.error('生成签名失败:', error);
}

// 构建请求头
function buildHeaders(params, timestamp) {
  const signature = generateSignature(params, timestamp, TENCENT_CLOUD_CONFIG.SECRET_KEY);
  return {
    'Content-Type': 'application/json',
    'X-TC-Timestamp': timestamp.toString(),
    'X-TC-SecretId': TENCENT_CLOUD_CONFIG.SECRET_ID,
    'X-TC-Signature': signature,
    'X-TC-Version': '2022-12-29',
    'X-TC-Region': TENCENT_CLOUD_CONFIG.REGION
  };
}

// 提交生图任务
async function submitTextToImageJob(prompt, images = []) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    Action: 'SubmitTextToImageJob',
    Version: '2022-12-29',
    Region: TENCENT_CLOUD_CONFIG.REGION
  };

  const data = {
    Prompt: prompt,
    Images: images,
    Resolution: '1024:1024',
    LogoAdd: 0,
    Revise: 1
  };

  const headers = buildHeaders(params, timestamp);

  try {
    const response = await axios.post(TENCENT_CLOUD_CONFIG.API_URL, data, {
      headers
    });

    if (response.data.Response && response.data.Response.JobId) {
      return {
        success: true,
        jobId: response.data.Response.JobId
      };
    } else {
      return {
        success: false,
        error: response.data.Response.Error || '提交任务失败'
      };
    }
  } catch (error) {
    console.error('提交生图任务失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 查询生图任务
async function queryTextToImageJob(jobId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    Action: 'QueryTextToImageJob',
    Version: '2022-12-29',
    Region: TENCENT_CLOUD_CONFIG.REGION
  };

  const data = {
    JobId: jobId
  };

  const headers = buildHeaders(params, timestamp);

  try {
    const response = await axios.post(TENCENT_CLOUD_CONFIG.API_URL, data, {
      headers
    });

    const result = response.data.Response;
    if (result.JobStatusCode === '5') {
      // 任务完成
      return {
        success: true,
        imageUrl: result.ResultImage && result.ResultImage[0] ? result.ResultImage[0] : '',
        revisedPrompt: result.RevisedPrompt && result.RevisedPrompt[0] ? result.RevisedPrompt[0] : ''
      };
    } else if (result.JobStatusCode === '4') {
      // 任务失败
      return {
        success: false,
        error: result.JobErrorMsg || '任务处理失败'
      };
    } else {
      // 任务进行中
      return {
        success: false,
        status: result.JobStatusMsg || '任务进行中',
        code: result.JobStatusCode
      };
    }
  } catch (error) {
    console.error('查询生图任务失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 轮询任务结果
async function pollJobResult(jobId, maxRetries = 30, interval = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await queryTextToImageJob(jobId);
    
    if (result.success) {
      return result;
    } else if (result.error) {
      return result;
    } else {
      // 任务进行中，继续轮询
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  return {
    success: false,
    error: '任务处理超时'
  };
}

exports.main = async (event, context) => {
  const { prompt, imageUrl, resolution = '1024:1024' } = event;
  
  if (!prompt) {
    return {
      success: false,
      error: '缺少 prompt 参数'
    };
  }
  
  try {
    // 准备垫图数组
    const images = imageUrl ? [imageUrl] : [];
    
    // 提交生图任务
    const submitResult = await submitTextToImageJob(prompt, images);
    if (!submitResult.success) {
      return {
        success: false,
        error: submitResult.error
      };
    }
    
    // 轮询任务结果
    const jobResult = await pollJobResult(submitResult.jobId);
    if (!jobResult.success) {
      return {
        success: false,
        error: jobResult.error
      };
    }
    
    // 返回成功结果
    return {
      success: true,
      imageUrl: jobResult.imageUrl,
      revisedPrompt: jobResult.revisedPrompt
    };
  } catch (error) {
    console.error('生图失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};