// pages/register/register.js
var app = getApp();

Page({

  // 页面的初始数据
  data: {
    name: '',
    userId: '',
    password:''
  },

  // 监听输入
  nameInput: function(e){
    this.setData({
      name: e.detail.value
    })
  },

  stuIdInput: function(e){
    this.setData({
      userId: e.detail.value
    })
  },

  passwordInput: function(e){
    this.setData({
      password: e.detail.value
    })
  },

  // 注册
  register: function(e){
    var that = this
    var data = {
      name: that.data.name,
      username: that.data.userId,
      password: that.data.password
    }
    if (data.name && data.username && data.password) {
      app.func.baseReq('/api/register/register/','POST' , function(res){
        console.log(res)
        if (res.code == 200){
          wx.showToast({
            title: res.data,
            icon: "none"
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data,
            icon: "none"
          })
        }
      }, data)
    } else {
      wx.showToast({
        title: '一项都不能少哦',
        icon: "none"
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.userInfo.avatarUrl
    })
  }
})