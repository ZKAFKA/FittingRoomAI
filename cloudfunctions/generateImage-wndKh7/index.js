const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// API密钥配置 - 请在此处填写您的HunyuanImage API密钥
const API_CONFIG = {
  HUNYUAN_API_KEY: '请填写您的HunyuanImage API密钥',
  HUNYUAN_API_URL: 'https://api.weixin.qq.com/cgi-bin/token',
  TENCENT_CLOUD_API_KEY: '请填写您的腾讯云API密钥'
};

exports.main = async (event, context) => {
  const { 
    userImage, 
    clothId, 
    settings, 
    generateSettings 
  } = event;
  
  const openid = cloud.getWXContext().OPENID;
  
  try {
    const startTime = Date.now();
    
    // 获取服装信息
    const clothInfo = await getClothInfo(clothId);
    
    // 构建参数
    const params = {
      userImage,
      clothes: [clothInfo],
      prompt: `虚拟试衣：${clothInfo.name}`,
      mode: 'change',
      settings: settings || {},
      bodyProfile: {}
    };
    
    const result = await callHunyuanAPI(params);
    
    const duration = (Date.now() - startTime) / 1000;
    
    await saveTryonRecord({
      openid,
      userImage,
      resultImage: result.url,
      clothes: [clothInfo],
      prompt: params.prompt,
      mode: params.mode,
      settings: params.settings,
      bodyProfile: params.bodyProfile,
      duration
    });
    
    return {
      success: true,
      imageUrl: result.url,
      duration
    };
  } catch (error) {
    console.error('生成失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

async function getClothInfo(clothId) {
  const clothRes = await db.collection('wardrobe')
    .doc(clothId)
    .get();
  
  if (!clothRes.data) {
    throw new Error('服装信息不存在');
  }
  
  return clothRes.data;
}

async function callHunyuanAPI(params) {
  const { userImage, clothes, prompt, mode, settings, bodyProfile } = params;
  
  // 构建HunyuanImage API请求
  const hunyuanPrompt = buildHunyuanPrompt(params);
  
  // 这里应该是实际的API调用
  // 由于API密钥需要用户配置，这里提供一个模拟实现
  // 实际使用时需要替换为真实的API调用
  
  // 模拟API调用结果
  const mockResult = {
    url: userImage, // 实际应该是API返回的图片URL
    message: '模拟生成成功' // 实际应该是API返回的消息
  };
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockResult;
}

function buildHunyuanPrompt(params) {
  const { userImage, clothes, prompt, mode, settings, bodyProfile } = params;
  
  let hunyuanPrompt = '';
  
  if (mode === 'change') {
    hunyuanPrompt = `Image-to-Image generation task. Reference the provided user photo and replace the clothing with ${clothes[0].name}. 
    
CRITICAL REQUIREMENTS:
1. Keep the person's facial features EXACTLY the same - no changes to face, eyes, nose, mouth, or expression
2. Maintain the person's body shape, height, and weight proportions
3. Only replace the clothing item, do not modify the person's physical characteristics
4. The new clothing should fit naturally and realistically on the person
5. Preserve the original lighting and atmosphere
6. Ensure the clothing drapes and folds naturally according to the person's body

${bodyProfile.height ? `Body reference: ${bodyProfile.height}cm, ${bodyProfile.weight}kg` : ''}

${settings.privacyProtection ? 'Add a subtle blur effect to the background while keeping the person sharp and clear.' : ''}
${settings.backgroundReplace ? 'Replace the background with a suitable scene that complements the clothing style.' : ''}
${settings.imageOptimization ? 'Apply additional optimization to enhance realism and remove any artifacts.' : ''}`;
  } else {
    const clothingList = clothes.map(c => c.name).join(', ');
    hunyuanPrompt = `Image-to-Image generation task. Reference the provided user photo and dress them in the following clothing items: ${clothingList}.
    
CRITICAL REQUIREMENTS:
1. Keep the person's facial features EXACTLY the same - no changes to face, eyes, nose, mouth, or expression
2. Maintain the person's body shape, height, and weight proportions
3. Layer the clothing items appropriately to create a natural, coordinated outfit
4. Ensure each garment fits properly and drapes naturally on the person's body
5. Preserve the original lighting and atmosphere
6. The outfit should look cohesive and stylish

Clothing details:
- ${clothes.map(c => `${c.category}: ${c.name} - ${c.color}, ${c.style}`).join('\n- ')}

${bodyProfile.height ? `Body reference: ${bodyProfile.height}cm, ${bodyProfile.weight}kg` : ''}

${settings.privacyProtection ? 'Add a subtle blur effect to the background while keeping the person sharp and clear.' : ''}
${settings.backgroundReplace ? 'Replace the background with a suitable scene that complements the clothing style.' : ''}
${settings.imageOptimization ? 'Apply additional optimization to enhance realism and remove any artifacts.' : ''}`;
  }
  
  return hunyuanPrompt;
}

async function saveTryonRecord(params) {
  const {
    openid,
    userImage,
    resultImage,
    clothes,
    prompt,
    mode,
    settings,
    bodyProfile,
    duration
  } = params;
  
  await db.collection('tryon_records').add({
    data: {
      openid,
      userImageUrl: userImage,
      resultImageUrl: resultImage,
      tryonMode: mode,
      selectedClothes: clothes,
      prompt,
      settings,
      bodyProfile,
      generationTime: duration,
      aiOptimized: settings.imageOptimization,
      createTime: db.serverDate(),
      isShared: false
    }
  });
}