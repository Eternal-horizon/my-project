var network = require("../../utils/network.js");
var app = getApp();
Page({
  data: {
    num: 1,
    bool: true,
    term: true,
    cartList: [],
    selectAll: false,
  },
  onShow: function () {
    // 购物车统计选中的价格
    this.setData({
      cartList: app.storageCart.show(),
      total: app.storageCart.total(),
      selectAll: app.storageCart.selectAll()
    })
  },
  selectAll: function (e) {
    var selected = this.data.selectAll ? false : true;
    this.setData({
      cartList: app.storageCart.select(selected),
      total: app.storageCart.total(),
      selectAll: selected
    })
  },
  decrease: function (e) {
    var gid = e.target.dataset.index;
    var num = parseInt(e.target.dataset.num) - 1;
    if (num < 1) {
      num = 1;
    } else {
      var cartList = app.storageCart.save(gid, num, false);
    }
    this.setData({
      cartList: cartList,
      total: app.storageCart.total()
    })
  },
  // 购物车列表加法的操作
  increase: function (e) {
    var gid = e.target.dataset.index;
    var num = parseInt(e.target.dataset.num) + 1;
    this.setData({
      cartList: app.storageCart.save(gid, num, false),
      total: app.storageCart.total()
    })

  },
  //单个复选框
  bindCheckbox: function (e) {
    var gid = e.target.dataset.index;
    var selected = e.target.dataset.checks ? false : true;
    this.setData({
      cartList: app.storageCart.select(selected, gid),
      total: app.storageCart.total()
    })
  },
  // 删除单个个
  delete: function (e) {
    var gid = e.target.dataset.index;
    console.log(gid);
    this.setData({
      cartList: app.storageCart.delete(gid),
      total: app.storageCart.total()
    })
  },
  //提交订单
  payNow: function (e) {
    var ispay = 0;
    var goods = new Array();
    for (var i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].checks) {
        ispay = 1;
        goods.push(this.data.cartList[i]);
      }
    }
    if (ispay == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'success',
        duration: 2000
      })
    } else {
      var goods = JSON.stringify(goods);
      network.post({
        url: '/Home/Order/add',
        data: { user_id: 5, goods: goods, total: app.storageCart.total() },
        success: function (res) {
          if (res.data.status == 1) {
            var order_id = res.data.info.order_id;
            wx.setStorageSync('order_id', order_id);
            wx.navigateTo({
              url: '../confirm-order/index?payNow=1&order_id=' + order_id,
            })
          }
        }
      })
    }
  },
})
