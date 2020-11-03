// 待实现:
// 1. 录制成功的音频在暂停按钮处控制播放和暂停
// 2. 在提交事件中 录制成功的音频 和 评分 一起上传，写入历史记录
// 3. 点击上一首下一首时切换曲谱
// 4. 点击电脑示范和人工示范拿到示范音频
// 5. 音叉标准音
// 6. 评分、曲目一起加入错题本
// 7. 上面一条导航栏？显示第几题
// 8. 点击关闭列表的下滑动画
// 9. 点击表单的状态
// 10. wechat首页请求歌曲总数写到setSongInfo函数中
// 10. 列表上滑动画
var RM = wx.getRecorderManager()
const FileSystemManager = wx.getFileSystemManager()
var rpx;
wx.getSystemInfo({ //获取屏幕宽度
  success: function (res) {
    rpx = res.windowWidth / 375;
  },
})
var interval = 90 * rpx
const app = getApp()
var day = new Date()
const ctx = wx.createCanvasContext('myCanvas') //画布
var audioCxt = wx.createInnerAudioContext(); //音乐播放器
var audioCxtS = wx.createInnerAudioContext(); //音乐播放器标准
audioCxt.obeyMuteSwitch = false;
audioCxtS.obeyMuteSwitch = false;
var serverURL = "http://192.168.0.105:7890"
var difficulty = '01'
var standardAudio = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

    base: "",
    //画布初始设置
    //width: 350 * rpx,
    height: 50 * rpx,
    // scroll_height: 395 * rpx,
    screenHeight: 667 * rpx,
    screenWidth: 375 * rpx,

    width: 0,
    type: "双声部旋律",
    percent: "0%",

    teacherFlag: 0,
    stopFlag: 1,
    uploadFlag: 0,
    recordFlag: 0,
    finishRecordFlag: 0, ///////////////////////添加了finishRecordFlag判断是否录音完成
    // showAnswerFlag: 0,

    loading: true,
    isRuleTrue: true,
    modalName: null,

    questionId: "",

    //页面状态
    stateFlag: 0, //0-做题阶段；1-提交后的list界面；
    //题目信息
    songSum: 3,
    questionList: [1, 2, 3],
    currentIndex: 0, //当前题号，从0开始，所以currentIndex的最大值为songSum-1
    answerList: [1, 0, 0],

    myScoreList: [{
      done: 1,
      score: 80
    }, {
      done: 1,
      score: 75
    }, {
      done: 0,
      score: -1
    }],

    //**********本首音乐的信息 */
    partId: "",
    part: {
      id: '010302',
      measure: [{
        number: '',
        note: [{
          step: 'c',
          octave: '5',
          tie: '',
          duration: '4',
          alter: '0',
        }, {
          step: '',
          octave: '',
          tie: '',
          duration: '8',
          alter: '',
          x: 100 * rpx,
          y: 30 * rpx,
          imageName: '8'
        }],

      }],
      attributes: {
        beats: '4',
        beat_type: '4',
        divisions: '4',
        key: {
          fifths: 2
        },
        clef: {
          sign: 'G',
          line: 2
        }
      }
    },
    teacherAudio: '',
    computerAudio: '',

    recordImage: ['/image/sing/record.png', '/image/sing/record1.png'],

    size: [60, 60, 60, 60, 60],
    showListStatus: false, //列表flag
    animationData: '',
    homeworkStatus: 0,

    showListStatus1: false, //批改页面flag
    animationData1: '',
    fadeInA: '',

    //******用户添加的数据 */
    audioFile: '',
    activeScore: 0,


  },
  popstack() {
    this.setData({
      stateFlag: 0
    })
  },

  gotoHomework(e) {
    if (e.currentTarget.dataset.flag == 0) {
      //未完成当前课次
      wx.redirectTo({
        url: '/pages/study/chooseCourse/chooseCourse?type=0&rank=' + this.data.rank,
        success(res) {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    } else {
      wx.switchTab({
        url: '/pages/homework/homework',
      })
    }
  },

  gotoDetail(e) {
    //在查看总分页面，选择查看的题目
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      stateFlag: 0,
      currentIndex: index
    })
  },


  back() {
    wx.navigateBack({
      delta: 0,
    })
  },

  hideRule: function () {
    //隐藏遮盖层
    this.setData({
      isRuleTrue: false,
    })
  },

  handleStopTap() {
    //处理暂停点击事件
    let tmp = this.data.stopFlag
    if (this.data.finishRecordFlag) {
      this.playAudio()
      this.setData({
        stopFlag: (tmp + 1) % 2
      })
      console.log('播放')
    } else {
      wx.showToast({
        title: '请先录制音频！',
        icon: 'none',
        duration: 600
      })
    }


  },

  //*****************************************播放暂停音频 */
  playAudio: function () {
    var that = this
    if (!that.data.stopFlag) {
      audioCxt.src = this.data.audioFile;
      audioCxt.play()
    } else {
      audioCxt.pause();
    }
  },

  onShow() {
    this.setData({
      base: app.globalData.serverURL
    })
    // 监听音乐播放
    let that = this

    audioCxt.onPlay(() => {
      that.timer && clearInterval(that.timer)
      that.timer = setInterval(() => {

        let per = (audioCxt.currentTime / audioCxt.duration) * 10000
        console.log("percent:" + Math.round(per) / 100 + '%')
        that.setData({
          percent: Math.round(per) / 100 + '%',
        })

      }, 100)
    })

    // 监听背景音频暂停事件
    audioCxt.onPause(() => {
      clearInterval(that.timer)
    })
    audioCxt.onEnded(() => {
      console.log("音乐停止")
      that.setData({
        stopFlag: 0
      })
    })


  },

  //录音事件
  handleRecordTap() {
    var that = this;
    //处理录音点击事件
    if (this.data.uploadFlag == 0 & this.data.stopFlag == 0) {
      //如果未在播放中 && 未点击上传
      let tmp = this.data.recordFlag
      if (tmp == 0) { //录音开始

        if (that.data.finishRecordFlag == 1) {
          wx.showModal({
            title: '提示',
            content: '确定重新录音？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.recordStart()
                that.setData({
                  recordFlag: (tmp + 1) % 2
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {
          that.recordStart()
          this.setData({
            recordFlag: (tmp + 1) % 2
          })
        }
      } else {
        RM.stop();
        RM.onStop((res) => {
          this.tempFilePath = res.tempFilePath
          console.log('停止录音', res.tempFilePath)
          const {
            tempFilePath
          } = res
          wx.showToast({
            title: '录音完成！',
            icon: "none"
          })
          that.setData({ //****************添加了停止录音后显示录音停止样式 */
            finishRecordFlag: 1,
            audioFile: res.tempFilePath
          })
          var fileName = app.globalData.openid + that.data.partId + ".mp3"
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: fileName,
            // 指定要上传的文件的小程序临时文件路径
            filePath: res.tempFilePath,
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
                that.setData({ //****************添加了停止录音后显示录音停止样式 
                  cloudFile: res.fileList[0].tempFileURL
                })
                // if (this.uploadRecordReadyCallback) {
                //   this.uploadRecordReadyCallback(res)
                //   console.log('成功上传到云存储')
                // }
              }).catch(error => {
                // handle error
              })

            },
          })
          //that.downloadAndSave( res.tempFilePath, fileName.substr(obj + 1))
          that.fadeIn();
        })

        this.setData({
          recordFlag: (tmp + 1) % 2
        })
      }
    } else if (that.data.stopFlag == 1) {
      wx.showToast({
        title: '请先暂停播放音频！',
        icon: "none"
      })
    }
  },
  recordStart() {
    var that = this
    const option = {
      duration: 60000,
      format: 'mp3'
    }
    //录制开始
    that.fadeOut();
    RM.start(option)
    RM.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    RM.onError((res) => {
      console.log(res);
    })

  },

  //********************************************已录音出现动画 */
  fadeIn: function () {
    if (this.data.finishRecordFlag && !this.data.recordFlag) {
      console.log("fadeIn")
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'linear'
      })
      // this.animation = animation
      animation.opacity(1).step()
      this.setData({
        fadeInA: animation.export(),
      })
    }

  },

  //***********************************************已录音消失动画
  fadeOut: function () {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear'
    })
    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      fadeInA: animation.export(),
    })

  },

  handleUploadTap() {
    var that = this

    //处理提交点击事件
    if (this.data.isRuleTrue == false && this.data.recordFlag == 0 && this.data.stopFlag == 0 && this.data.finishRecordFlag == 1) {

      if (that.data.myScoreList[that.data.currentIndex].done == 1) {
        //若已提交过，则直接跳出批改页面
        that.showList({
          currentTarget: {
            dataset: {
              id: 1
            }
          }
        })
      }

      wx.showLoading({
        title: '提交中',
      })
      this.uploadAudio()

      //修改本地访问记录数组
      var theSingHistory = this.searchStorage('singHistory')
      if (theSingHistory != null) {
        console.log('本地已存储')
        theSingHistory[parseInt(that.data.partId.slice(1, 3)) - 1][parseInt(that.data.partId.slice(3, 5)) - 1][parseInt(that.data.partId.slice(5, 7)) - 1][parseInt(difficulty) - 1][0] = theSingHistory[parseInt(that.data.partId.slice(1, 3)) - 1][parseInt(that.data.partId.slice(3, 5)) - 1][parseInt(that.data.partId.slice(5, 7)) - 1][parseInt(difficulty) - 1][0] + 1
        console.log('修改sing记录本地存储')
        this.saveToStorage('singHistory', theSingHistory)
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先录音',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  computerHelp() {
    // 电脑示范
    var that = this
    console.log('电脑示范')
    var computerAudio = app.globalData.serverURL + this.data.questionList[this.data.currentIndex].ques_audio_path
    audioCxtS.src = computerAudio;
    console.log(audioCxtS.src)
    audioCxtS.play()

    that.setData({
      teacherFlag: 1
    })
    audioCxtS.onPlay(() => {
      that.timer && clearInterval(that.timer)
      that.timer = setInterval(() => {

        let per = (audioCxtS.currentTime / audioCxtS.duration) * 10000
        // console.log("percent:"+Math.round(per) / 100 + '%')
        that.setData({
          percent: Math.round(per) / 100 + '%',
        })
      }, 100)
    })

    // 监听背景音频暂停事件
    audioCxtS.onPause(() => {
      clearInterval(that.timer)
    })
    audioCxtS.onEnded(() => {
      console.log("音乐停止")
      that.setData({
        teacherFlag: 0
      })
    })
  },

  manualHelp() {
    // 人工示范
    console.log('人工示范')
    this.getTeacher()
  },

  yincha() {
    //播放标准音
    console.log('播放了标准音')
    // audioCxtS.src = app.globalData.standardAudio;
    audioCxtS.src = app.globalData.serverURL + app.globalData.standardAudioSrc
    console.log(audioCxtS.src)
    audioCxtS.play()
  },

  toFix: function (value) {
    value = value + ''
    if (value.length == 2) {
      return value + ''
    } else if (value.length == 1) {
      return '0' + value
    }
  },

  // showModal(modalName) {
  //   this.setData({
  //     modalName: modalName
  //   })
  // },

  // hideModal(e) {
  //   var that = this
  //   this.setData({
  //     modalName: null
  //   })
  //   if (e.currentTarget.dataset.modal == 'last') {
  //     that.setLast(e.currentTarget.dataset.name)
  //   } else if (e.currentTarget.dataset.modal == 'next') {
  //     that.setNext(e.currentTarget.dataset.name)
  //   } else if (e.currentTarget.dataset.modal != null) {
  //     that.changePart(e.currentTarget.dataset.modal, e.currentTarget.dataset.name)
  //   }
  // },

  setLast() {
    var that = this
    let data = this.data
    let active = data.currentIndex
    var newId = that.data.questionList[(active - 1 + data.questionList.length) % data.questionList.length].partId
    this.setData({
      currentIndex: (active - 1 + data.questionList.length) % data.questionList.length,
      activeScore: 0,
      partId: newId
    })
    that.init()
    console.log('上一首')

  },

  setNext() {
    var that = this
    let data = this.data

    let active = data.currentIndex
    var newId = that.data.questionList[(active + 1) % data.questionList.length].partId
    this.setData({
      currentIndex: (active + 1) % data.questionList.length,
      activeScore: 0,
      partId: newId
    })
    that.init()
    console.log('下一首')
  },

  handleLastTap() {
    //切换上一首歌
    var that = this
    if (this.data.recordFlag == 1) {
      wx.showToast({
        title: '请先停止录音!',
        icon: 'none',
        duration: '600'
      })
    } else if (this.data.stopFlag == 1) {
      wx.showToast({
        title: '请先停止播放音频!',
        icon: 'none',
        duration: '600'
      })
    }
    if (this.data.isRuleTrue == false & this.data.recordFlag == 0 & this.data.stopFlag == 0) {
      if (that.data.currentIndex == 0) {
        wx.showToast({
          title: '当前为第一题',
          icon: 'none',
          duration: 800
        })
        return;
      }
      wx.showModal({
        title: '确定切换题目？',
        content: '切换题目会清空你的作答',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log('上一首')
            that.setLast()

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      // if (this.data.currentIndex == 1) {
      //   wx.showToast({
      //     title: '已是第一题',
      //     icon: 'none',
      //     duration: 600
      //   })
      // } else {
      //   var newId = this.data.partId.slice(0, this.data.partId.length - 2) + that.toFix(this.data.currentIndex - 1) //从01开始，如果从00开始还得-1
      //   console.log('newID' + newId)
      //   that.setData({
      //     partId: newId,
      //     currentIndex: this.data.currentIndex - 1
      //   })
      //   that.init()
      // }
    }
  },

  handleNextTap() {
    //切换下一首歌
    var that = this
    if (this.data.recordFlag == 1) {
      wx.showToast({
        title: '请先停止录音!',
        icon: 'none',
        duration: '600'
      })
    } else if (this.data.stopFlag == 1) {
      wx.showToast({
        title: '请先停止播放音频!',
        icon: 'none',
        duration: '600'
      })
    }
    if (this.data.isRuleTrue == false && this.data.recordFlag == 0 && this.data.stopFlag == 0) {


      if (this.data.uploadFlag == 0) {
        wx.showModal({
          title: '确定切换题目？',
          content: '切换题目会清空你的作答,请在右下角提交答案',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              console.log('下一首')
              that.setNext()

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        if (that.data.currentIndex + 1 == that.data.songSum) {
          //如果所有题都做完了，转到查看总分界面
          that.setData({
            stateFlag: 1
          })
        } else {
          that.setNext()
        }
      }

      // console.log('下一首')
      // that.showModal('next')
      // if (this.data.currentIndex == this.data.songSum) {
      //   wx.showToast({
      //     title: '已是最后一题',
      //     icon: 'none',
      //     duration: 600
      //   })
      // } else {
      //   var newId = this.data.partId.slice(0, this.data.partId.length - 2) + that.toFix(this.data.currentIndex + 1) //从01开始，如果从00开始还得-1
      //   console.log('newID' + newId)
      //   that.setData({
      //     partId: newId,
      //     currentIndex: this.data.currentIndex + 1
      //   })
      //   that.init()
      // }

    }
  },

  chooseQuestion(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.id)
    var that = this

    if (that.data.uploadFlag == 0) {
      wx.showModal({
        title: '提示',
        content: '尚未提交，确定切换题目？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              currentIndex: e.currentTarget.dataset.id
            })
            that.init()
            e.currentTarget.dataset.id = 0
            that.hideList(e)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {

      that.setData({
        currentIndex: e.currentTarget.dataset.id
      })
      that.init()
      e.currentTarget.dataset.id = 0
      that.hideList(e)
    }

  },
  changePart(index, feedback) {
    var that = this
    if (feedback == 'ok') {
      that.setData({
        currentIndex: index,
        partId: that.data.questionList[index].partId
      })
      that.init()
    }
  },

  showList(e) {
    // 弹出lists
    if (this.data.isRuleTrue == false & this.data.recordFlag == 0 & this.data.stopFlag == 0) {

      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out",
        delay: 0
      })
      this.animation = animation
      animation.translateY(500).step()

      if (e.currentTarget.dataset.id == 0) {
        this.setData({
          animationData: animation.export(),
          showListStatus: !this.data.showListStatus
        })
        setTimeout(function () {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export()
          })
        }.bind(this), 40)
      } else {
        this.setData({
          animationData1: animation.export(),
          showListStatus1: !this.data.showListStatus1
        })
        setTimeout(function () {
          animation.translateY(0).step()
          this.setData({
            animationData1: animation.export()
          })
        }.bind(this), 40)
      }

    }
  },

  hideList: function (e) {
    let flag = e.currentTarget.dataset.id
    // 收起lists
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    if (flag == 0) {
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showListStatus: false
        })
      }.bind(this), 120)
    } else {
      wx.hideLoading()
      this.setData({
        animationData1: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData1: animation.export(),
          showListStatus1: false
        })
      }.bind(this), 120)
    }

  },

  handleJudgeTap(e) {
    // 处理提交
    this.setData({
      size: [60, 60, 60, 60, 60]
    })
    let i = e.target.dataset.id - 1
    let tmp = "size[" + i + "]"
    this.setData({
      [tmp]: 80,
    })
  },

  setSongInfo() {
    //请求到歌曲总数，并赋值给songSum
    console.log((this.data.currentIndex + 1) + '/' + this.data.songSum)
    wx.setNavigationBarTitle({
      title: (this.data.currentIndex + 1) + '/' + this.data.songSum,
    })
  },

  //***拿到本part的所有内容 */
  getPart() {
    var that = this

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'get_part', //函数名待改
        method: 'GET',
        qs: {
          partId: this.data.partId,
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
        if (res.result != "fail") { //success
          if (typeof res.result == "object") {
            that.setData({
              part: res.result,
            })
          }
        }
      }
    )
    // wx.request({ //查找所有曲目
    //   url: app.globalData.serverURL + 'get_part', //函数名待改
    //   data: {
    //     partId: this.data.partId,
    //     openid:app.globalData.openid
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //     if (typeof res.data == "object") {
    //       that.setData({
    //         part: res.data,
    //       })
    //       //let myComponent =that.selectComponent('#musicScore'); 

    //       //myComponent.resetReady(res.data);


    //     }
    //   }
    // })

  },

  //***********拿到人声示范 */
  getTeacher() {
    var that = this

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'get_voice_audio', //函数名待改
        method: 'GET',
        qs: {
          partId: this.data.partId
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
            teacherAudio: res.result,
          })
        }
      }
    )
    // wx.request({ //查找所有曲目
    //   url: app.globalData.serverURL + 'get_voice_audio', //函数名待改
    //   data: {
    //     partId: this.data.partId
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //     that.setData({
    //       teacherAudio: res.data,
    //     })
    //   }
    // })

  },

  uploadAudio() { //上传音频
    var that = this
    console.log('尝试上传')
    var setQuestionListDone = 'questionList[' + that.data.currentIndex + '].ifdo'
    var setQuestionListScore = 'questionList[' + that.data.currentIndex + '].score'
    var setQuestionListText = 'questionList[' + that.data.currentIndex + '].text'
    //var fileName=app.globalData.openid+that.data.partId+".mp3"

    //that.uploadRecordReadyCallback = res => {
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'get_sing_score', //函数名待改
        method: "POST",
        qs: {}, // 如果是get请求就把参数放在qs里
        body: {
          file: that.data.cloudFile,
          partId: that.data.partId,
          openid: app.globalData.openid,
          homework_mode: that.data.homeworkStatus
        }, // 如果是post请求就把参数放在body里
      }
    }).then(
      res => {
        console.log(res.result);
        console.log("调用云函数")
        if (res.result != "fail") { //success

          // wx.uploadFile({
          //   url: app.globalData.serverURL + 'get_sing_score', //函数名待改
          //   filePath: that.data.audioFile,
          //   name: 'file',
          //   header: {
          //     'Content-Type': 'multipart/form-data'
          //   },
          //   formData: {
          //     'partId': that.data.partId,
          //     'openid': app.globalData.openid,
          //     'homework_mode':that.data.homeworkStatus
          //   },
          //   success(res) {

          //const data = JSON.parse(res.result)
          const data = res.result
          console.log(data)
          if (typeof (data) == "object") {

            wx.hideLoading()

            that.setData({
              [setQuestionListDone]: 1,
              [setQuestionListScore]: data.score,
              [setQuestionListText]: data.text,
              uploadFlag: 1, //******************这里直接把uploadFlag设为选中状态了，只有点击重新答题才能变成0
            })
            var j = 0
            var answerStatus = 1;
            for (j = 0; j < that.data.questionList.length; j++) {
              if (that.data.questionList[j].ifdo != 1) {
                answerStatus = 0;
                break;
              }
            }
            that.setData({
              answerStatus: answerStatus
            })

            if (answerStatus == 1) {
              var i = 0
              var totalScore = 0
              var scoreInfo = new Array()
              for (i = 0; i < that.data.questionList; i++) {
                totalScore = totalScore + that.data.questionList[i].score
                scoreInfo.push({
                  score: that.data.questionList[i].score,
                  partid: that.data.questionList[i].part_id,
                })
              }
              if (that.data.homeworkStatus != 1) {
                //学习模式应该提交

                wx.cloud.callFunction({
                  name: "getData",
                  data: {
                    url: app.globalData.serverURL + 'minzu/insert_student_large_qus',
                    method: 'GET',
                    qs: {
                      openid: app.globalData.openid,
                      solfeggio: "0",
                      question_type: that.data.type,
                      rank: that.data.rank,
                      lesson_num: that.data.lessonNumber,
                      score: totalScore,
                      score_info: JSON.stringify(scoreInfo)
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
                      console.log("已提交")
                      let tmp = that.data.questionList
                      for (let i = 0; i < tmp.length; i++) {
                        tmp[i].floatingText = "查看标准答案~"
                      }
                      that.setData({
                        //stateFlag: 2,
                        questionList: tmp
                      })
                    }
                  }
                )
              }


              // wx.request({
              //   url: app.globalData.serverURL + 'minzu/insert_student_large_qus',
              //   data: {
              //     openid: app.globalData.openid,
              //     solfeggio: "0",
              //     question_type:that.data.type,
              //     rank: that.data.rank,
              //     lesson_num: that.data.lessonNumber,
              //     score: totalScore,
              //     score_info: scoreInfo
              //   },
              //   method: "GET",
              //   success(res) {
              //     console.log(res.data)
              //     console.log("已提交")
              //     let tmp = that.data.questionList
              //     for (let i = 0; i < tmp.length; i++) {
              //       tmp[i].floatingText = "查看标准答案~"
              //     }
              //     that.setData({
              //       //stateFlag: 2,
              //       questionList: tmp
              //     })
              //   },
              //   fail(err) {
              //     console.log(err)
              //   }
              // })
              // }
            } else {
              wx.hideLoading()
            }

          } else {
            wx.hideLoading()
            wx.showToast({
              title: '提交失败',
              icon: 'loading',
              duration: 2000
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    )
    //}
  },

  init() {
    var that = this
    //*******************************初始化record动画为隐藏
    this.fadeOut()
    //********************************请求本题的信息 */
    //that.getPart()
    console.log('enter'),
      that.setSongInfo()
    // that.getStandard()
    that.setData({
      partId: that.data.questionList[that.data.currentIndex].part_id,
      activeScore: 0,
      stopFlag: 0,
      uploadFlag: 0,
      recordFlag: 0,
      finishRecordFlag: 0, ///////////////////////添加了finishRecordFlag判断是否录音完成
    })

  },


  onLoad: function (options) {
    //得到胶囊的尺寸信息
    this.setData({
      width: wx.getMenuButtonBoundingClientRect().left,
    })
    var that = this
    this.fadeOut() //+++++++++++++++++++++++++++++++++++++++++连接服务器后删 */
    //***********************************拿到选择的题组 */
    console.log(options)




    //**********************************画布初始化 */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          //width: res.windowWidth - 20 * rpx,
          type: options.kind,
          width: wx.getMenuButtonBoundingClientRect().left,
          rank: options.rank,
          lessonNumber: options.lessonNumber,
          finishedLessonFlag: options.total - options.now == 1 ? 1 : 0,
          // scroll_height: res.windowHeight - 272 * rpx
        });
        // that.wuxianpu(0)
        // that.gaoyin()
        // ctx.draw()

      }
    });
    // that.getStandard();
    if (typeof (options.partid) != "undefined") {
      console.log("作业模式")
      that.setData({
        homeworkStatus: 1
      })
      var url = 'minzu/get_info_sing'
      if (options.type == "0") { //sing
        url = 'minzu/get_info_sing'
      } else if (options.type == "3") { //hear
        url = 'minzu/get_info_choice'
      }

      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + url, //函数名待改
          method: 'GET',
          qs: {
            partid: options.partid,
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
          if (res.result != "fail") { //success
            if (typeof (res.result) == "object") { //如果拿到的信息有效
              // for(j=0;j<res.data.length;j++){
              //   if(res.data[j].ques_pic_path){
              //     res.data[j].ques_pic_path=res.data[j].ques_pic_path.replace("\\","/")
              //   }
              // }
              var list = new Array()
              var part = new Object()
              console.log('type' + options.type)
              if (options.type == "3") {
                part.ques_pic_path = res.result.pic_path
                part.ques_audio_path = res.result.ques_audio_path
                part.ques_xml_path = res.result.xml_path
                part.part_id = options.partid
                part.ifdo = 0
              } else if (options.type == "0") {
                console.log(res.result[0])
                part.ques_pic_path = res.result[0][1]
                part.ques_audio_path = res.result[0][0]
                part.ques_xml_path = res.result[0][2]
                // res.result[0][3] //音频时长
                part.part_id = options.partid
                part.ifdo = 0
              }

              list.push(part)
              console.log(list)
              that.setData({
                currentIndex: 0,
                questionList: list,
                songSum: 1,
                partId: list[0].part_id,
              })
              //**********************初始化 */
              that.init()
            }
          }
        }
      )
      // wx.request({
      //   url: app.globalData.serverURL + url, //函数名待改
      //   data: {
      //     partid:options.partid,
      //     openid:app.globalData.openid

      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data) //输出一下

      //     if (typeof (res.data) == "object") { //如果拿到的信息有效
      //       // for(j=0;j<res.data.length;j++){
      //       //   if(res.data[j].ques_pic_path){
      //       //     res.data[j].ques_pic_path=res.data[j].ques_pic_path.replace("\\","/")
      //       //   }
      //       // }
      //       var list=new Array()
      //       var part=new Object()
      //       part.ques_pic_path=res.data.pic_path
      //       part.ques_audio_path=res.data.ques_audio_path
      //       part.ques_xml_path=res.data.xml_path
      //       part.part_id=options.partid
      //       part.ifdo=0
      //       list.push(part)
      //       console.log(list)
      //       that.setData({
      //         currentIndex:0,
      //         questionList: list,
      //         songSum: 1,
      //         partId: list[0].part_id,
      //       })
      //       //**********************初始化 */
      //       that.init()
      //     }
      //   }
      // })


    } else {
      //****************************************拿到本套题的信息和每题id */

      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + 'minzu/get_info_sing', //函数名待改
          method: 'GET',
          qs: {
            choice_rank: options.rank,
            lesson_num: options.lessonNumber,
            question_kind: options.nameId,
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
          if (res.result != "fail") { //success
            if (typeof (res.result) == "object") { //如果拿到的信息有效
              console.log(res.result.length)

              var j = 0
              for (j = 0; j < res.result.length; j++) {
                if (res.result[j].ifdo == 0) {
                  that.setData({
                    currentIndex: j,
                    partId: res.result[j].part_id,
                    //part_pic: app.globalData.serverURL + res.data[that.data.currentIndex].pic_path,
                  })
                  break;
                }
              }
              for (j = 0; j < res.result.length; j++) {
                if (res.result[j].ques_pic_path) {
                  res.result[j].ques_pic_path = res.result[j].ques_pic_path.replace("\\", "/")
                }
              }
              that.setData({
                questionList: res.result,
                songSum: res.result.length,
                partId: res.result[that.data.currentIndex].part_id,
              })
              //**********************初始化 */
              that.init()
            }
          }
        }
      )
      // wx.request({
      //   url: app.globalData.serverURL + 'minzu/get_info_sing', //函数名待改
      //   data: {
      //     choice_rank: options.rank,
      //     lesson_num: options.lessonNumber,
      //     question_kind: options.nameId,
      //     openid:app.globalData.openid
      //     // questionId: that.data.questionId,
      //     // difficulty: difficulty,
      //     // openid: app.globalData.openid
      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data) //输出一下

      //     if (typeof (res.data) == "object") { //如果拿到的信息有效
      //       console.log(res.data.length)

      //       var j = 0
      //       for (j = 0; j < res.data.length; j++) {
      //         if (res.data[j].ifdo == 0) {
      //           that.setData({
      //             currentIndex: j,
      //             partId: res.data[j].part_id,
      //             //part_pic: app.globalData.serverURL + res.data[that.data.currentIndex].pic_path,
      //           })
      //           break;
      //         }
      //       }for(j=0;j<res.data.length;j++){
      //         if(res.data[j].ques_pic_path){
      //           res.data[j].ques_pic_path=res.data[j].ques_pic_path.replace("\\","/")
      //         }
      //       }
      //       that.setData({
      //         questionList: res.data,
      //         songSum: res.data.length,
      //         partId: res.data[that.data.currentIndex].part_id,
      //       })
      //       //**********************初始化 */
      //       that.init()
      //     }
      //   }
      // })
    }


  },

  saveToStorage(key, data) {
    wx.setStorage({
      key: key,
      data: data
    })
  },

  //缓存搜索
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
  downloadAndSave: function (url, path) {
    var that = this
    wx.downloadFile({
      url: url,
      filePath: wx.env.USER_DATA_PATH + '/' + path,
      success: function (res) {
        console.log('成功下载' + res.filePath)
        var filePath = res.filePath
        wx.saveFile({
          tempFilePath: filePath,
          success(res) {
            console.log('文件保存成功')
            console.log(res.savedFilePath)
          }
        })
      }
    })
  },
})