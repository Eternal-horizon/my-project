var SHOP_ID = '1'
var API_URL = 'https://mshop.yunapply.com'

var requestHandler = {
  data: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  }
}

//GET请求
function get(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function post(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  var appInstance = getApp()
  var data = requestHandler.data
  var url = API_URL + requestHandler.url
  var openid = wx.getStorageSync('openid');

  wx.request({
    url: url,
    data: data,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'shop_id=' + SHOP_ID + ';openid=' + openid
    },
    success: function (res) {
      requestHandler.success(res)
    },

  })
}

module.exports = {
  get: get,
  post: post
}