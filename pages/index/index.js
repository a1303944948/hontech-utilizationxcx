function start(that){
  //选择日期默认选中昨天
  that.data.timeArray = [];
  var timeObject = new Object();
  timeObject.name = '昨天';
  var timeDate = new Date();
  function timeGetDate(num) {
    var timeGetDateS = new Date(timeDate.getTime() - num * 86400000);
    return timeGetDateS.getFullYear() + '-' + (timeGetDateS.getMonth() + 1) + '-' + (timeGetDateS.getDate());
  }
  function timeGetDateDay(num) {
    var timeGetDateS = new Date(timeDate.getTime() - num * 86400000);
    return timeGetDateS.getDay();
  }
  var timeyesterday;
  var timeNum = 0;
  if (timeDate.getHours() < 8) {
    if(timeDate.getHours() == 7){
      if (timeDate.getMinutes() < 40) {
        timeNum = 2;
        timeyesterday = timeGetDate(2);
      } else {
        timeNum = 1;
        timeyesterday = timeGetDate(1);
      }
    }else{
      timeNum = 2;
      timeyesterday = timeGetDate(2);
    }
  } else {
    timeNum = 1;
    timeyesterday = timeGetDate(1);
  }
  timeObject.value = timeyesterday + ',' + timeyesterday;
  console.log(timeObject);
  that.data.timeArray.push(timeObject);
  var timeObject = new Object();
  timeObject.name = '最近七天';
  timeObject.value = timeGetDate(timeNum + 6) + ',' + timeyesterday;
  that.data.timeArray.push(timeObject);
  var timeObject = new Object();
  timeObject.name = '上周';
  timeObject.value = timeGetDate(timeNum + timeGetDateDay(timeNum) + 6) + ',' + timeGetDate(timeNum + timeGetDateDay(timeNum));
  that.data.timeArray.push(timeObject);
  var timeObject = new Object();
  timeObject.name = '最近三十天';
  timeObject.value = timeGetDate(timeNum + 29) + ',' + timeyesterday;
  that.data.timeArray.push(timeObject);
  var timeObject = new Object();
  timeObject.name = '上个月';
  timeObject.value = timeGetDate(timeDate.getDate() + (Number(timeGetDate(timeDate.getDate()).split('-')[2])) - 1) + ',' + timeGetDate(timeDate.getDate());
  that.data.timeArray.push(timeObject);
  var timeObject = new Object();
  timeObject.name = '最近九十天';
  timeObject.value = timeGetDate(timeNum + 89) + ',' + timeyesterday;
  that.data.timeArray.push(timeObject);
  that.data.headTime = that.data.timeArray[0].value,
  that.setData({
    timeArray: that.data.timeArray,
    timeIndexs: that.data.timeArray[0].name,
    timeIndex: that.data.timeArray[0].value,
  })
}

function timeSplit(that,date){
  for(var i = 0; i < date.split(',').length; i++){
    if (i == 0) {
      that.data.headTime = date.split(',')[i].split(' ')[0];
      that.data.headTime = that.data.headTime + ' ~ ';
    }else{
      that.data.headTime = that.data.headTime + date.split(',')[i].split(' ')[0];
    }
  }
  return that.data.headTime;
}

function seach(that){
  if (that.data.headTime.split('~').length != 2) {
    that.data.headTimes = that.data.headTime;
    that.setData({
      headTime: timeSplit(that, that.data.headTime),
      headTimes: that.data.headTimes
    })
  }
  wx.request({
    url: getApp().URL + '/calculateActivation/calculateActivation.json',
    method: 'POST',
    data: {
      companyid: that.data.index,
      devtypecode: that.data.typeIndex,
      paramTime: that.data.timeIndex,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (msg) {
      console.log(msg);
      for (var i = 0; i < msg.data.length; i++) {
        msg.data[i].activation = Number(msg.data[i].activation);
        msg.data[i].cropmobility = Number(msg.data[i].cropmobility);
      }
      if (msg.data.length != 0) {
        msg.data.sort(compare("activation"));
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
      })
      if (msg.data == '') {
        wx.showToast({
          title: '暂无设备记录！',
          icon: 'success',
          success: function () {
            setTimeout(function () {
              wx.hideToast();
            }, 1000)
          },
        })
      } else {
        wx.showToast({
          title: '查询成功！',
          icon: 'success',
          success: function () {
            setTimeout(function () {
              wx.hideToast();
            }, 1000)
          },
        })
      }
    }
  })
}

