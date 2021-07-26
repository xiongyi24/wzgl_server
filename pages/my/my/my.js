// pages/me/me.js
// 获取到小程序全局唯一的 App 实例
var app = getApp();

// 注册小程序中的一个页面
Page({

  // 页面的初始数据
  data: {
    userId:'',
    userName:'游客',
    userStatus:''
  },
  
  // 跳转至登录页
  toLogin: function(){
    if(!this.data.userId) // this指向本页面
    // wx.navigateTo
    // 或者在wxml中：<navigator class="content" url="../logs/logs" hover-class="none">
    wx.navigateTo({
      url: '../login/login',
    });
  },

  // 注销
  loginOut:function(){
    var that=this;
    // 对话框
    wx.showModal({
      title: '提示',
      content: '是否注销',
      success (res) {
        // res.confirm 为 true 时，表示用户点击了确定按钮
        if (res.confirm) {
          wx.removeStorage({
            key: 'token',
            // 留意这个 res
            success (res) {
              // console.log(res)
              wx.removeStorage({
                key: 'userId',
                success (res) {
                  wx.removeStorage({
                    key: 'userName',
                    success (res) {
                      wx.removeStorage({
                        key: 'userStatus',
                        success (res) {
                          // 设置页面数据
                          that.setData({
                            userName:'游客',
                            userId:'',
                            userStatus:''
                          })
                          wx.showToast({
                            title: '注销成功'
                          })
                          setTimeout(function () {
                            // 跳转至tab页面需要用 switchTab 不能用 navigateTo
                          wx.switchTab({
                            url: '../my/my',
                          });
                          }, 2000)
                        }
                      })
                    }
                  })
                }
              })
            }
          }) 
        }
      }
    });
  },

  // 跳转至关于页
  goabout:function(){
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 页面加载时触发。一个页面只会调用一次
  onLoad: function (options) {
    this.setData({
      image: app.globalData.userInfo.avatarUrl
    })
    var that = this;
    wx.getStorage({
      key: 'userName',
      // 若没有找到对应值，则转交 fail:function(res){} 处理
      success:function(res){
        // 更新页面变量
        that.setData({
          userId: res.data
        })
        wx.getStorage({
          key: 'userName',
          success:function(res){
            that.setData({
              userName: res.data
            })
            wx.getStorage({
              key: 'userStatus',
              success:function(res){
                that.setData({
                  userStatus: res.data
                })
              }
            })  
          }
        })  
      }
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
  // 页面显示/切入前台时触发
  onShow: function () {
    this.setData({
      image: app.globalData.userInfo.avatarUrl
    })
    var that = this;
    wx.getStorage({
      key: 'userId',
      // 若没有找到对应值，则转交 fail:function(res){} 处理
      success:function(res){
        // 更新页面变量
        that.setData({
          userId: res.data
        })
        wx.getStorage({
          key: 'userName',
          success:function(res){
            that.setData({
              userName: res.data
            })
            wx.getStorage({
              key: 'userStatus',
              success:function(res){
                that.setData({
                  userStatus: res.data
                })
              }
            })  
          }
        })  
      }
    })
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