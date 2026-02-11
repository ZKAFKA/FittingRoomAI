Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    height: {
      type: String,
      value: ''
    },
    weight: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 本地状态，用于实时更新输入值
    localHeight: '',
    localWeight: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理身高输入
    handleHeightInput(e) {
      this.setData({
        localHeight: e.detail.value
      });
    },

    // 处理体重输入
    handleWeightInput(e) {
      this.setData({
        localWeight: e.detail.value
      });
    },

    // 处理取消操作
    handleCancel() {
      this.triggerEvent('cancel');
    },

    // 处理确认操作
    handleConfirm() {
      const { localHeight, localWeight } = this.data;
      this.triggerEvent('confirm', {
        height: localHeight,
        weight: localWeight
      });
    },

    // 处理背景点击
    handleBackdropTap() {
      this.triggerEvent('cancel');
    }
  },

  /**
   * 生命周期函数
   */
  observers: {
    // 监听属性变化，更新本地状态
    height(newHeight) {
      this.setData({ localHeight: newHeight });
    },
    weight(newWeight) {
      this.setData({ localWeight: newWeight });
    }
  }
});