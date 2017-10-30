var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {

  },
  onLoad: function (option) {
    var id = option.id;
    console.log(id);
    var that = this;
    network.post({
      url: '/Home/Goods/theme_goods',
      data: { theme_id: id },
      success: function (res) {
        console.log(res);
        that.setData({
          theme_goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })

  }
})
