// pages/my/setting/setting.js
const app = getApp()
Page({

  data: {
    portrait: "",
    assistant: "",
    optionMargin: 3,
    picker: ['知行', '美美'],
    optionSizeList: ['小', '中等', '大'],
    recordTimesLeft: 0,
    allowSave: true,
    storageFlag: false,
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      assistant: this.data.picker[e.detail.value]
    })

    app.globalData.assistant = this.data.picker[e.detail.value]

    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'create_stu',
        method: 'GET',
        qs: {
          openid: app.globalData.openid,
          teaching_assistant: app.globalData.assistant
        }, // 如果是get请求就把参数放在qs里
        body: {
          openid: app.globalData.openid,
          teaching_assistant: app.globalData.assistant
        }, // 如果是post请求就把参数放在body里
      }
    }).then(res => {
      console.log(res.result);
      console.log("调用云函数")
      if (res.result == 'fail') {
        console.log('fail')
      } else {
        console.log('上传成功，助教为' + app.globalData.assistant)
      }
    })
  },

  optionSizeChange(e) {
    let that = this
    that.setData({
      optionIndex: e.detail.value,
      optionMargin: parseInt(e.detail.value) + 1
    })
    app.globalData.optionMargin = that.data.optionMargin
    that.saveToStorage("optionMargin", that.data.optionMargin)
    console.log(app.globalData.optionMargin)
  },

  switchAllowSaveChange(e) {
    console.log(e);
    this.setData({
      allowSave: e.detail.value
    })
    app.globalData.allowSave = e.detail.value
  },

  onLoad: function (options) {
    var that = this
    console.log(options.portrait)
    wx.getStorageInfo({
      success(res) {
        console.log('目前缓存：' + res.currentSize)
        if (res.currentSize >= 0) {
          that.setData({
            storageFlag: false
          })
        } else {
          that.setData({
            storageFlag: true
          })
        }
      }
    })

    this.setData({
      portrait: app.globalData.userPortrait,
      assistant: app.globalData.assistant,
      optionMargin: app.globalData.optionMargin,
      recordTimesLeft: app.globalData.recordTimesLeft,
      allowSave: app.globalData.allowSave
    })

    wx.getStorage({
      key: 'optionMargin',
      success: function (res) {
        console.log(res.data)
        app.globalData.optionMargin = res.data
        that.setData({
          optionMargin: res.data
        })

      },
      fail: function (res) {
        console.log(res)
        console.log('缓存中未设置 optionMargin， 默认为大号')
      }
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
          var getKind=newChooseImgs.split(".")
          var d=new Date()
          var fileName=app.globalData.openid+"_avatarURL"+d.getTime()+"."+getKind[getKind.length-1]
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
                 app.globalData.userPortrait= res.fileList[0].tempFileURL
                
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
                        portrait:app.globalData.userPortrait
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
          
          // wx.uploadFile({
          //   url: app.globalData.serverURL + 'library/user_face/' + app.globalData.openid,
          //   filePath: newChooseImgs,
          //   header: {
          //     'content-type': 'multipart/form-data'
          //   },
          //   name: 'file',
          //   success: function (e) {
          //     console.log(e)
          //     if (e.data) {
          //       console.log("上传成功");
          //       let imageName = e.data.split('\\').pop()
          //       let subAddr = 'library/user_face/' + app.globalData.openid + '/' + imageName
          //       let addr = app.globalData.serverURL + subAddr
          //       that.setData({
          //         portrait: addr
          //       });
          //       app.globalData.userPortrait = subAddr

          //       wx.showToast({
          //         title: "上传成功",
          //         icon: 'success',
          //         duration: 1000
          //       });
          //       wx.request({
          //         url: app.globalData.serverURL + 'update_userinfo?user_face=' + imageName + '&openid=' + app.globalData.openid,
          //         success(e) {
          //           console.log('头像成功替换')
          //         }
          //       })
          //     } else {
          //       console.log("上传出错", e);
          //       wx.showToast({
          //         title: "上传出错",
          //         icon: 'none',
          //         duration: 1000
          //       });
          //     }
          //   },
          //   fail: function (e) {
          //     console.log("访问接口失败", e);
          //     wx.showToast({
          //       title: "网络出错",
          //       icon: 'none',
          //       duration: 1000
          //     });
          //   },
          // });



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
  clearStorage() {
    var that = this
    wx.clearStorage({
      success(res) {
        that.setData({
          storageFlag: true
        })
      }
    })


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
})