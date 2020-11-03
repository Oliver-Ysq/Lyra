/////////////有个index整数位数显示的问题要解决一下
const app = getApp()
var progressNum=0
Page({
  data: {
    changeFlag: 0,
    currentIndex: 0,
    sortId: '001',
    name: 'name1',
    progressFlag:false,
    singTitle: ['单声部', '双声部', '视谱即唱', '多项音乐语言阅读'],
    colorList: ["252,232,151", "158,212,110", "255,186,204","200,205,255"],
    swiperList: [
      [{
        id: 'card1',
        img: '/image/singchoice/05.png',
        name: '西洋',
        type: 'top'
      }, {
        id: 'card2',
        img: '/image/singchoice/02.png',
        name: '中国',
        type: ''
      }, {
        id: 'card3',
        img: '/image/singchoice/03.png',
        name: '少数民族',
        type: 'bottom'
      }],
      [{
        id: 'card1',
        img: '/image/singchoice/05.png',
        name: '西洋',
        type: 'top'
      }, {
        id: 'card2',
        img: '/image/singchoice/02.png',
        name: '中国',
        type: ''
      }, {
        id: 'card3',
        img: '/image/singchoice/03.png',
        name: '少数民族',
        type: 'bottom'
      }],
      [{
        id: 'card1',
        img: '/image/singchoice/05.png',
        name: '西洋',
        type: 'top'
      }, {
        id: 'card2',
        img: '/image/singchoice/02.png',
        name: '中国',
        type: ''
      }, {
        id: 'card3',
        img: '/image/singchoice/03.png',
        name: '少数民族',
        type: 'bottom'
      }],
    ],
    list: []
  },
  onReady(){
//     this.circle = this.selectComponent("#circle1");
// // 绘制背景圆环
// this.circle.drawCircleBg('circle_bg1', 100, 8)
// // 绘制彩色圆环
// this.circle.drawCircle('circle_draw1', 100, 8, 2);
  },
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      if (e.detail.current > this.data.changeFlag) {
        currentPageIndex = (currentPageIndex + 1) % 4
      } else {
        currentPageIndex = (currentPageIndex - 1 + 4) % 4
      }
      let sortid = currentPageIndex + 1
      this.setData({
        currentIndex: currentPageIndex,
        changeFlag: currentPageIndex,
        sortId: '00' + sortid
      })
    }

  },
  //用户点击tab时调用
  titleClick: function(e) {
    let currentPageIndex = e.currentTarget.dataset.idx
    let sortid = parseInt(e.currentTarget.dataset.idx) + 1
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx,
      sortId: '00' + sortid
    })
  },
  goToSing(e) {
    //跨页传参：选择的曲目
    let id = e.target.dataset.id
    let urlString = "/pages/practice/sing/sing?id=" + id
    wx.navigateTo({
      url: urlString
    })
  },

  saveToStorage(key,data){
    wx.setStorage({
      key: key,
      data: data
    })
  },

  //本地内存搜索
  searchStorage(key){
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

  onLoad: function(options) {
    let id = parseInt(options.id);
    let sortid = id + 1
    this.setData({
      currentIndex: id,
      sortId: '00' + sortid
    })

    var that = this;
      var timer = setInterval(function(){
      progressNum++;
    //当进度条为100时清除定时任务
      if (progressNum >= 95){
        
        clearInterval(timer);
      }
    //并且把当前的进度值设置到progress中
      that.setData({
        progress: progressNum
      })
    })

    //先从本地内存找历史记录。没有再说
    var theSingHistory=this.searchStorage('singHistory')
    if(typeof(theSingHistory)=='object'){
      console.log('本地已存储')
      console.log('加载完成')
      this.setData({
        list: theSingHistory,
        progressFlag:true
      })
    }else{
      console.log('本地未存储')
      wx.request({
        url: app.globalData.serverURL + 'singChoice_tolist',
        data:{
          openid:app.globalData.openid
        },
        method: 'GET',
        success: res => {
          console.log('视唱的数据，需要存储')
          console.log(res.data)
          if(typeof(res.data)=='object'){
            console.log('加载完成')
            this.setData({
              progressFlag:true,
              list: res.data
            })
            this.saveToStorage('singHistory',res.data)
          }else{
            wx.showToast({
              title: '未连接服务器',
              icon:'loading'
            })
          }
          
        },
        error: err => { console.log(err) }
      })
    }
    
  },

})