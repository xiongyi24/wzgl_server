// pages/index/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [{
      icon: 'send',
      color: 'red',
      name: '添加设备',
      func: 'addDevice',
    }, {
      icon: 'ticket',
      color: 'blue',
      name: '批量修改位置',
      func: 'addManyLocation',
    }, {
      icon: 'location',
      color: 'yellow',
      name: '管理位置',
      func: 'location',
    }],
  },

  // 跳转至添加设备
  addDevice: function(res) {
    wx.navigateTo({
      url: '../addDevice/addDevice',
    });
  },

  // 跳转至位置管理
  location: function(res) {
    wx.navigateTo({
      url: '../location/location',
    });
  },

  // 跳转至位置管理
  addManyLocation: function(res) {
    wx.navigateTo({
      url: '../addManyLocation/addManyLocation',
    });
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