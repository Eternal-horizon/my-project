var app = getApp();
var network = require("../../utils/network.js")
Page({
  data: {
    condition: false,
    order: true
  },
  // 订单列表页
  onLoad: function (options) {
    var that = this;
    network.post({
      url: '/Home/Order/index',
      data: { user_id: 5, status: 2 },
      success: function (res) {
        if (res.data.status == 1) {
          var list = res.data.info.list;
          var condition = list == '' ? true : false;
          var order = list == '' ? false : true;
          that.setData({
            list: list,
            condition: condition,
            order: order
          })
        }
      }
    })
  },
  //返回按钮事件
  back: function () {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    }
  }

})