//app.js

// 引入模块。返回模块通过 module.exports 或 exports 暴露的接口
var util = require('utils/util.js') 

// 每个小程序都 必须 在 app.js 中调用 App 方法注册小程序实例
App({

  // 小程序初始化完成时触发
  onLaunch: function() {

    var that = this;

    Date.prototype.Format = function (fmt) { //author: meizz
      var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) 
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }),

    // 获取用户信息
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })


    /** 
      使用自定义导航栏
      1. App.js 获得系统信息
      2. App.json 配置取消系统导航栏,并全局引入组件
      3. page.wxml 页面可以直接调用了
    **/
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    
  },

  // 开发者可以在调用App()时
  // 添加任意的函数或数据变量到 Object 参数中，用 this 可以访问
  // app.func

  globalData: {
    // 以下是状态码
    deviceState: ["未借出", "借用审核中", "已借出"],
    operationState: ["借出", "归还"],
    examineState: ["待审核", "审核通过", "审核拒绝"]
  },

  func: { //这里配置我们需要的方法
    Req: util.Req,
    formatTime: util.formatTime,
    baseReq: util.baseReq,
  }, 

})