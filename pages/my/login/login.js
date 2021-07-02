// pages/login/login.js
var app = getApp();

Page({

  // 页面的初始数据
  data: {
    userId: '',
    password:''
  },

  // 跳转至注册页
  toRegister: function(){
    wx.navigateTo({
      url: '../register/register',
    });
  },

  // 监听输入
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

  // 登录
  login: function(e){
    var that = this
    var data = {
      username: that.data.userId,
      password: that.data.password
    }
    app.func.baseReq('/api/user/login/','POST' , function(res){
      // console.log(res)
      if (res.code == 200) {
        var token = res.data.token.token
        var username = res.data.user.username
        var name = res.data.user.name
        var status = ''
        if (res.data.user.is_superuser)
          status = "admin"
        else
          status = "user"
        wx.setStorage({
          data: token,
          key: 'token',
          success: function(res) {
            wx.setStorage({
              data: username,
              key: 'userId',
              success: function(res) {
                wx.setStorage({
                  data: that.data.password,
                  key: 'password',
                  success: function(res) {
                    wx.setStorage({
                      data: name,
                      key: 'userName',
                      success: function(res) {
                        wx.setStorage({
                          data: status,
                          key: 'userStatus',
                          success: function(res) {
                            // 跳转至tab页面需要用 switchTab 不能用 navigateTo
                            wx.switchTab({
                              url: '../my/my',
                            });
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        })
      }
    }, data)
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