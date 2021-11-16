// pages/index/answer.js
const app = getApp()

const answerUrl = require('../../config.js').answerUrl
const tokenUrl = require('../../config.js').getCosTokeUrl
var COS = require('../../utils/cos-wx-sdk-v5.js');
const util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "填写你的回答，发布后其他人都能看到哟~",
    title: '',
    remark: '',
    // hasComment:false,
    question_id: 0,
    imgPathArray: [],
    bucketPathArray: [],   //腾讯云上图片的路径
    rewardToast: { // 金币奖励toast
      isShow: false,
      title: "",
      subtitle: ""
    },
    buttonClikced:false,      //是否已经回答问题，防止重复回答
    // selfComment:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _title = options.title
    var _question_id = options.question_id
    // var _hasComment = options.hasComment
    // var _selfComment = wx.getStorageSync('self-comment')
    
    // var _imgs = []
    // if(_selfComment.imgs.length != 0){
    //   for(var i = 0;i < _selfComment.imgs.length;i++){
    //     _imgs.push(_selfComment.imgs[i])
    //   }
    // }
    this.setData({
      title: _title,
      question_id: _question_id,
      // hasComment:_hasComment,
      // selfComment:_selfComment,
      // imgPathArray:_imgs
    })

    this.ctx = wx.createCameraContext()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindTextAreaBlur: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  onClickComment: function (e) {
    let that = this;
    //======统计
    app.aldstat.sendEvent('回答页-回答button点击')
    //======
    //这里这么写的原因是，坑爹的微信bindTextAreaBlur在点击事件后才调

    util.buttonClicked(this)
    var _remark = e.detail.value.textarea

    // if (_remark.length == 0) return
    var _uid = wx.getStorageSync('uid')

    wx.showLoading({
      title: '正在发布',
      mask:true
    })


    var _answer_id = "";
    // if (this.data.selfComment.auto_id.length != 0 && this.data.selfComment.auto_id != ''){
    //   _answer_id = this.data.selfComment.auto_id
    // }
    
    if (this.data.imgPathArray.length != 0){
      this.uploadImagesToBucket(_remark);
    } else {
      wx.request({
        url: answerUrl,
        method: 'POST',
        data: {
          // answer_id:_answer_id,
          uid: _uid,
          question_id: this.data.question_id,
          content: _remark,
          imgs: []
        },
        success: function (e) {
          if (e.data.msg == 'success') {
            wx.hideLoading();
            let _data = e.data.data;
            let ifFirst = _data.ifFirst;
            let rewardMoney = _data.reward;
            // 首次点赞，奖励弹窗
            if (ifFirst == 1) {
              let rewardTitle = "完成一次评论";
              let rewardSubtitle = "+" + rewardMoney + "金币";
              let _rewardToast = { // 金币奖励toast
                isShow: true,
                title: rewardTitle,
                subtitle: rewardSubtitle
              };
              that.setData({
                rewardToast: _rewardToast
              });
            
              // 关闭 toast
              setTimeout(() => {
                that.setData({
                  rewardToast: {
                    isShow: false
                  }
                });
                wx.navigateBack({
                  delta: 1
                });
              }, 2 * 1000);
            } else {
              wx.showToast({
                title: '回答成功',
                duration: 1000,
                mask: true,
                success: res => {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 3000);
                }
              });
            }
          } else {
            wx.showToast({
              title: e.data.msg,
              duration: 1000,
              mask: true,
              icon: 'none',
              success: res => {
              }
            })
          }
        },
        fail: function (e) {
          console.log(e)
        }
      })
    }
    

  },

  onPhotoClick: function (e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        // 这是一个数组
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imgPathArray: tempFilePaths
        })

      },
      fail: res => {

      }
    })
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  onDeleteImage: function (e) {
    var _index = e.currentTarget.dataset.index
    console.log(_index)
    var _imagePathArray = []
    for (var i = 0; i < this.data.imgPathArray.length; i++) {
      if (i != _index) _imagePathArray.push(this.data.imgPathArray[i])
    }
    this.setData({
      imgPathArray: _imagePathArray
    })
  },

  onImageDetail: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imgPathArray,
    })
  },

  uploadImagesToBucket: function (e) {
    var Bucket = 'imgs-1255982020';
    var Region = 'ap-beijing';
    var _remark = e
    var _uid = wx.getStorageSync('uid')
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (options, callback) {
        //获取授权
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDkVVRDu76XAdP5bJ53qbFj9PUPApdfuLb',
          SecretKey: 'GGTadVCiFf0EHAsOsgLDyYxBXZp371k8',
          Method: options.Method,
          Key: options.Key,
          Query: options.Query,
          Headers: options.Headers,
          Expires: 60,
        });
        callback(authorization);
      }
    });

    var _filePathArray = this.data.imgPathArray
    var _fileNum = _filePathArray.length
    var _fileIndex = 0

    var _promiseArray = []
    for (var i = 0; i < _fileNum; i++) {
      let promise = new Promise(function (resolve, reject) {
        var _filePath = _filePathArray[i]
        var _fileName = _filePath.substr(_filePath.lastIndexOf('/') + 1)
        var _fileNameBucket = "img-" + _uid +i+ new Date().getTime().toString()+'.jpg'
        cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: _fileNameBucket,
          FilePath: _filePath,
          onProgress: function (info) {
            // console.log(JSON.stringify(info));
          }
        }, function (err, data) {
          if (!err) {
            //上传成功
            resolve(data)
          }
          // console.log(err || data);
        });
      })

      _promiseArray.push(promise)
    }

    Promise.all(_promiseArray).then(res => {
      if (res.length != _fileNum) {
        wx.showToast({
          title: '图片未上传完成！',
        })
      }
      var _locationArray = []
      for (var i = 0; i < res.length; i++) {
        _locationArray.push(res[i].Location)
      }
      this.setData({
        bucketPathArray: _locationArray
      })

      
      wx.request({
        url: answerUrl,
        method: 'POST',
        data: {
          uid: _uid,
          question_id: this.data.question_id,
          content: _remark,
          imgs: _locationArray
        },
        success: function (e) {
          if (e.data.msg == 'success') {
            wx.showToast({
              title: '回答成功',
              duration: 1000,
              mask: true,
              success: res => {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
            // 当日首次回答逻辑
            if (e.data.ifFirst == 1) {
              // todo 奖励弹窗
            }
          } else {
            wx.showToast({
              title: e.data.msg,
              duration: 1000,
              mask: true,
              icon:'none',
              success: res => {
              }
            })
          }
        },
        fail: function (e) {
          console.log(e)
        }
      })
    })
    },
})