// pages/practice/hearSelectPractise/hearSelectPractise.js
const app = getApp()
Page({

  data: {
    count: 60,
    percent: 80,
    activeQuestion: 1,
    questionNumber: 4,
    click: 0,
    questionList: [{
      title: "以下哪位不是佛兰德乐派的作曲家?",
      choices: ['若斯坎(josquin des prez)',
        '奥克冈(johannes ockeghem)',
        '邓斯泰布尔(john dunstable)',
        '拉絮斯(拉索)(orlande de lassus)'
      ]
    }, {
      title: "1+1=?",
      choices: ['a', 'b', 'c', 'd']
    }, {
      title: "hello?",
      choices: ['a', 'b', 'c', 'd']
    }, {
      title: "1+1=?",
      choices: ['a', 'b', 'c', 'd']
    }],
    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  },
  handleOptionsTap(e) {
    var that = this
    if (e == null) { //由于超时转到下一题
      console.log('超时啦')
      this.setData({
        click: null
      })
    } else {
      console.log("第" + this.data.activeQuestion + "选择了" + this.data.alphabet[e.currentTarget.dataset.id])
      this.setData({
        click: e.currentTarget.dataset.id + 1
      })
    }


    if (this.data.activeQuestion >= this.data.questionNumber) {
      console.log('到头了')
      setTimeout(() => {
        this.setData({
          click: 0,
        })
        return;
      }, 1000);
    } else {
      setTimeout(() => {
        clearInterval(that.data.timer);
        that.countDown()
        this.setData({
          activeQuestion: this.data.activeQuestion + 1,
          click: 0
        })
        wx.setNavigationBarTitle({
          title: this.data.activeQuestion + '/' + this.data.questionNumber,
        })
      }, 1000);
    }

  },

  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: this.data.activeQuestion + '/' + this.data.questionNumber,
    })
    options.questionId = '201010101'
    wx.request({
      method: 'GET',
      url: app.globalData.serverURL + 'get_part?partId=' + options.questionId,
      success: res => {
        let data = res.data[0]
        console.log("题目难度，正确答案，题干图片路径，题干音频路径，题目文本，几个选项:")
        console.log(data)
        this.setData({
          questionList: [{
            title: data[4],
            choices: data.slice(5)
          }]
        })
      },
      fail: err => console.log(err)
    })


    that.countDown()
  },
  //计时器
  countDown: function () {
    let that = this;
    let count = 60;
    that.setData({
      timer: setInterval(function () {
        count--;
        that.setData({
          count: count
        })
        if (count == 0) {
          clearInterval(that.data.timer);
          that.handleOptionsTap(null);
        }
      }, 1000)
    })
  }
})