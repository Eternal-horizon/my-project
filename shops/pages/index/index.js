var network = require("../../utils/network.js")
var app = getApp()
Page({
  data: {
    scrollTop: 0,
    focus: true,
    banner: '',
    theme:'',
    show:true,
    show_class:false,
  },
  search: function () {
    wx.navigateTo({
      url: '../goods-search/index'
    })
  },
  onShow: function () {
    var that = this;
    network.post({
      url: '/Home/Banner/index',
      data: {},
      success: function (res) {
        // console.log(res);
        that.setData({
          banner: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
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
    network.post({
      url: '/Home/Theme/index',
      data: {},
      success: function (res) {
        that.setData({
          theme: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })

    network.post({
      url: '/Home/Classify/index',
      data: {},
      success: function (res) {
        // console.log(res);
        // console.log("class");
        that.setData({
          classify: res.data.info.list,
        })
      }
    })
    network.post({
      url: '/Home/Goods/index',
      data: {},
      success: function (res) {
        // console.log(res);
        that.setData({
          goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
  },
  changeAll:function(){
    var that = this;
    that.setData({
      show:true,
      show_class:false
    })
    network.post({
      url: '/Home/Goods/index',
      data: {},
      success: function (res) {
        // console.log(res);
        that.setData({
          goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    })
  },
  changeClassify:function(e){
    // console.log(e);
    var that = this;
    var id= e.currentTarget.dataset.id;
    that.setData({
      show:false,
      show_class: true,
      'currentItem': id
    })
     network.post({
      url: '/Home/Goods/classify_goods',
      data: {classify_id:id},
      success: function (res) {
        // console.log(res);
        that.setData({
          goods: res.data.info.list,
          api_url: app.globalData.api_url
        })
      }
    }) 

  },
  //滚动监听
  scroll: function (e) {
    var scrollTop = e.detail.scrollTop;
    this.setData({
      scrollTop: scrollTop
    })
  }
})