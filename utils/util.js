// const 声明一个只读的常量
// => 箭头函数
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 网络请求通用模板
var apiHost = 'https://www.cumt-ljp.ltd'

function Request(url, method, callback, data = '') {
  var header = {
    'content-type': 'application/json'
  }
  wx.getStorage({
    // 本地缓存中指定的 key
    key: 'token',
    // 接口调用成功的回调函数
    success: function (res) {
      header.Authorization = "Bearer " + res.data;
      wx.request({
        url: apiHost + url,
        method: method,
        data: data,
        header: header,
        success: function (res) {
          // 刷新token
          if (res.data.code == 401) {
            wx.getStorage({
              key: 'userId',
              success: function(res) {
                var username = res.data
                wx.getStorage({
                  key: 'password',
                  success: function(res) {
                    var login_data = {
                      username: username,
                      password: res.data
                    }
                    console.log(login_data)
                    wx.request({
                      url: apiHost + '/api/user/login/',
                      method: 'POST',
                      data: login_data,
                      success: function (res) {
                        // console.log(res)
                        if (res.data.code == 200) {
                          var token = res.data.data.token.token
                          wx.setStorage({
                            data: token,
                            key: 'token',
                            success: function(res) {
                              // console.log(token)
                              // 刷新token后重新请求
                              var header = {
                                'content-type': 'application/json',
                                'Authorization': "Bearer " + token
                              }
                              wx.request({
                                url: apiHost + url,
                                method: method,
                                data: data,
                                header: header,
                                success: function (res) {
                                  if (callback && typeof callback === "function") {
                                    callback(res.data);
                                  }
                                }
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: "res.data",
                            icon: "none"
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          // 正常流程
          } else {
            // console.log(res)
            // callback 是参数，指向一个传入的函数，灵活处理返回值
            if (callback && typeof callback === "function") {
              callback(res.data);
            }
          }
        },
        fail: function (error) {
          console.log(error)
          wx.showToast({
            title: '网络连接失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    },
    fail: function(res) {
      wx.showToast({
        title: '尚未登录，请前往“我的”登录',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

function BaseRequest(url, method, callback, data = '') {
  var header = {
    'content-type': 'application/json'
  }
  wx.request({
    url: apiHost + url,
    method: method,
    data: data,
    header: header,
    success: function (res) {
      if (callback && typeof callback === "function") {
        callback(res.data);
      }
    },
    fail: function (error) {
      console.log(error)
      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  baseReq: BaseRequest,
  Req: Request
}