Page({
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
    timeArr: ['昨天','最近七天','上周','最近三十天','上月','最近九十天'],
    timeArray: [],
    timeIndex: '',
    timeIndexs: '',
    headTime: '',
    headTImes: '',
    meta: [],
  },
  //选择公司下拉框渲染
  bindPickerChange(e){
    var that = this;
    that.setData({
      indexs: that.data.array[e.detail.value].name,
      index: that.data.array[e.detail.value].value,
    })
    seach(that);
  },
  //选择设备类型下拉框渲染
  bindPickerChangeType(e){
    var that = this;
    that.setData({
      typeIndexs: that.data.typeArray[e.detail.value].name,
      typeIndex: that.data.typeArray[e.detail.value].value,
    })
    seach(that);
  },  
  //选择时间下拉框渲染
  bindPickerChangeTime(e){
    var that = this;
    that.data.headTime = that.data.timeArray[e.detail.value].value;
    that.setData({
      timeIndexs: that.data.timeArray[e.detail.value].name,
      timeIndex: that.data.timeArray[e.detail.value].value,
    })
    seach(that);
  },
  //点击时间下拉框时更新时间信息
  bindPickerChangeTimeMe() {
    var that = this;
    start(that);
  },
  //查询事件
  /*indexHeadBtnMe(){
    var that = this;
    if(that.data.headTime.split('~').length != 2){
      that.data.headTimes = that.data.headTime;
      that.setData({
        headTime: timeSplit(that,that.data.headTime),
        headTimes: that.data.headTimes
      })
    }
    wx.request({
      url: getApp().URL + '/calculateActivation/calculateActivation.json',
      method: 'POST',
      data: {
        companyid: that.data.index,
        devtypecode: that.data.typeIndex,
        paramTime: that.data.timeIndex,
      },
      header: {
        'content-type':'application/x-www-form-urlencoded',
      },
      success: function(msg){
        console.log(msg);
        for(var i = 0; i < msg.data.length; i++){
          msg.data[i].activation = Number(msg.data[i].activation);
          msg.data[i].cropmobility = Number(msg.data[i].cropmobility);
        }
        if(msg.data.length != 0){
          msg.data.sort(compare("activation"));
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
  },*/
  //点击跳转到内页事件
  indexBodyListMe(e){
    var that = this;
    wx.navigateTo({
      url: '../index_detail/index_detail?machId=' + e.currentTarget.dataset.value.devcode + '&timeInterval=' + that.data.headTimes + '&rank=' + e.currentTarget.dataset.rank,
    })
  },
  onLoad: function(){
    var that = this;

    start(that);
    that.data.headTimes = that.data.timeArray[0].value,

    //获取设备类型
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
        };
      }
    })
    console.log(that.data.timeIndex);
    wx.request({
      url: getApp().URL + '/calculateActivation/calculateActivation.json',
      method: 'POST',
      data: {
        companyid: '',
        devtypecode: '',
        paramTime: that.data.timeIndex,
      },
      header: {
        'content-type':'application/x-www-form-urlencoded',
      },
      success: function(msg){
        console.log(msg);
        for(var i = 0; i < msg.data.length; i++){
          msg.data[i].activation = Number(msg.data[i].activation);
          msg.data[i].cropmobility = Number(msg.data[i].cropmobility);
        }
        if(msg.data.length != 0){
          msg.data.sort(compare("activation"));
          //json数组排序
          function compare(property) {
            return function (a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value2 - value1;
            }
          }
        }
        console.log(msg.data);
        that.setData({
          meta: msg.data,
        })
      }
    })
    that.setData({
      headTime: timeSplit(that, that.data.headTime),  //顶部数据时间
    })
  }
})
