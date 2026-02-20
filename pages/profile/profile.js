const i18n = require('../../utils/i18n');

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
      weight: '',
      gender: ''
    },
    appVersion: '1.0.0',
    loading: false,
    showBodyInfoEditor: false,
    defaultAvatarUrl: '',
    // 语言相关状态
    i18n: i18n,
    langData: i18n.getLangData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化语言管理
    this.initLanguage();
    
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
        active: 1,
        isTryonPage: false
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
        let gender = '';
        try {
          const bodyRes = await wx.cloud.database().collection('body_profile')
            .where({ openid })
            .get();
          
          if (bodyRes.data.length > 0) {
            height = bodyRes.data[0].height || '';
            weight = bodyRes.data[0].weight || '';
            gender = bodyRes.data[0].gender || '';
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
            weight,
            gender
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
  async navigateToHistory() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/history/history' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 页面跳转 - 我的衣柜
   */
  async navigateToWardrobe() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/wardrobe/wardrobe' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 页面跳转 - 体貌特征
   */
  async navigateToBodyProfile() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/body-profile/body-profile' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 页面跳转 - 设置
   */
  async navigateToSettings() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/settings/settings' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 页面跳转 - 关于我们
   */
  async navigateToAbout() {
    try {
      await this.checkLogin();
      wx.navigateTo({ url: '/pages/about/about' });
    } catch (error) {
      console.log('用户未登录，取消跳转');
    }
  },

  /**
   * 页面跳转 - 反馈建议
   */
  async navigateToFeedback() {
    try {
      await this.checkLogin();
      wx.showToast({ title: '反馈功能开发中', icon: 'none' });
    } catch (error) {
      console.log('用户未登录，取消操作');
    }
  },

  /**
   * 同步微信用户信息
   */
  async syncWechatUserInfo() {
    try {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 调用微信用户信息获取接口
        const res = await wx.getUserProfile({
          desc: '用于完善用户资料'
        });
        
        if (res.userInfo) {
          const { nickName } = res.userInfo;
          
          // 更新用户昵称到数据库
          const db = wx.cloud.database();
          const userCollection = db.collection('users');
          
          const userRes = await userCollection.where({ openid }).get();
          
          if (userRes.data.length > 0) {
            // 更新现有用户
            await userCollection.doc(userRes.data[0]._id).update({
              data: {
                nickName,
                updateTime: db.serverDate()
              }
            });
          } else {
            // 创建新用户记录
            await userCollection.add({
              data: {
                openid,
                nickName,
                createTime: db.serverDate(),
                updateTime: db.serverDate()
              }
            });
          }
          
          // 更新本地数据
          this.setData({
            'userInfo.nickName': nickName
          });
        }
      }
    } catch (error) {
      console.error('同步微信用户信息失败:', error);
      // 静默失败，不影响用户使用
    }
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
        
        // 6. 重新加载页面数据
        await this.loadPageData();
        
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

  /**
   * 显示头像编辑
   */
  async showEditAvatar() {
    try {
      // 检查登录状态
      await this.checkLogin();
      
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const tempFilePaths = res.tempFilePaths;
          const openid = wx.getStorageSync('openid');
          
          try {
            wx.showLoading({ title: '上传中...' });
            
            // 生成文件路径
            const timestamp = Date.now();
            const fileExt = tempFilePaths[0].split('.').pop();
            const cloudPath = `user-avatar/${openid}-avatar.${fileExt}`;
            
            // 上传到云存储
            const uploadRes = await wx.cloud.uploadFile({
              cloudPath,
              filePath: tempFilePaths[0]
            });
            
            if (uploadRes.fileID) {
              // 获取临时文件URL
              const urlRes = await wx.cloud.getTempFileURL({
                fileList: [uploadRes.fileID]
              });
              
              if (urlRes.fileList.length > 0 && urlRes.fileList[0].tempFileURL) {
                const avatarUrl = urlRes.fileList[0].tempFileURL;
                
                // 更新数据库
                const db = wx.cloud.database();
                const userCollection = db.collection('users');
                
                const userRes = await userCollection.where({ openid }).get();
                
                if (userRes.data.length > 0) {
                  await userCollection.doc(userRes.data[0]._id).update({
                    data: {
                      avatarUrl: uploadRes.fileID,
                      updateTime: db.serverDate()
                    }
                  });
                } else {
                  await userCollection.add({
                    data: {
                      openid,
                      avatarUrl: uploadRes.fileID,
                      createTime: db.serverDate(),
                      updateTime: db.serverDate()
                    }
                  });
                }
                
                // 更新本地数据
                this.setData({
                  'userInfo.avatarUrl': avatarUrl
                });
                
                wx.hideLoading();
                wx.showToast({
                  title: '头像更新成功',
                  icon: 'success',
                  duration: 2000
                });
              } else {
                throw new Error('获取头像链接失败');
              }
            } else {
              throw new Error('上传失败');
            }
          } catch (error) {
            console.error('上传头像失败:', error);
            wx.hideLoading();
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    } catch (error) {
      console.log('用户未登录，取消头像编辑');
    }
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
  async showEditBodyInfo() {
    try {
      await this.checkLogin();
      this.setData({
        showBodyInfoEditor: true
      });
    } catch (error) {
      console.log('用户未登录，取消编辑身体信息');
    }
  },

  /**
   * 处理身高体重编辑确认
   */
  async handleBodyInfoConfirm(e) {
    const { height, weight, gender } = e.detail;
    await this.saveBodyInfo(height, weight, gender);
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
   * 保存身高体重性别信息
   */
  async saveBodyInfo(heightStr, weightStr, gender) {
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
      
      const saveData = {
        height,
        weight,
        gender: gender || '',
        updateTime: db.serverDate()
      };

      if (profileRes.data.length > 0) {
        await bodyProfileCollection.doc(profileRes.data[0]._id).update({
          data: saveData
        });
      } else {
        await bodyProfileCollection.add({
          data: {
            openid,
            ...saveData,
            createTime: db.serverDate()
          }
        });
      }

      this.setData({
        'userInfo.height': height,
        'userInfo.weight': weight,
        'userInfo.gender': gender || ''
      });

      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });

    } catch (error) {
      console.error('保存身体信息失败:', error);
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