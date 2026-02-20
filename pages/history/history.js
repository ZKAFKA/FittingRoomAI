const i18n = require('../../utils/i18n');

Page({
  data: {
    // 试衣记录数据
    fittingHistory: {
      thisWeek: [],
      lastMonth: []
    },
    // 页面状态
    hasMore: true,
    page: 1,
    pageSize: 10,
    // 搜索相关
    showSearch: true,
    searchKeyword: '',
    // 筛选相关
    showFilterModal: false,
    // 筛选选项
    filterOptions: {
      dateRange: 'all',
      favorite: false,
      startDate: null,
      endDate: null
    },
    // 原始数据
    allRecords: [],
    // 语言相关状态
    i18n: i18n,
    langData: i18n.getLangData()
  },

  onLoad() {
    // 初始化语言管理
    this.initLanguage();
    
    // 页面加载时初始化数据
    this.loadFittingHistory();
    // 测试导航
    console.log('Page loaded, testing navigation function');
  },

  onShow() {
    // 页面显示时更新数据
    this.updateTabBar();
  },

  /**
   * 更新底部导航栏
   */
  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 2, // Activity tab index
        isHistoryPage: true
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
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  /**
   * 执行搜索
   */
  doSearch() {
    // 这里可以添加搜索逻辑
    console.log('Search keyword:', this.data.searchKeyword);
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' });
  },

  /**
   * 切换筛选弹窗显示/隐藏
   */
  toggleFilterModal() {
    this.setData({
      showFilterModal: !this.data.showFilterModal
    });
  },

  /**
   * 隐藏筛选弹窗
   */
  hideFilterModal() {
    this.setData({
      showFilterModal: false
    });
  },

  /**
   * 选择日期范围
   */
  selectDateRange(e) {
    const dateRange = e.currentTarget.dataset.range;
    this.setData({
      filterOptions: {
        ...this.data.filterOptions,
        dateRange
      }
    });
  },

  /**
   * 确认筛选
   */
  async confirmFilter() {
    // 关闭弹窗
    this.setData({
      showFilterModal: false
    });
    
    // 重新加载数据
    await this.loadFittingHistory(true);
  },

  /**
   * 阻止弹窗背景滚动
   */
  preventMove() {
    // 阻止遮罩层滚动
  },

  /**
   * 加载试衣记录数据
   */
  async loadFittingHistory(reset = false) {
    if (reset) {
      this.setData({ 
        page: 1, 
        hasMore: true, 
        allRecords: [] 
      });
    }
    
    try {
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      
      // 构建查询
      const db = wx.cloud.database();
      let query = db.collection('tryon_records').where({ openid });
      
      // 添加筛选条件
      const { filterOptions } = this.data;
      
      // 收藏状态筛选
      if (filterOptions.favorite) {
        query = query.where({ is_favorite: true });
      }
      
      // 时间范围筛选
      if (filterOptions.dateRange !== 'all') {
        const now = new Date();
        let startDate;
        
        let endDate;
        
        switch (filterOptions.dateRange) {
          case 'today':
            // 今天：00:00:00 到 23:59:59
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
          case 'yesterday':
            // 昨天：00:00:00 到 23:59:59
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            break;
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '180days':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case 'custom':
            if (filterOptions.startDate) {
              startDate = new Date(filterOptions.startDate);
            }
            if (filterOptions.endDate) {
              endDate = new Date(filterOptions.endDate);
              endDate.setHours(23, 59, 59, 999);
            }
            break;
        }
        
        if (startDate) {
          query = query.where({ 
            tryon_time: db.command.gte(startDate) 
          });
        }
        
        if (endDate) {
          query = query.where({ 
            tryon_time: db.command.lte(endDate) 
          });
        }
      }
      
      // 添加分页和排序
      const { page, pageSize } = this.data;
      const result = await query
        .orderBy('tryon_time', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      
      if (result.data.length > 0) {
        // 合并数据
        const newRecords = [...this.data.allRecords, ...result.data];
        this.setData({ allRecords: newRecords });
        
        // 处理数据，按周和月分类
        const fittingHistory = this.processFittingHistory(newRecords);
        this.setData({ fittingHistory });
        
        // 检查是否还有更多数据
        if (result.data.length < pageSize) {
          this.setData({ hasMore: false });
        }
      } else {
        this.setData({ hasMore: false });
      }
    } catch (error) {
      console.error('加载试衣记录失败:', error);
      wx.showToast({ title: '加载失败，请重试', icon: 'none' });
    }
  },
  
  /**
   * 处理试衣历史数据，按时间分类
   */
  processFittingHistory(records) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = [];
    const lastMonth = [];
    
    records.forEach((record) => {
      const tryonDate = new Date(record.tryon_time);
      const item = {
        id: record._id,
        imageUrl: record.image_file_id,
        date: tryonDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        isFavorite: record.is_favorite || false
      };
      
      if (tryonDate >= oneWeekAgo) {
        thisWeek.push(item);
      } else if (tryonDate >= oneMonthAgo) {
        lastMonth.push(item);
      }
    });
    
    return {
      thisWeek,
      lastMonth
    };
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMoreHistory();
    }
  },

  /**
   * 加载更多试衣记录
   */
  async loadMoreHistory() {
    if (!this.data.hasMore) return;
    
    this.setData({ 
      page: this.data.page + 1 
    });
    
    await this.loadFittingHistory();
  },

  /**
   * 切换时间范围筛选
   */
  async handleDateRangeChange(e) {
    const dateRange = e.currentTarget.dataset.range;
    this.setData({ 
      filterOptions: {
        ...this.data.filterOptions,
        dateRange
      },
      // 关闭筛选下拉框
      showFilterDropdown: false
    });
    
    await this.loadFittingHistory(true);
  },

  /**
   * 切换喜欢列表
   */
  async toggleFavoriteList() {
    this.setData({ 
      filterOptions: {
        ...this.data.filterOptions,
        favorite: !this.data.filterOptions.favorite
      }
    });
    
    await this.loadFittingHistory(true);
  },

  /**
   * 选择自定义日期范围
   */
  async handleCustomDateRange(startDate, endDate) {
    this.setData({ 
      filterOptions: {
        ...this.data.filterOptions,
        dateRange: 'custom',
        startDate,
        endDate
      }
    });
    
    await this.loadFittingHistory(true);
  },

  /**
   * 显示自定义日期选择器
   */
  showCustomDatePicker() {
    wx.showDatePicker({
      start: '2020-01-01',
      end: new Date().toISOString().split('T')[0],
      success: (startRes) => {
        const startDate = startRes.date;
        
        wx.showDatePicker({
          start: startDate,
          end: new Date().toISOString().split('T')[0],
          success: async (endRes) => {
            const endDate = endRes.date;
            await this.handleCustomDateRange(startDate, endDate);
          }
        });
      }
    });
  },

  /**
   * 点击试衣卡片
   */
  handleCardTap(e) {
    const cardId = e.currentTarget.dataset.id;
    console.log('Card tapped:', cardId);
  },

  /**
   * 点击收藏按钮
   */
  async handleFavoriteTap(e) {
    const { id, section } = e.currentTarget.dataset;
    
    try {
      // 切换收藏状态
      const newFittingHistory = { ...this.data.fittingHistory };
      const cardIndex = newFittingHistory[section].findIndex(card => card.id === id);
      
      if (cardIndex !== -1) {
        const newFavoriteState = !newFittingHistory[section][cardIndex].isFavorite;
        newFittingHistory[section][cardIndex].isFavorite = newFavoriteState;
        
        // 更新本地状态
        this.setData({ fittingHistory: newFittingHistory });
        
        // 更新数据库
        const db = wx.cloud.database();
        await db.collection('tryon_records').doc(id).update({
          data: {
            is_favorite: newFavoriteState
          }
        });
        
        wx.showToast({ 
          title: newFavoriteState ? '已添加到喜欢' : '已取消喜欢', 
          icon: 'success' 
        });
      }
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      
      // 恢复原状态
      this.loadFittingHistory();
    }
  },

  /**
   * 点击浮动操作按钮
   */
  handleFabTap() {
    console.log('handleFabTap called');
    wx.switchTab({
      url: '/pages/tryon/tryon',
      success: function(res) {
        console.log('Navigate success:', res);
      },
      fail: function(err) {
        console.log('Navigate fail:', err);
      }
    });
  },

  /**
   * 预览图片
   */
  async previewImage(e) {
    const { imageUrl } = e.currentTarget.dataset;
    
    try {
      // 获取图片的临时链接
      const tempUrlResult = await wx.cloud.getTempFileURL({
        fileList: [imageUrl]
      });
      
      if (tempUrlResult.fileList && tempUrlResult.fileList.length > 0) {
        const tempUrl = tempUrlResult.fileList[0].tempFileURL;
        wx.previewImage({
          urls: [tempUrl],
          current: tempUrl
        });
      } else {
        wx.showToast({ title: '获取图片失败', icon: 'none' });
      }
    } catch (error) {
      console.error('预览图片失败:', error);
      wx.showToast({ title: '预览失败，请重试', icon: 'none' });
    }
  }
});
