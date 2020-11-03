// pages/my/mycourse/mycourse.js
const app = getApp()
Page({

  data: {
    currentList: [],
    finishedList: []
  },

  goto(e) {
    let type = e.currentTarget.dataset.type
    let rank = e.currentTarget.dataset.rank
    wx.navigateTo({
      url: '/pages/study/chooseCourse/chooseCourse?type=' + type + '&rank=' + rank,
    })
  },

  onLoad: function (options) {

    let that = this
    //得到资料卡片的信息

    wx.cloud.callFunction({
      name:"getData",
      data:{
        url: app.globalData.serverURL + 'minzu/classcard',
        qs:{
          method:"GET",
          openid: app.globalData.openid,
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        },// 如果是post请求就把参数放在body里
      }
    }).then(
      res=>{
        if(res.result!="fail"){
          console.log(res.result)
        let lis = res.result

        let fList = []
        let cList = []
        for (let i in lis) {
          if (lis[i][0] == "完成") {
            fList.push(lis[i])
          } else {
            cList.push(lis[i])
          }
        }

        that.setData({
          currentList: cList,
          finishedList: fList
        })
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
    //     let lis = res.data

    //     let fList = []
    //     let cList = []
    //     for (let i in lis) {
    //       if (lis[i][0] == "完成") {
    //         fList.push(lis[i])
    //       } else {
    //         cList.push(lis[i])
    //       }
    //     }

    //     that.setData({
    //       currentList: cList,
    //       finishedList: fList
    //     })
    //   },
    //   fail(e) {
    //     console.log(e)
    //   }
    // })
  },
})