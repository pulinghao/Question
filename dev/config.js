/**
 * 小程序配置文件
 */
// 
// var host = "https://www.wenxiaoda.com/wenda"
// var host = "http://www.outiejun.cc:3030/wenda" //测试地址
var host = "https://qbkjapi.wenxiaoda.com/wenda"  //线上地址
// var host = "www.duanzi66.com/wenda"
var config = {

  // 下面的地址配合云端 Server 工作
  host,

  // 1.登录接口
  loginUrl: `${host}/login`,

  // 2.更新用户信息
  updateUserInfoUrl: `${host}/updateUserInfo`,

  // 3.获取小程序二维码
  getQrcodeUrl: `${host}/getQrcode`,

  // 4.批量提交formid
  saveFormidUrl: `${host}/saveFormid`,

  // 5.获取问题列表
  getQuestionListUrl: `${host}/getQuestionList`,

  // 6.获取单个问题详情 不包含回答
  getQuestioinDetailUrl: `${host}/getQuestioinDetail`,

  // 7.回答问题
  answerUrl: `${host}/answer`,

  // 8.获取回答列表
  getAnswerListUrl: `${host}/getAnswerList`,

  // 9.点赞接口
  addZanUrl: `${host}/addZan`,

  // 10.我参与的问题列表
  getQuestionJoinListUrl: `${host}/getQuestionJoinList`,

  // 11.cosToken
  getCosTokeUrl: `${host}/getCosAuth`,

  // 12.检查用户是否已经评论过
  checkUserHasCommentUrl: `${host}/checkUserHasComment`,
  
  // 13.投票
  voteUrl: `${host}/questionVote`,

  // 14.请求签到
  dailyLoginUrl: `${host}/dailyLogin`,

  // 15.签到接口
  dailyCheckInUrl: `${host}/dailyCheckIn`,

  // 16.金币中心
  moneyCenter: `${host}/moneycenter`,

  // 17.邀请奖励
  inviteReward: `${host}/inviteReward`,

  // 18.分享奖励
  shareQuestionReward: `${host}/shareQuestionReward`
};

module.exports = config
