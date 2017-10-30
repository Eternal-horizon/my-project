var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {
    list: '',
  },
  onShow: function () {
    var that = this;
    network.post({
      url: '/Home/Address/index',
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            list: res.data.info.list
          })
        }
      }
    })
  },
  shop_address: function (e) {
    var id = e.currentTarget.dataset.id;
    var order_id = wx.getStorageSync('order_id');
    console.log(1);
    if(order_id){
      wx.navigateTo({
        url: '../confirm-order/index?payNow=1&address_id='+id,
      })
    }
  },
  //删除
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    network.post({
      url: '/Home/Address/del',
      data: { 'id': id },
      success: function (res) {
        if (res.data.status == 1) {
          network.post({
            url: '/Home/Address/index',
            data: {},
            success: function (res) {
              if (res.data.status == 1) {
                that.setData({
                  list: res.data.info.list
                })
              }
            }
          })
        }
      }
    })
  },
  //编辑页面的跳转
  edit: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/add-address/index?id=' + id
    })
  }
})
