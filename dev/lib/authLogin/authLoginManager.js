import AppManager from "../AppManager.js"
const updateUserInfoUrl = require('../../config.js').updateUserInfoUrl

class AuthLoginManager
{
  // 开始login
  static login(page, succBlk, failBlk) {
    var that = this
    wx.showLoading()
    wx.login({
      success(res) {
        if (res.code) {
          // 登录成功，获取用户信息
          that.getUserInfo(res.code, page, succBlk, failBlk)
        } else {
          // 否则弹窗显示，showToast需要封装
          that.showToast()
        }
      },
      fail() {
        that.showToast()
      }
    })
  }

  static getUserInfo(code, page, succBlk, failBlk) {
    var that = this
    wx.getUserInfo({
      // 获取成功，全局存储用户信息，开发者服务器登录
      success(res) {
        wx.hideLoading()
        // 全局存储用户信息
        that.updateUserInfo(res.userInfo,succBlk,failBlk)
        // 回调
        succBlk()
      },
      // 获取失败，弹窗提示一键登录
      fail() {
        wx.hideLoading()
        // 获取用户信息失败，清楚全局存储的登录状态，弹窗提示一键登录
        // 使用token管理登录态的，清楚存储全局的token
        // 使用cookie管理登录态的，可以清楚全局登录状态管理的变量
        // 获取不到用户信息，说明用户没有授权或者取消授权。弹窗提示一键登录，后续会讲
        // showLoginModal()
        failBlk()
      }
    })
  }

  showLoginModal() {
    wx.showModal({
      title: '提示',
      content: '你还未登录，登录后可获得完整体验 ',
      confirmText: '一键登录',
      success(res) {
        // 点击一键登录，去授权页面
        if (res.confirm) {
          wx.navigateTo({
            url: '授权登录页面地址',
          })
        }
      }
    })
  }

  static showToast(content = '登录失败，请稍后再试') {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  }

  static updateUserInfo(e,succBlk,failBlk) {
    let _succBlk = succBlk
    let _failBlk = failBlk
    AppManager.saveNickName(e.nickName)
    AppManager.saveHeadImg(e.avatarUrl)
    wx.request({
      url: updateUserInfoUrl,
      method: 'POST',
      data: {
        uid: AppManager.getUid(),
        nickName: AppManager.getNickName(),
        avatarUrl: AppManager.getHeadImg()
      },
      success: res => {
        _succBlk(res)
      },
      fail: res => {
        _failBlk(res)
      }
    })
  }

  static getSystemUserInfo(e,succBlk,failBlk) {
    AppManager.saveNickName(e.detail.userInfo.nickName)
    AppManager.saveHeadImg(e.detail.userInfo.avatarUrl)
    this.updateUserInfo(e.detail.userInfo, succBlk, failBlk)
  }
}

export default AuthLoginManager