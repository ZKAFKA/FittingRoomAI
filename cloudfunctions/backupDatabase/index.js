const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const collections = [
    'users',
    'body_profile',
    'wardrobe',
    'tryon_records',
    'inspirations'
  ];

  const backup = {};

  for (const collection of collections) {
    try {
      const res = await db.collection(collection).get();
      backup[collection] = res.data;
    } catch (error) {
      backup[collection] = {
        error: error.message
      };
    }
  }

  const backupId = Date.now();
  const backupPath = `backups/backup-${backupId}.json`;

  try {
    const fileContent = JSON.stringify(backup);
    const buffer = Buffer.from(fileContent, 'utf-8');
    
    await cloud.uploadFile({
      cloudPath: backupPath,
      fileContent: buffer
    });

    return {
      success: true,
      backupId,
      backupPath,
      collections: Object.keys(backup)
    };
  } catch (error) {
    console.error('备份失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};