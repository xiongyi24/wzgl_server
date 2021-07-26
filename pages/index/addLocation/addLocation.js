// pages/index/addLocation/addLocation.js
var app = getApp()

Page({

  data: {
    locationId: "",
    locationName: ""
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

  findLocationByCode: function(res) {
    var that = this
    wx.scanCode({
      success: function(res) {
        // console.log(res)
        wx.showToast({
          title: "扫码成功",
          icon: "none"
        })
        that.setData({
          locationId: res.result
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

  addLocation: function(res) {
      var that = this
      if (that.data.locationId && that.data.locationName) {
        var data = {
          serial_number: that.data.locationId,
          name: that.data.locationName
        }
        app.func.Req('/api/location/','POST' , function(res){
          console.log(res)
          if (res.code == 201) {
            wx.showToast({
              title: "添加成功",
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 500)
            // console.log(that.data)
          } else if (res.code == 400) {
              wx.showToast({
                title: res.message,
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
    if (options.locationId) {
      var that = this
      that.setData({
        locationId: options.locationId
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