// pages/my/mycoin/mycoin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["全部", "收入", "支出"],
    TabCur: 0,
    scrollLeft: 0,
    in: [{
      who: "A",
      type: "1",
      number: "2.33",
      date: "2020.6.30"
    }, {
      who: "B",
      type: "1",
      number: "6.66",
      date: "2020.6.30"
    }],
    out: [{
      who: "C",
      type: "0",
      number: "5.00",
      date: "2020.6.30"
    }, {
      who: "D",
      type: "0",
      number: "5.20",
      date: "2020.6.30",
    }],
    infoList: [{
        who: "A",
        type: "1",
        number: "2.33",
        date: "2020.6.30"
      }, {
        who: "B",
        type: "1",
        number: "6.66",
        date: "2020.6.30"
      },
      {
        who: "C",
        type: "0",
        number: "5.00",
        date: "2020.6.30"
      }, {
        who: "D",
        type: "0",
        number: "5.20",
        date: "2020.6.30"
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  banTouchMove() {
    return false
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