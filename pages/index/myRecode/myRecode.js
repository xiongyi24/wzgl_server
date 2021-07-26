// pages/index/myRecode/myRecode.js
var app = getApp()

Page({

  data: {
    tabData: [{
      id: 0,
      name: "审批状态"
    }],
    TabCur: 0,
    scrollLeft:0,
    // 真正使用时 examineData 和 registerData 需清空
    examineData: [],
    returnData: []
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    // console.log(this.data.TabCur)
  },

  // 刷新数据
  refreshData: function(data='') {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    if (that.data.TabCur == 0){
      // 直接从缓存里读，防止错误
      wx.getStorage({
        key: 'userId',
        success: function(res) {
          app.func.Req('/api/approve/?username='+res.data ,'GET' , function(res){
            wx.hideLoading()
            // console.log(res)
            if (res["code"] == 200) {
              var datas = res.data
              var data_list = []
              var examineState_color = ['text-orange', 'text-green' ,'text-red']
              var operationState_color = ['text-blue', 'text-mauve']
              for (var data of datas) {
                // console.log(data)
                data_list.push({
                  'approve_id': data.id,
                  'id': data.deviceId,
                  'name': data.deviceName,
                  'username': data.name,
                  'time': data.modified_time.slice(0, 19),
                  'state': [app.globalData.examineState[data.state], examineState_color[data.state]],
                  'operation': [app.globalData.operationState[data.operation], operationState_color[data.operation]],
                  'isShow': data.show 
                })
              }
              // 按时间倒序排序
              data_list.sort(function(a,b){
                return Date.parse(b.time) - Date.parse(a.time);
              });
              that.setData({
                examineData: data_list
              })
            } else {
              wx.showToast({
                icon: "error",
                title: "查询失败",
              })
            }
          }, data)
        },
        fail: function(res) {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '未登录，请前往我的登录',
          })
        }
      })
    } else if (that.data.TabCur == 1){
      // 只有一个页面暂时用不到
      app.func.Req('url','POST' , function(res){
        that.setData({
          registerDate: res
        })
      }, data)
    }
  },

  returnFunc: function(e) {
    var that = this
    // 扫码获取位置
    wx.scanCode({
      success: function(res) {
       var locationId = res.result 
      //  console.log(locationId)
        var data = {
          serial_number: locationId
        }
        // 确认位置
        app.func.Req('/api/location/retrieves/','POST' , function(res){
          console.log(res)
          if (res.code == 200) {
            wx.showModal({
              title: "确定归还？",
              content: "归还地点：" + res.data.name,
              success: function(res) {
                if (res.confirm) {
                  // console.log(e)
                  var data = {
                    serial_number: e.currentTarget.dataset.deviceid,
                    id: e.currentTarget.dataset.approveid,
                    location_number: locationId,
                  }
                  // console.log(data)
                  app.func.Req('/api/device/apply_return/','POST' , function(res){
                    // console.log(res)
                    if (res.code == 200) {
                      // 把数据刷新放到前面，已解决刷新延迟的问题
                      that.refreshData()
                      wx.showToast({
                        title: '归还申请提交成功',
                        icon: 'success',
                      })
                    } else {
                      that.refreshData()
                      wx.showToast({
                        title: res.message,
                        icon: 'none'
                      })
                    }
                  }, data)
                }
              }
            })
          } else if (res.code == 404) {
            wx.showToast({
              title:  '未找到位置编号为'+ locationId +'的位置信息',
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
        wx.showToast({
          title: '扫码失败',
          icon: "error"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshData()
    // 停止下拉刷新，不加的话无法自动回弹
    wx.stopPullDownRefresh()
  },

})