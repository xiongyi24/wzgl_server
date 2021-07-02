// pages/index/changeDevice/changeDevice.js
var app = getApp()

Page({

  data: {
    deviceId: "",
    deviceName: "",
    deviceLocation: "",
    deviceType: "",
    deviceComments: ""
},

  deviceIdInput: function(e) {
    this.setData({
      deviceId: e.detail.value
    })
  },

  deviceNameInput: function(e) {
    this.setData({
      deviceName: e.detail.value
    })
  },

  deviceLocationInput: function(e) {
    this.setData({
      deviceLocation: e.detail.value
    })
  },

  deviceTypeInput: function(e) {
    this.setData({
      deviceType: e.detail.value
    })
  },

  deviceCommentsInput: function(e) {
    this.setData({
      deviceComments: e.detail.value
    })
  },

  changeDevice: function(e) {
    var that = this
    wx.showModal({
      title: "修改",
      content: "确定修改？",
      success: function(res) {
        if (res.confirm) {
          var data = {
            serial_number: that.data.deviceId,
            name: that.data.deviceName,
            location: that.data.deviceLocation,
            classes: that.data.deviceType,
            comments: that.data.deviceComments
          }
          app.func.Req('/api/device/'+ that.data.id +'/','PUT' , function(res){
            // console.log('/api/device/'+ that.data.id +'/')
            // console.log(res)
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

  deleteDevice: function(e) {
    var that = this
    var deviceId = e.currentTarget.dataset.id
    wx.showModal({
      title: "删除",
      content: "确定删除？",
      success: function(res) {
        if (res.confirm) {
          app.func.Req('/api/device/'+ that.data.id +'/','DELETE' , function(res){
            //console.log(res)
            if (res.code == 204) {
              wx.navigateBack({
                delta: 1,
              })
              wx.showToast({
                title: '删除成功',
              })
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
    var data = {
      serial_number: options.deviceId
    }
    app.func.Req('/api/device/get_all/','POST' , function(res){
      // console.log(res)
      if (res.code == 200) {
        data = res.data.device
        that.setData({
          id: data.id,
          deviceId: data.serial_number,
          deviceName: data.name,
          deviceLocation: data.location,
          deviceType: data.classes,
          deviceComments: data.comments
        })
      } else if (res.code == 403) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: "查询失败",
        })
      }
    }, data)
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