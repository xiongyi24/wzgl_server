// pages/index/device/device.js
var app = getApp()

Page({

  data: {
    list: [],
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    load: true,
    // 注意不要忘了 isShow 字段
    deviceData:[],
    borrorRecord: [],
    userStatus: ""
  },

  // 搜索函数
  searchDevice(e) {
    let key = e.detail.value;
    let list = this.data.list;
    console.log(list)
    for (var type of list) {
      for (var deviceInfo of type.deviceInfo) {
        let a = key;
        // 按何值搜索
        let b = deviceInfo.name;
        if (b.search(a) != -1) {
          deviceInfo.isShow = true
        } else {
          deviceInfo.isShow = false
        }
      }
    }
    this.setData({
      list: list
    })
  },

  // 刷新数据
  refreshData: function(data='') {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.func.Req('/api/device/','GET' , function(res){
      wx.hideLoading()
      if (res.code == 200) {
        var zt_color = ['text-green', 'text-orange', 'text-red']
        var deviceType_list = []
        var id_num = 0
        for (var key in res.data) {
          var deviceInfo_list = []
          for (var data of res.data[key]) {
            var list_data = {
              id: data.serial_number,
              name: data.name,
              zl: data.classes,
              wz: data.location,
              bz: data.comments?data.comments:'无',
              zt: [app.globalData.deviceState[data.state], zt_color[data.state]],
              isShow: true
            } 
            deviceInfo_list.push(list_data)
          }
          deviceType_list.push({
            id: id_num,
            name: key,
            deviceInfo: deviceInfo_list
          })
          id_num = id_num + 1
        }
        that.setData({
          list: deviceType_list
        })
        // 若有设备详情的模态框，则更新其数据 deviceData
        if (that.data.modalName_1) {
          for (var datas of that.data.list){
            // console.log(datas)
            for (var data of datas.deviceInfo){
              if (data.id == that.data.currentDevideId) {
                that.setData({
                  deviceData: data
                })
                // console.log(that.data.deviceData)
              }
            }
          }
        }
        // console.log(that.data.list)
      } else {
        wx.showToast({
          icon: "error",
          title: "查询失败",
        })
      }
    }, data)
  },

  deviceInfo: function(e) {
    var that = this
    var deviceData = e.currentTarget.dataset.devicedata
    that.setData({
      currentDevideId: deviceData.id,
      deviceData: deviceData
    })
    // console.log(that.data.deviceData)
    that.showDeviceInfoModal()
  },

  // 修改设备信息
  changeDevice: function(e) {
    wx.navigateTo({
      url: '../changeDevice/changeDevice?deviceId=' + e.currentTarget.dataset.deviceid,
    })
  },

  // 跳转至添加设备
  addDevice: function(res) {
    wx.navigateTo({
      url: '../addDevice/addDevice',
    });
  },

  // 设备借出记录查询
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
    // 写入数据
    var data = {
      serial_number: e.currentTarget.dataset.deviceid
    }
    console.log(data)
    app.func.Req('/api/device/get_all/','POST' , function(res){
      wx.hideLoading()
      console.log(res)
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
            operation_list.push(data.name + " 于 "+ data.created_time.slice(0,19)+ " " + app.globalData.operationState[data.operation])
          }
        } else {
          operation_list = ['暂无记录']
        }
        that.setData({
          "borrowRecord": [device_name, operation_list]
        })
        that.showBorrowRecordModal()
      } else {
        wx.showToast({
          icon: "error",
          title: "查询失败",
        })
      }
    }, data)
  },

  showDeviceInfoModal(e) {
    this.setData({
      modalName_1: 'deviceInfo'
    })
  },

  hideDeviceInfoModal(e) {
    this.setData({
      modalName_1: null
    })
  },

  showBorrowRecordModal(e) {
    this.setData({
      modalName_2: 'borrowRecord'
    })
  },

  hideBorrowRecordModal(e) {
    this.setData({
      modalName_2: null
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        // console.log(view)
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.refreshData()
    // 获取权限
    wx.getStorage({
      key: 'userStatus',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          userStatus: res.data
        })
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '未登录，请前往"我的"登录',
        })
      }
    })
  },

  // 页面显示/切入前台时触发。
  onShow: function (options) {
    var that = this
    that.refreshData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示模态框时禁用下拉刷新
    if (this.data.modalName_1!='deviceInfo' && this.data.modalName_2!='borrowRecord') {
      this.refreshData()
      wx.stopPullDownRefresh()
    }
  },

})