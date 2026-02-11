Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: '',
      openid: '',
      height: '',
      weight: ''
    },
    appVersion: '1.0.0',
    loading: false,
    showBodyInfoEditor: false,
    defaultAvatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAvatarUrl();
    this.loadPageData();
  },

  /**
   * 获取头像临时链接
   */
  async getAvatarUrl() {
    try {
      const defaultAvatarFileID = 'cloud://fittingroom-0g0zcm3w1d2f40c5.6669-fittingroom-0g0zcm3w1d2f40c5-1400377926/system-images/default-avatar.jpg';
      const res = await wx.cloud.getTempFileURL({
        fileList: [defaultAvatarFileID]
      });
      if (res.fileList.length > 0 && res.fileList[0].tempFileURL) {
        this.setData({
          defaultAvatarUrl: res.fileList[0].tempFileURL
        });
      }
    } catch (error) {
      console.error('获取默认头像链接失败:', error);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPageData();
    this.updateTabBar();
  },

  updateTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 2,
        isTryonPage: false
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadPageData(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载页面数据
   */
  async loadPageData(callback) {
    try {
      this.setData({ loading: true });
      await this.loadUserInfo();
    } catch (error) {
      console.error('加载页面数据失败:', error);
    } finally {
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 加载用户基本信息
        const userRes = await wx.cloud.database().collection('users')
          .where({ openid })
          .get();
        
        let userData = {};
        if (userRes.data.length > 0) {
          userData = userRes.data[0];
        }

        // 加载身体信息
        let height = '';
        let weight = '';
        try {
          const bodyRes = await wx.cloud.database().collection('body_profile')
            .where({ openid })
            .get();
          
          if (bodyRes.data.length > 0) {
            height = bodyRes.data[0].height || '';
            weight = bodyRes.data[0].weight || '';
          }
        } catch (bodyError) {
          console.error('加载身体信息失败:', bodyError);
        }

        this.setData({
          userInfo: {
            nickName: userData.nickName || 'Elena Vance',
            handle: userData.handle || 'elena_fitting_ai',
            avatarUrl: (userData.avatarUrl && userData.avatarUrl.indexOf('/assets/images/') === -1) ? userData.avatarUrl : '',
            openid,
            height,
            weight
          }
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  /**
   * 页面跳转 - 试衣记录
   */
  navigateToHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  /**
   * 页面跳转 - 我的衣柜
   */
  navigateToWardrobe() {
    wx.navigateTo({ url: '/pages/wardrobe/wardrobe' });
  },

  /**
   * 页面跳转 - 体貌特征
   */
  navigateToBodyProfile() {
    wx.navigateTo({ url: '/pages/body-profile/body-profile' });
  },

  /**
   * 页面跳转 - 设置
   */
  navigateToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  /**
   * 页面跳转 - 关于我们
   */
  navigateToAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  /**
   * 页面跳转 - 反馈建议
   */
  navigateToFeedback() {
    wx.showToast({ title: '反馈功能开发中', icon: 'none' });
  },

  /**
   * 显示头像编辑
   */
  showEditAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        // 这里可以添加上传图片的逻辑
        console.log('选择的头像:', tempFilePaths)
        // 模拟更新头像
        this.setData({
          'userInfo.avatarUrl': tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 显示身高编辑
   */
  showEditHeight() {
    this.setData({
      showBodyInfoEditor: true
    })
  },

  /**
   * 显示体重编辑
   */
  showEditWeight() {
    this.setData({
      showBodyInfoEditor: true
    })
  },

  /**
   * 退出登录
   */
  async logout() {
    try {
      await wx.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储
            wx.removeStorageSync('openid');
            wx.removeStorageSync('sessionKey');
            
            // 重新登录
            wx.reLaunch({ url: '/pages/index/index' });
          }
        }
      });
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  },

  /**
   * 显示身高体重编辑弹窗
   */
  showEditBodyInfo() {
    this.setData({
      showBodyInfoEditor: true
    });
  },

  /**
   * 处理身高体重编辑确认
   */
  async handleBodyInfoConfirm(e) {
    const { height, weight } = e.detail;
    await this.saveBodyInfo(height, weight);
    this.setData({
      showBodyInfoEditor: false
    });
  },

  /**
   * 处理身高体重编辑取消
   */
  handleBodyInfoCancel() {
    this.setData({
      showBodyInfoEditor: false
    });
  },

  /**
   * 保存身高体重信息
   */
  async saveBodyInfo(heightStr, weightStr) {
    try {
      if (!heightStr || !weightStr) {
        wx.showToast({
          title: '请输入身高和体重',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      const height = parseInt(heightStr);
      const weight = parseFloat(weightStr);

      if (!this.validateBodyInfo(height, weight)) {
        return;
      }

      const openid = wx.getStorageSync('openid');
      if (!openid) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      wx.showLoading({ title: '保存中...' });

      const db = wx.cloud.database();
      const bodyProfileCollection = db.collection('body_profile');
      
      const profileRes = await bodyProfileCollection.where({ openid }).get();
      
      if (profileRes.data.length > 0) {
        await bodyProfileCollection.doc(profileRes.data[0]._id).update({
          data: {
            height,
            weight,
            updateTime: db.serverDate()
          }
        });
      } else {
        await bodyProfileCollection.add({
          data: {
            openid,
            height,
            weight,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }

      this.setData({
        'userInfo.height': height,
        'userInfo.weight': weight
      });

      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });

    } catch (error) {
      console.error('保存身高体重失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 验证身高体重数据
   */
  validateBodyInfo(height, weight) {
    if (isNaN(height) || isNaN(weight)) {
      wx.showToast({
        title: '请输入有效的数字',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (height < 100 || height > 250) {
      wx.showToast({
        title: '身高应在100-250cm之间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (weight < 30 || weight > 200) {
      wx.showToast({
        title: '体重应在30-200kg之间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    return true;
  }
})