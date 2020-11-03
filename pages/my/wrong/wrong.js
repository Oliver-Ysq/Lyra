const app = getApp()
Page({
  data: {
    title: ['视唱', '练耳'],
    TabCur: 0,
    scrollLeft: 0,
    singList: [{
      title: '多项音乐语言阅读1',
      detail: '1',
      score: 80
    }],
    hearList: [{
      title: '音阶1',
      detail: '1',
      score: 80
    }]
  },
  onLoad() {
    var that = this
    that.getNotes()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })

    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  deleteSing(e) {
    var that = this
    let num = e.target.dataset.num
    let id = e.target.dataset.id
    let arr = this.data.singList
    console.log('删除' + id)
    var partId = that.data.singList[id].id
    var difficulty = that.data.singList[id].difficulty
    this.deleteNotes(partId, difficulty)
    // arr.splice(id, 1)
    // setTimeout(() => {
    //   if (num == 1) {
    //     this.setData({
    //       singList: arr
    //     })
    //   } else {
    //     this.setData({
    //       hearList: arr
    //     })
    //   }
    // }, 500);

  },
  deleteHear(e) {
    var that = this
    let num = e.target.dataset.num
    let id = e.target.dataset.id
    let arr = this.data.hearList

    var partId = that.data.hearList[id].id
    var difficulty = that.data.hearList[id].difficulty

    console.log('删除' + id + difficulty + partId)
    this.deleteNotes(partId, difficulty)

  },
  //********删除错题本 */
  deleteNotes(partId, difficulty) {
    var that = this
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'del_wrong_rec', //函数名待改
      data: {
        partId: partId,
        openid: app.globalData.openid,
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
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
        that.getNotes()
      }
    })
  },
  //********检查错题本 */
  getNotes() {
    var that = this
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_wronglist',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (typeof (res.data) == 'object') {
          var a = 0
          var i = -1
          var j = -1
          var result = res.data
          var id = ''
          var singList = []
          var hearList = []
          for (a = 0; a < result.length; a++) {
            id = result[a][0]
            if (id.slice(0, 1) == '0') {
              i++;
              singList[i] = {
                title: '',
                detail: '',
                score: '',
                id: id,
                difficulty: result[a][2]
              }
              singList[i].score = result[a][1]
              if (id.slice(1, 3) == '04') {
                singList[i].title = '多项音乐语言阅读'
                if (id.slice(3, 5) == '01') {
                  singList[i].detail = '西洋古典音乐'
                  if (id.slice(5, 7) == '01') {
                    singList[i].detail = singList[i].detail + '·交响乐'
                  } else if (id.slice(5, 7) == '02') {
                    singList[i].detail = singList[i].detail + '·歌剧舞剧'
                  }
                } else if (id.slice(3, 5) == '02') {
                  singList[i].detail = '中国传统音乐'
                  if (id.slice(5, 7) == '01') {
                    singList[i].detail = singList[i].detail + '·传统器乐曲主题'
                  } else if (id.slice(5, 7) == '02') {
                    singList[i].detail = singList[i].detail + '·地方音乐'
                  } else if (id.slice(5, 7) == '03') {
                    singList[i].detail = singList[i].detail + '·地方戏曲'
                  }
                } else if (id.slice(3.5) == '03') {
                  singList[i].detail = '世界民族音乐'
                } else if (id.slice(3.5) == '04') {
                  singList[i].detail = '流行音乐'
                }
                singList[i].detail = singList[i].detail + '·' + result[a][2] + '·' + id.slice(7, 9)
                continue;
              } else if (id.slice(1, 3) == '01') {
                singList[i].title = '单声部'
              } else if (id.slice(1, 3) == '02') {
                singList[i].title = '双声部'
              } else if (id.slice(1, 3) == '03') {
                singList[i].title = '视谱即唱'
              }
              if (id.slice(3, 7) == '0101') {
                singList[i].detail = '西洋'
              } else if (id.slice(3, 7) == '0201') {
                singList[i].detail = '中国'
              } else if (id.slice(3, 7) == '0301') {
                singList[i].detail = '少数民族'
              }
              singList[i].detail = singList[i].detail + '·' + result[i][2] + '·' + id.slice(7, 9)

              //练耳
            } else if (id.slice(0, 1) == '1') {
              j++
              hearList[j] = {
                title: '',
                detail: '',
                score: '',
                id: id,
                difficulty: result[a][2]
              }
              hearList[j].score = result[a][1]
              if (id.slice(1, 3) == '01') {
                hearList[j].title = '音阶'
              } else if (id.slice(1, 3) == '02') {
                hearList[j].title = '音组'
              } else if (id.slice(1, 3) == '03') {
                hearList[j].title = '音程'
              } else if (id.slice(1, 3) == '04') {
                hearList[j].title = '和弦'
              } else if (id.slice(1, 3) == '05') {
                hearList[j].title = '节奏'
              } else if (id.slice(1, 3) == '06') {
                hearList[j].title = '音程连接'
              } else if (id.slice(1, 3) == '07') {
                hearList[j].title = '和弦连接'
              } else if (id.slice(1, 3) == '08') {
                hearList[j].title = '单声部旋律'
              } else if (id.slice(1, 3) == '09') {
                hearList[j].title = '双声部旋律'
              }
              hearList[j].detail = result[a][2] + '·' + id.slice(3, 5)

            }
          }
          that.setData({
            singList: singList,
            hearList: hearList
          })
          console.log(singList)
          console.log(hearList)

        }


      }
    })
    return 0
  },
  toSing(e) {
    //跨页传参：选择的曲目
    var that = this
    let num = e.currentTarget.dataset.id
    var id = that.data.singList[num].id.slice(0, 7)
    id = id + '' + (Array(2).join(0) + parseInt(that.data.singList[num].difficulty)).slice(-2)
    console.log(id)
    let urlString = "/pages/practice/sing/sing?id=" + id
    wx.navigateTo({
      url: urlString
    })

  },
  toHear(e) {
    //跨页传参：选择的曲目
    console.log(e)
    var that = this
    let num = e.currentTarget.dataset.id
    var id = that.data.hearList[num].id.slice(0, 3)
    let urlString = "/pages/practice/hear/hear?id=" + id + '&difficulty=' + that.data.singList[num].difficulty
    wx.navigateTo({
      url: urlString
    })

  },


})