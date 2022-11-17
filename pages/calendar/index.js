//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    selectedDays: ["2022-11-09", "2022-11-01", ],
  },
  onLoad: function () {

  },
  /**
   * 点击日期时候触发的事件
   * bind:getdate
   */
  getdate(e) {
    // console.log(e.detail);
  },

  /** 
   * 点击确定按钮触发的事件
   * bind:select
   */
  cmfclick(e) {
    //  console.log(e.detail.selectDays);
  },
  /** 
   * 点击清空事件
   * bind:clear
   */
  clear(e) {
    console.log("要清空选中日期")
  }
})