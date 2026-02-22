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
    // 生图任务相关
    clothTag: '',
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
          previewAreaStyle: '',
          clothTag: ''
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
      
      // 从数据库加载真实数据
      const openid = wx.getStorageSync('openid');
      let clothesData = [];
      
      if (openid) {
        try {
          const wardrobeRes = await wx.cloud.database().collection('wardrobe')
            .where({
              openid,
              status: 'active'
            })
            .orderBy('createTime', 'desc')
            .get();
          
          clothesData = wardrobeRes.data.map(item => ({
            _id: item._id,
            name: item.name || '未命名',
            category: item.category,
            categoryName: this.getCategoryName(item.category),
            imageUrl: item.imageUrl,
            status: item.status,
            createTime: item.createTime,
            tags: item.tags || []
          }));
        } catch (dbError) {
          console.error('从数据库加载衣物失败:', dbError);
        }
      }
      
      // 如果没有数据，使用模拟数据
      if (clothesData.length === 0) {
        clothesData = [
          { _id: 'mock-1', name: '白色T恤', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['白色', '纯棉', '休闲', '夏季'] },
          { _id: 'mock-2', name: '蓝色牛仔裤', category: 'lower', categoryName: '下装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['蓝色', '牛仔', '直筒', '百搭'] },
          { _id: 'mock-3', name: '黑色外套', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['黑色', '防风', '春秋', '通勤'] },
          { _id: 'mock-4', name: '红色裙子', category: 'lower', categoryName: '下装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['红色', '修身', '夏季', '约会'] },
          { _id: 'mock-5', name: '商务套装', category: 'suit', categoryName: '套装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['黑色', '商务', '正式', '职业'] },
          { _id: 'mock-6', name: '运动鞋', category: 'shoes', categoryName: '鞋帽', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['白色', '舒适', '运动', '休闲'] },
          { _id: 'mock-7', name: '项链', category: 'accessories', categoryName: '饰品', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['金色', '简约', '百搭', '饰品'] },
          { _id: 'mock-8', name: '夹克', category: 'upper', categoryName: '上装', imageUrl: '/test/unnamed.png', status: 'active', createTime: new Date(), tags: ['棕色', '皮夹克', '春秋', '时尚'] }
        ];
      }
      
      if (refresh) {
        this.setData({ clothes: clothesData });
      } else {
        this.setData({ clothes: [...this.data.clothes, ...clothesData] });
      }
      
      this.setData({ 
        hasMore: false,
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
    const categoryMap = {
      'all': '全部',
      'upper': '上装',
      'lower': '下装',
      'suit': '套装',
      'shoes': '鞋帽',
      'accessories': '饰品'
    };
    return categoryMap[categoryId] || '全部';
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
      previewAreaStyle: '',
      clothTag: ''
    });
  },

  hideAddModal() {
    this.setData({ 
      showAddClothModal: false,
      clothTag: ''
    });
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
              previewAreaStyle: previewAreaStyle,
              clothTag: ''
            });
          },
          fail: (error) => {
            console.error('获取图片信息失败:', error);
            // 如果获取图片信息失败，使用默认设置
            this.setData({
              newClothImage: tempFilePath,
              aiProcessed: false,
              previewAreaStyle: 'width: 100%; max-height: 400rpx;',
              clothTag: ''
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
    
    // 自动生成衣物标签
    this.generateClothTag(category);
  },

  /**
   * 生成衣物标签
   * @param {string} category - 衣物分类
   */
  async generateClothTag(category) {
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) return;
      
      // 查询该分类下已有衣物数量
      const countRes = await wx.cloud.database().collection('wardrobe')
        .where({
          openid,
          category,
          status: 'active'
        })
        .count();
      
      const count = countRes.total || 0;
      const categoryMap = {
        'upper': '上装',
        'lower': '下装',
        'suit': '套装',
        'shoes': '鞋帽',
        'accessories': '饰品'
      };
      
      const categoryName = categoryMap[category] || '衣物';
      const clothTag = `${categoryName}${count + 1}`;
      
      this.setData({
        clothTag: clothTag,
        newClothTags: clothTag
      });
    } catch (error) {
      console.error('生成衣物标签失败:', error);
    }
  },

  // 标签输入
  onTagInput(e) {
    const tags = e.detail.value;
    this.setData({ newClothTags: tags });
    // 生成标签列表
    const tagList = tags.split(/[\s,，]+/).filter(tag => tag.trim() !== '');
    this.setData({ tagList });
  },

  /**
   * 构建混元生图Prompt
   * @param {string} category - 衣物分类
   * @returns {string} 优化后的prompt
   */
  buildHunyuanPrompt(category) {
    const categoryMap = {
      'upper': { name: '上装', en: 'top clothing' },
      'lower': { name: '下装', en: 'bottom clothing' },
      'suit': { name: '套装', en: 'suit' },
      'shoes': { name: '鞋帽', en: 'shoes or hat' },
      'accessories': { name: '饰品', en: 'accessory' }
    };
    
    const categoryInfo = categoryMap[category] || { name: '衣物', en: 'clothing' };
    
    // 构建专业prompt，确保生成3:4比例、白色背景、摊开展示的衣物图片
    const prompt = `Professional clothing product photography of ${categoryInfo.en}. 

Requirements:
1. Remove all background and replace with pure white background (#FFFFFF)
2. Display the ${categoryInfo.en} in a fully spread out, flat lay style
3. Show the garment laid flat from a top-down perspective
4. Ensure the clothing item is centered and occupies 80-90% of the frame
5. Maintain natural fabric texture, folds, and details
6. Use soft, even lighting without harsh shadows
7. Aspect ratio: 3:4 (portrait orientation)
8. High resolution, professional e-commerce quality
9. No models, mannequins, or additional props
10. Clean edges, no background artifacts

Style: Clean, minimal, professional product photography suitable for e-commerce catalog.`;

    return prompt;
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
      // 构建prompt
      const prompt = this.buildHunyuanPrompt(this.data.newClothCategory);

      console.log('调用 generateImage-qyBGo1 云函数');
      console.log('Prompt:', prompt);

      // 调用腾讯官方混元生图云函数
      // 使用官方标准格式，只传递 prompt 参数
      const result = await wx.cloud.callFunction({
        name: 'generateImage-qyBGo1',
        data: {
          prompt: prompt
        }
      });

      console.log('generateImage-qyBGo1 返回结果:', result);

      const resData = result.result;

      // 检查是否成功
      if (!resData.success) {
        const errorMsg = resData.message || resData.code || '图片生成失败';
        throw new Error(errorMsg);
      }

      // 检查是否有图片URL
      if (!resData.imageUrl) {
        throw new Error('生成的图片URL为空');
      }

      // 处理成功，更新UI
      this.setData({
        newClothImage: resData.imageUrl,
        aiProcessing: false,
        aiProcessed: true
      });

      wx.showToast({
        title: '处理完成',
        icon: 'success'
      });

    } catch (error) {
      console.error('AI 处理失败:', error);
      console.error('错误详情:', JSON.stringify(error));
      this.setData({ aiProcessing: false });
      
      // 详细的错误提示
      let errorMsg = '处理失败，请重试';
      
      // 处理不同类型的错误
      if (error.message) {
        errorMsg = error.message;
        
        // 403 错误 - 权限问题
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMsg = '服务权限错误(403)，请检查：1.云函数是否已部署 2.混元生图服务是否已开通 3.额度是否充足';
        }
        // 云函数未找到
        else if (error.message.includes('not found')) {
          errorMsg = '云函数未部署，请在微信开发者工具中右键云函数并选择"创建并部署：云端安装依赖"';
        }
        // 网络错误
        else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMsg = '网络连接失败，请检查网络后重试';
        }
      }
      
      wx.showModal({
        title: '生成失败',
        content: errorMsg,
        showCancel: false,
        confirmText: '确定'
      });
    }
  },

  // 保存到衣橱
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
      wx.showLoading({ title: '保存中...' });
      
      // 调用 saveClothImage 云函数保存衣物
      const saveResult = await wx.cloud.callFunction({
        name: 'saveClothImage',
        data: {
          imageUrl: this.data.newClothImage,
          category: this.data.newClothCategory,
          tags: this.data.tagList,
          clothTag: this.data.clothTag
        }
      });
      
      console.log('保存衣物结果:', saveResult);

      if (!saveResult.result || !saveResult.result.success) {
        throw new Error(saveResult.result?.error || '保存失败');
      }

      // 关闭弹窗
      this.hideAddModal();

      // 刷新衣橱数据
      this.loadClothes(true);

      // 通知其他页面刷新数据
      if (this.eventChannel) {
        this.eventChannel.emit('clothAdded', {
          success: true,
          cloth: saveResult.result
        });
      }

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  // 重新上传
  reuploadImage() {
    this.setData({
      newClothImage: '',
      aiProcessed: false,
      previewAreaStyle: '',
      clothTag: '',
      newClothTags: '',
      tagList: []
    });
  },
});
