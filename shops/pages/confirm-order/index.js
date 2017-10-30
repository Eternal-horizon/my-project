var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {
    payNow: 0,
    has_address:false,
    address:[],
    order_list: [],
    goods_list: [],
    order_id:'',
    address_id:''
   
  },
  // 确认订单
  onLoad: function (options) {
    var that = this;
    //var address = that.data.address;
    var goods_list = that.data.goods_list;
    var order_list = that.data.order_list;
    var order_id = wx.getStorageSync('order_id');
    var address_id = options.address_id;
    if (options.payNow == 1) {
      // 获取用户的默认地址
      network.post({
        url: '/Home/Order/gain_order',
        data: { user_id: 5,order_id:order_id,address_id:address_id },
        success: function (res) {
          if (res.data.status == 1) {
            //var address = res.data.info.detail ? res.data.info.detail : {};
            var order_list = res.data.info.order_list;
            var goods_list = res.data.info.goods_list;
          for(var i =0;i<goods_list.length;i++){
            app.storageCart.goods_delete(goods_list[i].spec_id);
          }
           // var address_id = address.id;
            var has_address = order_list.receiver ? true :false;

            that.setData({
             // address: address,
              order_list:order_list,
              goods_list:goods_list,
              order_id:order_id,
              address_id:address_id,
              has_address: has_address
            })
          }
        }
      })
    }
  },
  pay: function (e) {
    var that = this;
    var address = e.target.dataset.address;
    if (address == '') {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'success',
        duration: 2000
      })
    }else{
      var order_id = that.data.order_id;
      var address_id = that.data.address_id;
      wx.removeStorageSync('order_id');
      network.post({
        url: '/Home/Pay/pay',
        data: { user_id: 5, order_id: order_id,address_id:address_id },
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

              }
            }
          )
        }
      })
    }
  },
  address_url:function(){
    wx.navigateTo({
      url: '../manage-address/index'
    })
  }


})