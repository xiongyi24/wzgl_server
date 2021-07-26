// pages/scan/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true
  },

  scan: function(res) {
    var that = this
    wx.scanCode({
      success: function(res) {
        // console.log(res)
        wx.showLoading({
          title: '加载中',
        })
        // 跳转至查找页面
        wx.navigateTo({
          url: '/pages/index/borrow/borrow?deviceId=' + res.result,
          success: function(res) {
            // 跳转成功后允许扫码页面触发弹出
            that.setData({
              flag: true
            })
            wx.hideLoading()
          }
        })
      },
      fail: function(res) {
        // console.log(res)
        var errorMsg = "扫码失败"
        if (res.errMsg == 'scanCode:fail cancel')
          errorMsg = "取消扫码"
        wx.switchTab({
          url: '/pages/index/index/index',
          success: function(res) {
            wx.showToast({
              title: errorMsg,
              icon: "error"
            })
            that.setData({
              flag: true
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (this.data.flag) {
      // 首先不允许扫码页面触发弹出
      this.setData({
        flag: false
      })
      this.scan()
    }
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