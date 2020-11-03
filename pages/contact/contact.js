const app = getApp();
Page({
  data: {
    allowMove: false, //是否允许按钮拖拽
    startX: 0,
    startY: 0,
    initLeft: 614,
    initBottom: 24,
    relativeMoveX: 0,
    relativeMoveY: 0,
    isRuleTrue: false,
    boxFlag: false,
    btnsShow: "none",
    changeFlag: 0,
    currentIndex: 0,
    name: 'name1',
    sortWay: 0,
    cardInfo: [],
    toEnd: false,
    currentStart: 0,
    currentEnd: 10,
    // cardInfo: [{
    //   id: 0,
    //   name: '黄秋子',
    //   time: '1',
    //   title: '请教一下第六题',
    //   commentNum: '5',
    //   star: 1,
    //   done: true,
    //   reward: 2,
    //   imgList: ['/image/my/head.jpg', '/image/my/head.jpg'],
    //   headSrc:'/image/my/head.jpg',
    // }, {
    //   id: 1,
    //   name: '炭治郎',
    //   time: '3',
    //   title: '请教一下第二题',
    //   commentNum: '0',
    //   star: 0,
    //   done: true,
    //   reward: 3,
    //   imgList: ['/image/my/head.jpg', '/image/my/head.jpg'],
    //   headSrc:'/image/my/head.jpg',

    // }, {
    //   id: 2,
    //   name: '祢豆子',
    //   time: '15',
    //   title: '请教一下第三题',
    //   commentNum: '3',
    //   star: 1,
    //   done: false,
    //   reward: 5,
    //   imgList: [],
    //   headSrc:'',

    // }], 

    mvList: [{
      title: "我录了一段《xxx》，快来听听吧",
      imgUrl: "",
      type: "record",
      name: "黄秋子",
      like: 5,
      hasLike: 1
    }, {
      title: "我录了一段《xxx》，快来听听吧",
      imgUrl: "/image/my/head.jpg",
      type: "record",
      name: "祢豆子",
      like: 3,
      hasLike: 1
    }, {
      title: "我录了一段《xxx》，快来听听吧",
      imgUrl: "/image/my/head.jpg",
      type: "record",
      name: "炭治郎",
      like: 4,
      hasLike: 0
    }, {
      title: "我录了一段《xxx》，快来听听吧",
      imgUrl: "/image/my/head.jpg",
      type: "video",
      name: "我妻善逸",
      like: 15,
      hasLike: 1
    }],

    commentList: [{
      id: 0,
      headUrl: '/image/my/head.jpg',
      name: '黄秋子',
      level: 1,
      time: 1,
      content: '今天挂科了真开心',
      commentNum: 5,
      likeNum: 3,
      hasLike: 1
    }, {
      id: 1,
      headUrl: '/image/my/head.jpg',
      name: '炭治郎',
      level: 2,
      time: 4,
      content: '楼上挂科了真开心',
      commentNum: 9,
      likeNum: 7,
      hasLike: 1
    }, {
      id: 2,
      headUrl: '/image/my/head.jpg',
      name: '祢豆子',
      level: 1,
      time: 10,
      content: '楼上开心我就开心',
      commentNum: 5,
      likeNum: 0,
      hasLike: 0
    }, {
      id: 3,
      headUrl: '/image/my/head.jpg',
      name: '我妻善逸',
      level: 4,
      time: 25,
      content: '傻子欢乐多',
      commentNum: 4,
      likeNum: 3,
      hasLike: 1
    }]

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
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  //改变状态
  handleStarChange(e) {
    let star = "cardInfo[" + e.detail.id + "].star"
    this.setData({
      [star]: e.detail.state,
    })
    if (e.detail.state == 1) {
      console.log(e.detail.id + "号问题已经收藏")
    }
    if (e.detail.state == 0) {
      console.log(e.detail.id + "号问题已取消收藏")
    }
  },
  // handleDetailTap(){
  //   wx.navigateTo({
  //     url: '/pages/contact/detail/detail',
  //   })
  // },
  handleLikeChange(e) {
    let like = "commentList[" + e.detail.id + "].hasLike"
    let likeNum = "commentList[" + e.detail.id + "].likeNum"
    let number = e.detail.state == 0 ? this.data.commentList[e.detail.id].likeNum - 1 : this.data.commentList[e.detail.id].likeNum + 1
    this.setData({
      [like]: e.detail.state,
      [likeNum]: number
    })
  },

  handleNewTap() {
    this.setData({
      sortWay: 0
    })
  },
  handleHotTap() {
    this.setData({
      sortWay: 1
    })
  },
  hideRule() {
    //隐藏遮盖层
    this.setData({
      isRuleTrue: false,
      isRuleTrueHelp: false
    })
  },
  handleAddTap() {
    this.hideRule()
    const flag = this.data.boxFlag
    this.setData({
      isRuleTrue: !flag,
      boxFlag: !flag
    })
  },
  timeFn: function (dateBegin) {

    var t0 = new Date().getYear() - 100;
    var t1 = new Date().getMonth() + 1;
    var t2 = new Date().getDate();
    var t3 = new Date().getHours();
    var t4 = new Date().getMinutes();


    var part1 = dateBegin.split("-");
    var part2 = dateBegin.split(":");
    part1[0] = part1[0].slice(2);
    part1[2] = part1[2].substring(0, 2)
    part2[0] = part2[0].slice(11);
    var realDate = part1.concat(part2);

    var del0 = t0 - realDate[0];
    var del1 = t1 - realDate[1];
    var del2 = t2 - realDate[2];
    var del3 = t3 - realDate[3];
    var del4 = t4 - realDate[4];
    if (del0 == 1) { //如果提问年间和现在年相差1
      if (del1 > 0) { //如果实际上距今已经超过一年
        return "1年前";
      } else { //如果实际上今还没有一年
        var nMonth = del1;
        var nMonthStr = '';
        if (del2 > 0) { //如果盈月了 
          nMonthStr = nMonth.toString() + "月前";
        } else {
          nMonth = nMonth - 1;
          nMonthStr = nMonth.toString() + "月前";
        }
        return nMonthStr;
      }
    } else if (del0 > 1) {
      var nYear = del0;
      var nYearStr = '';
      if (del1 > 0) {
        nYearStr = nYear.toString() + "年前";
      } else {
        nYear = nYear - 1;
        nYearStr = nYear.toString() + "年前";
      }
      return nYearStr;
    } else if (del0 == 0) { //如果是同一年

      var nMonth = del1;
      var nMonthStr = '';
      var nDay = del2;
      var nDayStr = '';
      var nHour = del3;
      var nHourStr = '';
      var nMinute = del4;
      var nMinuteStr = '';

      if (del1 == 0) { //同年同月
        if (del2 == 0) { //同年同月同天
          if (del3 == 0) { //同年同月同天同小时
            nMinuteStr = nMinute.toString() + "分钟前";
            return nMinuteStr;
          } else {

            if (del3 == 1) { //同年同月同天，差一小时
              if (del4 > 0) { //实际为一小时以上
                return "1小时前"
              } else {
                nMinute = del4 + 60;
                nMinuteStr = nMinute.toString();
                return nMinuteStr + "分钟前"
              }
            } else { //小时数差至少为2
              nHourStr = nHour.toString() + "小时前"
              return nHourStr;
            }
          }
        } else if (del2 == 1) {
          if (del3 > 0) {
            return "1天前";
          } else {
            nHour = nHour + 24;
            nHourStr = nHour.toString() + "小时前";

            return nHourStr;
          }
        } else {
          if (del3 > 0) {
            nDayStr = nDay.toString() + "天前";
            return nDayStr;
          } else {
            nDay = nDay - 1;
            nDayStr = nDay.toString() + "天前";
            return nDayStr;
          }
        }
      } else if (del1 == 1) {

        if (del2 > 0) {
          return "1月前";
        } else {
          nDay = nDay + 30;
          nDayStr = nDay.toString() + "天前";
          return nDayStr;
        }
      } else if (del1 > 1) {
        if (del2 > 0) {
          nMonthStr = nMonth.toString() + "月前";
        } else {
          nMonth--;
          nMonthStr = nMonth.toString() + "月前";
        }
      }
    }
  },
  goto(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "/pages/contact/issue/issue?type=" + type
    })
  },
  toDetail: function (event) {
    wx.navigateTo({
      url: "/pages/contact/detail/detail?obj=" + encodeURIComponent(JSON.stringify(this.data.cardInfo[event.currentTarget.dataset.index]))
    })
    console.log(event)
  },
  onPullDownRefresh: function () {
    let that = this;
    var currentTopID = that.data.cardInfo[0].id; //记录当前最新的id
    var nth = 50;
    console.log(that.data.currentStart)
    console.log(that.data.currentEnd)
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "SBP",
          start: 0,
          end: 20, //一次请求20条提问的信息
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
          //说明：如果nth不为默认值50，res.result[0]-res.result[nth-1]是新发出的提问
          if (nth != 50) {  //nth不为50则进行拼装，为50说明并没有新帖子
            for (var i = nth-1; i>=0; i--) {
              that.timeFn(res.result[i][3])
              var time2 = res.result[i][3].substring(5, res.result[i][3].length - 3)
              var obj = {
                from: 'contact',
                id: res.result[i][0],
                name: res.result[i][2],
                time: that.timeFn(res.result[i][3]),
                time2: time2,
                title: res.result[i][6],
                content: res.result[i][7],
                commentNum: res.result[i][4],
                star: 0,
                done: false,
                reward: 3,
                imgList: that.handleImgStr(res.result[i][5]),
                headSrc: res.result[i][8],
              }
              that.data.cardInfo.unshift(obj)
              that.setData({
                cardInfo: that.data.cardInfo
              });
              
            }
          }
          wx.stopPullDownRefresh();
        }
      }
    )
  },


  onShow: function () {
    let that = this;
    console.log(that.data.currentStart)
    console.log(that.data.currentEnd)
    wx.cloud.callFunction({
      name: "getData",
      data: {
        url: app.globalData.serverURL + 'minzu/discussion/get',
        method: 'GET',
        qs: {
          mode: "SBP",
          start: 0,
          end: that.data.currentEnd,
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
          if (res.result.length < 10) {
            that.setData({
              toEnd: true
            })
          }
          console.log(res);
          for (var i = 0; i < res.result.length; i++) {
            that.timeFn(res.result[i][3])
            var time2 = res.result[i][3].substring(5, res.result[i][3].length - 3)
            var obj = {
              from: 'contact',
              id: res.result[i][0],
              name: res.result[i][2],
              time: that.timeFn(res.result[i][3]),
              time2: time2,
              title: res.result[i][6],
              content: res.result[i][7],
              commentNum: res.result[i][4],
              star: 0,
              done: false,
              reward: 3,
              imgList: that.handleImgStr(res.result[i][5]),
              headSrc: res.result[i][8],

            }
            that.data.cardInfo[i] = obj;
            that.setData({
              cardInfo: that.data.cardInfo
            });
          }
        }
      }
    )
  },
  onReachBottom: function () {
    console.log("reach");
    var that = this;
    if (that.data.toEnd == false) {
      that.setData({
        currentStart: that.data.currentStart + 10,
        currentEnd: that.data.currentEnd + 10,
      })
      wx.cloud.callFunction({
        name: "getData",
        data: {
          url: app.globalData.serverURL + 'minzu/discussion/get',
          method: 'GET',
          qs: {
            mode: "SBP",
            start: that.data.currentStart,
            end: that.data.currentEnd,
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
            if (res.result.length < 10) {
              that.setData({
                toEnd: true
              })
            }
            for (var i = 0; i < res.result.length; i++) {
              that.timeFn(res.result[i][3])
              var time2 = res.result[i][3].substring(5, res.result[i][3].length - 3)
              var obj = {
                id: res.result[i][0],
                name: res.result[i][2],
                time: that.timeFn(res.result[i][3]),
                time2: time2,
                title: res.result[i][6],
                content: res.result[i][7],
                commentNum: res.result[i][4],
                star: 0,
                done: false,
                reward: 3,
                imgList: that.handleImgStr(res.result[i][5]),
                headSrc: '/image/my/head.jpg',
              }
              that.data.cardInfo.push(obj);
              that.setData({
                cardInfo: that.data.cardInfo
              });
            }
          }
        }
      )
      // wx.request({
      //   url: app.globalData.serverURL + 'minzu/discussion/get',
      //   data: {
      //     mode: "SBP",
      //     start: that.data.currentStart,
      //     end: that.data.currentEnd,
      //   },
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   success: function (res) {
      //     if(res.data.length<10){
      //       that.setData({
      //         toEnd: true
      //       })
      //     }
      //     for(var i=0; i<res.data.length; i++){
      //       that.timeFn(res.data[i][3])
      //       var time2 = res.data[i][3].substring(5,res.data[i][3].length-3)
      //       var obj = {
      //         id :  res.data[i][0],
      //         name :  res.data[i][2],
      //         time : that.timeFn(res.data[i][3]),
      //         time2: time2,
      //         title: res.data[i][6],
      //         content: res.data[i][7],
      //         commentNum: res.data[i][4],
      //         star: 0,
      //         done: false,
      //         reward: 3,
      //         imgList: that.handleImgStr(res.data[i][5]),
      //         headSrc:'/image/my/head.jpg',
      //       }
      //       that.data.cardInfo.push(obj);
      //       that.setData({
      //         cardInfo: that.data.cardInfo
      //       });
      //     }
      //   }

      // })
    } else {
      wx.showToast({
        title: '没有更多内容',
        icon: 'loading'
      })
    }
  },
  onHide() {
    this.setData({
      boxFlag: false,
      isRuleTrue: false
    })
  },

})