// page/main/pages/newquestion/launch.js
import AuthLoginManager from "../../lib/authLogin/authLoginManager.js";
import AppManager from "../../lib/AppManager.js";
import AppHttpHelper from "../../lib/AppHttpHelper.js";
const app = getApp()
const getQuestionJoinListUrl = require('../../config.js').getQuestionJoinListUrl
const inviteRewardUrl = require('../../config.js').inviteReward;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    nickName:"",
    headImg:"",
    dataList: [],
    item: {
      showLogin: false
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      var _uid = wx.getStorageSync('uid')
      this.setData({
        userInfo: app.globalData.userInfo,
        uid: _uid,
      })
    } else {
      let _inviteUid = options_inviteUid;
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      });
      // 发送被邀请请求
      if (_inviteUid) {
        AppManager.saveInviteUid(_inviteUid);
        var params = {};
        params.invite_uid = _inviteUid;
        AppHttpHelper.getReqByUid(
          inviteRewardUrl,
          params,
          (res) => {
            // todo 被邀请成功说明？
          });
      }
    }
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
    var that = this;
    
    var that = this
    AuthLoginManager.login(
      this,
      () => {
        var headImg = AppManager.getHeadImg()
        that.setData({
          headImg: AppManager.getHeadImg(),
          nickName: AppManager.getNickName(),
          item: {
            showLogin: false
          },
        })
        that.getQuestionJoinList();
      },
      () => {
        var headImg = AppManager.getHeadImg()
        that.setData({
          headImg: AppManager.getHeadImg(),
          nickName: AppManager.getNickName(),
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _uid = AppManager.getUid();
    return {
      path: '/pages/main/main?inviteUid=' + _uid
    };
  },

  goQuestionPage: function (e) {
    //======统计
    app.aldstat.sendEvent('我的-常见问题点击')
    //======
    wx.navigateTo({
      url: 'question',
    })
  },

  getQuestionJoinList: function () {
    var that = this;
    var uid = AppManager.getUid()
    wx.request({
      url: getQuestionJoinListUrl,
      method: 'GET',
      data: {
        uid: AppManager.getUid()
      },
      success: (res) => {
        var data = res.data.data;
        // console.log('-------')
        // console.log(data)
        if (data != null && data.length > 0) {
          that.setData({
            dataList: data,
          });
          // console.log(data);
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务异常',
        })
      }
    })
  },

  goDetailPage: function (e) {
    //======统计
    app.aldstat.sendEvent('我的-问题详情点击')
    //======
    var _item = e.currentTarget.dataset.item;
    var qid = _item.auto_id;

    var qid = _item.auto_id;
    wx.navigateTo({
      url: '../index/detail?id=' + qid,
    })
  },

  getSystemUserInfo:function(e){
    var that = this
    AuthLoginManager.getSystemUserInfo(e,
    (res)=>{
      that.setData({
        headImg: AppManager.getHeadImg(),
        nickName: AppManager.getNickName(),
        item: {
          showLogin: false
        },
      })
      that.getQuestionJoinList();
    },
    (res)=>{

    })
  },

// 进入金币中心页面
  onClickMoneyCenter:function(e){
    app.aldstat.sendEvent('我的-金币中心')
    wx.navigateTo({
      url: '../moneycenter/moneycenter',
    })
  }
})