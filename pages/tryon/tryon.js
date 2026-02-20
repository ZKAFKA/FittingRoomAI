const CloudService = require('../../utils/cloud');
const i18n = require('../../utils/i18n');

Page({
  data: {
    userImage: null,
    selectedCloth: null,
    clothOptions: [],
    activeCategory: 'upper',
    currentCategoryClothes: [],
    scrollIntoViewId: '',
    // 各品类服装数据
    categoryClothes: {}, // 各品类服装数据
    selectedItems: {}, // 各品类选中的服装
    tryonSettings: {
      bodyType: 'standard',
      size: 'M',
      fit: 'regular',
      style: 'casual'
    },
    generateSettings: {
      background: 'none',
      lighting: 'natural',
      quality: 'high'
    },
    isGenerating: false,
    generatedImage: null,
    loading: false,
    error: null,
    showGuideOverlay: false,
    dontShowAgain: false,
    exampleImageUrl: null,
    uploadAreaHeight: 560,
    // 背景图片状态
    backgroundImageLoading: true,
    backgroundImageError: false,
    // 网格高度相关
    maxGridHeight: 0, // 最大网格高度（以衣物数量最多的分类为准）
    categoryHeights: {}, // 每个分类的高度
    // 吸顶状态相关
    isCategoryNavSticky: false, // 分类导航是否吸顶
    lockStatus: 'locked', // 锁定状态：locked, unlocked
    windowHeight: 0, // 窗口高度
    categoryNavTop: 0, // 分类导航初始位置
    // 滑动相关
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    isSwiping: false,
    // 边缘高亮提示
    showLeftEdgeHint: false,
    showRightEdgeHint: false,
    // 分类顺序
    categories: ['upper', 'lower', 'suit', 'shoes', 'accessories'],
    // 身体信息
    bodyInfo: {
      height: '',
      weight: '',
      gender: ''
    },
    // 身体信息编辑器弹窗
    showBodyInfoEditor: false,
    // 语言相关状态
    i18n: i18n,
    langData: i18n.getLangData(),

  },

  onLoad() {
    // 初始化语言管理
    this.initLanguage();
    
    this.loadClothOptions();
    this.loadExampleImage();
    this.getSystemInfo();
    this.loadBodyInfo();
  },

  loadBodyInfo() {
    try {
      // 从数据库获取身体信息
      const openid = wx.getStorageSync('openid');
      if (openid) {
        wx.cloud.database().collection('body_profile')
          .where({ openid })
          .get()
          .then(res => {
            if (res.data.length > 0) {
              const bodyInfo = res.data[0];
              this.setData({
                bodyInfo: {
                  height: bodyInfo.height || '',
                  weight: bodyInfo.weight || '',
                  gender: bodyInfo.gender || ''
                }
              });
            } else {
              // 如果数据库中没有数据，使用默认值
              this.setData({
                bodyInfo: {
                  height: '',
                  weight: '',
                  gender: ''
                }
              });
            }
          })
          .catch(error => {
            console.error('从数据库加载身体信息失败:', error);
            // 失败时使用默认值
            this.setData({
              bodyInfo: {
                height: '',
                weight: '',
                gender: ''
              }
            });
          });
      } else {
        // 如果没有openid，使用默认值
        this.setData({
          bodyInfo: {
            height: '',
            weight: '',
            gender: ''
          }
        });
      }
    } catch (error) {
      console.error('加载身体信息失败:', error);
      // 异常时使用默认值
      this.setData({
        bodyInfo: {
          height: '',
          weight: '',
          gender: ''
        }
      });
    }
  },

  showBodyInfoEditor() {
    this.setData({ showBodyInfoEditor: true });
  },

  hideBodyInfoEditor() {
    this.setData({ showBodyInfoEditor: false });
  },

  handleBodyInfoConfirm(e) {
    try {
      const { height, weight, gender } = e.detail;
      this.setData({
        bodyInfo: {
          height,
          weight,
          gender
        },
        showBodyInfoEditor: false
      });
    } catch (error) {
      console.error('处理身体信息失败:', error);
    }
  },

  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        });
        
        // 获取分类导航的初始位置
        this.getCategoryNavPosition();
      }
    });
  },

  getCategoryNavPosition() {
    const query = wx.createSelectorQuery();
    query.select('.category-nav').boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        this.setData({
          categoryNavTop: res[0].top
        });
      }
    });
  },

  async loadExampleImage() {
    try {
      const fileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/tryon-example.png';
      const result = await CloudService.getTempFileURL([fileID]);
      if (result && result.length > 0 && result[0].tempFileURL) {
        this.setData({ exampleImageUrl: result[0].tempFileURL });
      }
    } catch (error) {
      console.error('加载示例图片失败:', error);
    }
  },

  onShow() {
    this.updateTabBar();
  },

  onReady() {
    // 页面渲染完成后再次获取分类导航的位置，确保值的准确性
    setTimeout(() => {
      this.getCategoryNavPosition();
    }, 100);
  },

  checkFirstTime() {
    const hasSeenGuide = wx.getStorageSync('hasSeenTryonGuide');
    if (!hasSeenGuide) {
      this.setData({ showGuideOverlay: true });
    }
  },

  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0,
        isTryonPage: true
      });
    }
  },

  /**
   * 初始化语言管理
   */
  initLanguage() {
    // 更新语言数据
    this.updateLanguageData();
    
    // 监听语言变化
    i18n.onLanguageChange(this.onLanguageChange.bind(this));
  },

  /**
   * 更新语言数据
   */
  updateLanguageData() {
    this.setData({
      langData: i18n.getLangData()
    });
  },

  /**
   * 语言变化监听器
   */
  onLanguageChange() {
    this.updateLanguageData();
  },

  async loadClothOptions() {
    try {
      this.setData({ loading: true });
      
      // 添加模拟数据
      const mockClothes = [
        { _id: 'mock-1', name: '白色T恤', category: 'upper', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-2', name: '蓝色牛仔裤', category: 'lower', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-3', name: '黑色外套', category: 'upper', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-4', name: '红色裙子', category: 'lower', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-5', name: '商务套装', category: 'suit', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-6', name: '运动鞋', category: 'shoes', imageUrl: '/test/unnamed.png', status: 'active' },
        { _id: 'mock-8', name: '夹克', category: 'upper', imageUrl: '/test/unnamed.png', status: 'active' }
      ];
      
      this.setData({ 
        clothOptions: mockClothes,
        loading: false 
      });
      
      // 添加加载过渡效果
      setTimeout(() => {
        this.loadAllCategories();
      }, 100);
    } catch (error) {
      console.error('加载服装选项失败:', error);
      this.setData({ 
        loading: false, 
        error: '加载服装失败，请稍后重试' 
      });
      
      const errMsg = error.errMsg || error.message || '';
      if (errMsg.includes('network') || errMsg.includes('网络')) {
        this.showErrorModal('网络连接失败', '请检查网络连接后重试');
      } else if (errMsg.includes('permission') || errMsg.includes('权限')) {
        this.showErrorModal('权限不足', '没有访问数据库的权限');
      } else {
        this.showErrorModal('加载失败', '无法加载服装列表，请稍后重试');
      }
    }
  },

  loadAllCategories() {
    const categories = ['upper', 'lower', 'suit', 'shoes', 'accessories'];
    const categoryClothes = {};
    const categoryHeights = {};
    let maxClothCount = 0;
    
    // 获取屏幕高度（转换为rpx）
    const { windowHeight } = this.data;
    // 导航栏高度为120rpx
    const navHeight = 120;
    // 计算最小高度：屏幕高度 - 导航栏高度（转换为rpx，假设1px = 2rpx）
    const minHeight = Math.floor(windowHeight * 2) - navHeight;
    
    categories.forEach(category => {
      const clothes = this.filterClothesByCategory(category);
      categoryClothes[category] = clothes;
      // 计算衣物数量（包括添加按钮）
      const clothCount = clothes.length + 1;
      if (clothCount > maxClothCount) {
        maxClothCount = clothCount;
      }
      // 为每个分类计算合适的高度
      const rows = Math.ceil(clothCount / 3);
      const contentHeight = rows * 320; // 300rpx卡片高度 + 20rpx间隙
      // 取内容高度和最小高度的最大值
      categoryHeights[category] = Math.max(contentHeight, minHeight);
    });
    
    // 计算最大网格高度（基于衣物数量最多的分类）
    const rows = Math.ceil(maxClothCount / 3);
    const contentHeight = rows * 320;
    const maxGridHeight = Math.max(contentHeight, minHeight); // 同样应用最小高度限制
    
    this.setData({ 
      categoryClothes,
      categoryHeights,
      maxGridHeight
    });
  },

  filterClothesByCategory(category) {
    const { clothOptions } = this.data;
    
    if (clothOptions.length === 0) {
      return [];
    }
    
    const categoryMap = {
      'headwear': ['帽子', '头饰', '发带', '头巾'],
      'upper': ['上衣', '外套', '衬衫', 'T恤', '夹克'],
      'inner': ['内搭', '背心', '打底', '内衣'],
      'lower': ['裤子', '裙子', '短裤'],
      'suit': ['套装', '西装', '正装', '商务'],
      'shoes': ['鞋', '靴', '运动鞋'],
      'accessories': ['配饰', '项链', '腕饰', '包包', '围巾']
    };
    
    const keywords = categoryMap[category] || [];
    const filteredClothes = clothOptions.filter(cloth => {
      const name = cloth.name || '';
      return keywords.some(keyword => name.includes(keyword));
    });
    
    return filteredClothes;
  },



  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    
    // 先设置过渡效果
    this.setData({
      activeCategory: category,
      scrollIntoViewId: `category-${category}`
    });
    
    // 无论是否处于吸顶状态，切换分类时都会自动滑到最顶端
    this.scrollToCategoryTop(category);
  },

  scrollToCategoryTop(category) {
    // 跳转到分类内容的顶部
    const query = wx.createSelectorQuery();
    query.select(`.category-content[data-category="${category}"]`).boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const { isCategoryNavSticky } = this.data;
        // 当导航栏吸顶时，需要考虑导航栏高度（120rpx），确保内容不被遮挡
        // 当导航栏不吸顶时，保持原有逻辑
        const navHeight = isCategoryNavSticky ? 120 : 100;
        wx.pageScrollTo({
          scrollTop: res[0].top - navHeight,
          duration: 300
        });
      }
    });
  },

  handleAddCloth(e) {
    const category = e.currentTarget.dataset.category;
    // 跳转到衣橱页面，显示添加衣物弹窗
    wx.navigateTo({
      url: `/pages/wardrobe/wardrobe?showAddModal=true&defaultCategory=${category}`
    });
  },

  // 滚动同步效果
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    const { categoryNavTop, isCategoryNavSticky, lockStatus, activeCategory } = this.data;
    
    // 确保categoryNavTop有值
    if (!categoryNavTop) {
      this.getCategoryNavPosition();
      return;
    }
    
    // 实现吸顶状态的锁定机制
    if (isCategoryNavSticky) {
      if (scrollTop < categoryNavTop) {
        // 当导航栏处于吸顶状态，且用户向上滑动
        if (lockStatus === 'locked') {
          // 第一次滑到顶端时解锁
          this.setData({ lockStatus: 'unlocked' });
        } else if (lockStatus === 'unlocked') {
          // 解锁状态下再次上滑退出吸顶
          // 检查当前激活分类的内容区域位置
          const query = wx.createSelectorQuery();
          query.selectAll('.category-content').boundingClientRect();
          query.exec((res) => {
            if (res && res.length > 0) {
              // 找到当前激活分类的内容区域
              for (let i = 0; i < res.length; i++) {
                if (res[i].dataset && res[i].dataset.category === activeCategory) {
                  if (res[i].top >= 0) {
                    this.setData({
                      isCategoryNavSticky: false,
                      lockStatus: 'locked'
                    });
                  }
                  break;
                }
              }
              // 如果没有找到带dataset的元素，使用第一个
              if (res[0] && res[0].top >= 0) {
                this.setData({
                  isCategoryNavSticky: false,
                  lockStatus: 'locked'
                });
              }
            }
          });
        }
      } else if (scrollTop > categoryNavTop && lockStatus === 'unlocked') {
        // 解锁状态下下滑，重新锁定
        this.setData({ lockStatus: 'locked' });
      }
    } else {
      if (scrollTop >= categoryNavTop) {
        // 下滑时进入吸顶状态并锁定
        this.setData({
          isCategoryNavSticky: true,
          lockStatus: 'locked'
        });
      }
    }
  },

  chooseUserImage() {
    console.log('chooseUserImage called');
    // 先检查登录状态
    this.checkLogin().then(() => {
      // 登录成功后显示引导弹窗
      this.setData({ showGuideOverlay: true });
    }).catch(() => {
      // 登录失败或取消，不继续操作
      console.log('用户未登录');
    });
  },

  /**
   * 检查登录状态，未登录则触发微信授权
   */
  checkLogin() {
    return new Promise((resolve, reject) => {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 已登录
        resolve();
      } else {
        // 未登录，显示授权提示
        wx.showModal({
          title: '登录授权',
          content: '请授权登录以使用完整功能',
          showCancel: true,
          cancelText: '取消',
          confirmText: '授权登录',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 用户确认授权
              this.loginWithWechat().then(resolve).catch(reject);
            } else {
              // 用户取消授权
              reject(new Error('用户取消授权'));
            }
          },
          fail: () => {
            reject(new Error('显示授权弹窗失败'));
          }
        });
      }
    });
  },

  /**
   * 微信登录并获取用户信息
   */
  loginWithWechat() {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. 微信登录
        const loginRes = await wx.login({
          timeout: 10000
        });
        
        if (!loginRes.code) {
          throw new Error('登录失败：' + loginRes.errMsg);
        }
        
        // 2. 获取用户信息
        const userInfoRes = await wx.getUserProfile({
          desc: '用于完善用户资料'
        });
        
        if (!userInfoRes.userInfo) {
          throw new Error('获取用户信息失败');
        }
        
        const { nickName, avatarUrl } = userInfoRes.userInfo;
        
        // 3. 调用云函数获取openid
        const cloudRes = await wx.cloud.callFunction({
          name: 'login',
          data: {
            code: loginRes.code
          }
        });
        
        const openid = cloudRes.result.openid;
        if (!openid) {
          throw new Error('获取openid失败');
        }
        
        // 4. 存储openid
        wx.setStorageSync('openid', openid);
        
        // 5. 同步用户信息到数据库
        await this.syncUserInfo(openid, nickName, avatarUrl);
        
        resolve();
      } catch (error) {
        console.error('微信登录失败:', error);
        reject(error);
      }
    });
  },

  /**
   * 同步用户信息到数据库
   */
  async syncUserInfo(openid, nickName, avatarUrl) {
    try {
      const db = wx.cloud.database();
      const userCollection = db.collection('users');
      
      // 检查用户是否已存在
      const userRes = await userCollection.where({ openid }).get();
      
      if (userRes.data.length > 0) {
        // 更新现有用户
        await userCollection.doc(userRes.data[0]._id).update({
          data: {
            nickName,
            // 保持用户头像设置不变，使用默认头像
            updateTime: db.serverDate()
          }
        });
      } else {
        // 创建新用户记录
        await userCollection.add({
          data: {
            openid,
            nickName,
            // 使用默认头像
            avatarUrl: 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg',
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      
      // 同步身体信息
      await this.syncBodyInfo(openid);
      
    } catch (error) {
      console.error('同步用户信息失败:', error);
      // 静默失败，不影响登录流程
    }
  },

  /**
   * 同步身体信息
   */
  async syncBodyInfo(openid) {
    try {
      const db = wx.cloud.database();
      const bodyCollection = db.collection('body_profile');
      
      // 检查身体信息是否已存在
      const bodyRes = await bodyCollection.where({ openid }).get();
      
      if (bodyRes.data.length === 0) {
        // 创建默认身体信息
        await bodyCollection.add({
          data: {
            openid,
            height: '',
            weight: '',
            gender: '',
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      
    } catch (error) {
      console.error('同步身体信息失败:', error);
    }
  },

  openImagePicker() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'], // 自动压缩高分辨率图片
      sourceType: ['album', 'camera'],
      success: (res) => {
        try {
          const tempFile = res.tempFiles[0];
          
          if (!tempFile || !tempFile.tempFilePath) {
            this.showErrorModal('文件选择失败', '请重新选择图片');
            return;
          }
          
          const fileSize = tempFile.size || 0;
          const maxSize = 10 * 1024 * 1024;
          
          if (fileSize > maxSize) {
            this.showErrorModal(
              '文件大小超限', 
              `当前文件大小：${(fileSize / 1024 / 1024).toFixed(2)}MB\n最大支持：10MB\n请选择较小的图片或压缩后重试`
            );
            return;
          }
          
          if (fileSize === 0) {
            this.showErrorModal('文件无效', '选择的图片文件大小为0，请重新选择');
            return;
          }
          
          wx.getImageInfo({
            src: tempFile.tempFilePath,
            success: (imageInfo) => {
              // 使用实际图片的宽高比例
              const aspectRatio = imageInfo.width / imageInfo.height;
              
              // 获取屏幕信息
              wx.getSystemInfo({
                success: (systemInfo) => {
                  // 计算upload-area的实际宽度（rpx）
                  const screenWidth = 750; // 微信小程序设计稿宽度
                  const containerMaxWidth = screenWidth * 0.85; // 85%的屏幕宽度
                  const uploadAreaWidth = containerMaxWidth - 10; // 容器最大宽度减去10rpx
                  
                  // 根据宽度计算高度，使用实际图片的比例
                  const calculatedHeight = uploadAreaWidth / aspectRatio;
                  
                  // 计算页面80%的高度限制（rpx）
                  const maxHeightLimit = (systemInfo.windowHeight * 2) * 0.8; // 转换为rpx并取80%
                  
                  // 限制最大高度为页面的80%
                  let finalHeight = calculatedHeight;
                  if (finalHeight > maxHeightLimit) {
                    finalHeight = maxHeightLimit;
                  }
                  
                  this.setData({ 
                    userImage: tempFile.tempFilePath,
                    uploadAreaHeight: Math.round(finalHeight)
                  });
                },
                fail: (error) => {
                  console.error('获取系统信息失败:', error);
                  // 失败时使用默认计算
                  const screenWidth = 750; // 微信小程序设计稿宽度
                  const containerMaxWidth = screenWidth * 0.85; // 85%的屏幕宽度
                  const uploadAreaWidth = containerMaxWidth - 10; // 容器最大宽度减去10rpx
                  
                  // 使用实际图片的宽高比例
                  const aspectRatio = imageInfo.width / imageInfo.height;
                  // 根据宽度计算高度
                  const calculatedHeight = uploadAreaWidth / aspectRatio;
                  
                  this.setData({ 
                    userImage: tempFile.tempFilePath,
                    uploadAreaHeight: Math.round(calculatedHeight)
                  });
                }
              });
            },
            fail: (error) => {
              console.error('获取图片信息失败:', error);
              // 失败时使用默认高度
              this.setData({ 
                userImage: tempFile.tempFilePath,
                uploadAreaHeight: 560 // 默认高度
              });
            }
          });
        } catch (error) {
          console.error('处理选择的图片失败:', error);
          this.showErrorModal('图片处理失败', '请重新选择图片');
        }
      },
      fail: (error) => {
        const errMsg = error.errMsg || '';
        
        if (errMsg.includes('cancel') || errMsg.includes('用户取消')) {
          console.log('用户取消选择图片');
          return;
        }
        
        console.error('选择图片失败:', error);
        this.showErrorModal('选择图片失败', '请检查相册权限或稍后重试');
      }
    });
  },

  showErrorModal(title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#7B61FF',
      success: (res) => {
        if (res.confirm) {
          console.log('用户已确认错误提示');
        }
      }
    });
  },

  closeGuideOverlay() {
    this.setData({ showGuideOverlay: false });
  },

  toggleDontShowAgain() {
    this.setData({
      dontShowAgain: !this.data.dontShowAgain
    });
  },

  startUpload() {
    this.setData({ showGuideOverlay: false });
    if (this.data.dontShowAgain) {
      wx.setStorageSync('hasSeenTryonGuide', true);
    }
    this.openImagePicker();
  },

  selectCloth(e) {
    try {
      const clothId = e.currentTarget.dataset.id;
      const category = e.currentTarget.dataset.category;
      
      if (!clothId || !category) {
        console.error('服装ID或品类为空');
        return;
      }
      
      const { categoryClothes, selectedItems } = this.data;
      const clothes = categoryClothes[category] || [];
      const selectedCloth = clothes.find(cloth => cloth._id === clothId);
      
      if (!selectedCloth) {
        console.error('未找到对应的服装');
        return;
      }
      
      // 更新选中状态
      const newSelectedItems = { ...selectedItems };
      
      if (newSelectedItems[category] && newSelectedItems[category]._id === clothId) {
        // 取消选中
        delete newSelectedItems[category];
      } else {
        // 选中
        newSelectedItems[category] = selectedCloth;
      }
      
      this.setData({ selectedItems: newSelectedItems });
    } catch (error) {
      console.error('选择服装失败:', error);
      this.showErrorModal('选择失败', '无法选择该服装，请稍后重试');
    }
  },

  startTryon() {
    if (!this.data.userImage) {
      wx.showToast({ title: '请上传照片', icon: 'none' });
      return;
    }
    
    const { selectedItems } = this.data;
    const hasSelectedItems = Object.keys(selectedItems).length > 0;
    
    if (!hasSelectedItems) {
      wx.showToast({ title: '请选择服装', icon: 'none' });
      return;
    }

    this.generateTryon();
  },

  navigateToClothConfirm() {
    if (!this.data.userImage) {
      wx.showToast({ title: '请先上传用户照片', icon: 'none' });
      return;
    }
    
    if (!this.data.selectedCloth) {
      wx.showToast({ title: '请选择服装', icon: 'none' });
      return;
    }

    try {
      wx.navigateTo({
        url: `/pages/cloth-confirm/cloth-confirm?userImage=${encodeURIComponent(this.data.userImage)}&clothId=${this.data.selectedCloth._id}`
      });
    } catch (error) {
      console.error('跳转到服装确认页面失败:', error);
      this.showErrorModal('跳转失败', '无法打开服装确认页面，请稍后重试');
    }
  },

  navigateToTryonSettings() {
    try {
      wx.navigateTo({
        url: '/pages/tryon-settings/tryon-settings'
      });
    } catch (error) {
      console.error('跳转到试衣设置页面失败:', error);
      this.showErrorModal('跳转失败', '无法打开设置页面，请稍后重试');
    }
  },

  navigateToUploadCloth() {
    try {
      wx.navigateTo({
        url: '/pages/upload-cloth/upload-cloth'
      });
    } catch (error) {
      console.error('跳转到上传服装页面失败:', error);
      this.showErrorModal('跳转失败', '无法打开上传页面，请稍后重试');
    }
  },

  async generateTryon(prompt) {
    if (!this.data.userImage) {
      wx.showToast({ title: '请上传照片', icon: 'none' });
      return;
    }

    try {
      this.setData({ isGenerating: true, error: null });
      wx.showLoading({ title: '生成试衣效果...', mask: true });

      let uploadResult;
      try {
        uploadResult = await this.uploadImage(this.data.userImage);
      } catch (uploadError) {
        wx.hideLoading();
        
        if (uploadError.message === 'USER_CANCELLED') {
          console.log('用户取消上传');
          return;
        }
        
        this.showErrorModal(
          '图片上传失败',
          uploadError.message || '上传过程中发生错误，请稍后重试'
        );
        return;
      }
      
      if (!uploadResult || !uploadResult.fileID) {
        wx.hideLoading();
        this.showErrorModal('上传失败', '服务器未返回文件ID，请稍后重试');
        return;
      }
      
      // 准备衣物图片信息
      const { selectedItems } = this.data;
      const clothImages = Object.values(selectedItems).map(item => item.imageUrl);
      
      let generateResult;
      try {
        // 调用hunyuanGenerateImage函数生成试衣效果
        generateResult = await this.hunyuanGenerateImage({
          prompt,
          userImage: uploadResult.fileID,
          clothImages
        });
      } catch (cloudError) {
        wx.hideLoading();
        console.error('图片生成失败:', cloudError);
        
        const errMsg = cloudError.errMsg || '';
        if (errMsg.includes('network') || errMsg.includes('网络')) {
          this.showErrorModal('网络连接失败', '请检查网络连接后重试');
        } else if (errMsg.includes('timeout') || errMsg.includes('超时')) {
          this.showErrorModal('请求超时', '服务器响应时间过长，请稍后重试');
        } else if (errMsg.includes('quota') || errMsg.includes('配额')) {
          this.showErrorModal('调用次数超限', '请稍后重试或升级套餐');
        } else {
          this.showErrorModal('生成失败', cloudError.message || '服务器处理失败，请稍后重试');
        }
        return;
      }

      if (generateResult && generateResult.imageUrl) {
        // 显示生成结果
        this.setData({ generatedImage: generateResult.imageUrl });
        
        // 保存生成结果到云存储和数据库（带重试机制）
        let saveResult;
        try {
          saveResult = await this.saveTryonResultWithRetry(generateResult.imageUrl);
        } catch (error) {
          console.error('保存试衣结果异常:', error);
          saveResult = { success: false, error: error.message };
        }
        
        wx.hideLoading();
        
        if (saveResult.success) {
          wx.showToast({ title: '生成成功并已保存', icon: 'success' });
        } else {
          wx.showToast({ title: '生成成功但保存失败', icon: 'none' });
          console.error('保存失败原因:', saveResult.error);
        }
        
        // 清除已选中衣物的勾选状态
        this.setData({ selectedItems: {} });
      } else {
        wx.hideLoading();
        const errorMsg = generateResult?.error || '生成失败';
        this.showErrorModal('生成失败', errorMsg);
      }
    } catch (error) {
      console.error('生成试衣效果失败:', error);
      wx.hideLoading();
      this.showErrorModal('操作失败', error.message || '发生未知错误，请稍后重试');
      this.setData({ error: error.message || '生成失败' });
    } finally {
      this.setData({ isGenerating: false });
    }
  },

  async uploadImage(tempFilePath) {
    try {
      return await new Promise((resolve, reject) => {
        const cloudPath = `user-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePath,
          success: (res) => {
            if (!res || !res.fileID) {
              reject(new Error('上传失败：服务器未返回文件ID'));
              return;
            }
            resolve(res);
          },
          fail: (error) => {
            const errMsg = error.errMsg || '';
            console.error('云存储上传失败:', error);
            
            if (errMsg.includes('cancel') || errMsg.includes('用户取消')) {
              reject(new Error('USER_CANCELLED'));
              return;
            }
            
            if (errMsg.includes('network') || errMsg.includes('网络')) {
              reject(new Error('网络连接失败，请检查网络设置'));
              return;
            }
            
            if (errMsg.includes('size') || errMsg.includes('大小')) {
              reject(new Error('文件大小超出限制'));
              return;
            }
            
            if (errMsg.includes('format') || errMsg.includes('格式')) {
              reject(new Error('文件格式不支持'));
              return;
            }
            
            if (errMsg.includes('permission') || errMsg.includes('权限')) {
              reject(new Error('没有上传权限，请检查云存储配置'));
              return;
            }
            
            if (errMsg.includes('quota') || errMsg.includes('配额')) {
              reject(new Error('云存储空间不足'));
              return;
            }
            
            reject(new Error('上传失败：' + (errMsg || '未知错误')));
          }
        });
      });
    } catch (error) {
      console.error('上传图片异常:', error);
      throw error;
    }
  },

  saveTryonResult() {
    if (!this.data.generatedImage) {
      wx.showToast({ title: '没有可保存的试衣效果', icon: 'none' });
      return;
    }

    try {
      wx.navigateTo({
        url: `/pages/preview/preview?imageUrl=${encodeURIComponent(this.data.generatedImage)}`
      });
    } catch (error) {
      console.error('跳转到预览页面失败:', error);
      this.showErrorModal('跳转失败', '无法打开预览页面，请稍后重试');
    }
  },

  shareTryonResult() {
    if (!this.data.generatedImage) {
      wx.showToast({ title: '没有可分享的试衣效果', icon: 'none' });
      return;
    }

    try {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    } catch (error) {
      console.error('显示分享菜单失败:', error);
      this.showErrorModal('分享功能不可用', '当前版本不支持分享功能');
    }
  },

  onShareAppMessage() {
    return {
      title: '我的虚拟试衣效果',
      path: '/pages/index/index',
      imageUrl: this.data.generatedImage || '/assets/images/app-icon.png'
    };
  },

  onShareTimeline() {
    return {
      title: '虚拟试衣新体验',
      imageUrl: this.data.generatedImage || '/assets/images/app-icon.png'
    };
  },

  /**
   * 开始试衣按钮点击事件处理
   */
  async startTryon() {
    try {
      // 检查是否已上传人像照片
      if (!this.data.userImage) {
        wx.showToast({
          title: '请先上传人像照片',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 检查是否已选中衣物
      const { selectedItems } = this.data;
      const hasSelectedClothes = Object.keys(selectedItems).length > 0;
      
      if (!hasSelectedClothes) {
        wx.showToast({
          title: '请先选择衣物',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 生成对应的prompt
      const prompt = this.generatePrompt(selectedItems);
      console.log('生成的prompt:', prompt);

      // 调用图片生成功能
      await this.generateTryon(prompt);
    } catch (error) {
      console.error('开始试衣失败:', error);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 根据选中衣物品类生成对应的prompt
   */
  generatePrompt(selectedItems) {
    let prompt = '一个人穿着';
    
    Object.values(selectedItems).forEach((item, index) => {
      if (index > 0) {
        prompt += '和';
      }
      prompt += item.name;
    });
    
    prompt += '，高清照片，真实感，自然光线，正面视角';
    return prompt;
  },

  /**
   * 调用混元生图API生成试衣效果
   */
  async hunyuanGenerateImage({ prompt, userImage, clothImages }) {
    // 这里实现调用混元生图3.0大模型的逻辑
    // 由于是模拟实现，返回一个示例结果
    return new Promise((resolve) => {
      // 模拟生成过程
      setTimeout(() => {
        resolve({
          imageUrl: 'https://example.com/tryon-result.jpg', // 示例图片URL
          success: true
        });
      }, 2000);
    });
  },

  /**
   * 保存试衣结果到云存储和数据库
   */
  async saveTryonResult(imageUrl) {
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        console.error('用户未登录，无法保存试衣结果');
        return {
          success: false,
          error: '用户未登录'
        };
      }
      
      // 1. 生成唯一的文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substr(2, 9);
      const fileExt = imageUrl.split('.').pop() || 'jpg';
      const cloudPath = `tryon-results/${openid}/${timestamp}_${randomStr}.${fileExt}`;
      
      console.log('开始保存试衣结果:', {
        cloudPath,
        imageUrl
      });
      
      // 2. 下载图片到临时路径
      const downloadResult = await wx.downloadFile({
        url: imageUrl
      });
      
      if (downloadResult.statusCode !== 200) {
        throw new Error('图片下载失败');
      }
      
      const tempFilePath = downloadResult.tempFilePath;
      
      // 3. 上传图片到云存储
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath,
        filePath: tempFilePath
      });
      
      if (!uploadResult.fileID) {
        throw new Error('图片上传失败');
      }
      
      const fileID = uploadResult.fileID;
      console.log('图片上传成功，fileID:', fileID);
      
      // 4. 创建数据库记录
      const db = wx.cloud.database();
      const tryonRecord = {
        openid,
        tryon_time: new Date(),
        image_file_id: fileID,
        is_favorite: false,
        create_time: db.serverDate()
      };
      
      const dbResult = await db.collection('tryon_record').add({
        data: tryonRecord
      });
      
      console.log('数据库记录创建成功，_id:', dbResult._id);
      
      // 5. 返回成功结果
      return {
        success: true,
        fileID,
        recordId: dbResult._id
      };
    } catch (error) {
      console.error('保存试衣结果失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * 带重试机制的保存试衣结果方法
   */
  async saveTryonResultWithRetry(imageUrl, maxRetries = 3, retryDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`保存试衣结果，尝试 ${attempt}/${maxRetries}`);
      
      try {
        const result = await this.saveTryonResult(imageUrl);
        
        if (result.success) {
          return result;
        } else {
          // 检查是否是可重试的错误
          const isRetryable = this.isRetryableError(result.error);
          if (!isRetryable) {
            return result;
          }
          
          lastError = result.error;
          console.log(`尝试 ${attempt} 失败，错误: ${result.error}，将重试...`);
        }
      } catch (error) {
        lastError = error.message;
        console.log(`尝试 ${attempt} 异常，错误: ${error.message}，将重试...`);
      }
      
      // 等待一段时间后重试
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    // 所有尝试都失败
    return {
      success: false,
      error: lastError || '保存失败，已达到最大重试次数'
    };
  },

  /**
   * 检查错误是否可重试
   */
  isRetryableError(errorMessage) {
    const retryableErrors = [
      '网络',
      'timeout',
      '超时',
      'connection',
      '连接',
      'upload',
      '上传',
      'download',
      '下载',
      'server',
      '服务器'
    ];
    
    return retryableErrors.some(keyword => 
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  /**
   * 长按保存试衣结果图片
   */
  saveTryonResultImage() {
    if (!this.data.generatedImage) {
      return;
    }
    
    wx.showActionSheet({
      itemList: ['保存图片到相册'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showLoading({ title: '保存中...' });
          
          // 这里实现保存图片到相册的逻辑
          // 由于是模拟实现，仅打印日志并显示成功提示
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '保存成功', icon: 'success' });
            console.log('保存试衣结果到相册:', this.data.generatedImage);
          }, 1000);
        }
      },
      fail: (error) => {
        console.error('保存图片失败:', error);
      }
    });
  },

  handleError() {
    this.setData({ error: null });
  },

  // 背景图片加载完成
  onBackgroundImageLoad() {
    this.setData({ backgroundImageLoading: false });
  },

  // 背景图片加载失败
  onBackgroundImageError() {
    this.setData({ 
      backgroundImageLoading: false,
      backgroundImageError: true 
    });
  },



  // 触摸开始事件
  onTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX,
      touchStartY: e.touches[0].clientY,
      isSwiping: true
    });
  },

  // 触摸移动事件
  onTouchMove(e) {
    if (!this.data.isSwiping) return;
    
    const { touchStartX, categories, activeCategory } = this.data;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX;
    
    this.setData({
      touchEndX: currentX,
      touchEndY: e.touches[0].clientY
    });
    
    // 边缘高亮提示逻辑
    const currentIndex = categories.indexOf(activeCategory);
    
    if (deltaX > 0 && currentIndex === 0) {
      // 向右滑动到最右侧页面，显示右侧边缘提示
      this.setData({ showLeftEdgeHint: true });
    } else if (deltaX < 0 && currentIndex === categories.length - 1) {
      // 向左滑动到最左侧页面，显示左侧边缘提示
      this.setData({ showRightEdgeHint: true });
    } else {
      // 重置边缘提示
      this.setData({ 
        showLeftEdgeHint: false, 
        showRightEdgeHint: false 
      });
    }
  },

  // 触摸结束事件
  onTouchEnd(e) {
    if (!this.data.isSwiping) return;
    
    const { touchStartX, touchEndX, touchStartY, touchEndY, categories, activeCategory } = this.data;
    
    // 计算滑动距离和角度
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
    
    // 定义滑动阈值
    const SWIPE_THRESHOLD = 50; // 最小滑动距离
    const ANGLE_THRESHOLD = 30; // 最大角度偏差
    
    // 确保是水平滑动
    if (Math.abs(angle) < ANGLE_THRESHOLD || Math.abs(angle) > 150) {
      // 检测有效的左右滑动
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && distance > SWIPE_THRESHOLD) {
        const currentIndex = categories.indexOf(activeCategory);
        
        if (deltaX > 0 && currentIndex > 0) {
          // 向右滑动，切换到上一个分类
          this.selectCategoryByIndex(currentIndex - 1);
        } else if (deltaX < 0 && currentIndex < categories.length - 1) {
          // 向左滑动，切换到下一个分类
          this.selectCategoryByIndex(currentIndex + 1);
        }
      }
    }
    
    // 延迟隐藏边缘提示
    setTimeout(() => {
      this.setData({ 
        showLeftEdgeHint: false, 
        showRightEdgeHint: false 
      });
    }, 250);
    
    // 重置滑动状态
    this.setData({
      isSwiping: false,
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0
    });
  },

  // 根据索引选择分类
  selectCategoryByIndex(index) {
    const { categories } = this.data;
    if (index >= 0 && index < categories.length) {
      const category = categories[index];
      
      // 添加过渡动画效果
      this.setData({
        activeCategory: category,
        scrollIntoViewId: `category-${category}`
      });
      
      // 滚动到分类顶部
      this.scrollToCategoryTop(category);
    }
  }
});