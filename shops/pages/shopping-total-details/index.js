var network = require("../../utils/network.js")
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()
Page({
  data: {
    num: 1,
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
    this.setData({
      num: num
    })
  },
  reduce: function () {
    var num = this.data.num;
    num--;
    if (num > 0) {
      this.setData({
        num: num
      })
    } else {
      this.setData({
        num: 1
      })
    }
  }  
})
