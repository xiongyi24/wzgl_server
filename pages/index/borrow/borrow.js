// pages/index//borrow/borrow.js
var app = getApp()

Page({

  data: {
    deviceId: "",
    deviceInfo: "",
  },

  // 监听输入
  deviceIdInput: function(e) {
    this.setData({
      deviceId: e.detail.value
    })
  },

  // 通过 id 查找设备
  findDeviceById: function(res) {
    var that = this
    if (that.data.deviceId != '') {
      var data = {
        serial_number: that.data.deviceId
      }
      wx.showLoading({
        title: '加载中',
      })
      app.func.Req('/api/device/get_all/','POST' , function(res){
        console.log(res)
        wx.hideLoading()
        if (res.code == 200) {
          var zt_color = ['text-green', 'text-orange', 'text-red']
          data = res.data.device
          that.setData({
            "deviceInfo": {
              id: data.serial_number,
              name: data.name,
              zl: data.classes,
              wz: data.location,
              zt: [app.globalData.deviceState[data.state], zt_color[data.state]],
              bz: data.comments?data.comments:'无',
            }
          })
          // console.log(that.data.deviceInfo.zt)
        } else if(res.code == 400){
          wx.showToast({
            icon: 'none',
            title: res.message,
          })
        } else {
          wx.showToast({
            icon: "error",
            title: "查询失败",
          })
        }
      }, data)
    } else {
      wx.showToast({
        icon: 'none',
        title: '设备编号不能为空哟',
      })
    }
    
  },

  borrowRecord: function(e) {
    var that = this
    // 注意搭配 wx.hideLoading()
    wx.showLoading({
      title: '加载中',
    })
    // 首先清空，防止"残影"
    that.setData({
      "borrowRecord": []
    })
    var data = {
      serial_number: e.currentTarget.dataset.id
    }
    app.func.Req('/api/device/get_all/','POST' , function(res){
      wx.hideLoading()
      // console.log(res)
      if (res.code == 200) {
        var recordsData = res.data.records
        var device_name = res.data.device.name
        var operation_list = []
        if (recordsData.length != 0) {
          // 按时间倒序排序
          recordsData.sort(function(a,b){
            return Date.parse(b.created_time) - Date.parse(a.created_time);
          });
          for (var data of recordsData) {
            operation_list.push(data.name + " 于 " + data.created_time.slice(0,19) + " " + app.globalData.operationState[data.operation])
          }
        } else {
          operation_list = ['暂无记录']
        }
        that.setData({
          "borrowRecord": [device_name, operation_list]
        })
        that.showModal()
      } else if(res.code == 400){
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      } else {
        wx.showToast({
          icon: "error",
          title: "查询失败",
        })
      }
    }, data)
  },

  showModal(e) {
    this.setData({
      modalName: 'Modal'
    })
    // console.log(this.data.borrowRecord)
  },

  hideModal_recode(e) {
    this.setData({
      modalName: null
    })
  },

  // 隐藏模态框
  hideModal: function(res) {
    this.setData({
      deviceInfo: ""
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
        that.findDeviceById(res)
      },
      fail: function(res) {
        wx.showToast({
          title: "扫码失败",
          icon: "error"
        })
      }
    })
  },

  borrowDevice: function(e) {
    var that = this
    var data = {
      serial_number:  e.currentTarget.dataset.id
    }
    app.func.Req('/api/device/apply_borrow/','POST' , function(res){
      console.log(res)
      if (res.code == 200) {
        data = res.data.device
        wx.showToast({
          title: res.data,
        })
        that.hideModal()
      } else if (res.code == 403) {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      } else {
        wx.showToast({
          title: "提交审核失败",
        })
      }
    }, data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(options)
    if (options.deviceId) {
      var that = this
      that.setData({
        deviceId: options.deviceId
      })
      that.findDeviceById()
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