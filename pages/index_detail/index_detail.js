// pages/index_detail/index_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeInterval: '',
    meta: [],
    dateArr: [],
    sevenData: [],
    rank: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    console.log(options);
    var that = this;
    // that.setData({
    //   meta: getApp().rankViewObj,
    // })
    // function timeSplit(that,date){
    //   for(var i = 0; i < date.split(',').length; i++){
    //     if (i == 0) {
    //       that.data.headTime = date.split(',')[i].split(' ')[0];
    //       that.data.headTime = that.data.headTime + ' ~ ';
    //     }else{
    //       that.data.headTime = that.data.headTime + date.split(',')[i].split(' ')[0];
    //     }
    //   }
    //   return that.data.headTime;
    // }
    // //将稼动率换算为数字
    // for(var i = 0; i < that.data.meta.lastSevenDays.length; i++){
    //   that.data.meta.lastSevenDays[i].text = parseInt(that.data.meta.lastSevenDays[i].text);
    //   that.data.meta.lastSevenDays[i].normal = parseInt(that.data.meta.lastSevenDays[i].normal);
    // }
    // that.setData({
    //   timeInterval: timeSplit(that,that.data.timeInterval),
    //   meta: that.data.meta,
    // })
    // console.log(that.data.meta);

    var timeDate = new Date();
    function timeGetDate(num) {
      var timeGetDateS = new Date(timeDate.getTime() - num * 86400000);
      return timeGetDateS.getFullYear() + '-' + (timeGetDateS.getMonth() + 1) + '-' + (timeGetDateS.getDate());
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
    var startTimetext = timeGetDate(timeNum + 6);
    var endTimetext = timeyesterday;
    timetext = startTimetext + ',' + endTimetext;

    wx.request({
      url: getApp().URL + '/calculateActivation/homepageDetails.json',
      method: 'POST',
      data: {
        devcode: options.machId,
        paramTime: options.timeInterval,
        paramTimes: timetext,
      },
      header: {
        'content-type':'application/x-www-form-urlencoded',
      },
      success: function(msg){
        console.log(msg);
        //处理后台传回时间多余字符
        that.data.meta = msg.data[0];
        that.data.rank = options.rank;
        var metaArray = [];
        for(var i = 0; i < JSON.parse(that.data.meta.dateArr).length; i++){
          if(JSON.parse(that.data.meta.dateArr)[i].startTime != "" || JSON.parse(that.data.meta.dateArr)[i].endTime != ""){
            var metaObject = new Object();
            metaObject.name = JSON.parse(that.data.meta.dateArr)[i].name;
            metaObject.total = JSON.parse(that.data.meta.dateArr)[i].total;
            metaObject.text = Number(JSON.parse(that.data.meta.dateArr)[i].text);
            metaObject.startTime = JSON.parse(that.data.meta.dateArr)[i].startTime.split(':')[0] + ':' + JSON.parse(that.data.meta.dateArr)[i].startTime.split(':')[1];
            metaObject.endTime = JSON.parse(that.data.meta.dateArr)[i].endTime.split(':')[0] + ':' + JSON.parse(that.data.meta.dateArr)[i].endTime.split(':')[1];
            metaArray.push(metaObject);
          }
        }
        that.data.meta.dateArr = JSON.stringify(metaArray);

        //改造后台传回日期
        that.data.sevenData = JSON.parse(msg.data[0].sevenData);
        for (var i = 0; i < that.data.sevenData.length; i++){
          that.data.sevenData[i].date = JSON.parse(msg.data[0].sevenData)[i].date.split('-')[1] + '/' + JSON.parse(msg.data[0].sevenData)[i].date.split('-')[2];
          that.data.sevenData[i].text = Number(that.data.sevenData[i].text);
          that.data.sevenData[i].normal = Number(that.data.sevenData[i].normal);
        }
        console.log(options);
        that.setData({
          meta: that.data.meta,
          dateArr: JSON.parse(msg.data[0].dateArr),
          sevenData: that.data.sevenData,
          rank: options.rank,
          timeInterval: options.timeInterval,
        });
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