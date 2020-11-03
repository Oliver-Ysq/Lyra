const app = getApp()
Page({

  data: {
    week: 1,
    cardList: [],
  },

  goto(e) {
    let type = e.currentTarget.dataset.type
    let rank = e.currentTarget.dataset.rank
    let title = e.currentTarget.dataset.title
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: './chooseCourse/chooseCourse?type=' + type + '&rank=' + rank + '&title=' + title,
    })
  },

  onShow() {
    let that = this;


    //得到资料卡片的信息

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/classcard',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        if (res.result != "fail") { //success

          console.log(res.result)
          let list = res.result

          //计算进度条
          for (let i = 0; i < list.length; i++) {
            let tmp = list[i][1].split('/')
            let p = parseInt((parseInt(tmp[0]) / parseInt(tmp[1])) * 100) + "%"
            list[i].push(p)
          }

          that.setData({
            cardList: list
          })
          setTimeout(function () {
            that.setData({
              loading: true
            })
          }, 400)
        }
      }
    )
    // wx.request({

    //   url: app.globalData.serverURL + 'minzu/classcard',
    //   data: {
    //     openid: app.globalData.openid,
    //   },
    //   method: "GET",
    //   success(res) {
    //     console.log(res.data)
    //     let list = res.data

    //     //计算进度条
    //     for (let i = 0; i < list.length; i++) {
    //       let tmp = list[i][1].split('/')
    //       let p = parseInt((parseInt(tmp[0]) / parseInt(tmp[1])) * 100) + "%"
    //       list[i].push(p)
    //     }

    //     that.setData({
    //       cardList: list
    //     })
    //     setTimeout(function () {
    //       that.setData({
    //         loading: true
    //       })
    //     }, 400)
    //   },
    //   fail(e) {
    //     console.log(e)
    //   }
    // })
  },

  getcard() {
    //得到资料卡片的信息

    let that = this

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/classcard',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        if (res.result != "fail") { //success
          console.log(res.result)
          let list = res.result

          //计算进度条
          for (let i = 0; i < list.length; i++) {
            let tmp = list[i][1].split('/')
            let p = parseInt((parseInt(tmp[0]) / parseInt(tmp[1])) * 100) + "%"
            list[i].push(p)
          }

          that.setData({
            cardList: list
          })
          setTimeout(function () {
            that.setData({
              loading: true
            })
          }, 400)
        }
      }
    )

  },
  onLoad() {
    let that = this;
    // that.getcard()

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'standard_voice',
        method: 'GET',
        qs: {}, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        console.log("调用云函数")
        if (res.result != "fail") { //success
          app.globalData.standardAudioSrc = res.result.substr(2)
        }
      }
    )


    //设置周数

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/get_week',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        console.log("调用云函数")
        if (res.result != "fail") { //success
          that.setData({
            week: res.result
          })
        }
      }
    )


    // wx.cloud.callFunction({
    //   name: "getData",
    //   data: {
    //     url: app.globalData.serverURL + 'minzu/delete_record',
    //     method: 'GET',
    //     qs: {
    //       openid: app.globalData.openid,
    //     }, // 如果是get请求就把参数放在qs里
    //   }
    // }).then(
    //   res => {
    //     console.log("调用云函数")
    //     if (res.result != "fail") { //success
    //       console.log('成功' + res.data)
    //     }
    //   }
    // )

  },
  onShow() {
    this.getcard()
  }
})