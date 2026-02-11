const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { backupPath } = event;
  
  if (!backupPath) {
    return {
      success: false,
      message: '请提供备份文件路径'
    };
  }
  
  try {
    const fileRes = await cloud.downloadFile({
      fileID: backupPath
    });
    
    const backup = JSON.parse(fileRes.fileContent.toString());
    
    const results = {};
    
    for (const [collection, data] of Object.entries(backup)) {
      if (data.error) {
        results[collection] = {
          success: false,
          error: data.error
        };
        continue;
      }
      
      try {
        for (const record of data) {
          const { _id, ...recordData } = record;
          await db.collection(collection).add({
            data: recordData
          });
        }
        
        results[collection] = {
          success: true,
          count: data.length
        };
      } catch (error) {
        results[collection] = {
          success: false,
          error: error.message
        };
      }
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('恢复失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};