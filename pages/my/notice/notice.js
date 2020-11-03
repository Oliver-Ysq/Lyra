// pages/my/notice/notice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["点赞", "回复", "系统消息"],
    TabCur: 0,
    scrollLeft: 0,
    dianzanList: [{
      name: "毛利小五郎",
      detail: "hellohellohello",
      url: "/image/my/head.jpg"
    }, {
      name: "毛利兰",
      detail: "it's me",
      url: "/image/my/head.jpg"
    }, {
      name: "工藤新一",
      detail: "how are you",
      url: "/image/my/head.jpg"
    }],
    typeList: [
      ["回答", "提问"],
      ["评论", "状态"],
      ["回复", "评论"]
    ],
    replyList: [
      // {
      //   name: "大大",
      //   type: 0,
      //   detail: "xxx",
      //   comment: "这是因为xxx",
      //   url: "/image/my/head.jpg"
      // },
      // {
      //   name: "小小",
      //   type: 1,
      //   detail: "xxx",
      //   comment: "这个好好看",
      //   url: "/image/my/head.jpg"
      // },
      // {
      //   name: "旺财",
      //   type: 2,
      //   detail: "xxx",
      //   comment: "呕",
      //   url: "/image/my/head.jpg"
      // }
    ],
    systemList: [{
      type: 0,
      name: "小明",
      money: 6.66,
      detail: "aaa",
      url: "/image/my/head.jpg"
    }, {
      type: 1,
      title: "新活动！",
      detail: "bbb",
      url: "/image/my/head.jpg"
    }]
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

  toDetail: function (e) {
    console.log(e)
    var obj = {
      id: e.currentTarget.dataset.id,
      from: 'notice',
      name: e.currentTarget.dataset.name
    }
    wx.navigateTo({
      url: "/pages/contact/detail/detail?obj=" + encodeURIComponent(JSON.stringify(obj))
    })
  },
  onLoad: function (options) {
    let that = this;
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "BUM",
          openid: app.globalData.openid
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        console.log("调用云函数 openid:" + app.globalData.openid)
        for (var i = res.result.length - 1; i >= 0; i--) {
          var obj = {
            name: res.result[i][0],
            id: res.result[i][1],
            type: 0,
            kind: res.result[i][2],
            comment: res.result[i][3],
            detail: res.result[i][4],
          }
          that.data.replyList.unshift(obj);
          that.setData({
            replyList: that.data.replyList
          });
        }

        if (res.result == "fail") {
          console.log("失败")
        } else {
          if (res.result.length < 20) {
            that.setData({
              toEnd: true
            })
          }

        }
      }
    )
    // wx.request({
    //   url: app.globalData.serverURL + 'minzu/discussion/get',
    //   data: {
    //     mode: "BUM",
    //     openid: "toolboy"
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },  
    //   success: function (res) {
    //     console.log(res);
    //     for(var i=0; i<res.data.length; i++){
    //       var obj = {
    //         name :  res.data[i][0],
    //         id :  res.data[i][1],
    //         type :  0,
    //         kind : res.data[i][2],
    //         comment : res.data[i][3], 
    //         detail : res.data[i][4],
    //       }
    //       that.data.replyList[i] = obj;
    //       that.setData({
    //         replyList: that.data.replyList
    //       });
    //     }
    //   }

    // })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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