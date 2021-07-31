// pages/index/addDevice/addDevice.js
var app = getApp()

Page({

  data: {
    deviceId: "",
    deviceName: "",
    // 注意规定"暂无位置"的id
    deviceLocation: "默认位置",
    deviceLocationId: "00000",
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

  findDeviceByCode: function(res) {
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
  },

  findLocationByCode: function(res) {
    var that = this
    wx.scanCode({
      success: function(res) {
        // console.log(res)
        that.setData({
          deviceLocation: res.result
        })
      },
      fail: function(res) {
        wx.showToast({
          title: "扫码失败",
          icon: "error"
        })
      }
    })
  },

  addDevice: function(res) {
      var that = this
      if (that.data.deviceId && that.data.deviceName && that.data.deviceLocation && that.data.deviceType) {
        var data = {
          serial_number: that.data.deviceId,
          name: that.data.deviceName,
          location: that.data.deviceLocation,
          classes: that.data.deviceType,
          comments: that.data.deviceComments
        }
        // console.log(data)
        app.func.Req('/api/device/','POST' , function(res){
          // console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: "添加成功",
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
            // console.log(that.data)
          } else if (res.code == 400) {
              wx.showToast({
                title: String(res.message),
                icon: "none"
              })
          } else {
            wx.showToast({
              title: "添加失败",
              icon: "error"
            })
          }
        }, data)
      } else {
        wx.showToast({
          title: "有必填项未填写哟",
          icon: "none"
        })
      }
      
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.deviceId) {
      var that = this
      that.setData({
        deviceId: options.deviceId
      })
    }
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