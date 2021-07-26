// pages/index/examine/examine.js
var app = getApp()

Page({

  data: {
    tabData: [{
      id: 0,
      name: "设备借出审批"
    }, {
      id: 1,
      name: "设备归还审批"
    }, {
      id: 2,
      name: "用户注册审批"
    }],
    TabCur: 0,
    scrollLeft:0,
    // 真正使用时 examineData 和 registerData 需清空
    examineData: [],
    returnData: [],
    registerData: [],
    userStatus: ''
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    this.refreshData()
  },

  // 刷新数据
  refreshData: function(data='') {
    var that = this
    wx.getStorage({
      key: 'userStatus',
      success: function(res){
        if(res.data == 'admin') {
          wx.showLoading({
            title: '加载中',
          })
          // 设备借出审批查询
          if (that.data.TabCur == 0){
            app.func.Req('/api/approve?state=0&operation=0','GET' , function(res){
              // console.log(res)
              wx.hideLoading()
              if (res["code"] == 200) {
                var datas = res.data
                var data_list = []
                for (var data of datas) {
                  data_list.push({
                    'approve_id': data.id,
                    'id': data.deviceId,
                    'name': data.deviceName,
                    'username': data.name,
                    'time': data.created_time.slice(0, 19),
                    'show': data.show
                  })
                }
                // 按时间倒序排序
                data_list.sort(function(a,b){
                  return Date.parse(b.time) - Date.parse(a.time);
                });
                that.setData({
                  examineData: data_list
                })
                // console.log(that.data)
              } else {
                wx.showToast({
                  icon: "error",
                  title: "查询失败",
                })
              }
            }, data)
          // 设备归还审批查询
          } else if (that.data.TabCur == 1){
            wx.hideLoading()
            app.func.Req('/api/approve?state=0&operation=1','GET' , function(res){
              console.log(res)
              if (res["code"] == 200) {
                var datas = res.data
                var data_list = []
                for (var data of datas) {
                  data_list.push({
                    'approve_id': data.id,
                    'id': data.deviceId,
                    'name': data.deviceName,
                    'username': data.name,
                    'location': data.location,
                    'time': data.created_time.slice(0, 19),
                    'show': data.show
                  })
                }
                console
                // 按时间倒序排序查询
                data_list.sort(function(a,b){
                  return Date.parse(b.time) - Date.parse(a.time);
                });
                that.setData({
                  returnData: data_list
                })
              } else {
                wx.showToast({
                  icon: "error",
                  title: "查询失败",
                })
              }
              
            }, data)
          // 注册用户审批查询
          } else if (that.data.TabCur == 2){
            wx.hideLoading()
            app.func.Req('/api/register/','GET' , function(res){
              if (res.code == 200) {
                for (data of res.data)
                  data.created_time = data.created_time.slice(0,19)
                that.setData({
                  registerData: res.data
                })
              } else {
                wx.showToast({
                  icon: "error",
                  title: "查询失败",
                })
              }
            }, data)
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '审批界面仅供管理员访问',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(res){
        wx.showToast({
          title: '尚未登录，请前往“我的”登录',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 借出审批
  examineFunc: function(e) {
    var that = this
    wx.showModal({
      title: "审批",
      content: "确定审批？",
      success: function(res) {
        if (res.confirm) {
          var data = {
            id: e.currentTarget.dataset.approveid
          }
          // console.log(e)
          app.func.Req('/api/approve/agree/','POST' , function(res){
            // console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '审批成功',
                icon: 'success',
              })
              // showToast 和 showLoading 不能共存，加一个延时函数处理
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            } else {
              wx.showToast({
                title: '审批失败',
                icon: 'none'
              })
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            }
          }, data)
        }
      }
    })
  },

  // 借出拒绝
  unexamineFunc: function(e) {
    var that = this
    wx.showModal({
      title: "拒绝",
      content: "确定拒绝？",
      success: function(res) {
        // console.log(e)
        if (res.confirm) {
          var data = {
            id: e.currentTarget.dataset.approveid
          }
          app.func.Req('/api/approve/reject/','POST' , function(res){
            if (res.code == 200) {
              wx.showToast({
                title: '拒绝成功',
                duration: 2000
              })
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            } else {
              wx.showToast({
                title: 'res.message',
                icon: 'none'
              })
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            }
          }, data)
        }
      }
    })
  },

  // 注册审批
  registerFunc: function(e) {
    // console.log(e)
    var that = this
    wx.showModal({
      title: "审批",
      content: "确定审批？",
      success: function(res) {
        if (res.confirm) {
          var data = {
            username: e.currentTarget.dataset.userid
          }
          app.func.Req('/api/register/agree/','POST' , function(res){
            if (res.code == 200) {
              wx.showToast({
                title: '审批成功'
              })
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
              setTimeout(function () {
                that.refreshData()
              }, 1000);
            }
            
          }, data)
        }
      }
    })
  },

  // 注册拒绝
  unregisterFunc: function(res) {
    // console.log(e)
    var that = this
    wx.showModal({
      title: "审批",
      content: "确定审批？",
      success: function(res) {
        if (res.confirm) {
          var data = {
            username: e.currentTarget.dataset.userid
          }
          app.func.Req('/api/register/reject/','POST' , function(res){
            if (res.code == 200) {
              that.refreshData()
              wx.showToast({
                title: '拒绝成功',
                duration: 2000
              })
            } else {
              that.refreshData()
              wx.showToast({
                title: 'res.message',
                icon: 'none'
              })
            }
            
          }, data)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userStatus',
      success: function(res){
        that.setData({
          userStatus: res.data
        })
        that.refreshData()
      },
      fail: function(res){
        wx.showToast({
          title: '尚未登录，请前往“我的”登录',
          icon: 'none',
          duration: 2000
        })
      }
    })
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