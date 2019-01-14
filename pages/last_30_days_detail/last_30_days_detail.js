// pages/last_30_days_detail/last_30_days_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meta: [],
    last30Array: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var timeDate = new Date();
    function timeGetDate(num) {
      var timeGetDateS = new Date(timeDate.getTime() - num * 86400000);
      return timeGetDateS.getFullYear() + '-' + (timeGetDateS.getMonth() + 1) + '-' + (timeGetDateS.getDate());
    }
    function timeGetDate(num) {
      var timeGetDateS = new Date(timeDate.getTime() - num * 86400000);
      return timeGetDateS.getFullYear() + '-' + (timeGetDateS.getMonth() + 1) + '-' + (timeGetDateS.getDate());
    }
    //获取最近三十天数据
    function timeDateArray(num,array){
      for(var i = 0; i < 30; i++){
        var timeObject = new Object();
        var timeGetDateS = new Date(timeDate.getTime() - (i + num) * 86400000);
        var timeNian = timeGetDateS.getFullYear();
        var timeYue = timeGetDateS.getMonth() + 1 + '';
        var timeRi = timeGetDateS.getDate() + '';
        if(timeYue.length < 2){
          timeYue = '0' + timeYue;
        }
        if (timeRi.length < 2) {
          timeRi = '0' + timeRi;
        }
        if(i == 0){
          for(var j = 0; j < timeGetDateS.getDay(); j++){
            var timeObjects = new Object();
            timeObjects.value = '';
            timeObjects.text = '';
            timeObjects.day = '';
            timeObjects.month = '';
            timeObjects.date = '';
            that.data.last30Array.push(timeObjects);
          }
        }
        for(var j = 0; j < array.length; j++){
          if(array[j].text == timeNian + '-' + timeYue + '-' + timeRi){
            timeObject.value = Number(array[j].value);
          };
        }
        if(timeObject.value == undefined || timeObject.value == null || timeObject.value == ""){
          timeObject.value = 0;
        };
        timeObject.text = timeNian + '-' + timeYue + '-' + timeRi;
        timeObject.day = timeGetDateS.getDay();
        timeObject.month = timeYue;
        timeObject.date = timeRi;
        that.data.last30Array.push(timeObject);
      }
      that.setData({
        last30Array: that.data.last30Array,
      })
    }
    var timeyesterday;
    var timeNum = 0;
    if (timeDate.getHours() < 8) {
      if (timeDate.getHours() == 7) {
        if(timeDate.getMinutes() < 40) {
          timeNum = 2;
          timeyesterday = timeGetDate(2);
        }else{
          timeNum = 1;
          timeyesterday = timeGetDate(1);
        }
      }else{
        timeNum = 2;
        timeyesterday = timeGetDate(2);
      }
    }else{
      timeNum = 1;
      timeyesterday = timeGetDate(1);
    }
    var timetext;
    var startTimetext = timeGetDate(timeNum + 29);
    var endTimetext = timeyesterday;
    timetext = startTimetext + ',' + endTimetext;
    that.data.paramTime = timetext;
    console.log(options.machId);
    console.log(that.data.paramTime);
    wx.request({
      url: getApp().URL + '/calculateActivation/calculateDetails.json',
      method: 'POST',
      data: {
        devcode: options.machId,
        paramTime: that.data.paramTime,
      },
      header: {
        'content-type':'application/x-www-form-urlencoded',
      },
      success: function(msg){
        console.log(msg);
        that.setData({
          meta: msg.data[0],
          paramTime: that.data.paramTime,
        })
        timeDateArray(timeNum, JSON.parse(that.data.meta.dateArr));
      }
    })
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