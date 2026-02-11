const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const officialInspirations = [
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-001-casual.jpg',
      description: '简约休闲风格，白色T恤搭配黑色牛仔裤，轻松舒适，适合日常穿搭',
      style: 'casual',
      tags: ['简约', '休闲', '日常', '舒适'],
      clothes: [
        {
          name: '白色T恤',
          category: 'upper',
          color: 'white',
          style: 'casual'
        },
        {
          name: '黑色牛仔裤',
          category: 'lower',
          color: 'black',
          style: 'casual'
        },
        {
          name: '白色运动鞋',
          category: 'shoes',
          color: 'white',
          style: 'sport'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-002-business.jpg',
      description: '商务休闲风格，蓝色衬衫搭配黑色西裤，适合职场穿搭',
      style: 'business',
      tags: ['商务', '休闲', '职场', '专业'],
      clothes: [
        {
          name: '蓝色衬衫',
          category: 'upper',
          color: 'blue',
          style: 'business'
        },
        {
          name: '黑色西裤',
          category: 'lower',
          color: 'black',
          style: 'business'
        },
        {
          name: '黑色皮鞋',
          category: 'shoes',
          color: 'black',
          style: 'business'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-003-sport.jpg',
      description: '运动健身风格，运动套装搭配运动鞋，活力十足',
      style: 'sport',
      tags: ['运动', '健身', '活力', '舒适'],
      clothes: [
        {
          name: '黑色运动上衣',
          category: 'upper',
          color: 'black',
          style: 'sport'
        },
        {
          name: '黑色运动裤',
          category: 'lower',
          color: 'black',
          style: 'sport'
        },
        {
          name: '白色运动鞋',
          category: 'shoes',
          color: 'white',
          style: 'sport'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-004-fashion.jpg',
      description: '时尚潮流风格，拼接卫衣搭配破洞牛仔裤，展现个性',
      style: 'fashion',
      tags: ['时尚', '潮流', '个性', '街头'],
      clothes: [
        {
          name: '拼接卫衣',
          category: 'upper',
          color: 'multi',
          style: 'fashion'
        },
        {
          name: '破洞牛仔裤',
          category: 'lower',
          color: 'blue',
          style: 'fashion'
        },
        {
          name: '白色运动鞋',
          category: 'shoes',
          color: 'white',
          style: 'sport'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-005-minimalist.jpg',
      description: '简约极简风格，白色衬衫搭配卡其裤，干净利落',
      style: 'minimalist',
      tags: ['简约', '极简', '干净', '利落'],
      clothes: [
        {
          name: '白色衬衫',
          category: 'upper',
          color: 'white',
          style: 'minimalist'
        },
        {
          name: '卡其裤',
          category: 'lower',
          color: 'khaki',
          style: 'minimalist'
        },
        {
          name: '棕色皮鞋',
          category: 'shoes',
          color: 'brown',
          style: 'minimalist'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-006-vintage.jpg',
      description: '复古怀旧风格，格纹外套搭配牛仔裤，经典复古',
      style: 'vintage',
      tags: ['复古', '怀旧', '经典', '格纹'],
      clothes: [
        {
          name: '格纹外套',
          category: 'upper',
          color: 'brown',
          style: 'vintage'
        },
        {
          name: '蓝色牛仔裤',
          category: 'lower',
          color: 'blue',
          style: 'casual'
        },
        {
          name: '白色运动鞋',
          category: 'shoes',
          color: 'white',
          style: 'sport'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-007-street.jpg',
      description: '街头潮流风格，连帽卫衣搭配工装裤，街头感十足',
      style: 'street',
      tags: ['街头', '潮流', '工装', '连帽'],
      clothes: [
        {
          name: '连帽卫衣',
          category: 'upper',
          color: 'black',
          style: 'street'
        },
        {
          name: '工装裤',
          category: 'lower',
          color: 'black',
          style: 'street'
        },
        {
          name: '黑色运动鞋',
          category: 'shoes',
          color: 'black',
          style: 'sport'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    },
    {
      openid: null,
      nickName: 'FittingRoom AI',
      avatarUrl: '/assets/images/logo.png',
      imageUrl: 'cloud://fittingroom-prod-xxxxx/inspirations/official/inspiration-008-formal.jpg',
      description: '正式场合风格，西装套装搭配皮鞋，庄重得体',
      style: 'formal',
      tags: ['正式', '西装', '庄重', '得体'],
      clothes: [
        {
          name: '西装外套',
          category: 'upper',
          color: 'black',
          style: 'formal'
        },
        {
          name: '西装裤',
          category: 'lower',
          color: 'black',
          style: 'formal'
        },
        {
          name: '黑色皮鞋',
          category: 'shoes',
          color: 'black',
          style: 'formal'
        }
      ],
      likes: 0,
      likedBy: [],
      views: 0,
      shares: 0,
      isOfficial: true,
      createTime: db.serverDate(),
      status: 'active'
    }
  ];

  const results = [];
  for (const inspiration of officialInspirations) {
    try {
      const result = await db.collection('inspirations').add({
        data: inspiration
      });
      results.push({
        id: result._id,
        style: inspiration.style,
        success: true
      });
    } catch (error) {
      results.push({
        style: inspiration.style,
        success: false,
        error: error.message
      });
    }
  }

  return {
    success: true,
    total: officialInspirations.length,
    successCount: results.filter(r => r.success).length,
    failCount: results.filter(r => !r.success).length,
    results
  };
};