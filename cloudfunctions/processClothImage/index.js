const cloud = require('wx-server-sdk');
const axios = require('axios');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 腾讯云混元生图API配置
// 注意：请在云函数环境变量中设置以下配置
// TENCENT_CLOUD_SECRET_ID - 腾讯云SecretId
// TENCENT_CLOUD_SECRET_KEY - 腾讯云SecretKey
const TENCENT_CLOUD_CONFIG = {
  SECRET_ID: process.env.TENCENT_CLOUD_SECRET_ID || '',
  SECRET_KEY: process.env.TENCENT_CLOUD_SECRET_KEY || '',
  REGION: 'ap-guangzhou',
  SERVICE: 'hunyuan',
  HOST: 'hunyuan.tencentcloudapi.com',
  VERSION: '2023-09-01'
};

/**
 * 生成腾讯云API签名
 * @param {string} secretId - SecretId
 * @param {string} secretKey - SecretKey
 * @param {number} timestamp - 时间戳
 * @param {string} payload - 请求体JSON字符串
 * @returns {string} 签名
 */
function generateSignature(secretId, secretKey, timestamp, payload) {
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  
  // 计算payload的哈希值
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
  
  // 构建规范请求
  const canonicalRequest = `POST\n/\n\ncontent-type:application/json\nhost:${TENCENT_CLOUD_CONFIG.HOST}\n\ncontent-type;host\n${payloadHash}`;
  
  // 构建待签名字符串
  const credentialScope = `${date}/${TENCENT_CLOUD_CONFIG.SERVICE}/tc3_request`;
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;
  
  // 计算签名
  const secretDate = crypto.createHmac('sha256', `TC3${secretKey}`).update(date).digest();
  const secretService = crypto.createHmac('sha256', secretDate).update(TENCENT_CLOUD_CONFIG.SERVICE).digest();
  const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');
  
  return signature;
}

/**
 * 构建请求头
 * @param {string} payload - 请求体JSON字符串
 * @returns {Object} 请求头
 */
function buildHeaders(payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature(
    TENCENT_CLOUD_CONFIG.SECRET_ID,
    TENCENT_CLOUD_CONFIG.SECRET_KEY,
    timestamp,
    payload
  );
  
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  const credential = `${TENCENT_CLOUD_CONFIG.SECRET_ID}/${date}/${TENCENT_CLOUD_CONFIG.SERVICE}/tc3_request`;
  
  return {
    'Content-Type': 'application/json',
    'Host': TENCENT_CLOUD_CONFIG.HOST,
    'X-TC-Action': 'SubmitChatPro',
    'X-TC-Version': TENCENT_CLOUD_CONFIG.VERSION,
    'X-TC-Timestamp': timestamp.toString(),
    'X-TC-Region': TENCENT_CLOUD_CONFIG.REGION,
    'Authorization': `TC3-HMAC-SHA256 Credential=${credential}, SignedHeaders=content-type;host, Signature=${signature}`
  };
}

/**
 * 构建混元生图Prompt
 * @param {string} category - 衣物分类
 * @returns {string} 优化后的prompt
 */
function buildHunyuanPrompt(category) {
  const categoryMap = {
    'upper': { name: '上装', en: 'top clothing' },
    'lower': { name: '下装', en: 'bottom clothing' },
    'suit': { name: '套装', en: 'suit' },
    'shoes': { name: '鞋帽', en: 'shoes or hat' },
    'accessories': { name: '饰品', en: 'accessory' }
  };
  
  const categoryInfo = categoryMap[category] || { name: '衣物', en: 'clothing' };
  
  // 构建专业prompt，确保生成3:4比例、白色背景、摊开展示的衣物图片
  const prompt = `Professional clothing product photography of ${categoryInfo.en}. 

Requirements:
1. Remove all background and replace with pure white background (#FFFFFF)
2. Display the ${categoryInfo.en} in a fully spread out, flat lay style
3. Show the garment laid flat from a top-down perspective
4. Ensure the clothing item is centered and occupies 80-90% of the frame
5. Maintain natural fabric texture, folds, and details
6. Use soft, even lighting without harsh shadows
7. Aspect ratio: 3:4 (portrait orientation)
8. High resolution, professional e-commerce quality
9. No models, mannequins, or additional props
10. Clean edges, no background artifacts

Style: Clean, minimal, professional product photography suitable for e-commerce catalog.`;

  return prompt;
}

/**
 * 提交混元生图任务
 * @param {string} imageUrl - 原始图片URL
 * @param {string} category - 衣物分类
 * @param {string} openid - 用户openid
 * @returns {Object} 任务提交结果
 */
