// page/main/pages/newquestion/launch.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    
    dataList: [
      {
        title: '“问小答”怎么用？',
        answer: '“问小答”是一个优质问答内容互动社区，在这里每天都会发布最新最热的话题，你可以写下自己独到的见解，和网友们进行实时的互动讨论。在“问小答”社区里，只要你回答的内容足够优质，被网友们喜欢，将有无数的网友看到你的回答，参与你的话题讨论～'
      },
      {
        title: '怎样才能让我的回答被更多人看见？',
        answer: '“问小答”中的每个回答都是按照点赞数量排序的，网友们给你的点赞数量越多，你的回答就越靠前，所以要尽量发布优质的回答喔～'
      },
      {
        title: '主要有哪些好玩的内容？',
        answer: '我们主要发布几种主要类型的问题：实时热点事件的看法、网友疑惑问题求解答、一些较为小众但值得讨论的问题。'
      },
      {
        title: '问题太多了，如何快速找到我参与过的问题？',
        answer: '我们将你直接参与过回答的问题为你收集到了“我的”里，如果不想浏览其他问题，可直接在“我的”板块中浏览你参与过的问题，让你更快关注到网友们的回答。同时，我们后续会上线收藏问题相关功能。'
      },
      {
        title: '为什么还不能进行提问？',
        answer: '平台初上线，提问功能尚处于内测阶段，敬请期待。'
      },
      {
        title: '还有什么好玩的地方吗？',
        answer: '我们会陆续上线更多好玩的功能，为了鼓励更优质回答的产生，我们会不定期为较高点赞数的用户送上神秘大礼~做好准备吧！'
      },
      {
        title: '我有很多对这款小程序的意见，怎么反馈？',
        answer: '若你还有其他建议与意见，欢迎在我们相关的几大公众号：经典段子（jingdianduanzi）、斗图（doutu11）、王根基（genjige）的后台进行留言发表意见。'
      },
      {
        title: '最后想对你说：',
        answer: '产品上线初期，还有很多不完善的地方，为了给你提供更优质的内容，提供更好的体验，少不了你的持续参与与关注，如果觉得我们还不错的话，别忘了转发给你的好友，邀请他们一起来参与话题的讨论~，共同构建属于你们的优质问答社区。'
      },
    ],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  }
})