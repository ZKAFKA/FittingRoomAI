Component({
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
    },
    gender: {
      type: String,
      value: ''
    }
  },

  data: {
    localHeight: '',
    localWeight: '',
    localGender: ''
  },

  methods: {
    handleHeightInput(e) {
      this.setData({ localHeight: e.detail.value });
    },

    handleWeightInput(e) {
      this.setData({ localWeight: e.detail.value });
    },

    selectGender(e) {
      this.setData({ localGender: e.currentTarget.dataset.gender });
    },

    handleCancel() {
      this.triggerEvent('cancel');
    },

    handleConfirm() {
      const { localHeight, localWeight, localGender } = this.data;
      this.triggerEvent('confirm', {
        height: localHeight,
        weight: localWeight,
        gender: localGender
      });
    },

    handleBackdropTap() {
      this.triggerEvent('cancel');
    },

    preventMove() {
      // 阻止背景滚动
    }
  },

  observers: {
    'height'(val) {
      this.setData({ localHeight: val || '' });
    },
    'weight'(val) {
      this.setData({ localWeight: val || '' });
    },
    'gender'(val) {
      this.setData({ localGender: val || '' });
    }
  }
});
