var network = require("./utils/network.js");
import storageCart from 'utils/storageCart'
App({
  data: {
    cartList: {}
  },

  onLaunch: function () {
    this.getUserinfo();
  },

  //获取用户信息
  getUserinfo: function () {
    var that = this;

    wx.login({//登录
      success: function (loginRes) {
        // console.log(loginRes);
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (getUserInfoRes) {
            that.globalData.user = getUserInfoRes.userInfo
            network.post({
              url: '/Home/User/auth',
              data: { encryptedData: getUserInfoRes.encryptedData, iv: getUserInfoRes.iv, code: loginRes.code },
              success: function (res) {
                wx.setStorageSync('openid', res.data.info.openid)
              }
            })
          }
        })
      }
    })


  },

  onShow: function () {
  },

  onHide: function () {

  },
  globalData: {
    user: null,
    api_url: 'https://mshop.yunapply.com'
  },
storageCart: new storageCart
})



