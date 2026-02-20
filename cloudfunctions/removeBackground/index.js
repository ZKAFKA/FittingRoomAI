const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// API密钥配置 - 请在此处填写您的HunyuanImage API密钥
const API_CONFIG = {
  HUNYUAN_API_KEY: '请填写您的HunyuanImage API密钥',
  HUNYUAN_API_URL: 'https://api.weixin.qq.com/cgi-bin/token'
};

exports.main = async (event, context) => {
  const { 
    prompt, 
    imageUrl, 
    category 
  } = event;
  
  const openid = cloud.getWXContext().OPENID;
  
  try {
    const startTime = Date.now();
    
    // 构建参数
    const params = {
      imageUrl,
      prompt: prompt || `Remove background from this clothing item and make it white background. Focus only on the clothing item. Create a clean product image of the clothing.`,
      category
    };
    
    const result = await callHunyuanAPI(params);
    
    const duration = (Date.now() - startTime) / 1000;
    
    return {
      success: true,
      imageUrl: result.url,
      duration
    };
  } catch (error) {
    console.error('背景去除失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

async function callHunyuanAPI(params) {
  const { imageUrl, prompt, category } = params;
  
  // 构建HunyuanImage API请求
  const hunyuanPrompt = buildHunyuanPrompt(params);
  
  try {
    // 调用新的 hunyuanGenerateImage 云函数
    const result = await cloud.callFunction({
      name: 'hunyuanGenerateImage',
      data: {
        prompt: hunyuanPrompt,
        imageUrl: imageUrl
      }
    });
    
    console.log('调用 hunyuanGenerateImage 结果:', result);
    
    if (result.result && result.result.success) {
      return {
        url: result.result.imageUrl,
        message: '背景去除成功'
      };
    } else {
      throw new Error(result.result?.error || '调用 hunyuanGenerateImage 失败');
    }
  } catch (error) {
    console.error('调用 hunyuanGenerateImage 失败:', error);
    throw error;
  }
}

function buildHunyuanPrompt(params) {
  const { imageUrl, prompt, category } = params;
  
  // 构建针对背景去除的prompt
  let hunyuanPrompt = `Image-to-Image generation task. Remove the background from the provided clothing image and make it white background.`;
  
  // 根据衣物类型添加更具体的描述
  const categoryMap = {
    upper: 'top clothing',
    inner: 'inner wear',
    lower: 'bottom clothing',
    suit: 'suit',
    shoes: 'shoes',
    accessories: 'accessories'
  };
  
  const categoryName = categoryMap[category] || 'clothing';
  
  hunyuanPrompt += `\n\nFocus specifically on the ${categoryName} item in the image.`;
  hunyuanPrompt += `\n\nIf the image does not contain ${categoryName}, return an error message stating that the image does not contain ${categoryName}.`;
  hunyuanPrompt += `\n\nCreate a clean, professional product image of the ${categoryName} with white background.`;
  
  return hunyuanPrompt;
}