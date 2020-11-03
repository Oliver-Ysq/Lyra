// pages/my/my.js
const app = getApp()
Page({
  data: {
    name: '用户小琴',
    level: 1,
    levelName: ['天琴幼稚园', '天琴幼稚园', '天琴幼稚园', '天琴幼稚园', '天琴幼稚园'],
    days: 1,
    msgNum: 0,
  },
  tmpChooseClass() {
    //一键选课功能
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/test_insert_sc',
        qs: {
          method: "GET",
          openid: app.globalData.openid
        }, // 如果是get请求就把参数放在qs里
        body: {
          some: 'payload'
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
      }
    )
    // wx.request({
    //   url: app.globalData.serverURL + 'minzu/test_insert_sc',
    //   data: {
    //     openid: app.globalData.openid,
    //   },
    //   method: "GET",
    //   success: (res) => {
    //     console.log(res.data)
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },
  gotoWrong() {
    wx.navigateTo({
      url: './wrong/wrong',
    })
  },
  gotoMycourse() {
    wx.navigateTo({
      url: './mycourse/mycourse',
    })
  },
  gotoFriends() {
    wx.navigateTo({
      url: './friends/friends',
    })
  },
  gotoCollect() {
    wx.navigateTo({
      url: './collect/collect',
    })
  },
  gotoNotice() {
    wx.navigateTo({
      url: './notice/notice',
    })
  },
  gotoScore() {
    wx.navigateTo({
      url: './score/score',
    })
  },
  gotoMycoin() {
    wx.navigateTo({
      url: './mycoin/mycoin',
    })
  },
  gotoQiandao() {
    wx.navigateTo({
      url: './qiandao/qiandao?days=' + this.data.days,
    })
  },
  gotoSetting() {
    wx.navigateTo({
      url: './setting/setting?portrait=' + this.data.portrait,
    })
  },
  chooseimage() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const newChooseImgs = res.tempFilePaths[0];
        const imgInfo = res.tempFiles[0];
        // console.log("选择的图片", res);
        // 判断图片尺寸
        // console.log("尺寸", imgInfo.size);
        if (imgInfo.size / 1024 / 1024 >= 10) {
          wx.showModal({
            title: '提示', // 标题
            content: "图片超过10MB啦~", // 内容
            showCancel: false, // 是否显示取消按钮
            confirmText: '确定', // 确认按钮的文字
          });
          return
        }
        // 判断图片格式
        const imgSplit = newChooseImgs.split(".");
        const imgSLen = imgSplit.length;
        // console.log("格式", imgSplit, imgSLen, imgSLen - 1);
        if (["jpg", "jpeg", "png"].includes(imgSplit[imgSLen - 1])) {
          console.log("格式正确");
        } else {
          console.log("格式错误");
          wx.showModal({
            title: '提示',
            content: "请选择正确的图片格式上传",
            showCancel: false,
            confirmText: '确定',
          });
          return
        }
        if (newChooseImgs) {
          //  上传图片
          console.log("此次选择的图片", newChooseImgs);
          var getKind = newChooseImgs.split(".")
          var d = new Date()
          var fileName = app.globalData.openid + "_avatarURL" + d.getTime() + "." + getKind[getKind.length - 1]
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: fileName,
            // 指定要上传的文件的小程序临时文件路径
            filePath: newChooseImgs, //图片的临时路径
            // 成功回调
            success: e => {
              console.log('上传成功', e)
              wx.cloud.getTempFileURL({
                fileList: [{
                  fileID: e.fileID,
                  maxAge: 60 * 60, // one hour
                }]
              }).then(res => {
                // get temp file URL
                console.log(res.fileList)
                app.globalData.userPortrait = res.fileList[0].tempFileURL

                wx.cloud.callFunction({
                  name: "getData",
                  data: {
                    url: app.globalData.serverURL + 'update_userinfo',
                    method: 'GET',
                    qs: {
                      user_face: res.fileList[0].tempFileURL,
                      openid: app.globalData.openid,
                    }, // 如果是get请求就把参数放在qs里
                    body: {

                    }, // 如果是post请求就把参数放在body里
                  }
                }).then(
                  res => {
                    console.log(res.result);
                    console.log("调用云函数")
                    if (res.result == "fail") {
                      console.log("失败")
                    } else {
                      that.setData({
                        portrait: app.globalData.userPortrait
                      })
                      wx.showToast({
                        title: '上传成功',
                        icon: "success",
                        duration: 1000,
                        success: function () {
                          console.log('头像成功替换')
                        }
                      })
                    }
                  }
                )
              })
            }
          })


        }
      }
    })
  },

  choosePortrait() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要修改头像',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.chooseimage()

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  quit() {
    wx.showModal({
      title: '提示',
      content: '是否要退出账号',
      success(res) {
        if (res.confirm) {
          console.log('用户确认退出账号')
        } else if (res.cancel) {
          console.log('用户取消操作')
        }
      }
    })
  },
  getCurrentDate: function (format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
      time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
  },
  onShow: function () {
    var that = this;
    if (app.globalData.myInitialFlag == 0) {
      console.log(app.globalData)
      this.setData({
        name: app.globalData.wxuserInfo.nickName,
        level: app.globalData.userLevel,
        portrait: app.globalData.userPortrait,
        //portrait: app.globalData.serverURL + app.globalData.userPortrait,
        days: app.globalData.userLoginDays
      })
      app.globalData.myInitialFlag = 1
    }
    wx.getStorage({
      key: 'lastTime',
      success(res) {
        var lastTime = res.data;
        wx.setStorage({
          key: "lastTime",
          data: that.getCurrentDate(2)
        })
        console.log("请求参数如下:")
        console.log("mode:N");
        console.log("openid:" + app.globalData.openid);
        console.log("time_start:" + lastTime)
        wx.cloud.callFunction({
          name: "getData",
          data: {
            url: app.globalData.serverURL + 'minzu/discussion/get',
            method: 'GET',
            qs: {
              mode: "N",
              openid: app.globalData.openid,
              time_start: lastTime
            }, // 如果是get请求就把参数放在qs里
            body: {
              some: 'payload'
            }, // 如果是post请求就把参数放在body里
          }
        }).then(
          res => {
            that.setData({
              msgNum: res.result
            })
          }
        )

      },
      fail(res) {
        console.log("第一次进入此页面，没有缓存时间可以读取")
        wx.setStorage({
          key: "lastTime",
          data: that.getCurrentDate(2)
        })
      }
    })
  },
})