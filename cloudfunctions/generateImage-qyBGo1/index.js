const cloud = require('wx-server-sdk');
const axios = require('axios');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 腾讯云混元生图 API 配置 - 使用 aiart 服务
const HUNYUAN_CONFIG = {
  SECRET_ID: process.env.TENCENT_CLOUD_SECRET_ID || '',
  SECRET_KEY: process.env.TENCENT_CLOUD_SECRET_KEY || '',
  REGION: process.env.TENCENT_CLOUD_REGION || 'ap-guangzhou',
  SERVICE: 'aiart',
  HOST: 'aiart.tencentcloudapi.com',
  VERSION: '2022-12-29'
};

/**
 * 生成腾讯云 API 签名 (TC3-HMAC-SHA256)
 */
function generateSignature(payload, timestamp, action) {
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

  const canonicalRequest = `POST
/

content-type:application/json
host:${HUNYUAN_CONFIG.HOST}
x-tc-action:${action.toLowerCase()}

content-type;host;x-tc-action
${payloadHash}`;

  const credentialScope = `${date}/${HUNYUAN_CONFIG.SERVICE}/tc3_request`;
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const secretDate = crypto.createHmac('sha256', `TC3${HUNYUAN_CONFIG.SECRET_KEY}`).update(date).digest();
  const secretService = crypto.createHmac('sha256', secretDate).update(HUNYUAN_CONFIG.SERVICE).digest();
  const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

  return signature;
}

/**
 * 构建请求头
 */
function buildHeaders(payload, action) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature(payload, timestamp, action);
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  const credential = `${HUNYUAN_CONFIG.SECRET_ID}/${date}/${HUNYUAN_CONFIG.SERVICE}/tc3_request`;

  return {
    'Content-Type': 'application/json',
    'Host': HUNYUAN_CONFIG.HOST,
    'X-TC-Action': action,
    'X-TC-Version': HUNYUAN_CONFIG.VERSION,
    'X-TC-Timestamp': timestamp.toString(),
    'X-TC-Region': HUNYUAN_CONFIG.REGION,
    'Authorization': `TC3-HMAC-SHA256 Credential=${credential}, SignedHeaders=content-type;host;x-tc-action, Signature=${signature}`
  };
}

/**
 * 将base64图片上传到云存储，获取URL
 */
