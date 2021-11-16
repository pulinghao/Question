// 工具类
// 1.管理用户的信息 uid nickName avatalUrl
class AppManager
{
  constructor(){
  }

  //1.获取UID
  static getUid()
  {
    return wx.getStorageSync('uid');
  }
  //2.设置UID
  static saveUid(uid)
  {
    wx.setStorageSync('uid', uid)
  }
  //3.获取昵称
  static getNickName()
  {
    return wx.getStorageSync('nickName');
  }
  //4.设置昵称
  static saveNickName(name)
  {
    wx.setStorageSync('nickName', name)
  }
  //5.获取头像
  static getHeadImg()
  {
    return wx.getStorageSync('headImg');
  }

  //6.设置头像
  static saveHeadImg(headImg)
  {
    wx.setStorageSync('headImg', headImg)
  }

  // 保存邀请人的uid
  static saveInviteUid(inviteUid) {
    wx.setStorageSync('inviteUid', inviteUid);
  }

  // 获取邀请人的uid
  static getInviteUid() {
    return wx.getStorageSync('inviteUid');
  }

  // 保存分享问题的 uid
  static saveShareUid(shareUid) {
    wx.setStorageSync('shareUid', inviteUid);
  }

  // 获取分享问题的 uid
  static getShareUid() {
    return wx.getStorage('shareUid');
  }
}

export default AppManager