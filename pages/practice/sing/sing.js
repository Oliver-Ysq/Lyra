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
const ctx = wx.createCanvasContext('myCanvas') //画布
var audioCxt = wx.createInnerAudioContext(); //音乐播放器
var audioCxtS = wx.createInnerAudioContext(); //音乐播放器标准
var serverURL = "http://192.168.0.105:7890"
var difficulty = '01'
var standardAudio = ''

Page({
  data: {
    //画布初始设置
    width: 350 * rpx,
    height: 50 * rpx,
    scroll_height: 395 * rpx,
    screenHeight: 667 * rpx,
    screenWidth: 375 * rpx,

    loading: true,
    processFlag: 0,

    stopFlag: 0,
    uploadFlag: 0,
    recordFlag: 0,
    finishRecordFlag: 0, ///////////////////////添加了finishRecordFlag判断是否录音完成
    showAnswerFlag: 0,

    isRuleTrue: true,
    isRuleTrueUp: false,
    modalName: null,

    questionId: "",

    songNumber: 0,
    songSum: 15,
    lists: [{
        score: 99,
        partid: "010301",
        done: 1,
      }, {
        score: 98,
        partid: "010302",
        done: 1,
      }, {
        score: 97,
        partid: "010303",
        done: 1,
      }, {
        score: 95,
        partid: "010304",
        done: 1,
      },
      {
        score: 0,
        partid: "010305",
        done: 0,
      }
    ],

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


    assFlag: 0,
    assistantImage: ['/image/sing/assistant/1.png', '/image/sing/assistant/2.png', '/image/sing/assistant/3.png'],
    stopImage: ['/image/sing/stop.png', '/image/sing/stop1.png'],
    uploadImage: ['/image/sing/upload.png', '/image/sing/upload1.png'],
    recordImage: ['/image/sing/record.png', '/image/sing/record1.png'],


    size: [60, 60, 60, 60, 60],
    notesFlag: 0,
    showListStatus: false,
    animationData: '',
    fadeInA: '',

    //******用户添加的数据 */
    audioFile: '',
    activeScore: 0,


  },



  //*********************************** */

  hideRule: function () {
    //隐藏遮盖层
    this.setData({
      isRuleTrue: false,
    })
  },

  hideRuleUp: function () {
    //隐藏示范遮盖层
    let tmp = this.data.assFlag
    let upflag = this.data.uploadFlag
    this.setData({
      isRuleTrue: false,
      isRuleTrueUp: false,
      assFlag: (tmp + 2) % 4,
      //uploadFlag: (upflag + 1) % 2,     ************这里把隐藏示范遮盖层修改upload改了，因为再次点击后应该显示正确答案
      showAnswerFlag: 1, //*****************************在已提交的基础上点击卡片可查看具体错误点 */
      size: [60, 60, 60, 60, 60]
    })
  },

  handleStopTap() {
    //处理暂停点击事件
    let tmp = this.data.stopFlag
    if (this.data.finishRecordFlag) {
      this.bofang()
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
  bofang: function () {
    var that = this
    if (!that.data.stopFlag) {
      audioCxt.src = this.data.audioFile;
      audioCxt.play()
    } else {
      audioCxt.pause();
    }
  },

  handleRecordTap() {
    var that = this;
    //处理录音点击事件
    if (this.data.uploadFlag == 0 & this.data.stopFlag == 0) {
      //如果未在播放中 && 未点击上传
      let tmp = this.data.recordFlag

      if (tmp == 0) { //录音开始
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
      } else { //录音结束
        RM.stop();
        RM.onStop((res) => {
          this.tempFilePath = res.tempFilePath
          console.log('停止录音', res.tempFilePath)
          const {
            tempFilePath
          } = res
          that.setData({ //****************添加了停止录音后显示录音停止样式 */
            finishRecordFlag: 1,
            audioFile: res.tempFilePath
          })
          that.fadeIn();
        })
      }

      this.setData({
        recordFlag: (tmp + 1) % 2
      })
    }
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
    if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false & this.data.recordFlag == 0 & this.data.stopFlag == 0 & this.data.finishRecordFlag == 1) { //**********已添加finishRecordFlag判定是否录制完成
      let tmp = this.data.uploadFlag
      let ass = this.data.assFlag
      this.setData({
        //uploadFlag: (tmp + 1) % 2,
        uploadFlag: 1, //******************这里直接把uploadFlag设为选中状态了，只有点击重新答题才能变成0
        assFlag: (ass + 2) % 4,
        isRuleTrueUp: true,
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
    }
  },

  handleAssTap() {
    // 点击小助手后的状态变化
    if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false) {
      let tmp = this.data.assFlag
      let p = this.data.processFlag
      this.setData({
        assFlag: (tmp + 1) % 2,
        processFlag: (p + 1) % 2
      })
      this.computerHelp();
    }
    //*****************************************添加了再次点击取消遮罩 */
    // else if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false) {
    //   let tmp = this.data.assFlag
    //   this.setData({
    //     assFlag: (tmp + 1) % 2,
    //   })
    // }
  },

  yincha() {
    //播放标准音
    console.log('播放了标准音')
    audioCxtS.src = app.globalData.standardAudio;
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

  showModal(modalName) {
    this.setData({
      modalName: modalName
    })
  },

  hideModal(e) {
    var that = this
    this.setData({
      modalName: null
    })
    if (e.currentTarget.dataset.modal == 'last') {
      that.setLast(e.currentTarget.dataset.name)
    } else if (e.currentTarget.dataset.modal == 'next') {
      that.setNext(e.currentTarget.dataset.name)
    } else if (e.currentTarget.dataset.modal != null) {
      that.changePart(e.currentTarget.dataset.modal, e.currentTarget.dataset.name)
    }
  },
  // handleLastTap() {
  //   //切换上一首歌
  //   var that = this
  //   if (that.data.isRuleTrue == false) {
  //     that.showModal('last')
  //   }
  // },
  setLast(feedback) {
    var that = this
    let data = this.data
    if (feedback == 'ok') {
      let active = data.songNumber
      var newId = that.data.lists[(active - 1 + data.lists.length) % data.lists.length].partId
      this.setData({
        songNumber: (active - 1 + data.lists.length) % data.lists.length,
        activeScore: 0,
        partId: newId
      })
      that.init()
      console.log('上一首')
    }
  },
  // handleNextTap() {
  //   //切换下一首
  //   var that = this
  //   if (that.data.isRuleTrue == false) {
  //     that.showModal('next')
  //   }
  // },
  setNext(feedback) {
    var that = this
    let data = this.data
    if (feedback == 'ok') {
      let active = data.songNumber
      var newId = that.data.lists[(active + 1) % data.lists.length].partId
      this.setData({
        songNumber: (active + 1) % data.lists.length,
        activeScore: 0,
        partId: newId
      })
      that.init()
      console.log('下一首')
    }
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
    if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false & this.data.recordFlag == 0 & this.data.stopFlag == 0) {
      that.showModal('last')
      console.log('上一首')
      // if (this.data.songNumber == 1) {
      //   wx.showToast({
      //     title: '已是第一题',
      //     icon: 'none',
      //     duration: 600
      //   })
      // } else {
      //   var newId = this.data.partId.slice(0, this.data.partId.length - 2) + that.toFix(this.data.songNumber - 1) //从01开始，如果从00开始还得-1
      //   console.log('newID' + newId)
      //   that.setData({
      //     partId: newId,
      //     songNumber: this.data.songNumber - 1
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
    if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false & this.data.recordFlag == 0 & this.data.stopFlag == 0) {
      console.log('下一首')
      that.showModal('next')
      // if (this.data.songNumber == this.data.songSum) {
      //   wx.showToast({
      //     title: '已是最后一题',
      //     icon: 'none',
      //     duration: 600
      //   })
      // } else {
      //   var newId = this.data.partId.slice(0, this.data.partId.length - 2) + that.toFix(this.data.songNumber + 1) //从01开始，如果从00开始还得-1
      //   console.log('newID' + newId)
      //   that.setData({
      //     partId: newId,
      //     songNumber: this.data.songNumber + 1
      //   })
      //   that.init()
      // }

    }
  },
  //*******************************lists************************ */
  chooseQuestion(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this
    that.hideList()
    that.showModal(e.currentTarget.dataset.id)
  },
  changePart(index, feedback) {
    var that = this
    if (feedback == 'ok') {
      that.setData({
        songNumber: index,
        partId: that.data.lists[index].partId
      })
      that.init()
    }
  },

  showList: function () {
    // 弹出lists
    if (this.data.isRuleTrue == false & this.data.isRuleTrueUp == false & this.data.recordFlag == 0 & this.data.stopFlag == 0) {

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
    }
  },

  hideList: function () {
    // 收起lists
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
  //**********************************************错题本 */
  handleNotesTap() {
    // 处理加入错题本事件
    var that = this
    //add
    if (that.data.lists[that.data.songNumber].added != 1) {
      that.addToNotes()

    } else { //delete
      that.deleteNotes()
    }

  },
  //*******************************处理重做 */
  redoTap() {
    this.fadeOut()
    this.setData({
      finishRecordFlag: 0,
      uploadFlag: 0,
      showAnswerFlag: 0,
    })

  },
  setSongInfo() {
    //请求到歌曲总数，并赋值给songSum
    console.log((this.data.songNumber + 1) + '/' + this.data.songSum)
    wx.setNavigationBarTitle({
      title: (this.data.songNumber + 1) + '/' + this.data.songSum,
    })
  },

  //************************************************这里是向服务器发送请求的函数们 */

  //***拿到本part的所有内容 */
  getPart() {
    var that = this
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_part', //函数名待改
      data: {
        partId: this.data.partId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (typeof res.data == "object") {
          that.setData({
            part: res.data,
          })
          //let myComponent =that.selectComponent('#musicScore'); 

          //myComponent.resetReady(res.data);


        }
      }
    })

  },
  //***********拿到人声示范 */
  getTeacher() {
    var that = this
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_voice_audio', //函数名待改
      data: {
        partId: this.data.partId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          teacherAudio: res.data,
        })
      }
    })

  },




  //***********拿到标准音 */
  getStandard() {
    var that = this
    //请求标准音
    //先从本地内存找历史记录。没有再说
    FileSystemManager.access({
      path: wx.env.USER_DATA_PATH + '/standardAudio',
      success(res) {
        console.log(res)
        if (res.errMsg == "access:ok") {
          console.log('本地已存储标准音')
        } else {
          console.log('本地未存储标准音')
          wx.request({ //查找所有曲目
            url: app.globalData.serverURL + 'standard_voice',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.downloadAndSave(app.globalData.serverURL + res.data, 'standardAudio')
            }
          });

        }

      },
      fail(res1) {
        console.log(res1)
      }
    })

  },
  //********访问错题本 */
  addToNotes() {
    var that = this
    let tmp = "lists[" + (this.data.songNumber) + "].added"
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'insert_distinct_wrong_list', //函数名待改
      data: {
        partId: this.data.partId,
        openid: app.globalData.openid,
        // mark: that.data.activeScore,
        // difficulty: difficulty,
        // part:that.data.part
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)

        if (res.data == '1') {
          that.setData({
            [tmp]: 1
          })
          wx.showToast({
            title: '成功添加到错题本',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }

      }
    })

  },
  //********检查错题本 */
  checkNotes() {
    var that = this
    let tmp = "lists[" + (this.data.songNumber) + "].added"
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'seek_wrong_rec', //函数名待改
      data: {
        partId: this.data.partId,
        openid: app.globalData.openid,
        difficulty: difficulty
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('错题本查询结果')
        console.log(res.data)

        if (parseInt(res.data) == 1) {
          that.setData({
            [tmp]: 1
          })
        } else {
          that.setData({
            [tmp]: 0
          })
        }
      }
    })

  },
  //********删除错题本 */
  deleteNotes() {
    var that = this
    let tmp = "lists[" + (this.data.songNumber) + "].added"
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'del_wrong_rec', //函数名待改
      data: {
        partId: this.data.partId,
        userId: app.globalData.openid,
        difficulty: difficulty,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)

        if (res.data == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          that.setData({
            [tmp]: 0
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }

      }
    })

  },

  //********尝试访问一个音频 */
  tryWav() {
    console.log('try')
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'to_wav', //函数名待改
      data: {
        partId: '10010010100010',
        // userId: app.globalData.openid,
        difficulty: difficulty
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        // if (typeof res.data == "object") {
        //   that.setData({
        //     computerAudio: res.data,
        //   })
        // }

      }
    })

  },


  uploadAudio() { //上传音频
    var that = this
    console.log('尝试上传')
    wx.uploadFile({
      url: app.globalData.serverURL + 'get_sing_score', //函数名待改
      filePath: that.data.audioFile,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        'partId': that.data.partId,
        'openid': app.globalData.openid,
      },
      success(res) {
        const data = JSON.parse(res.data)
        console.log(data)
        that.setData({
          score: data.score,
          text: data.text
        })
      }
    })
  },

  init() {
    var that = this
    //*******************************初始化record动画为隐藏
    this.fadeOut()
    //********************************请求本题的信息 */
    that.getPart()
    console.log('enter'),
      that.setSongInfo()
    that.checkNotes()
    that.getStandard()
    that.setData({
      activeScore: 0
    })

  },





  //*************************************页面加载函数 */
  onLoad(options) {
    var that = this
    this.fadeOut() //+++++++++++++++++++++++++++++++++++++++++连接服务器后删 */
    //***********************************拿到选择的题组 */
    console.log(options.id)
    console.log('difficulty' + options.id.slice(-2))
    difficulty = parseInt(options.id.slice(-2)) + ''
    this.setData({
      questionId: options.id.slice(0, options.id.length - 2)
    })



    //**********************************画布初始化 */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          width: res.windowWidth - 20 * rpx,
          scroll_height: res.windowHeight - 272 * rpx
        });
        // that.wuxianpu(0)
        // that.gaoyin()
        // ctx.draw()

      }
    });

    //****************************************拿到本套题的信息和每题id */

    console.log(that.data.questionId.slice(0, that.data.questionId.length - 2))
    wx.request({
      url: app.globalData.serverURL + 'get_info', //函数名待改
      data: {
        questionId: that.data.questionId,
        difficulty: difficulty,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data) //输出一下

        if (typeof (res.data) == "object") { //如果拿到的信息有效
          console.log(res.data.length)
          that.setData({
            lists: res.data,
            songSum: res.data.length,
            partId: res.data[0].partId,

          })
          var j = 0
          for (j = 0; j < res.data.length; j++) {
            if (res.data[j].done == 0) {
              that.setData({
                songNumber: j,
                partId: res.data[j].partId,
                part_pic: app.globalData.serverURL + res.data[that.data.songNumber].pic_path,
              })
              break;
            }
          }
          //**********************初始化 */
          that.init()



        }


      }
    })



  },
  //存储到缓存
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