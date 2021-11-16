import AppHttpHelper from "../../lib/AppHttpHelper.js";
const voteUrl = require('../../config.js').voteUrl

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
        description: String,
        commentNum: Number,
        imgUrl: String,
        leftText: String, // yes == left
        leftPercent: Number,
        leftNum: Number,
        rightText: String, // no == right
        rightPercent: Number,
        rightNum: Number,
        isVoted: {
            type: Boolean,
            value: false // 默认没有投票
        }, // 是否已经投票 
        isShowLabelView: {
            type: Boolean,
            value: false // 默认不展示label veiw，目前首页需要展示，设为true
        },
        voteId: String
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
    },
})