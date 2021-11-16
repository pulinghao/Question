// components/todaydialogview/today-dialog-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:Boolean,
    hasLogin:Boolean,
    reward:String,
    day:String,
    plus:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCheckInClick: function (e) {
      const eventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      this.triggerEvent('checkinevent', e.detail, eventOption)
    },

    getSystemUserInfo:function(e){
      const eventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      this.triggerEvent('getsysteminfo', e.detail, eventOption)
    }

  }
})
