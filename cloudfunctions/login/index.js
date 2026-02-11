const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  
  try {
    const userRes = await db.collection('users')
      .where({ openid: OPENID })
      .get();
    
    if (userRes.data.length === 0) {
      await db.collection('users').add({
        data: {
          openid: OPENID,
          nickName: '用户',
          avatarUrl: 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg',
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          settings: {
            privacyProtection: false,
            backgroundReplace: false,
            imageOptimization: false
          },
          stats: {
            totalTryOn: 0,
            totalShares: 0,
            totalLikes: 0
          }
        }
      });
    } else {
      await db.collection('users')
        .doc(userRes.data[0]._id)
        .update({
          data: {
            updateTime: db.serverDate()
          }
        });
    }
    
    return {
      success: true,
      openid: OPENID,
      sessionKey: cloud.getWXContext().SESSIONKEY
    };
  } catch (error) {
    console.error('登录失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};