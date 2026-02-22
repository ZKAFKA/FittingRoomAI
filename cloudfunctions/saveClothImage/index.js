const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 下载图片到云存储
 * @param {string} imageUrl - 图片URL
 * @param {string} cloudPath - 云存储路径
 * @returns {Object} 上传结果
 */
async function downloadAndUploadImage(imageUrl, cloudPath) {
  try {
    // 下载图片
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    
    // 上传图片到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath,
      fileContent: Buffer.from(response.data)
    });
    
    return {
      success: true,
      fileID: uploadResult.fileID
    };
  } catch (error) {
    console.error('下载或上传图片失败:', error);
    return {
      success: false,
      error: error.message || '下载或上传图片失败'
    };
  }
}

/**
 * 主函数
 */
exports.main = async (event, context) => {
  const { 
    imageUrl, 
    category, 
    tags = [], 
    clothTag,
    jobId 
  } = event;
  
  const { OPENID } = cloud.getWXContext();
  
  if (!OPENID) {
    return {
      success: false,
      error: '用户未登录'
    };
  }
  
  if (!imageUrl || !category) {
    return {
      success: false,
      error: '缺少必要参数：imageUrl或category'
    };
  }
  
  try {
    // 构建云存储路径：clothes/{openid}/{timestamp}.png
    const timestamp = Date.now();
    const cloudPath = `clothes/${OPENID}/${timestamp}.png`;
    
    // 检查并创建用户文件夹（云存储会自动创建文件夹，无需手动创建）
    // 下载并上传图片
    const uploadResult = await downloadAndUploadImage(imageUrl, cloudPath);
    
    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error
      };
    }
    
    // 构建衣物数据
    const clothData = {
      openid: OPENID,
      category,
      name: clothTag || '未命名衣物',
      tags: Array.isArray(tags) ? tags : [],
      imageUrl: uploadResult.fileID,
      originalImageUrl: imageUrl, // 保存原始图片URL
      jobId: jobId || '', // 关联的生图任务ID
      status: 'active',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    };
    
    // 保存到数据库
    const addResult = await db.collection('wardrobe').add({
      data: clothData
    });
    
    if (addResult._id) {
      // 更新任务记录，标记为已保存
      if (jobId) {
        await db.collection('image_generation_jobs')
          .where({ jobId })
          .update({
            data: {
              status: 'saved',
              savedClothId: addResult._id,
              savedImageUrl: uploadResult.fileID,
              updateTime: db.serverDate()
            }
          });
      }
      
      return {
        success: true,
        clothId: addResult._id,
        fileID: uploadResult.fileID,
        message: '衣物保存成功'
      };
    } else {
      return {
        success: false,
        error: '保存到数据库失败'
      };
    }
  } catch (error) {
    console.error('保存衣物失败:', error);
    return {
      success: false,
      error: error.message || '保存衣物失败'
    };
  }
};
