var app = getApp();
var network = require("../../utils/network.js")
Page({
  data: {
    condition: false,
    order: true
  },
  // 订单列表页
  onShow: function (options) {
    var that = this;
    network.post({
      url: '/Home/Order/index',
      data: { user_id: 5, status: 4 },
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
  evaluate: function (e) {
    var order_id = e.target.dataset.order_id;
    var explain = e.target.dataset.explain;
    network.post({
      url: '/Home/Order/save',
      data: { id: order_id, explain: explain },
      success: function (res) {
        wx.navigateTo({
          url: '../my-order/index',
        })
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