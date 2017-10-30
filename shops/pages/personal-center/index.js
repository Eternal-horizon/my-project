var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {
    user: '',
    no_address: true
  },
  onShow: function () {
    this.setData({
      userinfo: app.globalData.user
    });
    var that = this;
    network.post({
      url: '/Home/Address/index',
      data: {},
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            no_address: false
          })
        } else {
          that.setData({
            no_address: true
          })
        }
      }
    })
  },
})
