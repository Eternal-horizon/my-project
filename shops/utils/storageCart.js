class storageCart {
    constructor() {

    }

    // 显示购物车列表
    show() {
        return wx.getStorageSync('cartList') ? wx.getStorageSync('cartList') : (new Array());
    }

    //加入购物车
    add(gid,goods_id, price, name, image, num, spec,title) {
      
        var ifPush = 0;
        var cartList = wx.getStorageSync('cartList') ? wx.getStorageSync('cartList') : (new Array());
        var length = cartList.length;
        for (var i = 0; i < length; i++) {

          if (cartList[i]['gid'] == gid ) {
                cartList[i].num = parseInt(cartList[i].num) + parseInt(num);
                ifPush = 1;
            }
        }
        if (ifPush == 0) {
            var cart = { gid:gid,goods_id:goods_id,name: name,image: image,num:num,price:price,spec:spec,title:title,checks: true }
            cartList.push(cart);
        }
        wx.setStorageSync('cartList', cartList);
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
        })
    }

    //修改购物车
    save(gid, num, checks) {
        var cartList = wx.getStorageSync('cartList');
        if (num) {
          for (var j = 0; j < cartList.length; j++) {
            if (cartList[j]['gid'] == gid) {
              cartList[j].num = num;
            }
          }
          //  cartList[gid].num = num;
        }
        if (checks) {
            cartList[id].checks = checks;
        }
        wx.setStorageSync('cartList', cartList);
        return cartList;
    }

    //修改购物车
    shopnum() {
      var cartList = wx.getStorageSync('cartList');
      return cartList.length;
    }


    //删除购物车
    delete(gid){
        var cartList = wx.getStorageSync('cartList');
        for (var j = 0; j < cartList.length; j++) {
          if (cartList[j]['gid'] == gid) {
           // delete cartList[j];
            cartList.splice(j);
          }
        }
        wx.setStorageSync('cartList', cartList);
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        return cartList;
        
    }
    //清空缓存数据
    goods_delete(gid) {
      var cartList = wx.getStorageSync('cartList');
      for (var j = 0; j < cartList.length; j++) {
        if (cartList[j]['gid'] == gid) {
          // delete cartList[j];
          cartList.splice(j);
        }
      }
      wx.setStorageSync('cartList', cartList);
    }

    // 购物车统计总价格
    total() {
        var cartList = wx.getStorageSync('cartList') ? wx.getStorageSync('cartList') : (new Array());
        var length = cartList.length;
        var total = 0;
        for (var i = 0; i < length; i++) {
            if (cartList[i].checks) {
              //total += parseFloat(cartList[i].price);
              total += parseFloat(cartList[i].price) * parseFloat(cartList[i].num);
            }
        }
        return total;
    }

    //选择购物车
    select(selected,gid){
        var cartList = wx.getStorageSync('cartList');
        var length = cartList.length;
        if(gid>=0){
          for(var j = 0; j<cartList.length;j++){
            if(cartList[j]['gid']== gid){
              cartList[j].checks = selected;
            }
          }
        }else{
            for(var i = 0; i < length; i++){
                cartList[i].checks = selected;
            }
        }
        wx.setStorageSync('cartList', cartList);
        return cartList;
    }
    
    //判断是否是全选
    selectAll(){
        var cartList = wx.getStorageSync('cartList');
        var length = cartList.length;
        var isAll = true;
        for (var i = 0; i < length; i++) {
            if(!cartList[i].checks){
                isAll = false;
            }
        }
        return isAll;
    }
}
export default storageCart