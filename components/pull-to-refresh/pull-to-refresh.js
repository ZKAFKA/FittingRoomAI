Component({
  /**
   * 组件的属性列表
   */
  properties: {
    refreshing: {
      type: Boolean,
      value: false
    },
    refreshHeight: {
      type: Number,
      value: 100
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    translateY: -100,
    opacity: 0,
    refreshText: '下拉刷新'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置下拉距离
    setPullDistance(distance) {
      const refreshHeight = this.properties.refreshHeight;
      let translateY = Math.min(distance - refreshHeight, refreshHeight);
      let opacity = Math.min(translateY / refreshHeight, 1);
      
      let refreshText = '下拉刷新';
      if (distance > refreshHeight * 1.5) {
        refreshText = '释放刷新';
      }
      
      this.setData({
        translateY,
        opacity,
        refreshText
      });
    },
    
    // 重置状态
    reset() {
      this.setData({
        translateY: -this.properties.refreshHeight,
        opacity: 0,
        refreshText: '下拉刷新'
      });
    },
    
    // 设置刷新中状态
    setRefreshing(refreshing) {
      this.setData({
        refreshing
      });
    }
  }
});
