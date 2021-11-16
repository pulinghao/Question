import AppHttpHelper from "../../lib/AppHttpHelper.js";
import AppManager from "../../lib/AppManager.js"
const moneyCenterUrl = require('../../config.js').moneyCenter;

// 金币聚合页/金币任务中心
Page({
  data: {
    totalMoney: 0, // 总金币
    todayMoney: 0, // 今日获得
    sumMoney: 0, // 累计获得
    moneyTasks: [],
    redemList: [ // 兑换列表
      // {
      //   src: "../../images/test-to-delete.png",
      //   productName: "京东卡100元",
      //   productPrice: 10000
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let params = {};
    AppHttpHelper.getReqByUid(
      moneyCenterUrl,
      params,
      (res) => {
        let data = res.data.data;
        let totalMoney = data.total_money;
        let todayMoney = data.today_money;
        let sumMoney = data.sum_money;
        let moneyTasks = data.money_tasks;

        that.setData({
          todayMoney: todayMoney,
          totalMoney: totalMoney,
          sumMoney: sumMoney,
          moneyTasks: moneyTasks
        });
      }
    );
  },

    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    //统计
    app.aldstat.sendEvent('金币中心-邀请好友一起来')
    let uid = AppManager.getUid();
    let title = "邀请你一起刷问小答，赢取金币~";
    console.log("uid: " + uid);
    return {
      title: title,
      path: '/pages/main/main?inviteUid=' + uid,
      imageUrl: '../../images/invite_friend_icon.png'
    };
  },

  /**
   * 到主页
   */
  toHome: function() {
    //统计
    app.aldstat.sendEvent('金币中心-子任务点击')
    wx.reLaunch({
      url: '../main/main?'
    })
  }
});