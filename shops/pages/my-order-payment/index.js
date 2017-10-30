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
      data: { user_id: 5,status:1},
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
  pay: function (e) {
    var that = this;
    if (that.data.address == '') {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'success',
        duration: 2000
      })
    } else {
      var order_id = that.data.order_id;
      network.post({
        url: '/Home/Pay/pay',
        data: { user_id: 5, order_id: order_id},
        success: function (res) {
          var data = res.data;
          wx.requestPayment(
            {
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': data.signType,
              'paySign': data.paySign,
              'success': function (res) {
                console.log(res);
                // app.dopost('/home/order/save/id/' + order_id, {}, function (res) {
                //   if (res.data.info == '修改成功') {
                //     wx.navigateTo({
                //       url: '../my-order/index'
                //     })
                //   } else {

                //   }
                // })
              },
              'fail': function (res) {
                wx.navigateTo({
                      url: '../my-order-payment/index'
                    })
              }
            }
          )
        }
      })
    }
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