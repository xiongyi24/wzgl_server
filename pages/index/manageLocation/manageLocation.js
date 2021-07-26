// pages/index/manageLocation/manageLocation.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  locationIdInput: function(e) {
    this.setData({
      locationId: e.detail.value
    })
  },

  locationNameInput: function(e) {
    this.setData({
      locationName: e.detail.value
    })
  },

  changeLoction: function(e) {
    var that = this
    wx.showModal({
      title: "修改",
      content: "确定修改？",
      success: function(res) {
        if (res.confirm) {
          var data = {
            serial_number: that.data.locationId,
            name: that.data.locationName,
          }
          app.func.Req('/api/location/'+ that.data.id +'/','PUT' , function(res){
            console.log(res)
            if (res.code == 200) {
              wx.navigateBack({
                delta: 1,
              })
              wx.showToast({
                title: '修改成功',
              })
            } else if (res.code == 403) {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '修改失败',
                icon: 'error'
              })
            }
          }, data)
        }
      }
    })
  },

  deleteLoction: function(e) {
    var that = this
    wx.showModal({
      title: "删除",
      content: "确定删除？",
      success: function(res) {
        if (res.confirm) {
          app.func.Req('/api/location/'+ that.data.id +'/','DELETE' , function(res){
            // console.log(res)
            if (res.code == 204) {
              wx.showToast({
                title: "删除成功",
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 500)
            } else if (res.code == 403) {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'error'
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      locationName: options.name,
      locationId: options.serial_number,
      id: options.id
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