const watch = require("../../../utils/watch.js");
const app = getApp();
Page({

  data: {
    pic_type: [],
    name: 'oliver',
    type: '',
    arrowFlag: 0,
    animationData: '',
    showChange: false,
    title: '',
    content: '',
    anonymous: true,
    goldNumber: 3,
    placeholder: ['我有疑问...', '分享今天的心情...', '配上一段文字吧...', '配上一段文字吧'],
    typeList: [{
      type: 1,
      name: '问题',
      url: '/image/contact/question.png'
    }, {
      type: 2,
      name: '状态',
      url: '/image/contact/commentBtn.png'
    }, {
      type: 3,
      name: '音乐',
      url: '/image/contact/music.png'
    }, {
      type: 4,
      name: '视频',
      url: '/image/contact/video.png'
    }],
    initTypeList: [{
      type: 1,
      name: '问题',
      url: '/image/contact/question.png'
    }, {
      type: 2,
      name: '状态',
      url: '/image/contact/commentBtn.png'
    }, {
      type: 3,
      name: '音乐',
      url: '/image/contact/music.png'
    }, {
      type: 4,
      name: '视频',
      url: '/image/contact/video.png'
    }],
    btnList: [{
      id: 0,
      name: 'picture',
      height: 60,
      width: 60
    }, {
      id: 1,
      name: 'at',
      height: 60,
      width: 60
    }, {
      id: 2,
      name: 'smile',
      height: 56,
      width: 56
    }, {
      id: 3,
      name: 'music',
      height: 64,
      width: 64
    }],
    initBtnList: [{
      id: 0,
      name: 'picture',
      height: 60,
      width: 60
    }, {
      id: 1,
      name: 'at',
      height: 60,
      width: 60
    }, {
      id: 2,
      name: 'smile',
      height: 56,
      width: 56
    }, {
      id: 3,
      name: 'music',
      height: 64,
      width: 64
    }],
    imgList: [],
  },
  watch: {
    type(newV, oldV) {
      console.log('newV', newV, 'to', 'oldV', oldV)
      const my = this.data
      //如果从[类型1]离开，清空标题、内容、图片、赏金、匿名
      if (oldV === 1) {
        this.setData({
          title: '',
          content: '',
          anonymous: true,
          goldNumber: 3,
          imgList: [],
        })
      }
      //如果从[类型2]离开，清空内容和图片
      else if (oldV === 2) {
        this.setData({
          content: '',
          imgList: [],
        })
      }
      //如果来到[类型4]，选择视频
      if (newV === 4) {
        this.getVideo()
        this.setBtnList()
      } else if (newV === 3) {
        this.setBtnList()
      } else if (newV === 1 || newV === 2) {
        this.setData({
          btnList: my.initBtnList
        })
      }
    }
  },
  setBtnList() {
    const my = this.data
    const arr = my.initBtnList
    arr.splice(3, 1)
    arr.splice(0, 1)
    this.setData({
      btnList: arr
    })
  },
  handleNonameTap(e) {
    this.setData({
      anonymous: e.detail.value
    })
  },
  add() {
    this.setData({
      goldNumber: parseInt(this.data.goldNumber) + 1
    })
    console.log('add')
  },
  minus() {
    this.setData({
      goldNumber: parseInt(this.data.goldNumber) - 1
    })
    console.log('minus')
  },
  setGoldNumber(e) {
    this.setData({
      goldNumber: e.detail.value
    })
  },
  handleArrowTap() {
    const flag = this.data.arrowFlag;
    if (flag == 0) {
      this.showList()
    } else {
      this.hideList()
    }
    this.setData({
      arrowFlag: (flag + 1) % 2
    })
  },
  getTitle(e) {
    // console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  getContent(e) {
    // console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  chooseImg() {
    const that = this
    wx.chooseImage({
      count: 3, //可选张数 1~9
      success: function success(res) {
        console.log(res);
        var images = [];
        res.tempFiles.forEach(function (item) {
          // 这里可以去限制图片大小 
          if (item.size > 5242880) {
            wx.showToast({
              title: '图片限制在5M之内',
              icon: 'none'
            });
          } else {
            const imgSplit = item.path.split(".");
            const imgSLen = imgSplit.length;
            // console.log("格式", imgSplit, imgSLen, imgSLen - 1);
            console.log(imgSplit[imgSLen - 1]);

            images.push(item.path);
          }
        });
        that.setData({
          imgList: that.data.imgList.concat(images)
        })

      }
    });
  },
  getVideo() {
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
      },
      fail() {
        console.log('fail')
      }
    })
  },
  handleBtnTap(e) {
    if (e.target.dataset.id === 0) {
      this.data.imgList.length < 3 ?
        this.chooseImg() :
        wx.showToast({
          title: '已选满三张，点击图片重新选择哦！',
          icon: 'none'
        })
    }
  },
  handleChangeType(e) {
    const flag = this.data.arrowFlag
    const id = e.currentTarget.dataset.id
    const arr = this.data.initTypeList.slice(0)
    arr.splice(id - 1, 1)
    this.setData({
      type: id,
      showChange: false,
      typeList: arr,
      arrowFlag: (flag + 1) % 2
    })
  },

  showList: function () {
    // 弹出list
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
      showChange: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 40)

  },

  hideList: function () {
    // 弹出list
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
        showChange: false
      })
    }.bind(this), 120)
    //矫正箭头方向
    this.setData({
      arrowFlag: 0
    })
    console.log(this.data.imgList);
  },
  // upload() {
  //   const my = this.data
  //   console.log(`提交类型：类型${my.data}`)
  //   console.log('标题', my.title, '内容', my.content, '打赏', my.goldNumber, '匿名', my.anonymous)
  //   // wx.navigateBack()
  // },
  // succeeded() {
  //   const that = this
  //   wx.showToast({
  //     title: `${this.data.type}类型发表成功！`,
  //     success() {
  //       that.upload()
  //     }
  //   })
  // },
  onLoad(options) {
    watch.setWatcher(this)
    wx.setNavigationBarTitle({
      title: this.data.name
    })
    const type = parseInt(options.type)
    const arr = this.data.initTypeList.slice(0)
    arr.splice(type - 1, 1)
    this.setData({
      type,
      typeList: arr
    })
    if (type === 4) {
      this.getVideo()
    }
  },


  preview(e) {
    console.log(app.globalData.wxuserInfo.avatarUrl)
    console.log('预览')
    console.log(e)
    const index = e.currentTarget.id
    const images = this.data.imgList
    console.log(images)
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images,
    })
  },
  /**
   * 删除图片
   */
  deleteImg: function (e) {
    const that = this;
    console.log('移除')
    console.log(e)
    // 定义操作菜单
    wx.showActionSheet({
      itemList: ['移除图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          let index = e.currentTarget.id
          that.data.imgList.splice(index, 1)
          that.setData({
            imgList: that.data.imgList
          })
        }
      }
    })
  },

  submit: function () {
    wx.showToast({
      title: '上传中',
      icon: "loading",
      duration: 5000
    })
    let that = this;
    // 上传图片 得到pic_url 
    Promise.all(that.asyncImgUploadFile(that.data.imgList)).then((res) => {
      let URLS = "";
        res.forEach((item, index) => {
        URLS = URLS + item + " ";
        console.log("分次返回的结果")
        console.log(res)
      })
      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + 'minzu/discussion',
          method: 'GET',
          qs: {
            openid: app. globalData.openid,
            mode: "P",
            title: that.data.title,
            txt: that.data.content,
            pic_url: URLS
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
            console.log("失败")
          } else {
            wx.showToast({
              title: '上传成功',
              icon: "success",
              duration: 1000,
              success: function () {
                console.log('back')
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
        }
      )
    })
  },
  // 封装Promise 对象
  asyncImgUploadFile: function (file, type) {
    var that=this
    let p1 = [];

    for (let i = 0; i < file.length; i++) {

      const imgSplit = file[i].split(".");
      const imgSLen = imgSplit.length;
      // console.log("格式", imgSplit, imgSLen, imgSLen - 1);
      // console.log(imgSplit[imgSLen - 1]);
      this.data.pic_type[i] = imgSplit[imgSLen - 1];
      console.log(imgSplit[imgSLen - 1]);
      p1.push(new Promise((resolve, reject) => {
        //上传图片到服务器 
        // console.log(app.globalData.serverURL + 'library/ask/' + (i).toString()+'.'+imgSplit[imgSLen - 1])
        console.log(file[i])
        var getFilename=file[i].split("/")
        var fileName=getFilename[getFilename.length-1]
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: fileName,
          // 指定要上传的文件的小程序临时文件路径
          filePath: file[i], //图片的临时路径
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
              that.setData({ 
                cloudFile: res.fileList[0].tempFileURL
              })
              resolve(res.fileList[0].tempFileURL)
            })
           }
         })
      }))
    }
    return p1;
  },
})