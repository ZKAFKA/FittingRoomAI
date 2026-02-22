const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 批量删除集合中的数据
 * @param {string} collectionName 集合名称
 * @param {object} query 查询条件
 */
async function deleteCollectionData(collectionName, query) {
  try {
    const collection = db.collection(collectionName);
    const { data } = await collection.where(query).get();
    
    if (data.length > 0) {
      const ids = data.map(item => item._id);
      
      // 批量删除，每次最多100条
      const batchSize = 100;
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        await collection.where({
          _id: _.in(batch)
        }).remove();
      }
      
      console.log(`从 ${collectionName} 删除了 ${data.length} 条记录`);
      return { success: true, deletedCount: data.length };
    }
    
    return { success: true, deletedCount: 0 };
  } catch (error) {
    console.error(`删除 ${collectionName} 数据失败:`, error);
    throw error;
  }
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  
  if (!OPENID) {
    return {
      success: false,
      error: '用户未登录'
    };
  }
  
  console.log('开始删除用户数据，openid:', OPENID);
  
  try {
    const results = {
      users: { success: false, count: 0 },
      body_profile: { success: false, count: 0 },
      wardrobe: { success: false, count: 0 },
      history: { success: false, count: 0 }
    };
    
    // 1. 删除用户基本信息
    try {
      const result = await deleteCollectionData('users', { openid: OPENID });
      results.users = { success: true, count: result.deletedCount };
    } catch (error) {
      console.error('删除用户基本信息失败:', error);
      results.users = { success: false, error: error.message };
    }
    
    // 2. 删除身体信息
    try {
      const result = await deleteCollectionData('body_profile', { openid: OPENID });
      results.body_profile = { success: true, count: result.deletedCount };
    } catch (error) {
      console.error('删除身体信息失败:', error);
      results.body_profile = { success: false, error: error.message };
    }
    
    // 3. 删除 wardrobe 中的衣物数据
    try {
      const result = await deleteCollectionData('wardrobe', { openid: OPENID });
      results.wardrobe = { success: true, count: result.deletedCount };
    } catch (error) {
      console.error('删除衣物数据失败:', error);
      results.wardrobe = { success: false, error: error.message };
    }
    
    // 4. 删除历史记录
    try {
      const result = await deleteCollectionData('history', { openid: OPENID });
      results.history = { success: true, count: result.deletedCount };
    } catch (error) {
      console.error('删除历史记录失败:', error);
      results.history = { success: false, error: error.message };
    }
    
    // 检查是否有删除失败的情况
    const hasErrors = Object.values(results).some(r => !r.success);
    
    if (hasErrors) {
      console.error('部分数据删除失败:', results);
      return {
        success: false,
        error: '部分数据删除失败',
        details: results
      };
    }
    
    console.log('用户数据删除成功:', results);
    
    return {
      success: true,
      message: '用户数据已完全删除',
      details: results
    };
    
  } catch (error) {
    console.error('删除用户数据时发生错误:', error);
    return {
      success: false,
      error: error.message || '删除用户数据失败'
    };
  }
};
