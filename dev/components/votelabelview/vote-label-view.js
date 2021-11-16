Component({
    /**
     * 组件的属性列表
     */
    properties: {
        voteNumber: Number,
        commentNumber: Number
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onShare(e) {
            console.log("onShare");
        }
    }
})