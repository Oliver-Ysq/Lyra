// pages/homework/homework.js
const app = getApp()
Page({
  data: {
    nav: ['待完成', '已完成'],
    TabCur: 0,
    scrollLeft: 0,
    todoList: [],
    finishedList: [],
    typeList: ["视唱", "练耳", "视唱", "练耳"]
  },
  goto(e) {
    let dataset = e.currentTarget.dataset
    console.log(e.currentTarget.dataset.partid)
    wx.navigateTo({
      url: '/pages/study/sightsinging/sightsinging?partid=' + dataset.partid + "&type=" + dataset.type + "&kind=" + dataset.kind,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  handleIndex(s) {
    let num = parseInt(s)
    if (num <= 10) {
      num = num - 1
      return "0" + num
    } else {
      num = num - 1
      return "" + num
    }
  },
  onShow(options) {
    let that = this

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/get_homework',
        // 视唱/练耳，等级，课次，最高分时间，partid，是否完成，最高分
        method: 'GET',
        qs: {
          openid: app.globalData.openid
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        console.log("调用云函数")
        if (res.result != "fail") {
          console.log(res.result)
          let list = res.result
          let Tlist = []
          let Flist = []
          for (let i = 0; i < res.result.length; i++) {
            if (list[i].info[2] == "00") {
              list[i].info[2] = "未知"
            } else if (list[i].info[2] == "01") {
              list[i].info[2] = "基础"
            } else {
              list[i].info[2] = that.handleIndex(list[i].info[2])
            }
            console.log(list[i])

            if (list[i].info[5] == 0) {
              Tlist.push(list[i])
            } else {
              Flist.push(list[i])
            }
          }
          that.setData({
            todoList: Tlist,
            finishedList: Flist
          })
          console.log(that.data.todoList, that.data.finishedList)
        }
      }
    )
  },
})