async function uploadBase64ToCloudStorage(base64Image, userId) {
  try {
    // 生成文件名
    const timestamp = Date.now();
    const fileName = `temp/reference_${userId}_${timestamp}.png`;
    
    // 将base64转为buffer
    const buffer = Buffer.from(base64Image, 'base64');
    
    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: fileName,
      fileContent: buffer
    });
    
    // 获取临时URL
    const fileID = uploadResult.fileID;
    const tempURLResult = await cloud.getTempFileURL({
      fileList: [fileID]
    });
    
    const fileURL = tempURLResult.fileList[0].tempFileURL;
    console.log('垫图已上传到云存储，URL:', fileURL);
    
    return {
      success: true,
      url: fileURL,
      fileID: fileID
    };
  } catch (error) {
    console.error('上传垫图到云存储失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * 提交混元生图任务 (3.0版本)
 */
async function submitHunyuanImageJob(event, userId) {
  const { prompt, images = [], resolution = '1024:1024', revise = 1, style = '' } = event;

  // 构建请求体
  const requestBody = {
    Prompt: prompt,
    Resolution: resolution,
    Revise: revise,
    LogoAdd: 0
  };

  // 处理垫图 - 上传到云存储获取URL
  if (images.length > 0) {
    console.log('检测到垫图，开始上传到云存储...');
    const uploadResult = await uploadBase64ToCloudStorage(images[0], userId);
    
    if (!uploadResult.success) {
      return {
        success: false,
        code: 'UPLOAD_ERROR',
        message: '垫图上传失败: ' + uploadResult.message
      };
    }
    
    // 使用 Images 数组参数传递垫图URL
    requestBody.Images = [uploadResult.url];
    console.log('垫图URL已添加:', uploadResult.url);
    
    // 保存fileID用于后续清理
    event._tempFileID = uploadResult.fileID;
  }

  // 如果指定了风格
  if (style) {
    requestBody.Style = style;
  }

  const payload = JSON.stringify(requestBody);
  const headers = buildHeaders(payload, 'SubmitTextToImageJob');

  try {
    console.log('提交生图任务，参数:', JSON.stringify(requestBody, (key, val) => {
      if (key === 'Images' && val) return '[image_url_array]';
      return val;
    }));

    const response = await axios.post(
      `https://${HUNYUAN_CONFIG.HOST}`,
      payload,
      { headers }
    );

    console.log('提交任务响应:', JSON.stringify(response.data));

    if (response.data.Response && response.data.Response.JobId) {
      return {
        success: true,
        jobId: response.data.Response.JobId,
        tempFileID: event._tempFileID
      };
    } else if (response.data.Response && response.data.Response.Error) {
      return {
        success: false,
        code: response.data.Response.Error.Code,
        message: response.data.Response.Error.Message
      };
    } else {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        message: '未知错误'
      };
    }
  } catch (error) {
    console.error('提交生图任务失败:', error);
    return {
      success: false,
      code: 'REQUEST_ERROR',
      message: error.message || '请求失败'
    };
  }
}

/**
 * 查询混元生图任务状态
 */
async function queryHunyuanImageJob(jobId) {
  const requestBody = {
    JobId: jobId
  };

  const payload = JSON.stringify(requestBody);
  const headers = buildHeaders(payload, 'QueryTextToImageJob');

  try {
    const response = await axios.post(
      `https://${HUNYUAN_CONFIG.HOST}`,
      payload,
      { headers }
    );

    console.log('查询任务状态响应:', JSON.stringify(response.data));

    const result = response.data.Response;

    if (result.JobStatusCode === '5') {
      // 任务完成
      return {
        success: true,
        status: 'completed',
        imageUrl: result.ResultImage || '',
        revisedPrompt: result.RevisedPrompt || ''
      };
    } else if (result.JobStatusCode === '4') {
      // 任务失败
      return {
        success: false,
        status: 'failed',
        code: result.JobErrorCode,
        message: result.JobErrorMsg || '任务处理失败'
      };
    } else {
      // 任务进行中 (1:初始化, 2:运行中, 3:处理中)
      return {
        success: true,
        status: 'processing',
        statusCode: result.JobStatusCode,
        statusMsg: result.JobStatusMsg || '处理中'
      };
    }
  } catch (error) {
    console.error('查询任务状态失败:', error);
    return {
      success: false,
      code: 'QUERY_ERROR',
      message: error.message || '查询任务状态失败'
    };
  }
}

/**
 * 轮询任务结果
 */
async function pollJobResult(jobId, maxRetries = 30, interval = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await queryHunyuanImageJob(jobId);

    if (result.status === 'completed') {
      return result;
    } else if (result.status === 'failed') {
      return result;
    } else {
      // 任务进行中，继续轮询
      console.log(`任务进行中... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  return {
    success: false,
    code: 'TIMEOUT',
    message: '任务处理超时'
  };
}

/**
 * 清理临时文件
 */
async function cleanupTempFile(fileID) {
  if (!fileID) return;
  
  try {
    await cloud.deleteFile({
      fileList: [fileID]
    });
    console.log('临时垫图已清理:', fileID);
  } catch (error) {
    console.error('清理临时垫图失败:', error);
  }
}

/**
 * 主函数
 */
exports.main = async (event, context) => {
  console.log('云函数被调用，入参:', JSON.stringify(event, (key, val) => {
    if (key === 'images' && val) return '[base64_images]';
    return val;
  }));

  // 检查API配置
  if (!HUNYUAN_CONFIG.SECRET_ID || !HUNYUAN_CONFIG.SECRET_KEY) {
    return {
      success: false,
      code: 'CONFIG_ERROR',
      message: 'API配置未设置，请在云函数环境变量中配置 TENCENT_CLOUD_SECRET_ID 和 TENCENT_CLOUD_SECRET_KEY'
    };
  }

  // 验证必要参数
  if (!event.prompt) {
    return {
      success: false,
      code: 'INVALID_PARAM',
      message: '缺少 prompt 参数'
    };
  }

  // 获取用户ID
  const { OPENID } = cloud.getWXContext();
  const userId = OPENID || 'anonymous';

  try {
    // 提交生图任务
    const submitResult = await submitHunyuanImageJob(event, userId);

    if (!submitResult.success) {
      return submitResult;
    }

    // 轮询任务结果
    const jobResult = await pollJobResult(submitResult.jobId);

    // 清理临时垫图
    if (submitResult.tempFileID) {
      await cleanupTempFile(submitResult.tempFileID);
    }

    if (!jobResult.success) {
      return jobResult;
    }

    // 返回成功结果
    return {
      success: true,
      imageUrl: jobResult.imageUrl,
      revisedPrompt: jobResult.revisedPrompt
    };

  } catch (error) {
    console.error('云函数执行异常:', error);
    return {
      success: false,
      code: 'FUNCTION_ERROR',
      message: error.message || '云函数执行失败'
    };
  }
};
