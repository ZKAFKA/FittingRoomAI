const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 验证用户权限的云函数
 * @param {Object} event - 事件参数
 * @param {string} event.action - 操作类型：read, write, delete
 * @param {string} event.resourceType - 资源类型：tryonRecord, image
 * @param {string} event.resourceId - 资源ID，如试衣记录ID或图片fileID
 * @param {Object} context - 上下文
 * @returns {Object} - 权限验证结果
 */
exports.main = async (event, context) => {
  try {
    const { action, resourceType, resourceId } = event;
    const openid = cloud.getWXContext().OPENID;
    
    if (!openid) {
      return {
        success: false,
        error: '用户未登录',
        code: 'UNAUTHORIZED'
      };
    }
    
    if (!action || !resourceType) {
      return {
        success: false,
        error: '缺少必要参数',
        code: 'INVALID_PARAMS'
      };
    }
    
    // 根据资源类型验证权限
    switch (resourceType) {
      case 'tryonRecord':
        return await verifyTryonRecordPermission(openid, action, resourceId);
      case 'image':
        return await verifyImagePermission(openid, action, resourceId);
      default:
        return {
          success: false,
          error: '不支持的资源类型',
          code: 'INVALID_RESOURCE_TYPE'
        };
    }
  } catch (error) {
    console.error('权限验证失败:', error);
    return {
      success: false,
      error: error.message || '权限验证过程中发生错误',
      code: 'INTERNAL_ERROR'
    };
  }
};

/**
 * 验证试衣记录权限
 */
async function verifyTryonRecordPermission(openid, action, recordId) {
  if (!recordId) {
    // 如果没有记录ID，检查是否是查询列表操作
    if (action === 'read') {
      // 列表查询默认允许，后续会在查询时添加openid过滤
      return {
        success: true,
        message: '允许查询试衣记录列表'
      };
    }
    return {
      success: false,
      error: '缺少记录ID',
      code: 'INVALID_PARAMS'
    };
  }
  
  // 查询试衣记录
  const result = await db.collection('tryon_record').doc(recordId).get();
  
  if (!result.data) {
    return {
      success: false,
      error: '试衣记录不存在',
      code: 'RESOURCE_NOT_FOUND'
    };
  }
  
  // 验证记录所属权
  if (result.data.openid !== openid) {
    return {
      success: false,
      error: '无权访问此试衣记录',
      code: 'PERMISSION_DENIED'
    };
  }
  
  return {
    success: true,
    message: '权限验证通过'
  };
}

/**
 * 验证图片权限
 */
async function verifyImagePermission(openid, action, fileID) {
  if (!fileID) {
    return {
      success: false,
      error: '缺少文件ID',
      code: 'INVALID_PARAMS'
    };
  }
  
  // 从fileID中提取用户ID部分
  // 假设fileID格式为：cloud://xxx/tryon-results/{openid}/{filename}
  const filePath = fileID.split('/').slice(2).join('/');
  const pathParts = filePath.split('/');
  
  if (pathParts.length < 3 || pathParts[0] !== 'tryon-results') {
    return {
      success: false,
      error: '无效的文件路径',
      code: 'INVALID_FILE_PATH'
    };
  }
  
  const fileOpenid = pathParts[1];
  
  if (fileOpenid !== openid) {
    return {
      success: false,
      error: '无权访问此图片',
      code: 'PERMISSION_DENIED'
    };
  }
  
  return {
    success: true,
    message: '权限验证通过'
  };
}
