// pages/index/addManyLocation/addManyLocation.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    deviceList: [],
  },

  main: function() {
    var that = this
    wx.showToast({
      title: '请扫描设备条码',
      icon: 'none'
    })
    wx.scanCode({
      success: function(res) {
        wx.showLoading({
          title: '查询设备信息中',
        })
        var deviceId = res.result
        // 获取所有设备信息
        app.func.Req('/api/device/','GET' , function(res){
          if (res.code == 200) {
            var deviceList = []
            for (var key in res.data) {
              for (var data of res.data[key]) {
                deviceList.push(data)
              }
            }
            var changeData = ''
            for (var data of deviceList) {
              if (deviceId == data.serial_number) {
                var id = data.id
                changeData = {
                  serial_number: data.serial_number,
                  name: data.name,
                  classes: data.classes,
                  comments: data.comments
                }
                break
              }
            }
            if (changeData) {
              wx.hideLoading({
                success: (res) => {wx.showToast({
                  title: '请扫描位置条码',
                  icon: 'none'
                })
                wx.scanCode({
                  success: function(res) {
                    wx.showLoading({
                      title: '查询位置信息中',
                    })
                    var locationId = res.result
                    var data = {
                      serial_number: locationId
                     } 
                     app.func.Req('/api/location/retrieves/','POST' , function(res){
                      if (res.code == 200) {
                        changeData.location = res.data.name
                        wx.hideLoading({
                          success: (res) => {
                            wx.showModal({
                              title: "修改",
                              content: "设备id："+changeData.serial_number+"；"+"设备名称："+changeData.name+"；位置："+changeData.location+"；确定修改？",
                              success: function(res) {
                                if (res.confirm) {
                                  // console.log(changeData)
                                  // console.log('/api/device/' + id + '/')
                                  app.func.Req('/api/device/' + id + '/','PUT' , function(res){
                                    // console.log(res)
                                    if (res.code == 200) {
                                      wx.showToast({
                                        title: '修改成功',
                                        duration: 2000,
                                        success: (res) => {
                                          setTimeout(function () {
                                            that.main()
                                          }, 2000)
                                        }
                                      })
                                      // console.log(that.data)
                                    } else if (res.code == 403) {
                                      wx.navigateBack({
                                        delta: 1,
                                      })
                                      wx.showToast({
                                        title: res.message,
                                        icon: 'none'
                                      })
                                    } else {
                                      wx.navigateBack({
                                        delta: 1,
                                      })
                                      wx.showToast({
                                        title: '修改失败',
                                        icon: 'error',
                                        duration: 2000
                                      })
                                    }
                                  }, changeData)
                                }
                              }
                            })},
                        })
                      } else if (res.code == 400 && res.message == '位置不存在') {
                        wx.showToast({
                          title: '未找到位置编号为'+ locationId +'的位置信息',
                          icon: 'none',
                          duration: 2000
                        })
                      } else {
                        wx.showToast({
                          title: '扫码错误：' + res.message,
                          icon: 'none'
                        })
                      }
                     }, data)
                  },
                  fail: function(res) {
                    wx.navigateBack({
                      delta: 1,
                      success: function(res) {
                        wx.showToast({
                          title: '扫码失败',
                          icon: 'error',
                        })
                        that.setData({
                          flag: true
                        })
                      }
                    })
                  }
                })},
              })
            } else {
              wx.navigateBack({
                delta: 1,
                success: function(res) {
                  wx.showToast({
                    title: '未找到编号为'+res.result+'的设备',
                    icon: 'none',
                  })
                  that.setData({
                    flag: true
                  })
                }
              })
            }
          } else {
            wx.navigateBack({
              delta: 1,
              success: function(res) {
                wx.showToast({
                  title: '获取设备信息列表失败',
                  icon: 'none',
                })
                that.setData({
                  flag: true
                })
              }
            })
          }
        })
        
      },
      fail: function(res) {
        wx.navigateBack({
          delta: 1,
          success: function(res) {
            wx.showToast({
              title: '扫码失败',
              icon: 'error',
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
      this.main()
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