async function submitImageGenerationJob(imageUrl, category, openid) {
  try {
    // 下载原始图片并转换为base64
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imageResponse.data).toString('base64');
    
    // 构建prompt
    const prompt = buildHunyuanPrompt(category);
    
    // 构建请求体
    const payload = JSON.stringify({
      Model: 'hunyuan-image-gen',
      Messages: [
        {
          Role: 'user',
          Content: [
            {
              Type: 'image_url',
              ImageUrl: {
                Url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              Type: 'text',
              Text: prompt
            }
          ]
        }
      ],
      Resolution: '768:1024', // 3:4 比例
      LogoAdd: 0, // 不添加水印
      Revise: 1 // 开启prompt优化
    });
    
    // 构建请求头
    const headers = buildHeaders(payload);
    
    // 发送请求
    const response = await axios.post(
      `https://${TENCENT_CLOUD_CONFIG.HOST}`,
      payload,
      { headers }
    );
    
    console.log('混元生图API响应:', response.data);
    
    if (response.data.Response && response.data.Response.JobId) {
      // 保存任务信息到数据库
      const jobData = {
        openid,
        jobId: response.data.Response.JobId,
        category,
        originalImageUrl: imageUrl,
        status: 'processing',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      };
      
      await db.collection('image_generation_jobs').add({
        data: jobData
      });
      
      return {
        success: true,
        jobId: response.data.Response.JobId
      };
    } else if (response.data.Response && response.data.Response.Error) {
      return {
        success: false,
        error: response.data.Response.Error.Message || '提交任务失败'
      };
    } else {
      return {
        success: false,
        error: '未知错误'
      };
    }
  } catch (error) {
    console.error('提交混元生图任务失败:', error);
    return {
      success: false,
      error: error.message || '提交任务失败'
    };
  }
}

/**
 * 查询混元生图任务状态
 * @param {string} jobId - 任务ID
 * @returns {Object} 任务状态
 */
async function queryImageGenerationJob(jobId) {
  try {
    const payload = JSON.stringify({
      JobId: jobId
    });
    
    const headers = buildHeaders(payload);
    
    const response = await axios.post(
      `https://${TENCENT_CLOUD_CONFIG.HOST}`,
      payload,
      { headers }
    );
    
    console.log('查询任务状态响应:', response.data);
    
    const result = response.data.Response;
    
    if (result.JobStatusCode === '5') {
      // 任务完成
      return {
        success: true,
        status: 'completed',
        imageUrl: result.ResultImage && result.ResultImage[0] ? result.ResultImage[0] : ''
      };
    } else if (result.JobStatusCode === '4') {
      // 任务失败
      return {
        success: false,
        status: 'failed',
        error: result.JobErrorMsg || '任务处理失败'
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
      error: error.message || '查询任务状态失败'
    };
  }
}

/**
 * 获取用户某分类的衣物数量
 * @param {string} openid - 用户openid
 * @param {string} category - 衣物分类
 * @returns {number} 衣物数量
 */
async function getUserClothCount(openid, category) {
  try {
    const countResult = await db.collection('wardrobe')
      .where({
        openid,
        category,
        status: 'active'
      })
      .count();
    
    return countResult.total || 0;
  } catch (error) {
    console.error('获取衣物数量失败:', error);
    return 0;
  }
}

/**
 * 生成衣物标签
 * @param {string} category - 衣物分类
 * @param {number} count - 当前数量
 * @returns {string} 衣物标签
 */
function generateClothTag(category, count) {
  const categoryMap = {
    'upper': '上装',
    'lower': '下装',
    'suit': '套装',
    'shoes': '鞋帽',
    'accessories': '饰品'
  };
  
  const categoryName = categoryMap[category] || '衣物';
  const sequence = count + 1;
  
  return `${categoryName}${sequence}`;
}

/**
 * 主函数
 */
exports.main = async (event, context) => {
  const { action, imageUrl, category, jobId } = event;
  const { OPENID } = cloud.getWXContext();
  
  if (!OPENID) {
    return {
      success: false,
      error: '用户未登录'
    };
  }
  
  // 检查API配置
  if (!TENCENT_CLOUD_CONFIG.SECRET_ID || !TENCENT_CLOUD_CONFIG.SECRET_KEY) {
    return {
      success: false,
      error: 'API配置未设置，请在云函数环境变量中配置TENCENT_CLOUD_SECRET_ID和TENCENT_CLOUD_SECRET_KEY'
    };
  }
  
  try {
    switch (action) {
      case 'submit':
        // 提交图片生成任务
        if (!imageUrl || !category) {
          return {
            success: false,
            error: '缺少必要参数：imageUrl或category'
          };
        }
        
        // 获取用户该分类的衣物数量
        const clothCount = await getUserClothCount(OPENID, category);
        
        // 生成衣物标签
        const clothTag = generateClothTag(category, clothCount);
        
        // 提交生图任务
        const submitResult = await submitImageGenerationJob(imageUrl, category, OPENID);
        
        if (submitResult.success) {
          return {
            success: true,
            jobId: submitResult.jobId,
            clothTag,
            message: '任务提交成功'
          };
        } else {
          return {
            success: false,
            error: submitResult.error
          };
        }
        
      case 'query':
        // 查询任务状态
        if (!jobId) {
          return {
            success: false,
            error: '缺少必要参数：jobId'
          };
        }
        
        const queryResult = await queryImageGenerationJob(jobId);
        
        // 更新数据库中的任务状态
        if (queryResult.status) {
          await db.collection('image_generation_jobs')
            .where({ jobId })
            .update({
              data: {
                status: queryResult.status,
                resultImageUrl: queryResult.imageUrl || '',
                errorMsg: queryResult.error || '',
                updateTime: db.serverDate()
              }
            });
        }
        
        return queryResult;
        
      default:
        return {
          success: false,
          error: '未知的操作类型'
        };
    }
  } catch (error) {
    console.error('处理失败:', error);
    return {
      success: false,
      error: error.message || '处理失败'
    };
  }
};
