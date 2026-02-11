Page({
  data: {
    clothes: [],
    filteredClothes: [],
    categories: [
      { id: 'all', name: '全部' },
      { id: 'upper', name: '上装' },
      { id: 'inner', name: '内搭' },
      { id: 'lower', name: '下装' },
      { id: 'suit', name: '套装' },
      { id: 'shoes', name: '鞋帽' },
      { id: 'accessories', name: '配饰' }
    ],
    selectedCategory: 'all',
    loading: true,
    error: null,
    page: 1,
    pageSize: 10,
    hasMore: true,
    scrollIntoViewId: '',
    isDropdownOpen: false,
    selectedCategoryText: '全部'
  },

  onLoad() {
    this.loadClothes();
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
      
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        this.setData({ loading: false, error: '请先登录' });
        return;
      }

      const query = wx.cloud.database().collection('wardrobe')
        .where({ 
          openid, 
          status: 'active' 
        })
        .orderBy('createTime', 'desc')
        .skip((this.data.page - 1) * this.data.pageSize)
        .limit(this.data.pageSize);

      const res = await query.get();
      
      let newClothes = res.data || [];
      
      if (refresh) {
        this.setData({ clothes: newClothes });
      } else {
        this.setData({ clothes: [...this.data.clothes, ...newClothes] });
      }
      
      this.setData({ 
        hasMore: newClothes.length === this.data.pageSize,
        page: refresh ? 2 : this.data.page + 1
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
    
    if (this.data.selectedCategory !== 'all') {
      filtered = filtered.filter(cloth => cloth.category === this.data.selectedCategory);
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
  }
});