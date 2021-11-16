// page/main/pages/newquestion/launch.js
import AppHttpHelper from "../../lib/AppHttpHelper.js"
import AppManager from "../../lib/AppManager.js"
const app = getApp()
const updateUserInfoUrl = require('../../config.js').updateUserInfoUrl
const getQuestionListUrl = require('../../config.js').getQuestionListUrl
const voteUrl = require('../../config.js').voteUrl
const dailyLoginUrl = require('../../config.js').dailyLoginUrl
const dailyCheckInUrl = require('../../config.js').dailyCheckInUrl

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    searchLoading: false,
    searchLoadComplete: false,
    pageIndex: 1, // 页码
    authorized: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHidden: true,
    voteItem: {
      yesNum: 0,
      yesPercent: 0,
      noNum: 0,
      noPercent: 0
    }, //展示的弹框
    rewardToast: { // 金币奖励toast
      isShow: false,
      title: "",
      subtitle: ""
    },
    dailyLogin:{         //每日登录弹框
      hasLogin:false,    //用户授权
      hasDailyLogin:false,  //用户当日是否登录
      isShow:false,
      reward:0,          
      day:0,
      plus:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    var that = this
    var res = wx.getSystemInfoSync()
    var _id;

    let inviteUid = options.inviteUid;
    let storedInvitedUid = AppManager.getInviteUid();
    if (!storedInvitedUid && inviteUid && (uid != inviteUid)) {
      // 没有存储邀请人uid的情况，就保存邀请人的 uid
      AppManager.saveInviteUid(inviteUid);    }

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
          wx.showTabBar({
            aniamtion: true
          })
        } else {
          _authorized = false;
        }
        this.setData({
          authorized: _authorized,
        });
      }
    })

    this.onDailyLogin()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var pageIndex = this.data.pageIndex;
    // console.log('before------- pageIndex-------')
    // console.log(pageIndex);
    var params = {};
    params.page = pageIndex;
    AppHttpHelper.getReqByUid(
      getQuestionListUrl,
      params,
      (res) => {
        var data = res.data.data;
        if (data != null && data.length > 0) {
          var _dataList = data;
          console.log(_dataList);
          that.setData({
            searchLoading: true,
            dataList: _dataList,
          })
        }
      },
      (res) => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务异常',
        })
      });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let item = null;
    if (e.target != null && e.target.dataset != null) {
      item = e.target.dataset.item;
    }
    var uid = AppManager.getUid();
    console.log("uid: " + uid);
    if(item != null && item.qt == "xuanfu"){
      return {
        title: item.title,
        path: '/pages/index/detail?id=' + item.auto_id,
        imageUrl: '../../images/nizenmekan.png'
      };
    } 
    // 首页不能邀请好友，只能在金币任务中心邀请好友
    // else {
    //   return {
    //     path: '/pages/main/main?inviteUid=' + uid
    //   };
    // }
  },


  /******** 自定义函数 *******/

  initData: function() {
    var _userInfo = {};
    _userInfo.avatarUrl = "";
    _userInfo.nickName = "";
    this.setData({
      avator: "",
      nickname: "",
      userInfo: _userInfo,
    });
  },

  getQuestionList: function() {
    var that = this;
    var _pageIndex = this.data.pageIndex;
    _pageIndex++;
    AppHttpHelper.getReqByUid(
      getQuestionListUrl, {
        page: _pageIndex
      },
      (res) => {
        var data = res.data.data;
        if (data != null && data.length > 0) {
          var _dataList = that.data.dataList;
          _dataList = _dataList.concat(data);
          console.log(_dataList)
          that.setData({
            searchLoading: true,
            pageIndex: _pageIndex,
            dataList: _dataList
          })
        }
      },
      (res) => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务异常',
        })
      }
    )
  },


  getUserInfo: function(e) {
    // console.log("getUserInfo")
    var that = this

    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      wx.showTabBar({
        aniamtion: true
      })
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
        success: function(res) {
          var params = {};
          let _inviteUid = AppManager.getInviteUid();
          if(_inviteUid) {
            params.invite_uid = _inviteUid;
            AppHttpHelper.getReqByUid(
              inviteRewardUrl,
              params,
              (res) => {
                // todo 被邀请成功说明？
              });
          }
        }
      })
    } else {
      // console.log("e.detail.userInfo 2")
      return;
    }
  },

  goDetailPage: function(e) {
    //======统计
    app.aldstat.sendEvent('首页-问题卡片点击')
    //======

    var _item = e.currentTarget.dataset.item;
    var qid = _item.auto_id;
    console.log("-----goDetailPage");
    // console.log(qid);
    wx.navigateTo({
      url: '../index/detail?id=' + qid + '&isFromLink=' + false,
    })
  },

  searchScrollLower: function(e) {
    var that = this;
    that.getQuestionList();
  },

  onVoteForYes: function(e) {
    app.aldstat.sendEvent('首页-投票yes点击')
    this.onHandleVote(e,0)
  },

  onVoteForNo: function(e) {
    app.aldstat.sendEvent('首页-投票no点击')
    this.onHandleVote(e,1)
  },

  onHandleVote:function(e,yesOrNo)
  {
    var that = this
    var id = e.target.dataset.voteid
    console.log(e);
    var params = {
      question_id: id,
      yesOrNo: yesOrNo
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
          let _isHideVoteModel = false;
          if (_ifFirst == 1 && _reward) {
            let _toastTitle = "完成一次投票";
            let _toastSubtitle = "+" + _reward +  "金币";
            that.showRewardToast(_toastTitle, _toastSubtitle);
            // 展示奖励 toast 时，不展示首页投票完成弹窗
            _isHideVoteModel = true;
          } 
          var item = {
            auto_id: id,
            qt: 'xuanfu',
            yesNum: res.data.data.yesNum,
            yesPercent: (res.data.data.yesPercent),
            noNum: res.data.data.noNum,
            noPercent: (res.data.data.noPercent)
          } //展示的弹框
          var index = 0;
          var boolFind = false;
          var _dataList = that.data.dataList
          for (var i = 0; i < _dataList.length; i++) {
            var each = _dataList[i];
            if (each.auto_id == id) {
              _dataList[i].voteInfo.isVoted = true;
              _dataList[i].voteInfo.yesPercent = item.yesPercent;
              _dataList[i].voteInfo.noPercent = item.noPercent;
              _dataList[i].voteInfo.yesNum = item.yesNum;
              _dataList[i].voteInfo.noNum = item.noNum;
              item.isVoted = true;
              item.title = _dataList[i].title;
              item.noText = _dataList[i].voteInfo.noText;
              item.yesText = _dataList[i].voteInfo.yesText;
              boolFind = true;
              index = i;
              break;
            }
          }
          that.setData({
            isHidden: _isHideVoteModel,
            voteItem: item,
            dataList: _dataList
          })
        }
      },
      (res) => {

      }
    )
  },

  onHideTip: function(e) {
    this.setData({
      isHidden: true
    })
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

// 悬浮框分享
  onShareClickInToase:function(e){
    //======统计
    app.aldstat.sendEvent('首页-弹框分享')
    //======
    this.onShareClick(e)
  },

  onShareClickOnMain:function(e){
    //======统计
    app.aldstat.sendEvent('首页-看看朋友们怎么选')
    //======
    this.onShareClick(e)
  },

  onShareClick:function(e){
    
    var item = e.target.dataset.item
    var param = {
      item:item,
      qt:"xuanfu"  //来自悬浮框的分享
    }
    this.onShareAppMessage(param)
  },
// 悬浮框评论
  onCommentClick:function(e){
    //======统计
    app.aldstat.sendEvent('首页-弹框评论')
    //======
    var item = e.target.dataset.item
    wx.navigateTo({
      url: '../index/answer?title=' + item.title + '&question_id='+ item.auto_id + '&hasComment=false',
    })
  },


  //首次弹登录框
  onDailyLogin:function(e){
    var that = this
    AppHttpHelper.getReqByUid(
      dailyLoginUrl,
      {},
      (res)=>{
        if(res.data.code == 200 && res.data.msg =='首次签到'){
          that.setData({
            dailyLogin: {         //每日登录弹框
              hasLogin: res.data.data.hasLogin == 1 ? true : false,    //用户授权
              hasDailyLogin: res.data.data.hasCheckIn == 0 ? true : false,  //用户当日是否登录
              reward: res.data.data.reward,
              day: res.data.data.day,
              plus: res.data.data.plus,
              isShow: res.data.data.hasCheckIn == 0 ? true : false,
            }
          })
        }
        
      },
      (res)=>{
        
      }
    )
  },

  onCheckIn:function(e){
    var that = this
    AppHttpHelper.getReqByUid(
      dailyCheckInUrl,
      {},
      (res)=>{
        console.log(res)
        if(res.data.code == 200){
          if(res.data.data.error_no == 0)
          {
            that.setData({
              rewardToast: { // 金币奖励toast
                isShow: true,
                title: "签到成功!",
                subtitle: "+"+that.data.dailyLogin.reward+"金币"
              },
              dailyLogin:{
                isShow:false
              }
            })

            // 关闭 toast
            setTimeout(() => {
              that.setData({
                rewardToast: {
                  isShow: false
                }
              });
            }, 2 * 1000);
          } else {
            wx.showToast({
              title: '您已签过到了~',
            })
            that.setData({
              dailyLogin: {
                isShow: false
              }
            })
          }
        }
        
      },
      (res)=>{
        console.log(res)
      }
    )
  },

  getUserInfoAndCheckIn:function(e){
    this.getUserInfo(e)
    this.onCheckIn(e)
  },

  onClickCoincenter:function(e){
    app.aldstat.sendEvent('首页-金币入口')
    wx.navigateTo({
      url: '../moneycenter/moneycenter',
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