// pages/scan/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [{
      icon: 'same',
      color: 'red',
      name: '查找/借出设备',
      func: 'findDevice',
      isShow: true
    }, {
      icon: 'add',
      color: 'yellow',
      name: '添加设备',
      func: 'addDevice',
      isShow: false
    }],
    deviceId: '',
    flag: true
  },

  findDevice: function(e) {
    // console.log('/pages/index/borrow/borrow?deviceId=' + e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/index/borrow/borrow?deviceId=' + e.currentTarget.dataset.id,
    })
  },

  addDevice: function(e) {
    wx.navigateTo({
      url: '/pages/index/addDevice/addDevice?deviceId=' + e.currentTarget.dataset.id,
    })
  },

  scan: function(res) {
    var that = this
    wx.scanCode({
      success: function(res) {
        // console.log(res)
        that.setData({
          deviceId: res.result
        })
      },
      fail: function(res) {
        wx.showToast({
          title: "扫码失败",
          icon: "error"
        })
      }
    })
    that.setData({
      flag: false
    })
  },

  scanAgain: function(e) {
    this.setData({
      deviceId: '',
      flag: true
    })
    this.onLoad()
  },

  // 监听输入
  deviceIdInput: function(e) {
    this.setData({
      deviceId: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 先判断有没有登陆，顺便获取权限
    var that = this
    wx.getStorage({
      key: 'userStatus',
      success: function(res) {
        that.setData({
          userStatus: res.data
        })
        if (res.data == 'admin') {
          for (var data of that.data.iconList) {
            if (data.name == '添加设备') {
              data.isShow = true
            }
          }
        } else {
          for (var data of that.data.iconList) {
            if (data.name == '添加设备') {
              data.isShow = false
            }
          }
        }
        that.setData({
          iconList: that.data.iconList
        })
        if (that.data.flag) {
          that.scan()
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '尚未登录，请前往“我的”登录',
          icon: 'none',
          duration: 2000
        })
        for (var data of that.data.iconList) {
          if (data.name == '添加设备') {
            data.isShow = false
          }
        }
        that.setData({
          iconList: that.data.iconList
        })
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
    this.onLoad()
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