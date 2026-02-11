const CloudService = require('../../utils/cloud');

Page({
  data: {
    userImage: null,
    selectedCloth: null,
    clothOptions: [],
    activeCategory: 'upper',
    currentCategoryClothes: [],
    scrollIntoViewId: '',
    // 新增状态变量
    swiperCurrent: 1, // 默认选中上衣
    categoryClothes: {}, // 各品类服装数据
    selectedItems: {}, // 各品类选中的服装
    swiperHeight: 600, // swiper初始高度
    scrollPositions: {}, // 各品类滚动位置
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
    uploadAreaHeight: 400
  },

  onLoad() {
    this.loadClothOptions();
    this.checkFirstTime();
    this.loadExampleImage();
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

  checkFirstTime() {
    const hasSeenGuide = wx.getStorageSync('hasSeenTryonGuide');
    if (!hasSeenGuide) {
      this.setData({ showGuideOverlay: true });
    }
  },

  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1,
        isTryonPage: true
      });
    }
  },

  async loadClothOptions() {
    try {
      this.setData({ loading: true });
      
      const res = await wx.cloud.database().collection('wardrobe')
        .where({ status: 'active' })
        .get();
      
      if (!res || !res.data) {
        throw new Error('获取服装数据失败');
      }
      
      this.setData({ 
        clothOptions: res.data || [],
        loading: false 
      });
      
      this.loadAllCategories();
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
    const categories = ['headwear', 'upper', 'inner', 'lower', 'suit', 'shoes', 'accessories'];
    const categoryClothes = {};
    
    categories.forEach(category => {
      categoryClothes[category] = this.filterClothesByCategory(category);
    });
    
    this.setData({ categoryClothes });
    
    // 初始化swiper高度
    this.calculateSwiperHeight();
  },

  filterClothesByCategory(category) {
    const { clothOptions } = this.data;
    
    if (clothOptions.length === 0) {
      return this.getMockClothes(category);
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
    
    return filteredClothes.length > 0 ? filteredClothes : this.getMockClothes(category);
  },

  getMockClothes(category) {
    const mockData = {
      'headwear': [
        { _id: 'mock-headwear-1', name: '棒球帽', imageUrl: '/assets/icons/icon-history.png', category: 'headwear' },
        { _id: 'mock-headwear-2', name: '渔夫帽', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'headwear' },
        { _id: 'mock-headwear-3', name: '发带', imageUrl: '/assets/icons/icon-history.png', category: 'headwear' }
      ],
      'upper': [
        { _id: 'mock-upper-1', name: '白色T恤', imageUrl: '/assets/icons/icon-history.png', category: 'upper' },
        { _id: 'mock-upper-2', name: '蓝色衬衫', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'upper' },
        { _id: 'mock-upper-3', name: '黑色夹克', imageUrl: '/assets/icons/icon-history.png', category: 'upper' },
        { _id: 'mock-upper-4', name: '灰色外套', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'upper' },
        { _id: 'mock-upper-5', name: '红色卫衣', imageUrl: '/assets/icons/icon-history.png', category: 'upper' },
        { _id: 'mock-upper-6', name: '绿色毛衣', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'upper' },
        { _id: 'mock-upper-7', name: '粉色针织衫', imageUrl: '/assets/icons/icon-history.png', category: 'upper' },
        { _id: 'mock-upper-8', name: '紫色风衣', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'upper' },
        { _id: 'mock-upper-9', name: '黄色背心', imageUrl: '/assets/icons/icon-history.png', category: 'upper' }
      ],
      'inner': [
        { _id: 'mock-inner-1', name: '白色背心', imageUrl: '/assets/icons/icon-history.png', category: 'inner' },
        { _id: 'mock-inner-2', name: '黑色打底', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'inner' },
        { _id: 'mock-inner-3', name: '灰色内衣', imageUrl: '/assets/icons/icon-history.png', category: 'inner' }
      ],
      'lower': [
        { _id: 'mock-lower-1', name: '牛仔裤', imageUrl: '/assets/icons/icon-history.png', category: 'lower' },
        { _id: 'mock-lower-2', name: '休闲裤', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'lower' },
        { _id: 'mock-lower-3', name: '运动短裤', imageUrl: '/assets/icons/icon-history.png', category: 'lower' }
      ],
      'suit': [
        { _id: 'mock-suit-1', name: '西装套装', imageUrl: '/assets/icons/icon-history.png', category: 'suit' },
        { _id: 'mock-suit-2', name: '运动套装', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'suit' },
        { _id: 'mock-suit-3', name: '休闲套装', imageUrl: '/assets/icons/icon-history.png', category: 'suit' },
        { _id: 'mock-suit-4', name: '正装套装', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'suit' },
        { _id: 'mock-suit-5', name: '商务套装', imageUrl: '/assets/icons/icon-history.png', category: 'suit' },
        { _id: 'mock-suit-6', name: '时尚套装', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'suit' },
        { _id: 'mock-suit-7', name: '休闲西装', imageUrl: '/assets/icons/icon-history.png', category: 'suit' },
        { _id: 'mock-suit-8', name: '运动休闲', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'suit' },
        { _id: 'mock-suit-9', name: '商务休闲', imageUrl: '/assets/icons/icon-history.png', category: 'suit' }
      ],
      'shoes': [
        { _id: 'mock-shoes-1', name: '运动鞋', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'shoes' },
        { _id: 'mock-shoes-2', name: '休闲鞋', imageUrl: '/assets/icons/icon-history.png', category: 'shoes' }
      ],
      'accessories': [
        { _id: 'mock-acc-1', name: '项链', imageUrl: '/assets/icons/icon-history.png', category: 'accessories' },
        { _id: 'mock-acc-2', name: '腕饰', imageUrl: '/assets/icons/icon-wardrobe.png', category: 'accessories' },
        { _id: 'mock-acc-3', name: '时尚包', imageUrl: '/assets/icons/icon-history.png', category: 'accessories' }
      ]
    };
    
    return mockData[category] || [];
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    const categoryIndex = this.getIndexByCategory(category);
    
    this.setData({ 
      activeCategory: category,
      scrollIntoViewId: `category-${category}`,
      swiperCurrent: categoryIndex
    });
    
    // 恢复滚动位置
    this.restoreScrollPosition(category);
  },

  handleAddCloth(e) {
    const category = e.currentTarget.dataset.category;
    const categoryNames = {
      'upper': '上装',
      'inner': '内搭',
      'lower': '下装',
      'suit': '套装',
      'shoes': '鞋帽',
      'accessories': '配饰'
    };
    
    wx.showModal({
      title: '添加衣服',
      content: `是否要添加新的${categoryNames[category]}到衣橱？`,
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.chooseMedia({
            count: 1,
            mediaType: 'image',
            sourceType: ['album', 'camera'],
            success: (res) => {
              const tempFilePath = res.tempFiles[0].tempFilePath;
              
              wx.showToast({
                title: '上传中...',
                icon: 'loading',
                duration: 2000
              });
              
              setTimeout(() => {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                });
              }, 2000);
            },
            fail: (err) => {
              wx.showToast({
                title: '选择图片失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

  getIndexByCategory(category) {
    const categories = ['upper', 'inner', 'lower', 'suit', 'shoes', 'accessories'];
    return categories.indexOf(category);
  },

  getCategoryByIndex(index) {
    const categories = ['upper', 'inner', 'lower', 'suit', 'shoes', 'accessories'];
    return categories[index];
  },

  handleSwiperChange(e) {
    const current = e.detail.current;
    const category = this.getCategoryByIndex(current);
    
    this.setData({ 
      swiperCurrent: current,
      activeCategory: category,
      scrollIntoViewId: `category-${category}`
    });
    
    // 恢复滚动位置
    this.restoreScrollPosition(category);
    
    // 预加载相邻品类数据
    this.preloadAdjacentCategories(current);
  },

  handleScroll(e) {
    const category = e.currentTarget.dataset.category;
    const scrollTop = e.detail.scrollTop;
    
    // 保存滚动位置
    this.setData({
      [`scrollPositions.${category}`]: scrollTop
    });
  },

  // 滚动同步效果
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    // 这里可以添加滚动同步的逻辑
    // 例如：当页面滚动时，调整导航栏的位置或透明度
  },

  restoreScrollPosition(category) {
    const { scrollPositions } = this.data;
    const scrollTop = scrollPositions[category] || 0;
    
    // 延迟执行，确保scroll-view已经渲染
    setTimeout(() => {
      const scrollView = wx.createSelectorQuery().select(`.waterfall-scroll[data-category="${category}"]`);
      scrollView.scrollOffset({ scrollTop, animated: false }).exec();
    }, 100);
  },

  preloadAdjacentCategories(currentIndex) {
    const categories = ['headwear', 'upper', 'inner', 'lower', 'shoes', 'accessories'];
    const adjacentIndices = [currentIndex - 1, currentIndex + 1];
    
    adjacentIndices.forEach(index => {
      if (index >= 0 && index < categories.length) {
        const category = categories[index];
        // 这里可以添加实际的预加载逻辑
        console.log(`预加载 ${category} 数据`);
      }
    });
  },

  calculateSwiperHeight() {
    // 获取屏幕高度，计算swiper高度
    wx.getSystemInfo({ 
      success: (res) => {
        const screenHeight = res.screenHeight;
        const windowHeight = res.windowHeight;
        
        // 计算可用高度（减去上传区域和导航栏）
        const uploadAreaHeight = this.data.uploadAreaHeight || 400;
        const swiperHeight = windowHeight - (uploadAreaHeight * 2) - 200; // 估算值
        
        this.setData({ 
          swiperHeight: Math.max(swiperHeight, 500) // 最小高度500
        });
      }
    });
  },

  chooseUserImage() {
    const hasSeenGuide = wx.getStorageSync('hasSeenTryonGuide');
    if (!hasSeenGuide) {
      this.setData({ showGuideOverlay: true });
    } else {
      this.openImagePicker();
    }
  },

  openImagePicker() {
    wx.chooseMedia({
      count:1,
      mediaType: ['image'],
      sizeType: ['compressed'],
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
              const { width, height } = imageInfo;
              const aspectRatio = width / height;
              
              const screenWidth = 750;
              const containerWidth = screenWidth - 40;
              const calculatedHeight = containerWidth / aspectRatio;
              
              let finalHeight = calculatedHeight;
              const minHeight = 400;
              const maxHeight = 800;
              
              if (aspectRatio < 1) {
                if (calculatedHeight > maxHeight) {
                  finalHeight = maxHeight;
                } else if (calculatedHeight < minHeight) {
                  finalHeight = minHeight;
                }
              } else {
                if (calculatedHeight < minHeight) {
                  finalHeight = minHeight;
                } else if (calculatedHeight > maxHeight) {
                  finalHeight = maxHeight;
                }
              }
              
              this.setData({ 
                userImage: tempFile.tempFilePath,
                uploadAreaHeight: Math.round(finalHeight)
              });
            },
            fail: (error) => {
              console.error('获取图片信息失败:', error);
              this.setData({ userImage: tempFile.tempFilePath });
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

  async generateTryon() {
    if (!this.data.userImage || !this.data.selectedCloth) {
      wx.showToast({ title: '请上传照片并选择服装', icon: 'none' });
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
      
      let generateResult;
      try {
        generateResult = await wx.cloud.callFunction({
          name: 'generateImage-wndKh7',
          data: {
            userImage: uploadResult.fileID,
            clothId: this.data.selectedCloth._id,
            settings: this.data.tryonSettings,
            generateSettings: this.data.generateSettings
          }
        });
      } catch (cloudError) {
        wx.hideLoading();
        console.error('云函数调用失败:', cloudError);
        
        const errMsg = cloudError.errMsg || '';
        if (errMsg.includes('network') || errMsg.includes('网络')) {
          this.showErrorModal('网络连接失败', '请检查网络连接后重试');
        } else if (errMsg.includes('timeout') || errMsg.includes('超时')) {
          this.showErrorModal('请求超时', '服务器响应时间过长，请稍后重试');
        } else if (errMsg.includes('quota') || errMsg.includes('配额')) {
          this.showErrorModal('云函数调用次数超限', '请稍后重试或升级套餐');
        } else {
          this.showErrorModal('生成失败', cloudError.message || '服务器处理失败，请稍后重试');
        }
        return;
      }

      if (generateResult.result && generateResult.result.success) {
        this.setData({ generatedImage: generateResult.result.imageUrl });
        wx.hideLoading();
        wx.showToast({ title: '生成成功', icon: 'success' });
      } else {
        wx.hideLoading();
        const errorMsg = generateResult.result?.error || '生成失败';
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

  handleError() {
    this.setData({ error: null });
  }
});