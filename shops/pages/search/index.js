var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {
  key:''
  },
  onShow: function () {
    var that = this;
    network.post({
      url: '/Home/Goods/new_goods',
      data: {},
      success: function (res) {
        // console.log(res);
        that.setData({
          new_goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
  },
  search_text:function(e){
    this.setData({
      key: e.detail.value
    })
  },
  search:function(){
    var key=this.data.key;
    var that = this;
    network.post({
      url: '/Home/Goods/search_goods',
      data: { keywords:key},
      success: function (res) {
        // console.log(res);
        that.setData({
          new_goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
  }
})
