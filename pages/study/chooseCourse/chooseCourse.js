const app = getApp()
var progressNum = 0
Page({
  data: {
    type: 0, // 0-视唱；3-练耳
    rank: "01", // 难度：01-基础级

    active: 0, // 当前课次 == active + 1
    currentTab: 0,
    progressFlag: false,

    singList: ["单声部精唱", "单声部视谱即唱", "双声部"],
    hearList: ["音阶", "音组", "音程", "和弦", "节奏", "单声部旋律", "双声部旋律"],
    stateList: [],
    totalLessons: 0,
    totalLargeNum: 0,
    totalScore: 0
  },
  numToString(x) {
    if (x < 10)
      return "0" + x
    else
      return x + ""
  },

  switchNav(e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      active: id
    });
    this.update()

  },

  goto(e) {
    if (e.currentTarget.dataset.flag == true) return;
    console.log(e)
    //跨页面传值
    const name = e.currentTarget.dataset.name //大题类别
    const lessonNumber = this.numToString(e.currentTarget.dataset.id + 1) //课次从1开始
    const nameId = e.currentTarget.dataset.nameid

    if (this.data.type == 0) {
      //视唱
      wx.navigateTo({
        url: '/pages/study/sightsinging/sightsinging?lessonNumber=' + lessonNumber + '&rank=' + this.data.rank + '&kind=' + name + '&total=' + this.data.totalLargeNum + '&now=' + this.data.stateList.length + '&nameId=' + "0" + nameId
      })
    } else if (this.data.type == 3) {
      console.log("lessonNmuber", lessonNumber)
      //练耳
      wx.navigateTo({
        url: '/pages/study/hearSelect/hearSelect?lessonNumber=' + lessonNumber + '&rank=' + this.data.rank + '&kind=' + name + '&total=' + this.data.totalLargeNum + '&now=' + this.data.stateList.length,
        success(res) {},
        fail(err) {
          console.log(err)
        }
      })
    }
  },

  update() {
    let that = this
    //查看完成答题情况

    console.log('section_ifdo'+that.numToString(parseInt(that.data.active) + 1))
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/section_ifdo',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
          solfeggio: that.data.type.toString(),
          // tonum:"1",
          rank: that.data.rank,
          lesson_num: that.numToString(parseInt(that.data.active) + 1)
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
          console.log(res.result)
          that.setData({
            stateList: res.result
          })
        }
      }
    )
    // wx.request({
    //   url: app.globalData.serverURL + 'minzu/section_ifdo',
    //   data: {
    //     openid: app.globalData.openid,
    //     solfeggio: that.data.type.toString(),
    //     // tonum:"1",
    //     rank: that.data.rank,
    //     lesson_num: that.numToString(that.data.active + 1)
    //   },
    //   method: "GET",
    //   success(res) {
    //     console.log(res.data)
    //     that.setData({
    //       stateList: res.data
    //     })
    //   },
    //   fail(err) {
    //     console.log(err)
    //   }
    // })

    //查看总成绩

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/get_lesson_score',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
          rank: that.data.rank,
          solfeggio: that.data.type.toString(),
          lesson_num: that.numToString(parseInt(that.data.active) + 1)
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
          console.log(res.result)
          that.setData({
            totalScore: res.result == "None" ? 0 : res.result
          })
        }
      }
    )

    // wx.request({
    //   url: app.globalData.serverURL + 'minzu/get_lesson_score',
    //   data: {
    //     openid: app.globalData.openid,
    //     rank: that.data.rank,
    //     solfeggio: that.data.type.toString(),
    //     lesson_num: that.numToString(that.data.active + 1)
    //   },
    //   method: "GET",
    //   success: res => {
    //     console.log(res.data)
    //     that.setData({
    //       totalScore: res.data == "None" ? 0 : res.data
    //     })
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },

  // saveToStorage(key, data) {
  //   wx.setStorage({
  //     key: key,
  //     data: data
  //   })
  // },

  // // 本地内存搜索
  // searchStorage(key) {
  //   try {
  //     const value = wx.getStorageSync(key)
  //     if (value) {
  //       console.log()
  //       console.log(value)
  //       return value;
  //     }
  //   } catch (e) {
  //     // Do something when catch error
  //   }
  // },

  onLoad(options) {
    console.log(options.type) //type：0-视唱/ 3-练耳
    console.log(options.rank) //难度等级
    this.setData({
      type: options.type,
      rank: options.rank,
      totalLargeNum: options.type == 0 ? 3 : 7
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })


    var that = this;
    var timer = setInterval(function () {
      progressNum++;
      //当进度条为100时清除定时任务
      if (progressNum >= 95) {
        clearInterval(timer);
      }
      //并且把当前的进度值设置到progress中
      that.setData({
        progress: progressNum
      })
    })

    //获取总课次

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/get_total_lesson_num',
        method: 'GET',
        qs: {
          mode: 3, //练耳选择题
          choice_rank: this.data.rank
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result)
        console.log("调用云函数")
        if (res.result != "fail") { //success
          console.log("练耳选择题 课次数量：" + res.result)
          that.setData({
            totalLessons: parseInt(res.result)
          })
        }
      }
    )

  },

  onShow() {
    this.update()
  }

})