var network = require("../../utils/network.js")
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()
Page({
  data: {
    p: 2,
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
  //滚动底部监听
  onReachBottom: function () { //下拉刷新
    var that = this;
    var p = that.data.p;
    //console.log(p);
    var new_goods = that.data.new_goods;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 3000
    });
    network.post({
      url: '/Home/Goods/new_goods',
      data: { "p": p },
      success: function (res) {
        // console.log(res);
        p++;
        that.setData({
          new_goods: new_goods.concat(res.data.info.list),
          api_url: app.globalData.api_url,
          p: p
        })

       setTimeout(function(){wx.hideToast();},1000);
      }
    })
  }
})
