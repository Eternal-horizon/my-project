//获取应用实例
var network = require("../../utils/network.js")
var tcity = require("../../utils/citys.js");

var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    term: true,
    is_show: false,
    show_text: '',
    id: '',
    detail: ''
  },
  setDefault: function () {
    this.setData({
      term: !this.data.term
    })
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      console.log('province no');
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function (options) {
    console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');
    //接收参数
    if (options.id > 0) {
      network.post({
        url: '/Home/Address/edit',
        data: { id: options.id },
        success: function (res) {
          if (res.data.status == 1) {
            that.setData({
              detail: res.data.info.detail
            })
            if (res.data.info.detail.is_default == 1) {
              that.setData({
                term: !that.data.term
              })
            }
          }
        }
      })
      that.setData({
        id: options.id
      })
    }

  },

  //form表单提交
  formSubmit: function (e) {
    var data = e.detail.value;
    var that = this;
    if (!data.receiver) {
      that.toast('收货人不能为空');
      return false;
    }
    if (!data.mobile) {
      that.toast('手机号不能为空');
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test(data.mobile)) {
      that.toast('手机号格式有误');
      return false;
    }
    if (!data.address_all) {
      that.toast('请选择地址');
      return false;
    }
    if (!data.address) {
      that.toast('请填写地址');
      return false;
    }
    if (data.id > 0) {
      var url = '/Home/Address/save';
    } else {
      var url = '/Home/Address/insert';
    }

    network.post({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          that.toast(res.data.info);
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/manage-address/index'
            })
          }, 1500);
        } else {
          that.toast(res.data.info);
        }
      }
    })
  },
  //提示框自定义
  toast: function (text) {
    var that = this;
    this.setData({
      is_show: true,
      show_text: text
    })
    setTimeout(function () {
      that.setData({
        is_show: false
      })
    }, 1500);
  }
})