//音频播放器
let myaudio = null
//（查看答案模式下的）音频播放器
let checkAudio = null
//标准音播放器
let standardAudio = null

const app = getApp()
const FileSystemManager = wx.getFileSystemManager()

Page({
  data: {

    base: "",

    finishedLessonFlag: 0,
    loading: true,
    showListStatus: false,
    shouldPlayTimes: 0,
    nextPlayTime: 0,
    interval: '',
    myCount: 99,
    showNextFlag: 1,
    showLastFlag: 1,
    moveFlag: false,

    playTimeList: {
      "音阶": 3,
      "音程": 3,
      "音组": 3,
      "和弦": 3,
      "节奏": 4,
      "单声部旋律": 5,
      "双声部旋律": 5
    },
    convertList: {
      A: 0,
      B: 1,
      C: 2,
      D: 3
    },

    width: 0,
    // percent: '61.8%',
    offset: 0,
    optionMargin: 3,

    totalScore: 0,
    type: "",
    rank: "",
    lessonNumber: "",
    extra_info: "",
    title: "",
    headway: 0, //间隔时间
    headwayList: {
      "音阶": 5,
      "音程": 5,
      "音组": 5,
      "和弦": 5,
      "节奏": 60,
      "单声部旋律": 120,
      "双声部旋律": 120
    },

    questionList: [],
    optionList: [{
      name: 'A'
    }, {
      name: 'B'
    }, {
      name: 'C'
    }, {
      name: 'D'
    }],

    //页面状态
    stateFlag: 0, //0-做题阶段；1-查看答案；2-提交后的list界面； 3-查看错题的list界面
    isplaying: 0,
    rotateFlag: 0,
    havePlayedTimes: 0,
    hideFlag: 0,

    //音频状态
    audioState: 0,

    //位置
    screenWidth: 0,
    screenHeight: 0,
    top: 0,
    right: 0,

    //拖动相关位置信息
    startX: 0,
    startY: 0,

    // 题目信息
    totalNumber: 0,
    currentIndex: 0, //当前题号
    mySelect: [], //默认初始化为全-1
    mySelectChangable: [], //当前答案是否确认

    //作答信息
    myScore: 99,
    answerList: []
  },

  // 悬浮窗按下
  bindTouchStart(e) {
    console.log('touchstart')
    let that = this
    that.setData({
      startX: that.data.screenWidth - e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  // 悬浮拖动
  bindTouchMove(e) {
    let that = this
    that.setData({
      moveFlag: true
    })
    console.log(that.data.right, that.data.top)
    //此处clientY与clientX为拖动悬浮窗超过设定的大小会返回默认显示位置
    let deltaX = that.data.screenWidth - e.touches[0].clientX - that.data.startX
    let deltaY = e.touches[0].clientY - that.data.startY
    if (that.data.right < that.data.screenWidth - 100 && that.data.top < that.data.screenHeight + 20 && that.data.right > -100 && that.data.top > -20) {
      that.setData({
        right: that.data.right + deltaX,
        top: that.data.top + deltaY,
        startX: that.data.screenWidth - e.touches[0].clientX,
        startY: e.touches[0].clientY
      })
    } else {
      that.setData({
        right: 22,
        top: 60
      })
      return false
    }
  },

  //跳过等待
  handleSkip() {
    this.setData({
      myCount: 1
    })
    standardAudio.stop()
  },

  //播放标准音
  playStandard() {
    let that = this
    //如果音频正在播放，则不允许播放标准音
    console.log("myaudio: " + myaudio.paused)
    if (myaudio && myaudio.paused == false && that.data.stateFlag == 0) return
    if (checkAudio != null && checkAudio.paused == false && that.data.stateFlag == 1) return
    //如果间隔时间小于5s，则不允许播放标准音
    if (that.data.myCount < 5 && that.data.stateFlag == 0) {
      console.log("间隔时间：" + that.data.myCount)
      return
    }
    //播放标准音
    console.log('播放了标准音')
    console.log('真实值' + app.globalData.serverURL + app.globalData.standardAudioSrc)
    console.log(standardAudio.src)
    standardAudio.play()
  },

  // 清除 myaudio 绑定的函数
  resetAudio() {
    myaudio.offPlay()
    myaudio.offEnded()
    myaudio.offTimeUpdate()
  },

  // 弹出lists
  showList: function () {
    console.log('弹出')
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
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

  },

  // 收起lists
  hideList: function () {
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
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
  },

  //在list中选择题目并跳转
  chooseQuestion(e) {
    let that = this
    let index = e.currentTarget.dataset.index

    if (that.data.isplaying == 1) {
      //如果正在播放
      wx.showModal({
        title: '提示',
        content: '音频正在播放，是否要进入上一题？（点击"是"将导致您无法再次收听音频）',
        success() {
          //保存当前页参数
          that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
          myaudio.stop()
          that.resetAudio()

          //清空状态
          clearInterval(that.data.interval)
          that.setData({
            currentIndex: index,
            havePlayedTimes: 0,
            isplaying: 0
          })
          if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
            //如果已经听过音频，则直接进入倒计时
            that.setCountDown()
          }
        },
        fail() {}
      })
    } else {

      //不在播放中
      console.log("last clearint")
      clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval) //清除当前页面的计时器
      that.setData({
        currentIndex: index,
        havePlayedTimes: 0
      })
      if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
        //如果已经听过音频，则直接进入倒计时
        that.setCountDown()
      }
    }

    that.hideList()
  },

  createCheckAudio() {
    checkAudio = wx.createInnerAudioContext()
    checkAudio.obeyMuteSwitch = false
    checkAudio.autoplay = true
  },

  //提交上传
  upload() {
    let that = this
    if (this.data.stateFlag != 0) return;

    that.createCheckAudio()

    //重置进度条
    let tmp = that.data.questionList
    for (let i = 0; i < tmp.length; i++)
      tmp[i].percent = 0
    that.setData({
      questionList: tmp
    })
    myaudio.stop()
    that.resetAudio()
    myaudio.destroy()

    clearInterval(that.data.interval)

    console.log("准备提交。我的选择：")
    console.log(this.data.mySelect)
    console.log("答案：")
    console.log(this.data.answerList)

    //计算小题成绩、大题总成绩
    let totalScore = 0
    let scoreInfo = []
    for (let i = 0; i < that.data.questionList.length; i++) {
      if (that.data.mySelect[i] == that.data.answerList[i]) {
        totalScore += that.data.questionList[i].score
        scoreInfo.push({
          score: that.data.questionList[i].score,
          partid: that.data.questionList[i].partid,
          // ifdo: 暂时未知
        })
      } else {
        scoreInfo.push({
          score: 0,
          partid: that.data.questionList[i].partid,
          // ifdo: 暂时未知
        })
      }
    }
    console.log(totalScore, scoreInfo)
    that.setData({
      myScore: totalScore
    })
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/insert_student_large_qus',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
          solfeggio: "3",
          question_type: this.data.type,
          rank: this.data.rank,
          lesson_num: this.data.lessonNumber,
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
            tmp[i].floatingText = "查看标准答案"
            clearInterval(tmp[i].countDownInterval)
            tmp[i].showProcessFlag = 1
            tmp[i].skipFlag = 0
          }
          that.setData({
            stateFlag: 2,
            isplaying: 0,
            rotateFlag: 0,
            questionList: tmp
          })
        }
      }
    )
  },

  //跳转到作业
  gotoHomework(e) {
    if (e.currentTarget.dataset.flag == 0) {
      //未完成当前课次
      wx.redirectTo({
        url: '/pages/study/chooseCourse/chooseCourse?type=3&rank=' + this.data.rank,
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

  //（在成绩页面）跳转到查看题目详情
  gotoDetail(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      stateFlag: 1,
      currentIndex: index
    })
  },

  // 打开题目列表
  gotoList() {
    if (this.data.stateFlag == 0) {
      this.showList()
    } else if (this.data.stateFlag == 1) {
      this.setData({
        stateFlag: 3
      })
    }
  },

  //回退
  popstack() {
    this.setData({
      stateFlag: 1
    })
  },

  // 上一题
  last() {
    let that = this
    if (that.data.stateFlag == 0) {
      if (that.data.currentIndex == 0) {
        wx.showToast({
          title: '当前为第一题',
          icon: 'none',
          duration: 800
        })
        return;
      }

      if (that.data.isplaying == 1) {
        //如果正在播放
        if (that.data.showLastFlag) {
          wx.showModal({
            title: '提示',
            content: '音频正在播放，是否要进入上一题？（点击"是"将导致您无法再次收听音频）',
            success(res) {
              if (res.confirm) {
                //保存当前页参数
                that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
                myaudio.stop()
                standardAudio.stop()
                that.resetAudio()

                //清空状态
                clearInterval(that.data.interval)
                let tmp = that.data.questionList
                tmp[that.data.currentIndex].percent = 0
                tmp[that.data.currentIndex].showProcessFlag = 0
                tmp[that.data.currentIndex].skipFlag = 0
                that.setData({
                  questionList: tmp,
                  currentIndex: that.data.currentIndex - 1,
                  havePlayedTimes: 0,
                  isplaying: 0,
                  rotateFlag: 0
                })

                if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
                  //如果已经听过音频，则直接进入倒计时
                  console.log('here')
                  that.setCountDown()
                }
              } else {
                console.log('cancel')
              }
            },
          })
          that.setData({
            showLastFlag: 0
          })
        } else {
          //保存当前页参数
          that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
          myaudio.stop()
          standardAudio.stop()
          that.resetAudio()

          //清空状态
          clearInterval(that.data.interval)
          let tmp = that.data.questionList
          tmp[that.data.currentIndex].percent = 0
          tmp[that.data.currentIndex].showProcessFlag = 0
          tmp[that.data.currentIndex].skipFlag = 0
          that.setData({
            questionList: tmp,
            currentIndex: that.data.currentIndex - 1,
            havePlayedTimes: 0,
            isplaying: 0,
            rotateFlag: 0
          })
          if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
            //如果已经听过音频，则直接进入倒计时
            console.log('here')
            that.setCountDown()
          }
        }
      } else {

        //不在播放中
        console.log("last clearint")
        standardAudio.stop()
        clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval) //清除当前页面的计时器
        that.setData({
          currentIndex: that.data.currentIndex - 1,
          havePlayedTimes: 0
        })
        if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
          //如果已经听过音频，则直接进入倒计时
          that.setCountDown()
        }
      }
    }
    if (that.data.stateFlag == 1) {
      if (that.data.currentIndex == 0) {
        wx.showToast({
          title: '当前为第一题',
          icon: 'none',
          duration: 800
        })
      } else {
        standardAudio.stop()
        checkAudio.stop()
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].percent = 0
        that.setData({
          rotateFlag: 0,
          isplaying: 0,
          currentIndex: that.data.currentIndex - 1,
        })
      }
    }

  },

  //下一题
  next() {
    console.log("call next()")
    let that = this

    if (that.data.stateFlag == 0) {
      if (that.data.currentIndex == that.data.totalNumber - 1) {
        //答完最后一题，提交
        var j = 0
        var content = '已完成所有题目，确定提交？'
        for (j = 0; j < that.data.mySelect.length; j++) {
          if (that.data.mySelect[j] == -1 && that.data.mySelectChangable[j] == true) {
            content = '还有题目未完成，确定提交？'
            break;
          }
        }
        wx.showModal({
          title: '提示',
          content: content,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              myaudio.stop()
              that.upload();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      } else { //不是最后一题
        if (that.data.isplaying == 1) {
          //如果正在播放
          if (that.data.showNextFlag) {
            wx.showModal({
              title: '提示',
              content: '音频正在播放，是否要进入下一题？（点击"是"将导致您无法再次收听音频）',
              success(res) {
                if (res.confirm) {
                  //保存当前悬浮文字
                  that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
                  //重置音频状态
                  myaudio.stop()
                  standardAudio.stop()
                  that.resetAudio()
                  // 清空状态
                  clearInterval(that.data.interval)
                  let tmp = that.data.questionList
                  tmp[that.data.currentIndex].percent = 0
                  tmp[that.data.currentIndex].showProcessFlag = 0
                  tmp[that.data.currentIndex].skipFlag = 0
                  that.setData({
                    questionList: tmp,
                    currentIndex: that.data.currentIndex + 1,
                    havePlayedTimes: 0,
                    isplaying: 0,
                    rotateFlag: 0,
                    myCount: that.data.headway
                  })
                  if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
                    //如果已经听过音频，则直接进入倒计时
                    that.setCountDown()
                  }
                } else if (res.cancel) {
                  console.log("cancel")
                }
              },
            })
            that.setData({
              showNextFlag: 0
            })
          } else {
            //保存当前悬浮文字
            that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")

            //重置音频状态
            myaudio.stop()
            standardAudio.stop()
            that.resetAudio()
            // 清空状态
            clearInterval(that.data.interval)
            let tmp = that.data.questionList
            tmp[that.data.currentIndex].percent = 0
            tmp[that.data.currentIndex].showProcessFlag = 0
            tmp[that.data.currentIndex].skipFlag = 0
            that.setData({
              questionList: tmp,
              currentIndex: that.data.currentIndex + 1,
              havePlayedTimes: 0,
              isplaying: 0,
              rotateFlag: 0,
              myCount: that.data.headway
            })
            if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
              //如果已经听过音频，则直接进入倒计时
              that.setCountDown()
            }
          }

        } else {
          //不在播放中
          console.log("next clearint")
          standardAudio.stop()
          clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval) //清除当前页面的计时器
          that.setData({
            currentIndex: that.data.currentIndex + 1,
            havePlayedTimes: 0
          })
          if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
            //如果已经听过音频，则直接进入倒计时
            that.setCountDown()

          }
        }
      }
    }

    if (that.data.stateFlag == 1) {
      if (that.data.currentIndex == that.data.totalNumber - 1) {
        wx.showToast({
          title: '当前为最后一题',
          icon: 'none',
          duration: 800
        })
      } else {
        standardAudio.stop()
        checkAudio.stop()
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].percent = 0
        that.setData({
          rotateFlag: 0,
          isplaying: 0,
          currentIndex: that.data.currentIndex + 1,
        })
      }
    }

  },

  //点击选项
  handleClick(e) {
    let that = this
    if (this.data.stateFlag != 0) return;
    if (this.data.mySelectChangable[that.data.currentIndex] == false) return;

    let cur = e.currentTarget.dataset.index
    let tmp = this.data.mySelect
    tmp[this.data.currentIndex] = cur
    this.setData({
      mySelect: tmp
    })
    console.log(tmp)
  },

  // 设置提示语
  setFloatingText(s) {
    let tmp = this.data.questionList
    tmp[this.data.currentIndex].floatingText = s
    this.setData({
      questionList: tmp
    })
  },

  //点击播放音频
  handlePlay() {
    let that = this
    if (that.data.stateFlag == 0) {
      if (that.data.questionList[that.data.currentIndex].havePlayed == true) {
        //若当前音频已经播放过，则不能播放
        wx.showToast({
          title: "再点击播放按钮也没用了哦！",
          icon: "none"
        })
        return;
      } else {
        //未播放过
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].havePlayed = true
        tmp[that.data.currentIndex].showProcessFlag = 1
        that.setData({
          isplaying: 1, //设为正在播放,
          questionList: tmp
        })

        //设置音频地址
        myaudio.src = app.globalData.serverURL + that.data.questionList[that.data.currentIndex].ques_audio_path
        console.log(myaudio.src)

        myaudio.offPlay()
        myaudio.onCanplay(() => {
          let tmp = that.data.questionList
          console.log(myaudio.duration)
          console.log('duration:' + tmp[that.data.currentIndex].ques_audio_size)
        })
        myaudio.onPlay(() => {
          standardAudio.stop()
        })

        myaudio.onTimeUpdate(() => {
          console.log('当前播放到' + parseFloat(myaudio.currentTime))
          let tmp = that.data.questionList
          tmp[that.data.currentIndex].percent = (myaudio.currentTime) / tmp[that.data.currentIndex].ques_audio_size * 100
          that.setData({
            questionList: tmp
          })
        })

        myaudio.onEnded(() => { //自然播放完毕的回调函数
          let tmp = that.data.questionList
          tmp[that.data.currentIndex].percent = 0
          that.setData({
            questionList: tmp,
            audioState: 0
          })
          console.log('进入等待阶段')
          //播放标准音
          setTimeout(() => {
            that.playStandard()
          }, 500);

          tmp[that.data.currentIndex].percent = 0
          tmp[that.data.currentIndex].showProcessFlag = 0
          tmp[that.data.currentIndex].skipFlag = 1
          that.setData({
            questionList: tmp,
            rotateFlag: 0
          })

          that.setData({ //当前剩余的间隔时间
            myCount: that.data.headway
          })
          that.setFloatingText("音频将在" + that.data.myCount + "s后播放！")
          that.data.interval = that.mySetInterval()
        })

        myaudio.play()
        that.setData({
          rotateFlag: 1,
          havePlayedTimes: that.data.havePlayedTimes + 1
        })
      }
    }
    if (that.data.stateFlag == 1) {
      //待完成： 查看答案时 播放音频逻辑
      if (checkAudio.paused == false) {
        wx.showToast({
          title: "正在播放中",
          icon: "none"
        })
        return
      }
      let tmp = that.data.questionList
      tmp[that.data.currentIndex].havePlayed = true
      tmp[that.data.currentIndex].showProcessFlag = 1
      tmp[that.data.currentIndex].percent = 0
      that.setData({
        isplaying: 1, //设为正在播放,
        rotateFlag: 1,
        questionList: tmp
      })

      //设置音频地址
      checkAudio.src = app.globalData.serverURL + that.data.questionList[that.data.currentIndex].ques_audio_path
      console.log(checkAudio.src)

      checkAudio.onCanplay(() => {
        //打印时长
        let tmp = that.data.questionList
        console.log(checkAudio.duration)
        console.log('duration:' + tmp[that.data.currentIndex].ques_audio_size)
      })

      checkAudio.onPlay(() => {
        //暂停标准音
        standardAudio.stop()
      })

      checkAudio.onTimeUpdate(() => {
        console.log('当前播放到' + parseFloat(checkAudio.currentTime))
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].percent = (checkAudio.currentTime) / tmp[that.data.currentIndex].ques_audio_size * 100
        that.setData({
          questionList: tmp
        })
      })

      checkAudio.onEnded(() => { //自然播放完毕的回调函数
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].percent = 0
        that.setData({
          questionList: tmp,
          rotateFlag: 0,
          isplaying: 0
        })
      })

      checkAudio.play()
    }
  },

  mySetInterval() {
    let that = this
    let interval = setInterval(() => {
      that.setData({
        myCount: that.data.myCount - 1
      })
      that.setFloatingText("音频将在" + that.data.myCount + "s后播放！")

      if (that.data.myCount <= 0) {
        //时间到了
        that.setFloatingText("×" + parseInt(that.data.shouldPlayTimes - that.data.havePlayedTimes))
        clearInterval(that.data.interval)

        if (that.data.havePlayedTimes + 1 >= that.data.shouldPlayTimes) { //如果下一遍就播完了
          myaudio.startTime = 0
          myaudio.offPlay()
          myaudio.onPlay(() => {
            myaudio.offEnded()
            standardAudio.stop()

            let tmp = that.data.questionList
            tmp[that.data.currentIndex].showProcessFlag = 1
            tmp[that.data.currentIndex].skipFlag = 0
            that.setData({
              rotateFlag: 1,
              questionList: tmp
            })
            console.log("这是最后一遍")

            myaudio.onEnded(() => {
              console.log("最后一遍结束了")
              let tmp = that.data.questionList
              tmp[that.data.currentIndex].percent = 0
              tmp[that.data.currentIndex].showProcessFlag = 0
              tmp[that.data.currentIndex].skipFlag = 0
              that.setData({
                isplaying: 0,
                rotateFlag: 0,
                questionList: tmp,
                myCount: 99,
                audioState: 0
              })
              that.setCountDown()
              that.resetAudio()
            })
          })
        }

        if (that.data.havePlayedTimes < that.data.shouldPlayTimes) { //如果还有未播完的次数
          myaudio.startTime = 0
          myaudio.seek(0)
          myaudio.play()
          console.log("play")

          let tmp = that.data.questionList
          tmp[that.data.currentIndex].showProcessFlag = 1
          tmp[that.data.currentIndex].skipFlag = 0
          that.setData({
            havePlayedTimes: that.data.havePlayedTimes + 1,
            rotateFlag: 1,
            questionList: tmp
          })
        }
      }
    }, 1000)
    return interval
  },

  //倒计时
  setCountDown() {
    console.log("call countdown")
    let that = this
    let leftTime = that.data.questionList[that.data.currentIndex].countDownTime

    if (leftTime < 1) {

      //如果计时器已经到时
      let lis = that.data.mySelectChangable
      lis[that.data.currentIndex] = false
      clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval)
      that.setData({
        mySelectChangable: lis //选项不可改动
      })
      that.setFloatingText("当前作答已保存，不可更改")
    } else {
      //如果计时器仍有剩余时间

      that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
      that.data.questionList[that.data.currentIndex].countDownInterval = setInterval(() => {
        let count = that.data.questionList[that.data.currentIndex].countDownTime
        //更新CountDownTime
        let tmp = that.data.questionList
        tmp[that.data.currentIndex].countDownTime = count - 1
        that.setData({
          questionList: tmp
        })
        that.setFloatingText("你有" + that.data.questionList[that.data.currentIndex].countDownTime + "秒钟的时间来修正本题的答案！")
        if (count == 0) {
          //若时间到了
          let lis = that.data.mySelectChangable
          lis[that.data.currentIndex] = false
          clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval)
          that.setData({
            mySelectChangable: lis //选项不可改动
          })
          that.setFloatingText("当前作答已保存，不可更改")
        }
      }, 1000)
    }
  },


  // 返回上一级
  back() {
    let that = this
    wx.navigateBack({
      delta: 0,
      success() {
        myaudio.stop()
        that.resetAudio()
        clearInterval(that.data.interval)
        for (let i = 0; i < that.data.questionList.length; i++) {
          clearInterval(that.data.questionList[that.data.currentIndex].countDownInterval)
        }
      }
    })
  },

  loadAudio() {
    standardAudio = wx.createInnerAudioContext()
    standardAudio.obeyMuteSwitch = false;
    standardAudio.autoplay = false;
    standardAudio.src = app.globalData.serverURL + app.globalData.standardAudioSrc

    myaudio = wx.createInnerAudioContext()
    myaudio.obeyMuteSwitch = false;
    myaudio.autoplay = true;
  },

  onLoad: function (options) {
    console.log(options)
    let that = this
    that.loadAudio()

    console.log("现在使用的服务器地址是：" + app.globalData.serverURL)

    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        that.setData({
          screenHeight: clientHeight,
          screenWidth: clientWidth,
          right: 22,
          top: 60
        })
        // 算出比例
        // let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        // let height = clientHeight * ratio;
        // 设置高度

      }
    });
    this.setData({
      optionMargin: app.globalData.optionMargin,
      width: wx.getMenuButtonBoundingClientRect().left,
      type: options.kind,
      rank: options.rank,
      lessonNumber: options.lessonNumber,
      finishedLessonFlag: options.total - options.now == 1 ? 1 : 0,
      headway: that.data.headwayList[options.kind],
      shouldPlayTimes: that.data.playTimeList[options.kind],
      nextPlayTime: that.data.headwayList[options.kind],
    })
    // that.getStandard()

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/get_info_choice',
        method: 'GET',
        qs: {
          choice_rank: options.rank,
          lesson_num: options.lessonNumber,
          question_kind: options.kind,
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
          //数据处理
          let tmp = Object.values(res.result.question)[0] //题目列表
          let total_score = tmp.total_score

          console.log("原始列表：")
          console.log(tmp)

          let len = Object.keys(tmp).length - 3 //小题总数
          let title = tmp.kind
          delete tmp.kind
          delete tmp.total_score
          let extra_info = tmp.extra_info //暂时不用
          delete tmp.extra_info
          tmp.length = len;
          tmp = Array.from(tmp)

          console.log("questionList：")
          console.log(tmp)

          let myselect = []
          let myselectchangable = []
          let ans = []
          for (let i = 0; i < tmp.length; i++) {
            myselect.push(-1)
            myselectchangable.push(true)
            ans.push(tmp[i].choice_ans)
            tmp[i].havePlayed = false
            tmp[i].countDownTime = 10
            tmp[i].floatingText = "×" + that.data.shouldPlayTimes
            tmp[i].countDownInterval = ""
            tmp[i].percent = 0
            tmp[i].showProcessFlag = 1
            tmp[i].skipFlag = 0
          }

          that.setData({
            questionList: tmp,
            title: title,
            extra_info: extra_info,
            totalNumber: tmp.length,
            mySelect: myselect,
            mySelectChangable: myselectchangable,
            answerList: ans,
            totalScore: total_score
          })

          console.log("当前答案和我的选择：")
          console.log(ans, myselect)
        }
      }
    )
  },


  onUnload() {
    let that = this
    myaudio.stop()
    standardAudio.stop()

    that.resetAudio()

    myaudio.destroy()
    standardAudio.destroy()
    clearInterval(this.data.interval)
    for (let i = 0; i < this.data.questionList.length; i++) {
      clearInterval(this.data.questionList[this.data.currentIndex].countDownInterval)
    }
  },

  onShow() {
    let that = this
    this.setData({
      base: app.globalData.serverURL
    })
    if (that.data.hideFlag == 1) {
      that.setData({
        hideFlag: 0
      })
      if (that.data.rotateFlag) {
        if (that.data.havePlayedTimes < that.data.shouldPlayTimes) {

          let tmp = that.data.questionList
          tmp[that.data.currentIndex].percent = 0
          that.setFloatingText("×" + parseInt(that.data.shouldPlayTimes - that.data.havePlayedTimes))

          that.setData({
            havePlayedTimes: that.data.havePlayedTimes + 1,
            questionList: tmp
          })
          if (that.data.havePlayedTimes >= that.data.shouldPlayTimes) { //如果下一遍就播完了
            myaudio.startTime = 0
            myaudio.offEnded()
            console.log("这是最后一遍")

            myaudio.onEnded(() => {
              console.log("最后一遍结束了")
              let tmp = that.data.questionList
              tmp[that.data.currentIndex].percent = 0
              tmp[that.data.currentIndex].showProcessFlag = 0
              tmp[that.data.currentIndex].skipFlag = 0
              that.setData({
                isplaying: 0,
                rotateFlag: 0,
                questionList: tmp,
                myCount: 99,
                audioState: 0
              })
              that.setCountDown()
              that.resetAudio()
            })
            myaudio.play()
          } else {
            myaudio.startTime = 0
            myaudio.play()
          }

        } else {
          console.log('结束力')
          let tmp = that.data.questionList
          tmp[that.data.currentIndex].percent = 0
          tmp[that.data.currentIndex].showProcessFlag = 0
          tmp[that.data.currentIndex].skipFlag = 0
          that.setData({
            isplaying: 0,
            rotateFlag: 0,
            questionList: tmp,
            myCount: 99,
            audioState: 0
          })
          that.setCountDown()
          that.resetAudio()
        }
      } else {
        if (that.data.isplaying) {
          console.log('继续计时')
          that.data.interval = that.mySetInterval()
        }
      }
    }
  },

  onHide() {
    let that = this
    that.setData({
      hideFlag: 1
    })
    //切出页面时的处理
    if (that.data.isplaying && that.data.rotateFlag) {
      console.log('！！正在播放音频')
      myaudio.stop()
    } else if (that.data.isplaying && !that.data.rotateFlag) {
      console.log('！！正在等待间隔')
      clearInterval(that.data.interval)
    }
  }
})