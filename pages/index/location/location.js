// pages/index/location/location.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationData: [],
  },

  // 搜索函数
  searchDevice(e) {
    let key = e.detail.value;
    for (var data of this.data.locationData) {
      let a = key;
      // 按何值搜索
      let b = data.name;
      if (b.search(a) != -1) {
        data.isShow = true
      } else {
        data.isShow = false
      }
    }
    this.setData({
      locationData: this.data.locationData
    })
  },

  // 刷新数据
  refreshData: function(data='') {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    app.func.Req('/api/location/' ,'GET' , function(res){
      wx.hideLoading()
      // console.log(res)
      if (res["code"] == 200) {
        for (var data of res.data) {
          data.isShow = true
        }
        that.setData({
          locationData: res.data
        })
      } else {
        wx.showToast({
          icon: "error",
          title: "查询失败",
        })
      }
    })
  },

  // 修改位置
  manageLocation: function(e) {
    var data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '../manageLocation/manageLocation?serial_number='+data.serial_number+'&name='+data.name+'&id=' + data.id,
    })
  },

  // 添加位置
  addLocation: function(e) {
    var data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '../addLocation/addLocation',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshData()
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
    this.refreshData()
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
    this.refreshData()
    // 停止下拉刷新，不加的话无法自动回弹
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})