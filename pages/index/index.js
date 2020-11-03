const app = getApp()
let RM = wx.getRecorderManager()
var flag = 1
Page({
  data: {
    info: {
      userType: 0, // 0：校内学生；1：校外学生；2：校外人员
      major: '美美'
    },
    nextBtnTapable: true,
    assChoosen: 0,
    getInfo: 1,
    numList: [1, 2, 3],
    num: 0,
    scroll: 0,
    changeFlag: 0,
    //currentIndex更改用于给调试提供方便，记得改回 0
    currentIndex: 0,

    chooseIndex: 1,
    modalFlag: 0,

    animation0: false,
    animationID0: false,
    animationID1: false,
    animationStu1: false,
    animationCmp2: false,
    animationID2: false,
    studentName0: '',
    studentID0: '',
    levelPicker0: ['一级（18英才）', '二级'],
    level0: null,
    majorPicker0: ['知行', '美美'],
    major0: 1,

    studentID1: '',
    ID1: '',
    levelPicker1: ['一级（18英才）', '二级'],
    level1: null,
    majorPicker1: ['数字媒体与设计艺术', '工业设计'],
    major1: null,

    ID2: '',
    company: '',
    recordFlag: 0,
    audioFile: '',
  },
  banMove() {
    return false
  },
  hideModal() {
    this.setData({
      modalFlag: 0
    })
  },
  next() {

    let {
      info
    } = this.data
    let that = this

    console.log(that.data.info)

    if (that.data.currentIndex === 0 && that.data.nextBtnTapable == true) {
      if (info.userType === 0) {
        if (info.studentID && info.studentName && info.major) {
          this.setData({
            num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1,
            // currentIndex: (this.data.currentIndex + 1) % 3
          })
          console.log(this.data.info)
        } else {
          //提示框：完善信息！
          this.setData({
            modalFlag: 1
          })
        }
      } else if (info.userType === 1) {
        if (info.ID && info.studentID && info.level && info.major) {
          this.setData({
            num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1,
            currentIndex: (this.data.currentIndex + 1) % 3
          })
          console.log(this.data.info)
        } else {
          this.setData({
            modalFlag: 1
          })
        }
      } else if (info.userType === 2) {
        if (info.ID && info.company) {
          this.setData({
            num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1,
            currentIndex: (this.data.currentIndex + 1) % 3
          })
          console.log(this.data.info)
        } else {
          this.setData({
            modalFlag: 1
          })
        }
      }
      that.setData({
        nextBtnTapable: false
      })
      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + 'create_stu',
          method: 'GET',
          qs: {
            identifyCode: info.studentID,
            md5: info.studentID,
            openid: app.globalData.openid,
            studentId: null,
            classId: null,
            realName: info.studentName,
            teaching_assistant: info.major,
            // userFace:app.globalData.wxuserInfo.avatarURL
          }, // 如果是get请求就把参数放在qs里
          body: {
            some: 'payload'
          }, // 如果是post请求就把参数放在body里
        }
      }).then(
        res => {
          console.log(res.result);
          console.log("调用云函数")
          if (res.result == "fail") {
            that.setData({
              nextBtnTapable: true
            })
          } else {
            if (res.result == "0") {

              console.log('验证成功')

              wx.cloud.callFunction({
                name: "getData",
                data: {
                  url: app.globalData.serverURL + 'insert_userinfo',
                  method: 'GET',
                  qs: {
                    openid: app.globalData.openid,
                    password: null,
                    userName: app.globalData.wxuserInfo.nickName,
                    userAuth: null,
                    userFace:app.globalData.wxuserInfo.avatarUrl
                  }, // 如果是get请求就把参数放在qs里
                  body: {
                    some: 'payload'
                  }, // 如果是post请求就把参数放在body里
                }
              }).then(
                res => {
                  console.log("userFace"+app.globalData.wxuserInfo.avatarUrl)
                  console.log(res.result);
                  console.log("调用云函数")
                  if (res.result == "fail") {
                    console.log(e)
                    that.setData({
                      nextBtnTapable: true
                    })
                  } else {
                    wx.cloud.callFunction({
                      name: "getData",
                      data: {
                        url: app.globalData.serverURL + 'insert_userinfo',
                        method: 'GET',
                        qs: {
                          openid: app.globalData.openid,
                          password: null,
                          userName: app.globalData.wxuserInfo.nickName,
                          userAuth: null,
                          userFace:app.globalData.wxuserInfo.avatarUrl
                        }, // 如果是get请求就把参数放在qs里
                        body: {
                          some: 'payload'
                        }, // 如果是post请求就把参数放在body里
                      }
                    }).then(
                      res => {
                        console.log(res.result);
                        console.log("调用云函数")
                        if (res.result == "fail") {
                          console.log(e)
                          that.setData({
                            nextBtnTapable: true
                          })
                        } else {
                          console.log('userinfoByUserid返回值：\n' + res.result)

                          app.globalData.userName = res.result[0][0]
                          app.globalData.userPortrait = res.result[0][1]
                          app.globalData.userLevel = res.result[0][2]
                          app.globalData.userPermission = res.result[0][3]
                          app.globalData.userLoginDays = res.result[0][4]

                          that.tmpChooseClass()

                          // wx.switchTab({
                          //   url: '../my/my'
                          // })
                        }
                      }
                    )
                  }
                }
              )


            } else {
              console.log('验证失败')
              wx.showModal({
                title: '提示',
                content: '验证失败',
                success(res) {
                  wx.reLaunch({
                    url: './index',
                  })
                }
              })
            }
          }
        }
      )
      return
    }
  },

  last() {
    this.setData({
      num: this.data.num - 1,
      currentIndex: (this.data.currentIndex - 1 + 3) % 3
    })
  },

  changeStudentID0(e) {
    console.log(e)
    this.setData({
      info: {
        ...this.data.info,
        studentID: e.detail.value
      },
      studentID0: e.detail.value
    })
  },

  changeStudentID1(e) {
    console.log(e)
    this.setData({
      info: {
        ...this.data.info,
        studentID: e.detail.value
      },
      studentID1: e.detail.value
    })
  },

  changeID1(e) {
    this.setData({
      info: {
        ...this.data.info,
        ID: e.detail.value
      },
      ID1: e.detail.value
    })
  },
  changeLevel1(e) {
    console.log(this.data.info);
    this.setData({
      level1: e.detail.value,
      info: {
        ...this.data.info,
        level: this.data.levelPicker1[e.detail.value]
      }
    })
  },
  changeMajor1(e) {
    console.log(this.data.info);
    this.setData({
      major1: e.detail.value,
      info: {
        ...this.data.info,
        major: this.data.majorPicker1[e.detail.value]
      }
    })
  },
  animation0focus() {
    this.setData({
      animation0: true
    })
  },
  animation0leave() {
    this.setData({
      animation0: false
    })
  },
  animationID0focus() {
    this.setData({
      animationID0: true
    })
  },
  animationID0leave() {
    this.setData({
      animationID0: false
    })
  },
  animationStu1Focus() {
    this.setData({
      animationStu1: true
    })
  },
  animationStu1Leave() {
    this.setData({
      animationStu1: false
    })
  },
  animationID1Focus() {
    this.setData({
      animationID1: true
    })
  },
  animationID1Leave() {
    this.setData({
      animationID1: false
    })
  },
  animationCmp2Focus() {
    this.setData({
      animationCmp2: true
    })
  },
  animationCmp2Leave() {
    this.setData({
      animationCmp2: false
    })
  },
  animationID2Focus() {
    this.setData({
      animationID2: true
    })
  },
  animationID2Leave() {
    this.setData({
      animationID2: false
    })
  },
  changeStudentName0(e) {
    this.setData({
      info: {
        ...this.data.info,
        studentName: e.detail.value
      },
      studentName0: e.detail.value
    })
  },
  changeLevel0(e) {
    console.log(this.data.info);
    this.setData({
      level0: e.detail.value,
      info: {
        ...this.data.info,
        level: this.data.levelPicker0[e.detail.value]
      }
    })
  },
  changeMajor0(e) {
    console.log(this.data.info);
    this.setData({
      major0: e.detail.value,
      info: {
        ...this.data.info,
        major: this.data.majorPicker0[e.detail.value]
      }
    })
  },
  changeCompany(e) {
    this.setData({
      info: {
        ...this.data.info,
        company: e.detail.value
      },
      company: e.detail.value
    })
  },
  changeID2(e) {
    this.setData({
      info: {
        ...this.data.info,
        ID: e.detail.value
      },
      ID2: e.detail.value
    })
  },
  handlePinkTap() {
    this.setData({
      chooseIndex: 0,
      level0: null,
      major0: null,
      studentName0: '',
      info: {
        userType: 1
      }
    })
  },
  handleBlueTap() {
    this.setData({
      chooseIndex: 2,
      level0: null,
      major0: null,
      studentName0: '',
      info: {
        userType: 2
      }
    })
  },
  back() {
    this.setData({
      chooseIndex: 1,
      level1: null,
      major1: null,
      studentID1: '',
      ID1: '',
      ID2: '',
      company: '',
      info: {
        userType: 0
      }
    })
  },

  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    app.globalData.wxuserInfo = e.detail.userInfo
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(e.detail.userInfo)
      console.log('成功获取授权用户信息')
    }
    //接下来写业务代码
    // //最后，记得返回刚才的页面
    // wx.navigateBack({
    // delta: 1
    // })
  },
  hideInfo() {
    this.setData({
      getInfo: 1
    })
  },

  checkRegister() {
    var that = this
    console.log('用户详细数据：\n')
    console.log(app.globalData)

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'user_info_by_userid',
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
        if (res.result == "fail") {

        } else {
          wx.cloud.callFunction({
            name: "getData",
            data: {
              url: app.globalData.serverURL + 'update_list',
              method: 'POST',
              qs: {

              }, // 如果是get请求就把参数放在qs里
              body: {
                flag: 0, //默认不请求
                openid: app.globalData.openid
              }, // 如果是post请求就把参数放在body里
            }
          }).then(
            e => {
              console.log(e.result);

              if (e.result == "fail") {

              } else {
                console.log('update_list成功')
              }
            }
          )
          console.log('标记：' + res.result)
          if (res.result.length !== 0) {
            console.log('userinfoByUserid返回值：\n' + res.result)
            app.globalData.userName = res.result[0][0]
            app.globalData.userPortrait = res.result[0][1]
            app.globalData.userLevel = res.result[0][2]
            app.globalData.userPermission = res.result[0][3]
            app.globalData.userLoginDays = res.result[0][4]
            app.globalData.assistant = res.result[0][5]
            console.log(app.globalData)

            console.log('该用户已注册过')
            wx.switchTab({
              url: '/pages/study/study',
            })
          } else {
            console.log('该用户初次登陆，需注册')
          }
        }
      }
    )

  },


  onLoad() {
    var that = this
    app.userInfoFailCallback = res => {
      //需要授权，出弹窗
      console.log('未授权，需要授权')
      that.setData({
        getInfo: 0
      })
      //这里是第一次获取授权的情况
      app.openIDReadyCallback = res => {

        that.userInfoReadyCallback = res => {
          wx.showModal({
            title: '提示',
            content: '是否使用正式服务器？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                app.globalData.serverURL = "https://chuyanjihua.icu/solfeggio/"
                that.checkRegister()

              } else if (res.cancel) {
                console.log('用户点击取消')
                app.globalData.serverURL = "http://chuyan.ngrok2.xiaomiqiu.cn/solfeggio/"
                that.checkRegister()
              }
            }
          })
          // that.checkRegister()

        }
      }
    }
    //这里是已经获取授权的情况
    app.openIDReadyCallback = res => {

      app.userInfoReadyCallback = res => {
        // that.checkRegister()
        wx.showModal({
          title: '提示',
          content: '是否使用正式服务器？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              app.globalData.serverURL = "https://chuyanjihua.icu/solfeggio/"
              that.checkRegister()

            } else if (res.cancel) {
              console.log('用户点击取消')
              app.globalData.serverURL = "http://chuyan.ngrok2.xiaomiqiu.cn/solfeggio/"
              that.checkRegister()
            }
          }
        })
      }
    }
  },

  saveToStorage(key, data) {
    wx.setStorage({
      key: key,
      data: data
    })
  },

  //本地内存搜索
  searchStorage(key) {
    try {
      const value = wx.getStorageSync(key)
      if (value) {
        console.log()
        console.log(value)
        return value;
      }
    } catch (e) {
      // Do something when catch error
    }
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
        if (res.result != "fail") {
          console.log(res.result)
          wx.switchTab({
            url: '/pages/study/study'
          })
        }
      }
    )

  },

  //以下函数均用于展示，暂时使用
  chooseAssistant() {
    this.setData({
      assChoosen: (this.data.assChoosen + 1) % 2
    })
  },

  handleRecordTap() {
    var that = this;
    let tmp = this.data.recordFlag
    if (tmp == 0) { //录音开始
      const option = {
        duration: 60000,
        format: 'mp3'
      }
      //录制开始
      RM.start(option)
      RM.onStart(() => {
        console.log('recorder start')
      });
      //错误回调
      RM.onError((res) => {
        console.log(res);
      })
    } else { //录音结束
      RM.stop();
      RM.onStop((res) => {
        this.tempFilePath = res.tempFilePath
        console.log('停止录音', res.tempFilePath)
        const {
          tempFilePath
        } = res
        that.setData({ //****************添加了停止录音后显示录音停止样式 */
          audioFile: res.tempFilePath
        })
      })
    }

    this.setData({
      recordFlag: (tmp + 1) % 2
    })
  },

  // uploadAudio() { //上传音频
  //   var that = this
  //   console.log('尝试上传')
  //   wx.uploadFile({
  //     url: app.globalData.serverURL + 'get_sing_score', //函数名待改
  //     filePath: that.data.audioFile,
  //     name: 'file',
  //     header: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     formData: {
  //       'openid': app.globalData.openid,
  //       'partId': '001020101'
  //     },
  //     success(res) {
  //       const data = JSON.parse(res.data)
  //       console.log(data.score)
  //       wx.showModal({
  //         title: '提示',
  //         content:'您的分数为：'+data.score+'\n您当前的等级为 3 级',
  //         showCancel: false,
  //         success(res){
  //           wx.switchTab({
  //             url: '../study/study'
  //           })
  //         }
  //       })
  //     },
  //     fail: (e) => {
  //       console.log(e)
  //     }
  //   })
  // }
})