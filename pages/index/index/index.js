// index.js

Page({
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/index/1.png'
    }, {
      id: 1,
      type: 'image',
      url: '/images/index/2.jpg'
    }, {
      id: 2,
      type: 'image',
      url: '/images/index/3.jpg'
    },
  ],
    elements: [{
      title: '借出',
      name: 'borrow',
      color: 'cyan',
      icon: 'newsfill',
      isShow: true
    },
    {
      title: '我的记录',
      name: 'myRecode',
      color: 'blue',
      icon: 'colorlens',
      isShow: true
    },
    {
      title: '设备',
      name: 'device',
      color: 'red',
      icon: 'font',
      isShow: true
    },
    {
      title: '审核',
      name: 'examine',
      color: 'purple',
      icon: 'icon',
      isShow: false
    }, {
      title: '敬请期待',
      name: 'more',
      color: 'green',
      icon: 'loading2',
      isShow: true
    },
  ],
  },

  onLoad() {
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');

    // 展示仅管理员可见的模块
    var that = this
    wx.getStorage({
      key: 'userStatus',
      success: function(res) {
        if (res.data == 'admin') {
          for (var data of that.data.elements) {
            if (data.title == '审核') {
              data.isShow = true
            }
          }
        } else {
          for (var data of that.data.elements) {
            if (data.title == '审核') {
              data.isShow = false
            }
          }
        }
        // 使用 setData，在修改数据后再次渲染页面（否则改变数据将不重新渲染）
        that.setData({
          elements: that.data.elements
        })
      },
      fail: function(res) {
        for (var data of that.data.elements) {
          if (data.title == '审核') {
            data.isShow = false
          }
        }
        that.setData({
          elements: that.data.elements
        })
      }
    })
  },

  onShow() {
    this.onLoad() 
  },

  /** 轮播图相关 */
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },

  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },

  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },

  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})