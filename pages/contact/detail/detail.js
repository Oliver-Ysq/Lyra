var app = getApp();
var _page = 0; //当前分页页码

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pic_type: [],
    urls: [],
    urls2: ["", "", "", "", "", ""],
    urls3: ["", "", "", "", "", ""],
    imgToSend: [],
    url: "/image/my/head.jpg",
    redPoint: false,
    detail: {},
    imgList: [],
    inputShowed: false,
    content: "",
    commentInfo: [],
    commentFlag: 0,
    currentID: '',
    commentToComment: false,
    currentStart: 0,
    currentEnd: 100,
    toEnd: false,
    table: [],
    replyTip: "我要回复...",
    previewUrls: [],
    notToChoosePic: true,
    currentTopID: 0,
  },

  handleImgStr: function (string) {
    if ((string != "") || (string != "\n")) {
      var array = string.split(" ")
      for (var i = 0; i < array.length; i++) {

        if (array[i] == "") {
          array.splice(i, 1);
        }
      }
      return array;
    } else {
      return [];
    }
  },
  commentComment: function (e) {
    this.setData({
      inputShowed: true,
    })
    setTimeout(() => {
      this.setData({
        currentID: e.currentTarget.dataset.id,
        currentReplyName: e.currentTarget.dataset.replyname,
        commentToComment: true,
        commentFlag: 1,

      })
      console.log("当前id:" + this.data.currentID)
      console.log("当前要回复的用户名：" + this.data.currentReplyName)
    }, 100);
  },
  commentofComment: function (e) {
    this.setData({
      inputShowed: true,
    })
    setTimeout(() => {
      this.setData({
        currentID: this.data.commentInfo[e.currentTarget.dataset.fatherindex].comments[e.currentTarget.dataset.sonindex].id,
        previewUrls: this.data.commentInfo[e.currentTarget.dataset.fatherindex].comments[e.currentTarget.dataset.sonindex].imgList,
        currentReplyName: this.data.commentInfo[e.currentTarget.dataset.fatherindex].comments[e.currentTarget.dataset.sonindex].name,
        commentToComment: true,
        commentFlag: 1
      })
      console.log("当前id:" + this.data.currentID)
      console.log("当前要回复的用户名：" + this.data.currentReplyName)
    }, 100);
  },
  setIdBack: function (e) {
    if ((this.data.content == '') && (this.data.imgToSend.length == 0)) {
      this.data.notToChoosePic = true;
      setTimeout(() => {
        console.log("失去焦点");
        if (this.data.notToChoosePic == true) {
          this.setData({
            commentToComment: false,
            replyTip: "回复主题："
          })
        }
      }, 100);
    }

  },
  setReplyTip: function () {
    setTimeout(() => {
      if (this.data.commentToComment == false) {
        this.setData({
          replyTip: "回复主题："
        })
      } else {
        this.setData({
          replyTip: "回复 " + this.data.currentReplyName + "："
        })
      }
    }, 100);
  },
  sortReply: function (array, length) {
    var that = this;
    var newthis = this;
    var hash = [];

    for (var i = 0; i < length; i++) {
      hash[i] = false;
    }
    for (var i = length - 1; i >= 0; i--) {
      var obj = {
        id: array[i][0],
        name: array[i][1],
        content: array[i][3],
        time: array[i][4].substring(5, array[i][4].length - 3),
        beReplied: array[i][9],
        replyName: array[i][5],
        videoList: array[i][7],
        imgList: newthis.handleImgStr(array[i][8]),
        commentNum: 0,
        likeNum: 0,
        comments: [],
        space: [],
      }
      if (array[i][2] != null) {
        obj.headSrc = array[i][2]
      }
      if (array[i][9] == null) { //如果该回复是对于主题帖的回复
        hash[i] = true;
        newthis.data.commentInfo.unshift(obj); //添加该回复到回复列表           
        newthis.data.table[newthis.data.table.length] = []; //为它建立自己的分区


      } else {
        for (var j = 0; j < newthis.data.commentInfo.length; j++) {
          if (newthis.data.commentInfo[j].id == obj.beReplied) { //若该条回复 是 回复的回复
            newthis.data.commentInfo[j].comments.unshift(obj);
            newthis.data.commentInfo[j].space.push(obj.id);
            obj.findPlace = true;
            hash[i] = true;

          }
        }
      }
      if (hash[i] == false) {
        for (var z = 0; z < newthis.data.commentInfo.length; z++) {
          for (var k = 0; k < newthis.data.commentInfo[z].space.length; k++) {
            if (newthis.data.commentInfo[z].space[k] == obj.beReplied) { //找到组织了
              hash[i] = true;
              newthis.data.commentInfo[z].comments[newthis.data.commentInfo[z].comments.length] = obj;
              newthis.data.commentInfo[z].space.push(obj.id);
            }
          }
        }
      } //如果该回复不是主题的回复
    }
    newthis.setData({
      commentInfo: newthis.data.commentInfo
    });
  },
  refresh: function () {
    let that = this;
    var currentTopID = that.data.currentTopID; //记录当前最新的id
    var nth = 50;
    console.log(that.data.currentStart)
    console.log(that.data.currentEnd)
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "SBPR",
          start: 0,
          end: 40,
          pid: that.data.detail.id
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
          for (var i = 0; i < res.result.length; i++) {
            if (res.result[i][0] == currentTopID) {
              nth = i;
            }
          }
          //说明：如果nth不为默认值50，res.result[0]-res.result[nth-1]是新发出的评论
          if (nth != 50) { //nth不为50则进行拼装，为50说明并没有新帖子
            that.sortReply(res.result, nth)
            console.log("送往拼装")
          }
          wx.stopPullDownRefresh();
        }
      }
    )
  },
  onPullDownRefresh: function () {
    var that = this;
    that.refresh();
  },


  onLoad: function (options) {
    var newthis = this;
    //app.checkLogin();//检查登录
    //app.getLaction();//得到gps
    //检测有没有传入id参数
    if (options.id != null && options.id != "") {
      this.setData({
        id: options.id
      })
    }
    //执行初始化,需要用的时候，可以把注释取掉
    //this.dataRefresh("init");
    //滑动门自适应swiper高度
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    //console.log(JSON.parse(JSON.stringify(that.data.answers)))
    let message = JSON.parse(decodeURIComponent(options.obj)) //接受上个页面传递的参数（比赛id）
    if (message.from == 'contact') {
      that.setData({
        detail: message,
        currentID: message.id
      })
      that.setData({
        detail: that.data.detail,
        urls: that.data.detail.imgList
      })
      for (var i = 0; i < that.data.urls.length; i++) {
        that.data.urls2[i] = that.data.urls[i];
      }
      that.setData({
        urls2: that.data.urls2
      })
    } else if (message.from == 'notice') {
      console.log("从通知页跳转至此，请求的pid是：" + message.id)
      that.setData({
        detail: message,
        currentID: message.id
      });
      console.log(that.data.detail)
      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + 'minzu/discussion/get',
          method: 'GET',
          qs: {
            mode: "DP",
            pid: message.id
          }, // 如果是get请求就把参数放在qs里
          body: {
            some: 'payload'
          }, // 如果是post请求就把参数放在body里
        }
      }).then(
        res => {
          console.log("获取单个问题的详情- ----")
          console.log(res)
          //that.data.detail.headSrc = res.result[0][2];
          that.data.detail.name = res.result[0][1];
          that.data.detail.title = res.result[0][3];
          that.data.detail.content = res.result[0][4];
          that.data.detail.time2 = res.result[0][9].substring(5, res.result[0][9].length - 3);
          if (res.result[0][6] != null) {
            that.data.detail.imgList = that.handleImgStr(res.result[0][6])
          }
          if (res.result[0][2] != null) {
            that.data.detail.headSrc = res.result[0][2]
          }
          that.setData({
            detail: that.data.detail,
            urls: that.data.detail.imgList
          })
          for (var i = 0; i < that.data.urls.length; i++) {
            that.data.urls2[i] = that.data.urls[i];
          }
          that.setData({
            urls2: that.data.urls2
          })
        }

      )
    }
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "SBPR",
          start: that.data.currentStart,
          end: that.data.currentEnd,
          pid: that.data.detail.id
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
          if (res.result.length < 20) {
            that.setData({
              toEnd: true
            })
          }
          if (res.result[0] != null) {
            that.setData({
              currentTopID: res.result[0][0]
            })
          }
          that.sortReply(res.result, res.result.length)
        }
      }
    )
  },
  getNewOne: function () {
    var that = this;
    var newthis = this;
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "SBPR",
          start: 0,
          end: 1,
          pid: that.data.detail.id
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
          console.log(res)
          that.sortReply(res.result, 1);
        }
      }
    )
    // wx.request({
    //   url: app.globalData.serverURL + 'minzu/discussion/get',
    //   data: {
    //     mode: "SBPR",
    //     start: 0,
    //     end: 1,
    //     pid: that.data.detail.id
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     for (var i = res.data.length-1; i >=0 ; i--) {
    //       var obj = {
    //           id: res.data[i][0],
    //           name: res.data[i][1],
    //           headSrc: app.globalData.serverURL + res.data[i][2].substring(2, res.data[i][2].length),
    //           content: res.data[i][3],
    //           time: res.data[i][4].substring(5, res.data[i][4].length - 3),
    //           beReplied: res.data[i][9],
    //           replyName: res.data[i][5],
    //           videoList: res.data[i][7],
    //           imgList: newthis.handleImgStr(res.data[i][8]),
    //           commentNum: 0,
    //           likeNum: 0,
    //           comments: [],
    //           space:[],
    //       }
    //       if (res.data[i][9] == null) {  //如果该回复是对于主题帖的回复
    //         hash[i] = true;
    //         newthis.data.commentInfo.unshift(obj);  //添加该回复到回复列表           
    //        // newthis.data.table[newthis.data.table.length] = [];  //为它建立自己的分区
    //       }
    //       else{
    //         for (var j = 0; j < newthis.data.commentInfo.length; j++) {
    //           if (newthis.data.commentInfo[j].id == obj.beReplied) { //若该条回复 是 回复的回复
    //             newthis.data.commentInfo[j].comments.unshift(obj);
    //             newthis.data.commentInfo[j].space.push(obj.id);
    //             obj.findPlace = true;
    //             hash[i]=true;
    //           }
    //         }
    //       }
    //       if (hash[i] == false){
    //         for (var z = 0; z < newthis.data.commentInfo.length; z++) {
    //           for(var k = 0;k<newthis.data.commentInfo[z].space.length;k++){
    //             if(newthis.data.commentInfo[z].space[k]==obj.beReplied){              //找到组织了
    //               hash[i]=true;
    //               newthis.data.commentInfo[z].comments[newthis.data.commentInfo[z].comments.length] = obj;
    //               newthis.data.commentInfo[z].space.push(obj.id);
    //             }
    //           }
    //         }
    //       }                        //如果该回复不是主题的回复
    //     }
    //     newthis.setData({
    //       commentInfo: newthis.data.commentInfo
    //     });

    //   }




    // })
  },

  tap: function (e) {
    switch (e.currentTarget.id) {
      case "1":
        this.setData({
          url: this.data.urls[0]
        })
        break;
      case "2":
        console.log("happen");
        this.setData({
          url: this.data.urls[1]
        })
        break;
      case "3":
        this.setData({
          url: this.data.urls[2]
        })
        break;

    }
    wx.previewImage({
      current: this.data.url, // 当前显示图片的http链接
      urls: this.data.urls // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示 需要用的时候，可以把注释取掉
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作,需要用的时候，可以把注释取掉
   */


  /**
   * 页面上拉触底事件的处理函数,需要用的时候，可以把注释取掉
   */
  // onReachBottom: function () {
  //   var that = this;
  //   var newthis = this;
  //   if (that.data.toEnd == false) {
  //     that.setData({
  //       currentStart: that.data.currentStart + 20,
  //       currentEnd: that.data.currentEnd + 20,
  //     })
  //     wx.request({
  //       url: app.globalData.serverURL + 'minzu/discussion/get',
  //       data: {
  //         mode: "SBPR",
  //         start: that.data.currentStart,
  //         end: that.data.currentEnd,
  //         pid: that.data.detail.id
  //       },
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         if (res.data.length < 20) {
  //           that.setData({
  //             toEnd: true
  //           })
  //         }
  //         for (var i = 0; i < res.data.length; i++) {
  //           var obj = {
  //             id: res.data[i][0],
  //             name: res.data[i][1],
  //             headSrc: app.globalData.serverURL + res.data[i][2].substring(2, res.data[i][2].length),
  //             content: res.data[i][3],
  //             time: res.data[i][4].substring(5, res.data[i][4].length - 3),
  //             beReplied: res.data[i][9],
  //             audioList: res.data[i][6],
  //             videoList: res.data[i][7],
  //             imgList: newthis.handleImgStr(res.data[i][8]),
  //             commentNum: 0,
  //             likeNum: 0,
  //             comments: [],
  //           }
  //           if (obj.beReplied == null) {
  //             newthis.data.commentInfo[newthis.data.commentInfo.length] = obj;
  //             newthis.setData({
  //               commentInfo: newthis.data.commentInfo
  //             });
  //           }
  //         }
  //         for (var i = 0; i < res.data.length; i++) {
  //           var obj = {
  //             id: res.data[i][0],
  //             name: res.data[i][1],
  //             headSrc: app.globalData.serverURL + res.data[i][2].substring(2, res.data[i][2].length),
  //             content: res.data[i][3],
  //             time: res.data[i][4].substring(5, res.data[i][4].length - 3),
  //             beReplied: res.data[i][9],
  //             audioList: res.data[i][6],
  //             videoList: res.data[i][7],
  //             imgList: newthis.handleImgStr(res.data[i][8]),
  //             commentNum: 0,
  //             likeNum: 0,
  //             comments: [],
  //           }
  //           if (obj.beReplied != null) {
  //             for (var j = 0; j < newthis.data.commentInfo.length; j++) {
  //               if (newthis.data.commentInfo[j].id == obj.beReplied) { //若该条回复是被回复的回复
  //                 newthis.data.commentInfo[j].comments[newthis.data.commentInfo[j].comments.length] = obj;
  //               }
  //               newthis.setData({
  //                 commentInfo: newthis.data.commentInfo
  //               });
  //             }
  //           }
  //         }

  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       icon: "loading",
  //       title: '没有更多回复',
  //     })
  //   }
  // },

  input: function (e) {
    //console.log(e.detail.value)
    var j = 0;
    for (var i = 0; i < e.detail.value.length; i++) {
      if (e.detail.value[i] == ' ') {
        j = j + 1;
      } else {
        break;
      }
    }
    this.setData({
      content: e.detail.value.substring(j, e.detail.value.length)
    })


  },

  /**
   * ---------------------------------------
   */


  tap2: function (e) {
    let that = this;
    that.setData({
      notToChoosePic: false
    })
    console.log("111");
    wx.chooseImage({
      count: 3, //可选张数 1~9
      success: function success(res) {
        that.data.notToChoosePic = true;
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
            images.push(item.path);
            // console.log("格式", imgSplit, imgSLen, imgSLen - 1);
            console.log(imgSplit[imgSLen - 1]);
            that.data.imgToSend[that.data.imgToSend.length] = item.path;
            that.setData({
              imgToSend: that.data.imgToSend
            })
            for (var i = 0; i < that.data.imgToSend.length; i++) {
              that.data.urls3[i] = that.data.imgToSend[i];
            }
            that.setData({
              urls3: that.data.urls3
            })
          }
        });
        console.log("选择的图片是------");
        console.log(that.data.imgToSend);
      },
      fail: function fail(res) {
        console.log("选择图片这里失败了");
        that.data.notToChoosePic = true;
        console.log("失败了以后，notToChoopic的值为" + that.data.notToChoosePic);
        that.setIdBack();
      },

    });

  },
  submit: function () {

    wx.showToast({
      title: '上传中',
      icon: "loading",
      duration: 5000
    })
    let that = this;
    if (that.data.commentToComment == true) {
      that.setData({
        commentFlag: 1
      })
    } else {
      that.setData({
        commentFlag: 0
      })
    }
    // 上传图片 得到pic_url 
    Promise.all(that.asyncImgUploadFile(that.data.imgToSend)).then((res) => {
      let URLS = "";
      res.forEach((item, index) => {
        URLS = URLS + item + " ";
      })
      console.log("URLS是------")
      console.log(URLS)
      console.log("------")
      var pid = "";
      var module2 = 0;
      if (that.data.commentFlag == 0) { //给主题的回复
        pid = that.data.detail.id;
        module2 = 0;
      } else {
        pid = that.data.currentID;
        module2 = 1;
      }
      console.log("to comment")
      console.log("pid:-------")
      console.log(pid);
      console.log("commentFlag--")
      console.log(that.data.commentFlag)

      if (that.data.commentFlag == 0) {
        console.log("这是对主题的回复")
        console.log("传回的pid：" + that.data.detail.id);
        console.log("传回的txt：" + that.data.content)
        wx.cloud.callFunction({
          name: "getData",
          data: {
            url: app.globalData.serverURL + 'minzu/discussion',
            method: 'GET',
            qs: {
              openid: app.globalData.openid,
              mode: "C",
              module: 0,
              pid: that.data.detail.id,
              txt: that.data.content,
              pic_url: URLS,
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
                duration: 500
              })
              that.setData({
                imgToSend: [],
                inputText: '',
                content: "",
              })
              that.refresh();
            }
          }
        )
        // wx.request({
        //   url: app.globalData.serverURL + 'minzu/discussion',
        //   data: {
        //     openid: app.globalData.openid,
        //     mode: "C",
        //     module: 0,
        //     pid: that.data.detail.id,
        //     txt: that.data.content,
        //     pic_url: URLS,

        //   },
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {
        //     wx.showToast({
        //       title: '上传成功',
        //       icon: "success",
        //       duration: 500
        //     })
        //     that.setData({
        //       imgToSend: [],
        //       inputText: ''
        //     })
        //     that.getNewOne();
        //   },
        //   fail: function (error) {
        //     //console.log(error)
        //   }
        // })
      } else {
        console.log("这是对回复的回复")
        that.setData({
          commentToComment: false,
          inputShowed: false
        })
        wx.cloud.callFunction({
          name: "getData",
          data: {
            url: app.globalData.serverURL + 'minzu/discussion',
            method: 'GET',
            qs: {
              openid: app.globalData.openid,
              mode: "C",
              module: 0,
              to_comment_id: pid,
              pid: that.data.detail.id,
              txt: that.data.content,
              pic_url: URLS,
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
                duration: 500
              })
              that.setData({
                imgToSend: [],
                inputText: '',
                content: '',
              })
              that.refresh();
              that.setIdBack();
            }
          }
        )
        // wx.request({
        //   url: app.globalData.serverURL + 'minzu/discussion',
        //   data: {
        //     openid: app.globalData.openid,
        //     mode: "C",
        //     module: 0,
        //     to_comment_id: pid,
        //     pid: that.data.detail.id,
        //     txt: that.data.content,
        //     pic_url: URLS,

        //   },
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {
        //     wx.showToast({
        //       title: '上传成功',
        //       icon: "success",
        //       duration: 500
        //     })
        //     that.setData({
        //       imgToSend: [],
        //       inputText: ''
        //     })
        //     that.getNewOne();
        //   },
        //   fail: function (error) {
        //     //console.log(error)
        //   }
        // })
      }
      //如果他后台返回图片路径了 如/solfeggio/library/ask/1.jpg ...
      // 你可以直接
      // let pic_url=res.join('/');
      //提交 
      // wx.request({
      //   url: 'url',
      //   data:{
      //     pic_url:pic_url
      //   }
      // })

    })
  },
  // 封装Promise 对象
  asyncImgUploadFile: function (file, type) {
    var that = this
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
        var getFilename = file[i].split("/")
        var fileName = getFilename[getFilename.length - 1]
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

  sendAnswer: function () {
    this.uploadImg();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  preview2(e) {
    console.log(e)
    var that = this;
    wx.previewImage({
      current: that.data.commentInfo[e.currentTarget.dataset.id].imgList[e.currentTarget.dataset.index], //当前预览的图片
      urls: that.data.commentInfo[e.currentTarget.dataset.id].imgList,
    })
  },
  preview3(e) {
    console.log(e)
    var that = this;
    wx.previewImage({
      current: that.data.previewUrls[e.currentTarget.dataset.index], //当前预览的图片
      urls: that.data.previewUrls
    })
  },
  preview(e) {
    console.log(app.globalData.wxuserInfo.avatarUrl)
    console.log('预览')
    console.log(e)
    const index = parseInt(e.currentTarget.id) - 1;
    console.log(index)
    const images = this.data.imgToSend
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
          let index = parseInt(e.currentTarget.id) - 1
          console.log(parseInt(e.currentTarget.id) - 1)
          that.data.imgToSend.splice(index, 1)
          that.setData({
            imgToSend: that.data.imgToSend
          })
          for (var i = 0; i < that.data.imgToSend.length; i++) {
            that.data.urls3[i] = that.data.imgToSend[i];
          }
          that.setData({
            urls3: that.data.urls3
          })
        }
        that.setIdBack();
      }
    })
  },
})