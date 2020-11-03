//app.js
var timeOut;
App({

  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //云开发初始化
    wx.cloud.init({
      env: "music-museum-15aq8",
      traceUser: true
    })
    let that = this
    wx.cloud.callFunction({
      name: 'openID',
      complete: res => {
        that.globalData.openid = res.result.openid

        if (this.openIDReadyCallback) {
          this.openIDReadyCallback(res)
          console.log('用户的openid为：' + res.result.openid)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {

              // 可以将 res 发送给后台解码出 unionId
              that.globalData.wxuserInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                console.log('成功获取授权用户信息')
                console.log(res)
              }
            },
            fail: res => {
              wx.showModal({
                title: '提示',
                content: '获取用户信息失败',
              })

            }
          })
        } else {
          //获取用户信息失败后。请跳转授权页面
          if (this.userInfoFailCallback) {
            this.userInfoFailCallback(res)
            console.log(res)
          }
        }
      }
    })
    that.globalData.state = 'show'

  },
  onHide: function () {
    console.log("HIDE")
    var that = this
    timeOut = setTimeout(function () {
      wx.request({
        url: that.globalData.serverURL + 'exit',
        data: {
          openid: that.globalData.openid
        },
        success: function (res) {
          console.log(res.data);
          that.globalData.state = "exit"
        },
        error(e) {
          console.log(e)
        }
      }, 600000) //十分钟后退出
    })

  },
  onShow: function () {
    var that = this
    clearTimeout(timeOut)
    this.openIDReadyCallback = res => {
      if (that.globalData.state == 'exit') { //退出(隐藏10min)了，重新请求一次服务器
        wx.request({
          url: app.globalData.serverURL + 'user_info_by_userid?openid=' + app.globalData.openid,
          success: res => {
            console.log(res.data)
            //++++++++++++++++++++++++++++++++++++++记得加一个加载条/圈圈
            // if (res.data.length !== 0) {
            //   console.log(res.data)
            //   console.log('成功')
            // } else {
            //   console.log('失败了')
            // }
          },
          error: err => {
            console.log(err)
          }
        })
      }
      that.globalData.state = 'show'
    }
  },
  globalData: {
    wxuserInfo: '',
    // serverURL: "",
    // serverURL: "https://chuyanjihua.icu/solfeggio/",
    serverURL: "http://chuyan.ngrok2.xiaomiqiu.cn/solfeggio/",
    state: 'exit',
    userLevel: 99,
    userLoginDays: 99,
    userPermission: 1,
    myInitialFlag: 0,
    assistant: '美美',
    recordTimesLeft: 5,
    allowSave: true,
    standardAudioSrc: null,
    userPortrait:"",
    standardAudio: wx.env.USER_DATA_PATH + '/standardAudio',
    optionMargin: 3
  }
})