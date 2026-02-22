// 测试混元生图云函数页面
Page({
  data: {
    prompt: '一只可爱的猫咪在阳光下玩耍',
    imageUrl: '',
    revisedPrompt: '',
    loading: false,
    result: null,
    error: null,
    // 垫图相关
    referenceImage: '',
    referenceImageBase64: '',
    // 混元3.0参数
    model: 'hunyuan-image-v3.0',
    resolution: '768:1024', // 3:4比例
    logoAdd: 0,
    revise: 0, // 0=不优化，1=优化
    enableThinking: false,
    // 参数说明
    showParams: false
  },

  onLoad() {
    console.log('测试页面加载');
  },

  // 输入框变化
  onPromptInput(e) {
    this.setData({
      prompt: e.detail.value
    });
  },

  // 切换参数面板显示
  toggleParams() {
    this.setData({
      showParams: !this.data.showParams
    });
  },

  // 选择垫图
  async chooseReferenceImage() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      const tempFilePath = res.tempFilePaths[0];
      console.log('选择的图片:', tempFilePath);

      // 读取图片并转为base64
      const fs = wx.getFileSystemManager();
      const base64 = fs.readFileSync(tempFilePath, 'base64');

      this.setData({
        referenceImage: tempFilePath,
        referenceImageBase64: base64
      });

      wx.showToast({
        title: '图片已选择',
        icon: 'success'
      });
    } catch (err) {
      console.error('选择图片失败:', err);
      wx.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  },

  // 清除垫图
  clearReferenceImage() {
    this.setData({
      referenceImage: '',
      referenceImageBase64: ''
    });
  },

  // 参数变化处理
  onResolutionChange(e) {
    const resolutions = ['768:1024', '1024:768', '1024:1024', '720:1280', '1280:720'];
    this.setData({
      resolution: resolutions[e.detail.value]
    });
  },

  onReviseChange(e) {
    this.setData({
      revise: e.detail.value ? 1 : 0
    });
  },

  onEnableThinkingChange(e) {
    this.setData({
      enableThinking: e.detail.value
    });
  },

  // 测试 generateImage-qyBGo1 云函数 - 混元3.0标准参数
  async testGenerateImage() {
    const prompt = this.data.prompt.trim();
    if (!prompt) {
      wx.showToast({
        title: '请输入提示词',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true,
      error: null,
      result: null,
      imageUrl: ''
    });

    // 构建混元3.0参数
    const params = {
      // 必需参数
      prompt: prompt,
      model: this.data.model,

      // 可选参数 - 混元3.0支持
      resolution: this.data.resolution,
      logo_add: this.data.logoAdd,

      // 垫图参数
      ...(this.data.referenceImageBase64 ? {
        images: [this.data.referenceImageBase64]
      } : {}),

      // v3.0特有参数
      ...(this.data.model.includes('v3.0') ? {
        revise: this.data.revise,
        enable_thinking: this.data.enableThinking
      } : {})
    };

    console.log('开始调用 generateImage-qyBGo1 云函数');
    console.log('参数:', JSON.stringify(params, (key, val) => {
      if (key === 'images' && val) return '[base64_image]';
      return val;
    }));

    try {
      // 调用生图云函数 - 使用混元3.0参数标准
      const res = await wx.cloud.callFunction({
        name: 'generateImage-qyBGo1',
        data: params
      });

      console.log('云函数返回结果:', res);
      console.log('res.result:', res.result);

      const result = res.result;

      if (result.success) {
        // 生成成功
        console.log('生成成功!');
        console.log('图片URL:', result.imageUrl);
        console.log('优化后的提示词:', result.revised_prompt);

        this.setData({
          loading: false,
          result: result,
          imageUrl: result.imageUrl,
          revisedPrompt: result.revised_prompt || ''
        });

        wx.showToast({
          title: '生成成功!',
          icon: 'success'
        });
      } else {
        // 生成失败
        console.error('生成失败:', result.code, result.message);
        this.setData({
          loading: false,
          error: {
            code: result.code,
            message: result.message
          }
        });

        wx.showModal({
          title: '生成失败',
          content: `错误码: ${result.code}\n错误信息: ${result.message}`,
          showCancel: false
        });
      }
    } catch (err) {
      console.error('调用失败:', err);
      this.setData({
        loading: false,
        error: {
          code: 'CALL_ERROR',
          message: err.message || '调用云函数失败'
        }
      });

      wx.showModal({
        title: '调用失败',
        content: err.message || '调用云函数失败',
        showCancel: false
      });
    }
  },

  // 测试 hunyuanGenerateImage 云函数
  async testHunyuanGenerateImage() {
    const prompt = this.data.prompt.trim();
    if (!prompt) {
      wx.showToast({
        title: '请输入提示词',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true,
      error: null,
      result: null,
      imageUrl: ''
    });

    console.log('开始调用 hunyuanGenerateImage 云函数');
    console.log('Prompt:', prompt);

    try {
      const res = await wx.cloud.callFunction({
        name: 'hunyuanGenerateImage',
        data: {
          prompt: prompt
        }
      });

      console.log('云函数返回结果:', res);

      const result = res.result;

      if (result.success) {
        console.log('生成成功!');
        console.log('图片URL:', result.imageUrl);
        console.log('优化后的提示词:', result.revisedPrompt);

        this.setData({
          loading: false,
          result: result,
          imageUrl: result.imageUrl,
          revisedPrompt: result.revisedPrompt || ''
        });

        wx.showToast({
          title: '生成成功!',
          icon: 'success'
        });
      } else {
        console.error('生成失败:', result.error);
        this.setData({
          loading: false,
          error: {
            code: 'GENERATE_ERROR',
            message: result.error || '生成失败'
          }
        });

        wx.showModal({
          title: '生成失败',
          content: result.error || '生成失败',
          showCancel: false
        });
      }
    } catch (err) {
      console.error('调用失败:', err);
      this.setData({
        loading: false,
        error: {
          code: 'CALL_ERROR',
          message: err.message || '调用云函数失败'
        }
      });

      wx.showModal({
        title: '调用失败',
        content: err.message || '调用云函数失败',
        showCancel: false
      });
    }
  },

  // 预览图片
  previewImage() {
    if (this.data.imageUrl) {
      wx.previewImage({
        urls: [this.data.imageUrl],
        current: this.data.imageUrl
      });
    }
  },

  // 预览垫图
  previewReferenceImage() {
    if (this.data.referenceImage) {
      wx.previewImage({
        urls: [this.data.referenceImage],
        current: this.data.referenceImage
      });
    }
  },

  // 复制图片URL
  copyImageUrl() {
    if (this.data.imageUrl) {
      wx.setClipboardData({
        data: this.data.imageUrl,
        success: () => {
          wx.showToast({
            title: '已复制URL',
            icon: 'success'
          });
        }
      });
    }
  },

  // 返回首页
  goBack() {
    wx.navigateBack();
  }
});
