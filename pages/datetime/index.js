const app = getApp();
let page = null;
Page({
  data: {
    datetime: '2000-02-12 12:13:21',
    date: '2020-02-12',
    time: '12:13:21'

      // datetime: '',
      // date: '',//
      // time: ''//
      ,
    placeholder: "请选择时间"

  },

  onLoad: function () {
    page = this;
  },
  // 时分的事件方法
  selectDateTime(e) {
    console.log("selectDateTime", e.detail);
    this.setData({
      datetime: e.detail
    })
  },
  selectDate(e) {
    console.log("selectDate", e.detail);
    this.setData({
      date: e.detail
    })
  },
  selectTime(e) {
    console.log("selectTime", e.detail);
    this.setData({
      time: e.detail
    })
  },
})