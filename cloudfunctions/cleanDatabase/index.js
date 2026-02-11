const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { confirm, openid } = event;
  
  if (!confirm) {
    return {
      success: false,
      message: '请设置confirm为true以确认清理操作'
    };
  }

  const collections = [
    'users',
    'body_profile',
    'wardrobe',
    'tryon_records',
    'inspirations',
    'tryon_tasks'
  ];

  const results = {};

  for (const collection of collections) {
    try {
      let query = {};
      
      if (openid) {
        query = { openid: openid };
      } else {
        query = {
          openid: /^test-/
        };
      }
      
      const res = await db.collection(collection)
        .where(query)
        .remove();
      
      results[collection] = {
        success: true,
        count: res.stats.removed
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
};