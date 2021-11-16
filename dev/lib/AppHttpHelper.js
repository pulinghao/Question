// HTTP请求辅助工具类
import AppManager from "AppManager.js"
const loginUrl = require('../config.js').loginUrl

class AppHttpHelper {
// 1. 发送需要UID的GET请求
  static getReqByUid(url, params, success, fail) {
    let _uid = AppManager.getUid();
    if (_uid.count == 0 || _uid == undefined || _uid == "") {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            console.log("code:" + res.code)
            wx.request({
              url: loginUrl,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (res) => {
                var uid = res.data.data.uid;
                AppManager.saveUid(uid)
                this.getReqByUidReal(url,uid,params,success,fail)
              },
              fail: res => {
                this.getReqByUidReal(url, uid, params, success, fail)
              }
            })
          }
        }
      })
    } else {
      this.getReqByUidReal(url, _uid, params, success, fail)
    }
  }

// 2.发送需要UID的post请求
  static postReqByUid(url,params,success, fail) {
    let _uid = AppManager.getUid();
    if (_uid.count == 0 || _uid == undefined) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            console.log("code:" + res.code)
            wx.request({
              url: loginUrl,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (res) => {
                var uid = res.data.data.uid;
                AppManager.saveUid(uid)
                this.postReqByUidReal(url, uid, params, success, fail)
              },
              fail: res => {
                this.postReqByUidReal(url, _uid, params, success, fail)
              }
            })
          }
        }
      })
    } else {
      this.postReqByUidReal(url, _uid, params, success, fail)
    }
  }

  static getReqByUidReal(url,uid,params,success,fail){
    var realparams = params
    realparams.uid = uid
    wx.request({
      url: url,
      method:'GET',
      data:realparams,
      success:res=>{
        success(res)
        },
      fail:res=>{
        fail(res)
      }
    })
  }

  static postReqByUidReal(url, uid, params, success, fail) {
    var realparams = params
    realparams.uid = uid
    wx.request({
      url: url,
      method: 'POST',
      data: realparams,
      success: res => {
        success(res)
      },
      fail: res => {
        fail(res)
      }
    })
  }
}

export default AppHttpHelper