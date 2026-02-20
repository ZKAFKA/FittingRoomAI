// 导入语言管理工具
const i18n = require('../../utils/i18n');

Page({
  data: {
    clothes: [],
    filteredClothes: [],
    categories: [
      { id: 'all', name: '全部' },
      { id: 'upper', name: '上装' },
      { id: 'lower', name: '下装' },
      { id: 'suit', name: '套装' },
      { id: 'shoes', name: '鞋帽' },
      { id: 'accessories', name: '饰品' }
    ],
    selectedCategory: 'all',
    loading: true,
    error: null,
    page: 1,
    pageSize: 10,
    hasMore: true,
    scrollIntoViewId: '',
    isDropdownOpen: false,
    selectedCategoryText: '全部',
    // 搜索相关状态
    showSearch: false,
    searchKeyword: '',
    // 弹窗相关状态
    showAddClothModal: false,
    newClothImage: '',
    newClothCategory: '',
    newClothTags: '',
    tagList: [],
    aiProcessing: false,
    aiProcessed: false,
    previewAreaStyle: '',
    // 语言相关状态
    i18n: i18n,
    langData: i18n.getLangData()
  },

  onLoad(options) {
    // 初始化语言管理
    this.initLanguage();
    
    // 加载衣物数据
    this.loadClothes();
    
    // 接收来自其他页面的参数
    if (options && options.showAddModal) {
      // 延迟一下，确保页面加载完成
      setTimeout(() => {
        this.setData({
          showAddClothModal: true,
          newClothImage: '',
          newClothCategory: options.defaultCategory || '',
          newClothTags: '',
          tagList: [],
          aiProcessing: false,
          aiProcessed: false,
          previewAreaStyle: ''
        });
      }, 100);
    }
    
    // 获取eventChannel，用于与其他页面通信
    this.eventChannel = this.getOpenerEventChannel();
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

  onShow() {
    this.loadClothes();
  },



  async loadClothes(refresh = false) {
    try {
      if (refresh) {
        this.setData({ page: 1, hasMore: true });
      }
      
      if (!this.data.hasMore && !refresh) return;
      
      this.setData({ loading: true, error: null });
      
      // 添加模拟数据（包含标签信息）
      const mockClothes = [
        { _id: 'mock-1', name: '白色T恤', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['白色', '纯棉', '休闲', '夏季'] },
        { _id: 'mock-2', name: '蓝色牛仔裤', category: 'lower', categoryName: '下装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['蓝色', '牛仔', '直筒', '百搭'] },
        { _id: 'mock-3', name: '黑色外套', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['黑色', '防风', '春秋', '通勤'] },
        { _id: 'mock-4', name: '红色裙子', category: 'lower', categoryName: '下装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['红色', '修身', '夏季', '约会'] },
        { _id: 'mock-5', name: '商务套装', category: 'suit', categoryName: '套装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['黑色', '商务', '正式', '职业'] },
        { _id: 'mock-6', name: '运动鞋', category: 'shoes', categoryName: '鞋帽', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['白色', '舒适', '运动', '休闲'] },
        { _id: 'mock-7', name: '项链', category: 'accessories', categoryName: '饰品', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['金色', '简约', '百搭', '饰品'] },
        { _id: 'mock-8', name: '夹克', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['棕色', '皮夹克', '春秋', '时尚'] }
      ];
      
      let newClothes = mockClothes;
      
      if (refresh) {
        this.setData({ clothes: newClothes });
      } else {
        this.setData({ clothes: [...this.data.clothes, ...newClothes] });
      }
      
      this.setData({ 
        hasMore: false, // 模拟数据不需要分页
        page: 2
      });
      
      this.filterClothes();
    } catch (error) {
      console.error('加载服装失败:', error);
      this.setData({ 
        loading: false, 
        error: '加载失败，请稍后重试' 
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  filterClothes() {
    let filtered = [...this.data.clothes];
    
    // 分类筛选
    if (this.data.selectedCategory !== 'all') {
      filtered = filtered.filter(cloth => cloth.category === this.data.selectedCategory);
    }
    
    // 标签搜索筛选
    const searchKeyword = this.data.searchKeyword.trim().toLowerCase();
    if (searchKeyword) {
      filtered = filtered.filter(cloth => {
        // 检查标签是否匹配
        if (cloth.tags && Array.isArray(cloth.tags)) {
          return cloth.tags.some(tag => 
            tag.toLowerCase().includes(searchKeyword)
          );
        }
        // 检查衣物名称是否匹配
        if (cloth.name) {
          return cloth.name.toLowerCase().includes(searchKeyword);
        }
        // 检查分类名称是否匹配
        if (cloth.categoryName) {
          return cloth.categoryName.toLowerCase().includes(searchKeyword);
        }
        return false;
      });
    }
    
    this.setData({ filteredClothes: filtered });
  },

  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    
    this.setData({
      selectedCategory: categoryId,
      selectedCategoryText: this.getCategoryName(categoryId),
      isDropdownOpen: false
    });
    
    this.filterClothes();
  },

  navigateToClothDetail(e) {
    const clothId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/wardrobe-detail/wardrobe-detail?id=${clothId}`
    });
  },

  navigateToUploadCloth() {
    wx.navigateTo({
      url: '/pages/upload-cloth/upload-cloth'
    });
  },

  toggleDropdown() {
    this.setData({
      isDropdownOpen: !this.data.isDropdownOpen
    });
  },

  closeDropdown() {
    this.setData({
      isDropdownOpen: false
    });
  },

  getCategoryName(categoryId) {
    const category = this.data.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '全部';
  },

  async deleteCloth(e) {
    const clothId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这件服装吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await wx.cloud.database().collection('wardrobe')
              .doc(clothId)
              .update({
                data: { status: 'deleted' }
              });
            
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadClothes(true);
          } catch (error) {
            console.error('删除服装失败:', error);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadClothes();
    }
  },



  refreshPage() {
    this.setData({
      selectedCategory: 'all',
      page: 1,
      hasMore: true
    });
    this.loadClothes(true);
  },

  handleError() {
    this.setData({ error: null });
    this.loadClothes(true);
  },

  /**
   * 切换搜索栏显示状态
   */
  toggleSearch() {
    this.setData({
      showSearch: !this.data.showSearch
    });
  },

  /**
   * 搜索输入处理
   */
  onSearchInput(e) {
    const searchKeyword = e.detail.value;
    this.setData({ searchKeyword });
    // 实时搜索
    this.filterClothes();
  },

  /**
   * 执行搜索
   */
  doSearch() {
    // 执行搜索逻辑
    this.filterClothes();
    // 可以选择是否关闭搜索栏
    // this.setData({ showSearch: false });
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' });
    // 清除后重新筛选
    this.filterClothes();
  },

  // 弹窗相关事件
  showAddModal() {
    this.setData({
      showAddClothModal: true,
      newClothImage: '',
      newClothCategory: '',
      newClothTags: '',
      tagList: [],
      aiProcessing: false,
      aiProcessed: false,
      previewAreaStyle: ''
    });
  },

  hideAddModal() {
    this.setData({ showAddClothModal: false });
  },

  preventMove() {
    // 阻止遮罩层滚动
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 获取图片信息
        wx.getImageInfo({
          src: tempFilePath,
          success: (imageInfo) => {
            // 获取屏幕尺寸
            const { windowWidth } = wx.getSystemInfoSync();
            
            // 计算弹窗宽度（假设弹窗宽度为屏幕宽度的90%）
            const modalWidth = windowWidth * 0.9;
            // 计算最大图片宽度（弹窗宽度 - 10rpx）
            const maxImageWidth = modalWidth - (10 * (windowWidth / 750)); // 转换为px
            // 计算最大图片高度（限制为400rpx转换为px）
            const maxImageHeight = 400 * (windowWidth / 750);
            
            // 获取图片原始尺寸
            const { width, height } = imageInfo;
            
            // 计算图片显示尺寸
            let displayWidth = width;
            let displayHeight = height;
            
            // 确保图片宽度不超过最大宽度
            if (width > maxImageWidth) {
              const ratio = maxImageWidth / width;
              displayWidth = maxImageWidth;
              displayHeight = height * ratio;
            }
            
            // 确保图片高度不超过最大高度
            if (displayHeight > maxImageHeight) {
              const ratio = maxImageHeight / displayHeight;
              displayHeight = maxImageHeight;
              displayWidth = displayWidth * ratio;
            }
            
            // 计算 previewArea 样式
            const previewAreaStyle = `width: ${displayWidth}px; height: ${displayHeight}px;`;
            
            this.setData({
              newClothImage: tempFilePath,
              aiProcessed: false,
              previewAreaStyle: previewAreaStyle
            });
          },
          fail: (error) => {
            console.error('获取图片信息失败:', error);
            // 如果获取图片信息失败，使用默认设置
            this.setData({
              newClothImage: tempFilePath,
              aiProcessed: false,
              previewAreaStyle: 'width: 100%; max-height: 400rpx;'
            });
          }
        });
      }
    });
  },

  // 选择衣物类型
  selectNewCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ newClothCategory: category });
  },

  // 标签输入
  onTagInput(e) {
    const tags = e.detail.value;
    this.setData({ newClothTags: tags });
    // 生成标签列表
    const tagList = tags.split(' ').filter(tag => tag.trim() !== '');
    this.setData({ tagList });
  },

  // 确认上传
  async confirmAddCloth() {
    // 验证衣物类型是否选择
    if (!this.data.newClothCategory) {
      wx.showToast({
        title: '请选择衣物类型',
        icon: 'none'
      });
      return;
    }

    // 验证是否上传了图片
    if (!this.data.newClothImage) {
      wx.showToast({
        title: '请上传衣物图片',
        icon: 'none'
      });
      return;
    }

    // 开始 AI 处理
    this.setData({ aiProcessing: true });

    try {
      // 1. 图片处理阶段：调用 removeBackground 云函数获取原始图片并进行背景移除处理
      const backgroundRemovalResult = await this.removeBackgroundFromImage();
      if (!backgroundRemovalResult.success) {
        throw new Error(backgroundRemovalResult.error || '背景移除失败');
      }

      // 2. 结果回显阶段：更新 UI 显示生成的图片
      this.setData({
        newClothImage: backgroundRemovalResult.imageUrl,
        aiProcessing: false,
        aiProcessed: true
      });

      wx.showToast({
        title: '处理完成',
        icon: 'success'
      });
    } catch (error) {
      console.error('AI 处理失败:', error);
      this.setData({ aiProcessing: false });
      wx.showToast({
        title: '处理失败，请重试',
        icon: 'none'
      });
    }
  },

  // 加入衣橱
  async addToWardrobe() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    try {
      // 上传图片到云存储
      const timestamp = Date.now();
      const cloudPath = `wardrobe/${openid}/${timestamp}.png`;
      
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.newClothImage
      });

      // 保存到数据库
      const clothData = {
        openid,
        category: this.data.newClothCategory,
        imageUrl: uploadResult.fileID,
        tags: this.data.tagList,
        createTime: new Date(),
        status: 'active'
      };

      await wx.cloud.database().collection('wardrobe').add({
        data: clothData
      });

      // 关闭弹窗
      this.hideAddModal();

      // 刷新衣橱数据
      this.loadClothes(true);

      // 通知其他页面刷新数据
      if (this.eventChannel) {
        this.eventChannel.emit('clothAdded', {
          success: true,
          cloth: clothData
        });
      }

      wx.showToast({
        title: '加入衣橱成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('加入衣橱失败:', error);
      wx.showToast({
        title: '加入失败，请重试',
        icon: 'none'
      });
      
      // 通知其他页面上传失败
      if (this.eventChannel) {
        this.eventChannel.emit('clothAdded', {
          success: false,
          error: error.message
        });
      }
    }
  },

  // 辅助函数：移除图片背景
  async removeBackgroundFromImage() {
    try {
      console.log('开始移除背景，图片URL:', this.data.newClothImage);
      console.log('衣物类型:', this.data.newClothCategory);
      
      // 调用 removeBackground 云函数
      const result = await wx.cloud.callFunction({
        name: 'removeBackground',
        data: {
          imageUrl: this.data.newClothImage,
          category: this.data.newClothCategory
        }
      });

      console.log('背景移除云函数返回结果:', result);

      if (result.result && result.result.success) {
        return {
          success: true,
          imageUrl: result.result.imageUrl
        };
      } else {
        console.error('背景移除失败，返回结果:', result.result);
        return {
          success: false,
          error: result.result?.error || '背景移除失败'
        };
      }
    } catch (error) {
      console.error('背景移除失败:', error);
      console.error('错误详情:', error.stack);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 辅助函数：构造衣物处理的 prompt
  constructClothPrompt() {
    // 衣物类型映射
    const categoryMap = {
      upper: {
        name: 'top clothing',
        description: 'shirt, blouse, sweater, jacket, coat, hoodie, etc.'
      },
      inner: {
        name: 'inner wear',
        description: 'undershirt, tank top, lingerie, etc.'
      },
      lower: {
        name: 'bottom clothing',
        description: 'pants, jeans, skirt, shorts, leggings, etc.'
      },
      suit: {
        name: 'suit',
        description: 'formal suit, business suit, etc.'
      },
      shoes: {
        name: 'shoes',
        description: 'sneakers, boots, sandals, heels, flats, etc.'
      },
      accessories: {
        name: 'accessories',
        description: 'hat, scarf, gloves, bag, belt, sunglasses, etc.'
      }
    };

    const categoryInfo = categoryMap[this.data.newClothCategory] || {
      name: 'clothing',
      description: 'clothing item'
    };

    // 预设模板
    const promptTemplate = `Remove background from this {{categoryName}} and make it white background. Focus only on the {{categoryName}} item. Create a clean, professional product image of the {{categoryName}}. The image should show the {{categoryName}} clearly with proper lighting and shadows.`;

    // 替换模板变量
    let prompt = promptTemplate
      .replace(/{{categoryName}}/g, categoryInfo.name)
      .replace(/{{categoryDescription}}/g, categoryInfo.description);

    // 添加标签信息（如果有）
    if (this.data.tagList.length > 0) {
      const tags = this.data.tagList.join(', ');
      prompt += ` Clothing tags: ${tags}.`;
    }

    return prompt;
  },


});