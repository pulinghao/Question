Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        shareClick(e) {
            let evenOption = {
                bubbles: true, 
                composed: true,
                capturePhase: false}
            this.triggerEvent('shareclick', {}, evenOption)
            console.log("triggerEvent--share");
        },
        commentClick(e) {
            let evenOption = {
                bubbles: true, 
                composed: true,
                capturePhase: false}
            this.triggerEvent('commentclick', {}, evenOption)
        },
    }
})