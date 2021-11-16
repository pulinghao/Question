// pages/index/detail.js
const app = getApp()
const getAnswerListUrl = require('../../config.js').getAnswerListUrl
const getQuestioinDetailUrl = require('../../config.js').getQuestioinDetailUrl
const shareQuestionUrl = require('../../config.js').shareQuestionReward
const updateUserInfoUrl = require('../../config.js').updateUserInfoUrl
const checkUserHasCommentUrl = require('../../config.js').checkUserHasCommentUrl
const addZanUrl = require('../../config.js').addZanUrl
const ctx = wx.createCanvasContext('shareImg');
const voteUrl = require('../../config.js').voteUrl

import AppHttpHelper from "../../lib/AppHttpHelper.js"
import AuthLoginManager from "../../lib/authLogin/authLoginManager.js"
import AppManager from "../../lib/AppManager.js"

const MaxWidth = 700
const titleFontSize = 52
const subTitleFontSize = 42

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false,
    searchLoadComplete: false,
    createList: [],
    answer_num: 0,
    title: '',
    remark: '',
    autoId: 2,
    question_id: 0,
    answer_list: [],
    pageIndex: 1,
    img: '',
    authorized: false,   //授权相关
    item: {
      showLogin: false
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isFromLink:false,    //判断是否来自分享
    isVotePage: false,    // 判断是否投票界面，显示投票相关的UI，默认false
    imgUrl: '', // 图片url
    rewardToast: { // 金币奖励toast
      isShow: false,
      title: "",
      subtitle: ""
    },
    voteInfo: {
      isVoted: false,
      yesText: "",
      yesPercent: 0, // 投票左边占比，默认0
      yesNum: 0,
      noText: "",
      noPercent: 0, // 投票右边占比，默认0
      noNum: 0
    }    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _question_id = options.id
    var _isFromLink = options.isFromLink
    var that = this;

    this.checkIfLogin();
    let _uid = wx.getStorageSync('uid');

    this.setData({
      question_id: _question_id,
      isFromLink: _isFromLink
    })

    var params = {};
    params.question_id = _question_id;
    params.page = 0;
    AppHttpHelper.getReqByUid(
      getQuestioinDetailUrl,
      params,
      (res) => {
        var _data = res.data.data
        let _cardStyle = _data.card_style;
        let voteInfo = _data.voteInfo;
        if (_cardStyle === 2) {
          // 投票页面
          voteInfo =  _data.voteInfo;
        }

        that.setData({
          title: _data.title,
          remark: _data.remark,
          cardStyle: _cardStyle,
          voteInfo: voteInfo,
          answer_num: _data.answer_num,
          imgUrl: _data.imgUrl,
          searchLoading: true,
          autoId: _data.auto_id
        })

        var topLineSize = 36
        var subLineSize = 32
        var space = 10
        var topLineOffsetY = 50
        var leftOffset = 12
        var maxWidht = 750 - 2 * topLineSize
        var maxWidthSub = 750 - 2 * subLineSize
        // ctx.setFillStyle('red')
        // ctx.fillRect(0,0,750,420)
        // ctx.draw()
        ctx.drawImage('/images/sharebg.png', 0, 10, 750, 600)

        //主标题
        // ctx.save()
        that.drawTitleLine(_data)
        that.drawPeopleIn(_data)
        // ctx.setTextAlign('left')
        // ctx.setFillStyle('#0076FF')
        // ctx.setFontSize(topLineSize)

        // if (_data.title.length <= 12) {
        //   ctx.fillText(_data.title, leftOffset, topLineOffsetY, maxWidht)
        // } else if (_data.title.length <= 24) {
        //   var line1 = _data.title.substring(0, 12)
        //   ctx.fillText(line1, leftOffset, topLineOffsetY, maxWidht)
        //   var line2 = _data.title.substring(12)
        //   ctx.fillText(line2, leftOffset, topLineOffsetY, maxWidht)
        // }
        // ctx.restore()

        //副标题
        ctx.save()
        // ctx.setTextAlign('left')
        // ctx.setFillStyle('#5C5C5C')
        // ctx.setFontSize(subLineSize)
        // var subLineTopOffset = topLineOffsetY + topLineSize + 12
        // if (_data.remark.length <= 12) {
        //   ctx.fillText(_data.title, leftOffset, subLineTopOffset, maxWidthSub)
        // } else if (_data.remark.length <= 24) {
        //   var line1 = _data.remark.substring(0, 12)
        //   ctx.fillText(line1, leftOffset, subLineTopOffset, maxWidthSub)
        //   var line2 = _data.remark.substring(12)
        //   ctx.fillText(line2, leftOffset, subLineTopOffset + 12, maxWidthSub)
        // } else if (_data.remark.length <= 36){
        //   var line1 = _data.remark.substring(0, 12)
        //   ctx.fillText(line1, leftOffset, subLineTopOffset, maxWidthSub)
        //   var line2 = _data.remark.substring(12,24)
        //   ctx.fillText(line2, leftOffset, subLineTopOffset + 12, maxWidthSub)
        //   var line3 = _data.remark.substring(24)
        //   ctx.fillText(line3, leftOffset, subLineTopOffset + 24, maxWidthSub)
        // }
        // ctx.restore()

        ctx.draw(true, setTimeout(() => {
          console.log("onReady1")
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 600,
            destWidth: 750,
            destHeight: 600,
            canvasId: 'shareImg',
            success(res) {
              console.log("onReady2")
              // console.log(res.tempFilePath);
              that.setData({
                img: res.tempFilePath
              })
              console.log("onReady3")
              console.log(that.data.img)

            }
          })
        }, 100))
      },
      (res) => {
        // 错误，暂时不处理
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var avatarUrl = wx.getStorageSync('userInfo').avatarUrl;
    // ctx.drawImage('/images/test.jpg', 0, 0, 750, 400);
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _uid = wx.getStorageSync('uid')
    var _question_id = this.data.question_id
    var that = this

    var params = {}
    params.question_id = _question_id
    params.page = this.data.pageIndex
    params.sorttype = 1
    AppHttpHelper.getReqByUid(
      getAnswerListUrl,
      params,
      (res) => {
        var data = res.data.data
        if (data != null && data.length > 0) {
          var _dataList = data;
          var _pageIndex = that.data.pageIndex;
          that.setData({
            answer_list: _dataList,
            pageIndex: _pageIndex
          })
        }
        console.log(res.data)
      },
      (res) => {
        console.log(res);
      }
    )


    //获取当前用户的评论
    let cparams = {}
    cparams.question_id = this.data.question_id
    // AppHttpHelper.getReqByUid(checkUserHasCommentUrl, cparams,
    //   (res) => {
    //     var comment = res.data.data
    //     that.setData({
    //       selfComment: comment
    //     })
    //     wx.setStorageSync('self-comment',comment);
    //   },
    //   (res) => {}
    // )

    AuthLoginManager.login(
      this,
      () => {
        var headImg = AppManager.getHeadImg()
        that.setData({
          item: {
            showLogin: false
          },
        })
      },
      () => {
        that.setData({
          item: {
            showLogin: true
          },
        })
      })
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
    var that = this;
    that.refreshAnswers();
  },

  onClickComment: function () {
    //======统计
    app.aldstat.sendEvent('详情页-回答button点击')
    //======
    
    let hasComment = false;
    if(this.data.selfComment){
      hasComment = true;
    }
    wx.navigateTo({
      url: 'answer?title=' + this.data.title + '&question_id=' + this.data.question_id + '&hasComment=' + hasComment,
    })
  },

  //点赞
  onZanClick: function (e) {

    //======统计
    app.aldstat.sendEvent('详情页-点赞button点击')
    //======

    var that = this
    var _uid = wx.getStorageSync('uid')
    var _question_id = e.currentTarget.dataset.questionid
    var _item = e.currentTarget.dataset.item

    if (_item.isZan == 1) {
      wx.showToast({
        title: '您已经赞过啦~',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.request({
      url: addZanUrl,
      data: {
        uid: _uid,
        answer_id: _question_id
      },
      method:'POST',
      success: res => {
        //刷新本地的数据即可
        console.log(res)
        let _data = res.data.data;
        let ifFirst = _data.ifFirst;
        let rewardMoney = _data.reward;
        // 首次点赞，奖励弹窗
        if (ifFirst == 1) {
          let rewardTitle = "完成一次点赞";
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
          }, 2 * 1000);
        }
        var _answer_list = this.data.answer_list
        for (var i = 0; i < this.data.answer_list.length; i++) {
          var item = _answer_list[i]
          if (item.auto_id == _question_id) {
            item.zan_num++
            item.isZan = 1
          }
        }
        that.setData({
          answer_list: _answer_list
        })
      },
      fail: res => {

      }
    })
  },


  refreshAnswers: function (e) {
    var _uid = wx.getStorageSync('uid')
    var _question_id = this.data.question_id
    var that = this
    var _pageIndex = that.data.pageIndex;
    _pageIndex++;

    var params = {}
    params.question_id = _question_id
    params.page = _pageIndex
    params.sorttype = 1

    AppHttpHelper.getReqByUid(
      getAnswerListUrl,
      params,
      (res) => {
        var data = res.data.data
        if (data != null && data.length > 0) {
          var _dataList = that.data.answer_list;
          _dataList = _dataList.concat(data);
          that.setData({
            answer_list: _dataList,
            pageIndex: _pageIndex
          })
        } else if (data.length == 0) {
          // wx.showToast({
          //   title: '没有更多了~',
          //   icon: 'none',
          //   duration: 2000
          // })
        }

        console.log(res.data)
      },
      (res) => {
        console.log(res);
      }
    )
    // wx.request({
    //   url: getAnswerListUrl,
    //   method: 'GET',
    //   data: {
    //     question_id: _question_id,
    //     page: _pageIndex,
    //     uid: _uid,
    //     sorttype:1
    //   },
    //   success: res => {
    //     var data = res.data.data
    //     if(data != null && data.length >0 ){
    //       var _dataList = that.data.answer_list;
    //       _dataList = _dataList.concat(data);
    //       that.setData({
    //         answer_list: _dataList,
    //         pageIndex: _pageIndex
    //       })
    //     } else if (data.length == 0) {
    //       // wx.showToast({
    //       //   title: '没有更多了~',
    //       //   icon: 'none',
    //       //   duration: 2000
    //       // })
    //     }

    //     console.log(res.data)
    //   },
    //   fail: res => {

    //   }
    // })
  },

  searchScrollLower: function (e) {
    var that = this;
    that.refreshAnswers();
  },

  onShareAppMessage: function () {
    // 请求问题分享
    let that = this;
    let params = {};
    params.share_uid = AppManager.getUid();
    params.question_id = that.data.autoId;
    AppHttpHelper.getReqByUid(
      shareQuestionUrl,
      params,
      (res) => {
        let _data = res.data.data;
        if(_data.reward_money) {
          let _toastTitle = "完成一次分享";
          let _toastSubtitle = "+" + _data.reward_money + "金币";
          that.showRewardToast(_toastTitle, _toastSubtitle);
        }
      }
    );
    console.log(this.data.img)
    let uid = AppManager.getUid();
    return {
      title: this.data.title,
      path: '/pages/index/detail?id=' + this.data.question_id + '&isFromLink=' + this.data.isFromLink,
      imageUrl: this.data.img
    }
  },

  onImageDetail: function (e) {
    var current = e.target.dataset.imgurl;
    var imgArray = e.target.dataset.item.imgs;
    wx.previewImage({
      current: current,
      urls: imgArray,
    })
  },

  drawTitleLine: function (e) {
    var text = e.title
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    //设置字体大小
    ctx.save()
    ctx.font = `normal normal`
    ctx.setFontSize(titleFontSize)
    //设置字体颜色
    ctx.setFillStyle("#0076FF")
    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < MaxWidth) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < MaxWidth - 30) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 10, 50 + b * 80, MaxWidth + 50);
    }
    ctx.restore()
    var topSpace = 50 + row.length * 80 + 10
    this.drawSubTitleLine(e.remark, topSpace)
  },

  drawSubTitleLine: function (txt, topSpace) {
    var text = txt
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    ctx.save()
    //设置字体大小
    ctx.font = `normal normal`
    ctx.setFontSize(subTitleFontSize)

    //设置字体颜色
    ctx.setFillStyle("#5C5C5C")
    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < MaxWidth) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < MaxWidth - 30) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 10, topSpace + b * 60, MaxWidth);
    }
    ctx.restore()
  },

  drawPeopleIn: function (e) {
    var _answernum = e.answer_num;
    ctx.save()
    //设置字体大小
    ctx.font = `normal normal`
    ctx.setFontSize(32)
    ctx.setTextAlign('right')
    //设置字体颜色
    ctx.setFillStyle("#FFFFFF")
    ctx.fillText("已有" + _answernum + "人参与讨论", 720, 580);

    ctx.restore()
  },

  checkIfLogin: function (e) {
    var res = wx.getSystemInfoSync()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            authorized: true,
          })
        }
      })
    }
    wx.getSetting({
      success: res => {
        var _authorized;
        if (res.authSetting['scope.userInfo']) {
          _authorized = true;
        } else {
          _authorized = false;
        }
        this.setData({
          authorized: _authorized,
        });
      }
    })
  },

  getUserInfo: function (e) {
    var that = this

    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        authorized: true,
        userInfo: e.detail.userInfo
      })

      var _nickName = app.globalData.userInfo.nickName
      var _avatarUrl = app.globalData.userInfo.avatarUrl
      var _uid = wx.getStorageSync('uid')
      wx.request({
        url: updateUserInfoUrl,
        method: 'POST',
        data: {
          nickName: _nickName,
          avatarUrl: _avatarUrl,
          uid: _uid
        },
        success: function (res) {
          that.onClickComment()
        }
      })
    } else {
      // console.log("e.detail.userInfo 2")
      return;
    }
  },

  onClickMainPage: function (e) {
    //======统计
    app.aldstat.sendEvent('详情页-首页入口')
    //======
    wx.reLaunch({
      url: '../main/main?'
    })
    // wx.redirectTo({
    //   url: '../main/main?',
    // })
  },

   onShareClick: function(e) {
     app.aldstat.sendEvent('详情页-看看朋友们怎么选')
     // todo 分享调起提示
   },

   onLeftEvent: function(e) {
    this.onVoteViewClick(e, "yes");
  },

  onRightEvent: function(e) {
    this.onVoteViewClick(e, "no");
  },

  /**
   * 投票点击事件
   */
  onVoteViewClick: function(e, clickType) {
      var voteId = e.currentTarget.dataset.voteid
      console.log(clickType);
      // let clickType = e.detail.type;
      console.log("detail vote type is " + clickType);
      console.log('vote e start');
      console.log(e);
      console.log('vote e end');
      let yesNum = this.data.leftNum;
      let yesPercent = this.data.leftPercent;
      let noNum = this.data.rightNum;
      let noPercent = this.data.rightPercent;
      let voteType = "0";
      if (clickType === "yes") {
          yesNum++;
          voteType = 0;
      } else if (clickType == "no") {
          noNum++;
          voteType = 1;
      }
      this.voteRequest(voteType, voteId)

      yesPercent = Math.round(yesNum / (yesNum + noNum) * 100);
      noPercent = 100 - yesPercent;
  },
  /**
   * 发起投票请求
   * @param voteType 投票的类型：0-赞成；1-反对
   */
  voteRequest: function(voteType, voteId) {
      var that = this;
      console.log("vote id is: " + voteId);
      var params = {
          question_id: voteId,
          yesOrNo: voteType
      }
      AppHttpHelper.postReqByUid(
          voteUrl,
          params,
          (res) => {
              //更新dataList
              console.log(res)
              if (res.data.code == 500) {
                  wx.showToast({
                      title: res.data.msg,
                      icon: 'none'
                  })
                  return
              }

              if (res.data.code == 200) {
                  let _data = res.data.data;
                  let _ifFirst = _data.ifFirst;
                  let _reward = _data.reward;
                  if (_ifFirst == 1 && _reward) {
                    let _toastTitle = "完成一次投票";
                    let _toastSubtitle = "+" + _reward +  "金币";
                    that.showRewardToast(_toastTitle, _toastSubtitle);
                  } 
                  let yesNum = res.data.data.yesNum;
                  let yesPercent = res.data.data.yesPercent;
                  let noNum = res.data.data.noNum;
                  let noPercent = res.data.data.noPercent;
                  let yesText = this.data.voteInfo.yesText;
                  let noText = this.data.voteInfo.noText;
                  let resultVoteInfo = {
                    isVoted: true,
                    yesNum: yesNum,
                    yesPercent: yesPercent,
                    noNum: noNum,
                    noPercent: noPercent,
                    yesText: yesText,
                    noText: noText
                  }
                  that.setData({
                    voteInfo: resultVoteInfo
                  })
              }

          },
          (res) => {

          }
      )
  },

  getSystemUserInfo: function (e) {
    var that = this
    AuthLoginManager.getSystemUserInfo(e,
      (res) => {
        that.setData({
          item: {
            showLogin: false
          },
        })
      },
      (res) => {

      })
  },

    /**
   * 显示金币奖励 toast（2秒）
   */
  showRewardToast: function(title, subtitle) {
    let that = this;
    that.setData({
      rewardToast: { // 金币奖励toast
        isShow: true,
        title: title,
        subtitle: subtitle
      }
    });

    // 2 秒后关闭 toast
    setTimeout(() => {
      that.setData({
        rewardToast: {
          isShow: false
        }
      });
    }, 2 * 1000);
  }

})