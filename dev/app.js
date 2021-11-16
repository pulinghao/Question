//app.js
const ald = require('./utils/ald-stat.js')
const loginUrl = require('config.js').loginUrl
const updateUserInfoUrl = require('config.js').updateUserInfoUrl
import AppManger from "lib/AppManager.js"

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化formId数组
    var formIdArray = [];
    wx.setStorageSync('formIds', formIdArray)

    var uid = "";
    var openid = "";
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        if (res.code) {
          wx.request({
            url: loginUrl,
            method: 'POST',
 
            data: {
              code: res.code
            },
            success: (res) => {
              var obj = res.data;
              uid = obj.data.uid;
              console.log(uid);
              AppManger.saveUid(uid)
              this.getUserInfo(uid);
            },
            fail: function() {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '服务异常',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '登录失败',
          })
        }
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务异常',
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    isIphoneX: false,
  },

  getUserInfo: function(e) {
    // 获取用户信息
    var uid = e;

    wx.getSystemInfo({
      success: res => {
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          this.globalData.isIphoneX = true
        }
      }
    })

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("getSetting true");
          wx.showTabBar({
            aniamtion: true
          })

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              var _nickName = res.userInfo.nickName;
              var _avatarUrl = res.userInfo.avatarUrl;

              wx.setStorageSync('avatarUrl', _avatarUrl)
              wx.setStorageSync('nickName', _nickName)
              var _uid = uid;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                wx.request({
                  url: updateUserInfoUrl,
                  method: 'POST',
                  data: {
                    nickName: _nickName,
                    avatarUrl: _avatarUrl,
                    uid: _uid
                  },
                  success: function(res) {
                    console.log('===updateUserInfo===')
                    console.log(res);
                    console.log('====================')
                  }
                })
              }
            }
          })
        } else {
          console.log("getSetting false");
          // wx.hideTabBar({
          //   aniamtion: true
          // })
        }
      }
    })
  }
})