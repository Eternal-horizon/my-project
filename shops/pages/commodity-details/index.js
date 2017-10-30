var network = require("../../utils/network.js")
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()

Page({
  data: {
    bool1:true,
    bool2: false,
    is_show: false,
    selecked: true,
    num: 1,
    gid: 0,
    bool: true,
    cart_show: false,
    buy_show: false,
    show: false,
    cart_show: false,
    detail: '',
    select_spec: new Array(),
    start: 0,
    shopp_id: 0,
    is_commit: true,
    error_msg: '',
    condition1: true,
    condition2: false,
    cur_price:0
  },
  onLoad: function (option) {
    var id = option.id;
    var that = this;
    var shopnum = app.storageCart.shopnum();
    network.post({
      url: '/Home/Goods/detail',
      data: { id: id },
      success: function (res) {
        var info = res.data.info.goods;
        var keys = info.key;
        var values = info.value;
        var select_spec = that.data.select_spec;
        var shopp_id = option.shopp_id;
        var gid = that.data.gid;

        if (shopp_id > 0) {
          var cartList = app.storageCart.show();
          for (var j = 0; j < cartList.length; j++) {
            if (cartList[j]['gid'] == shopp_id) {
              var list = cartList[j];
            }
          }
         
          var gid = list.gid;
          var snum = list.num;
          var select_spec = list.spec;
          var show_price = list.price * list.num;
          var sow = true;
          var csow = true;
        }
       
        var num = snum ? snum : that.data.num;
        var is_sow = sow ? sow : that.data.show;
        var cart_sow = csow ? csow : that.data.cart_show;
        var price = show_price ? show_price : info.price[0].price;
        info.select_price = info.show_price = price;
        var gid = gid ? gid : info.price[0].id;
        //info.select_price = info.show_price = info.price[0].price;
       // gid = info.price[0].id;
        for (var i = 0; i < keys.length; i++) {
          var checkobj = select_spec[i] ? select_spec[i] : values[keys[i]][0];
          keys[i] = { color_name: keys[i], color_detail: values[keys[i]], checkobj: checkobj };
          select_spec.push(checkobj);
        }
        
        info.key = keys;
        that.setData({
          detail: info,
          api_url: app.globalData.api_url,
          select_spec: select_spec,
          gid: gid,
          num: num,
          show_price: show_price,
          is_show: is_sow,
          cart_show: cart_sow,
          detail: info,
          api_url: app.globalData.api_url,
          select_spec: select_spec,
          gid: gid,
          cur_price: info.select_price,
          shopnum:shopnum
        })

        WxParse.wxParse('content', 'html', res.data.info.goods.content, that, 5);
        console.log(that);
      }
    })
    network.post({
      url: '/Home/Goods/like_goods',
      data: {},
      success: function (res) {
        that.setData({
          love_goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
  },
  tab: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    if (name == "细节描述") {
      that.setData({
        bool1:true,
        bool2:false,
        condition1: true,
        condition2: false
      })
    } else {
      that.setData({
        bool1: false,
        bool2: true,
        condition1: false,
        condition2: true
      })
    }
  },
  add_cart: function () {
    this.setData({
      is_show: true,
      cart_show: true,
    })
  },
  confirm: function () {
    this.setData({
      is_show: true,
      buy_show: true,
    })
  },
  save_cart: function (e) {
    var that = this;
    if (!that.data.is_commit) {
      var msg = that.data.error_msg;
      wx.showToast({ title: msg })
      return false;
    }
    var gid = parseInt(e.target.dataset.gid);
    var goods_id = parseInt(e.target.dataset.goods_id);
    var price = parseInt(e.target.dataset.price);
    var name = e.target.dataset.name;
    var image = e.target.dataset.image;
    var num = parseInt(this.data.num);
    var spec = this.data.select_spec;
    var title = e.target.dataset.title;
    app.storageCart.add(gid, goods_id, price, name, image, num, spec,title);
  },
  addSpec: function (e) {
    var select_key = e.target.dataset.key;
    var select_value = e.target.dataset.value;
    var info = this.data.detail;
    info.key[select_key].checkobj = select_value;
    var all_spec = '';
    for (var i = 0; i < info.key.length; i++) {
      if (select_key == i) {
        all_spec += select_value + '_';
      } else {
        all_spec += info.key[i].checkobj + '_';
      }
    }
    all_spec = all_spec.substring(0, all_spec.length - 1);
    var select_spec = this.data.select_spec;
    select_spec[select_key] = select_value;
    this.check_price(all_spec);
    var is_commit = this.data.is_commit;
    if (!this.check_price(all_spec)) {
      var error_msg = '此规格不存在';
      is_commit = false;
      wx.showToast({
        title: error_msg,
      })
    } else {
      var error_msg = '';
      is_commit = true;
    }
    this.setData({
      detail: info,
      select_spec: select_spec,
      is_commit: is_commit,
      error_msg: error_msg
    })
  },
  //提交订单
  payNow: function (e) {
    var that = this;
    if (!that.data.is_commit) {
      var msg = that.data.error_msg;
      wx.showToast({ title: msg })
      return false;
    }
    var gid = parseInt(e.target.dataset.gid);
    var goods_id = parseInt(e.target.dataset.goods_id);
    var price = parseInt(e.target.dataset.price);
    var name = e.target.dataset.name;
    var image = e.target.dataset.image;
    var num = parseInt(this.data.num);
    var spec = this.data.select_spec;
    var title = e.target.dataset.title;
    var shop_goods = [{gid:gid,goods_id:goods_id,price:price,name:name,image:image,num:num,spec:spec,title:title}];
      var goods = JSON.stringify(shop_goods);
      var total = price *num;
      network.post({
        url: '/Home/Order/add',
        data: { user_id: 5, goods: goods, total: total },
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
  },
  hide: function () {
    this.setData({
      is_show: false,
      cart_show: false,
      buy_show: false
    })
  },
  check_price: function (all_spec) {
    var has = false;
    var info = this.data.detail;
    var gid = this.data.gid;
    var cur_price = this.data.cur_price;
    for (var i = 0; i < info.price.length; i++) {
      if (all_spec == info.price[i].key) {
        console.log('a',info.price);
        gid = info.price[i].id;
        info.show_price = this.data.num * info.price[i].price;
        cur_price = info.price[i].price;
        has = true;
      }
    }
    this.setData({
      detail: info,
      gid: gid,
      cur_price: cur_price
    })
    return has;
  },
  check_nums: function (e) {
    var nums = e.detail.value;
    var reg = new RegExp("^[1-9]{1,4}$");
    if (!reg.test(nums)) {
      nums = 1;
    }
    //遍历时处理
    this.setData({
      num: nums
    });
  },
  add: function () {
    var num = this.data.num;
    num++;
    var info = this.data.detail;
    info.show_price = num * this.data.cur_price;
    this.setData({
      num: num,
      detail: info
    })
  },
  reduce: function () {
    var num = this.data.num;
    num--;
    if(num>0){
      var info = this.data.detail;
      info.show_price = num * this.data.cur_price;
      this.setData({
        num: num,
        detail: info
      })
    } else {
      this.setData({
        num: 1
      })
    }
  },
  to_cart:function(){
    wx.switchTab({
      url: '../shopping-total/index'
    })
  }
})
