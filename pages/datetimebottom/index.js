//获取应用实例
const app = getApp()
Page({
    data: {
        // datetime: '2022-11-11 12:13:21',
        // date: '2022-11-11',
        // time: '12:13:21',
       
        datetime: '',
        date: '',//
        time: ''//
        ,
        placeholder:"请选择时间"
    },
    // 时分的事件方法
    selectDateTime(e) {
        console.log(e);
        this.setData({
            datetime: e.detail.value
        })
    },
    selectDate(e) {
        this.setData({
            date: e.detail.value
        })
    },
    selectTime(e) {
        this.setData({
            time: e.detail.value
        })
    },
})