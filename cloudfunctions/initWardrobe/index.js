const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = event;
  
  if (!openid) {
    return {
      success: false,
      message: '请提供用户OpenID'
    };
  }

  const testClothes = [
    {
      openid: openid,
      name: '白色T恤',
      category: 'upper',
      imageUrl: '/assets/images/clothes/white-tshirt.jpg',
      processedImageUrl: '/assets/images/clothes/white-tshirt-processed.jpg',
      color: 'white',
      style: 'casual',
      brand: 'Uniqlo',
      season: 'summer',
      tags: ['基础款', '百搭'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色T恤',
      category: 'upper',
      imageUrl: '/assets/images/clothes/black-tshirt.jpg',
      processedImageUrl: '/assets/images/clothes/black-tshirt-processed.jpg',
      color: 'black',
      style: 'casual',
      brand: 'Uniqlo',
      season: 'all',
      tags: ['基础款', '百搭'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '蓝色衬衫',
      category: 'upper',
      imageUrl: '/assets/images/clothes/blue-shirt.jpg',
      processedImageUrl: '/assets/images/clothes/blue-shirt-processed.jpg',
      color: 'blue',
      style: 'business',
      brand: 'Zara',
      season: 'all',
      tags: ['商务', '正式'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色牛仔裤',
      category: 'lower',
      imageUrl: '/assets/images/clothes/black-jeans.jpg',
      processedImageUrl: '/assets/images/clothes/black-jeans-processed.jpg',
      color: 'black',
      style: 'casual',
      brand: 'Levis',
      season: 'all',
      tags: ['基础款', '百搭'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '蓝色牛仔裤',
      category: 'lower',
      imageUrl: '/assets/images/clothes/blue-jeans.jpg',
      processedImageUrl: '/assets/images/clothes/blue-jeans-processed.jpg',
      color: 'blue',
      style: 'casual',
      brand: 'Levis',
      season: 'all',
      tags: ['基础款', '百搭'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色西裤',
      category: 'lower',
      imageUrl: '/assets/images/clothes/black-dress-pants.jpg',
      processedImageUrl: '/assets/images/clothes/black-dress-pants-processed.jpg',
      color: 'black',
      style: 'business',
      brand: 'H&M',
      season: 'all',
      tags: ['商务', '正式'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '白色运动鞋',
      category: 'shoes',
      imageUrl: '/assets/images/clothes/white-sneakers.jpg',
      processedImageUrl: '/assets/images/clothes/white-sneakers-processed.jpg',
      color: 'white',
      style: 'sport',
      brand: 'Nike',
      season: 'all',
      tags: ['运动', '舒适'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色运动鞋',
      category: 'shoes',
      imageUrl: '/assets/images/clothes/black-sneakers.jpg',
      processedImageUrl: '/assets/images/clothes/black-sneakers-processed.jpg',
      color: 'black',
      style: 'sport',
      brand: 'Adidas',
      season: 'all',
      tags: ['运动', '舒适'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色皮鞋',
      category: 'shoes',
      imageUrl: '/assets/images/clothes/black-leather-shoes.jpg',
      processedImageUrl: '/assets/images/clothes/black-leather-shoes-processed.jpg',
      color: 'black',
      style: 'formal',
      brand: 'Clarks',
      season: 'all',
      tags: ['正式', '商务'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色棒球帽',
      category: 'accessory',
      imageUrl: '/assets/images/clothes/black-cap.jpg',
      processedImageUrl: '/assets/images/clothes/black-cap-processed.jpg',
      color: 'black',
      style: 'casual',
      brand: 'New Era',
      season: 'summer',
      tags: ['配饰', '休闲'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '白色棒球帽',
      category: 'accessory',
      imageUrl: '/assets/images/clothes/white-cap.jpg',
      processedImageUrl: '/assets/images/clothes/white-cap-processed.jpg',
      color: 'white',
      style: 'casual',
      brand: 'New Era',
      season: 'summer',
      tags: ['配饰', '休闲'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      openid: openid,
      name: '黑色背包',
      category: 'accessory',
      imageUrl: '/assets/images/clothes/black-backpack.jpg',
      processedImageUrl: '/assets/images/clothes/black-backpack-processed.jpg',
      color: 'black',
      style: 'casual',
      brand: 'Herschel',
      season: 'all',
      tags: ['配饰', '实用'],
      usageCount: 0,
      lastUsedTime: null,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  ];

  const results = [];
  for (const cloth of testClothes) {
    try {
      const result = await db.collection('wardrobe').add({
        data: cloth
      });
      results.push({
        id: result._id,
        name: cloth.name,
        category: cloth.category,
        success: true
      });
    } catch (error) {
      results.push({
        name: cloth.name,
        category: cloth.category,
        success: false,
        error: error.message
      });
    }
  }

  return {
    success: true,
    total: testClothes.length,
    successCount: results.filter(r => r.success).length,
    failCount: results.filter(r => !r.success).length,
    results
  };
};