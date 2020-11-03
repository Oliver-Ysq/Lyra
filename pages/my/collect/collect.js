// pages/my/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: [{
      id: 0,
      name: '黄秋子',
      time: '1',
      title: '请教一下第六题',
      commentNum: '5',
      star: 1,
      done: true,
      reward: 2,
      imgList: ['/image/my/head.jpg', '/image/my/head.jpg']

    }, {
      id: 1,
      name: '炭治郎',
      time: '3',
      title: '请教一下第二题',
      commentNum: '0',
      star: 0,
      done: true,
      reward: 3,
      imgList: ['/image/my/head.jpg', '/image/my/head.jpg']

    }, {
      id: 2,
      name: '祢豆子',
      time: '15',
      title: '请教一下第三题',
      commentNum: '3',
      star: 1,
      done: false,
      reward: 5,
      imgList: ['/image/my/head.jpg']

    }],
  },
  handleStarChange(e) {
    let star = "cardInfo[" + e.detail.id + "].star"
    this.setData({
      [star]: e.detail.state,
    })
    if (e.detail.state == 1) {
      console.log(e.detail.id + "号问题已经收藏")
    }
    if (e.detail.state == 0) {
      console.log(e.detail.id + "号问题已取消收藏")
    }
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