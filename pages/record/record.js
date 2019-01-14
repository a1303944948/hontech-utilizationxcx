// pages/record/record.js
function seach(that){
  wx.request({
    url: getApp().URL + '/calculateActivation/calculateRecord.json',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: {
      companyid: that.data.index,
      devtypecode: that.data.typeIndex,
      paramTime: that.data.paramTime,
    },
    success: function (msg) {
      for(var i = 0; i < msg.data.length; i++){
        msg.data[i].total = Number(msg.data[i].total);
      }
      if(msg.data.length != 0){
        msg.data.sort(compare("total"));
        //json数组排序
        function compare(property) {
          return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
          }
        }
      }
      that.setData({
        meta: msg.data,
        paramTime: that.data.paramTime,
      })
      if(msg.data == ''){
        wx.showToast({
          title: '暂无设备记录！',
          icon: 'success',
          success: function(){
            setTimeout(function(){
              wx.hideToast();
            },1000)
          },
        })
      }else{
        wx.showToast({
          title: '查询成功！',
          icon: 'success',
          success: function(){
            setTimeout(function(){
              wx.hideToast();
            },1000)
          },
        })
      }
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['公司...','浙江嘉丰','东莞嘉丰'],
    array: [{name:'公司...',value:''},
            {name:'浙江嘉丰',value:'zjjf'},
            {name:'东莞嘉丰',value:'dgjf'}],
    index: '',
    indexs: '公司...',
    typeArr: [],
    typeArray: [],
    typeIndex: '',
    typeIndexs: '设备类型...',
    paramTime: '',
    meta: [],
  },
  //选择公司下拉框渲染
  bindPickerChange(e) {
    var that = this;
    that.setData({
      indexs: that.data.array[e.detail.value].name,
      index: that.data.array[e.detail.value].value,
    })
    seach(that)
  },
  //选择设备类型下拉框渲染
  bindPickerChangeType(e) {
    var that = this;
    console.log(that.data.typeArray[e.detail.value].name);
    console.log(that.data.typeArray[e.detail.value].value);
    that.setData({
      typeIndexs: that.data.typeArray[e.detail.value].name,
      typeIndex: that.data.typeArray[e.detail.value].value,
    })
    seach(that)
  },
  indexHeadBtnMe(){
    var that = this;
    wx.request({
      url: getApp().URL + '/calculateActivation/calculateRecord.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        companyid: that.data.index,
        devtypecode: that.data.typeIndex,
        paramTime: that.data.paramTime,
      },
      success: function (msg) {
        for(var i = 0; i < msg.data.length; i++){
          msg.data[i].total = Number(msg.data[i].total);
        }
        if(msg.data.length != 0){
          msg.data.sort(compare("total"));
          //json数组排序
          function compare(property) {
            return function (a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value2 - value1;
            }
          }
        }
        that.setData({
          meta: msg.data,
          paramTime: that.data.paramTime,
        })
        if(msg.data == ''){
          wx.showToast({
            title: '暂无设备记录！',
            icon: 'success',
            success: function(){
              setTimeout(function(){
                wx.hideToast();
              },1000)
            },
          })
        }else{
          wx.showToast({
            title: '刷新成功！',
            icon: 'success',
            success: function(){
              setTimeout(function(){
                wx.hideToast();
              },1000)
            },
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //获取设备类型
    function start(){
      wx.request({
        url: getApp().URL + '/activationType/getAllActivationType.json',
        method: 'POST',
        success: function(msg){
          if(JSON.stringify(msg.data) != '{}'){
            that.data.typeArr.push('设备类型...');
            var typeObject = new Object();
            typeObject.name = '设备类型...';
            typeObject.value = "";
            that.data.typeArray.push(typeObject);
            for(var i = 0; i < msg.data.result.length; i++){
              that.data.typeArr.push(msg.data.result[i].devtypename);
              var typeObject = new Object();
              typeObject.name = msg.data.result[i].devtypename;
              typeObject.value = msg.data.result[i].devtypecode;
              that.data.typeArray.push(typeObject);
            }
            that.setData({
              typeArr: that.data.typeArr,
              typeArray: that.data.typeArray,
            })
          }
        }
      })
      var date = new Date();
      if(date.getHours() < 8){
        if(date.getHours() == 7){
          if(date.getMinutes() > 40){
            that.data.paramTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ',' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); 
          }else{
            that.data.paramTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()-1) + ',' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()-1);
          }
        }else{
          that.data.paramTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()-1) + ',' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()-1); 
        }
      }else{
        that.data.paramTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + ',' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
      }
      
      console.log(that.data.paramTime);
      wx.request({
        url: getApp().URL + '/calculateActivation/calculateRecord.json',
        method: 'POST',
        header: {
          'content-type':'application/x-www-form-urlencoded',
        },
        data: {
          companyid: '',
          devtypecode: '',
          paramTime: that.data.paramTime,
        },
        success: function(msg){
          console.log(msg);
          for(var i = 0; i < msg.data.length; i++){
            msg.data[i].total = Number(msg.data[i].total);
          }
          if(msg.data.length != 0){
            msg.data.sort(compare("total"));
            //json数组排序
            function compare(property) {
              return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
              }
            }
          }
          that.setData({
            meta: msg.data,
            paramTime: that.data.paramTime,
          })
        }
      })
    }
    start();

    function clicks(){
      wx.request({
        url: getApp().URL + '/calculateActivation/calculateRecord.json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          companyid: that.data.index,
          devtypecode: that.data.typeIndex,
          paramTime: that.data.paramTime,
        },
        success: function (msg) {
          for(var i = 0; i < msg.data.length; i++){
            msg.data[i].total = Number(msg.data[i].total);
          }
          if(msg.data.length != 0){
            msg.data.sort(compare("total"));
            //json数组排序
            function compare(property) {
              return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
              }
            }
          }
          that.setData({
            meta: msg.data,
            paramTime: that.data.paramTime,
          })
        }
      })
    }
    setInterval(function(){
      clicks();
    },600000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})