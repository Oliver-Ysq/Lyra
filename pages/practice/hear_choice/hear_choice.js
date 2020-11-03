const app = getApp()
var progressNum=0
Page({
  data: {
    active: 0,
    currentTab: 0,
    progressFlag:false,
    list: [
      [1],
      [2],
      [3],
      [4]
    ],
    tabList: [{
        id: 0,
        name: '音阶'
      },
      {
        id: 1,
        name: '音组'
      },
      {
        id: 2,
        name: '音程'
      },
      {
        id: 3,
        name: '和弦'
      },
      {
        id: 4,
        name: '节奏'
      },
      {
        id: 5,
        name: '音程连接'
      },
      {
        id: 6,
        name: '和弦连接'
      },
      {
        id: 7,
        name: '单声部旋律'
      },
      {
        id: 8,
        name: '双声部旋律'
      },
    ]
  },
  switchNav(e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      active: id
    });
  },

  goto(e) {
    //跨页面传值
    const name = e.target.dataset.name
    var difficulty = e.target.dataset.difficulty 
    console.log(e)
    console.log('name' + name)
    wx.navigateTo({
      url: "/pages/practice/hear/hear?name=" + name + '&id=10' + (parseInt(e.target.id) + 1) + '&difficulty=' + difficulty
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

  onLoad(options) {
    let id = parseInt(options.id);
    console.log('id' + id)
    this.setData({
      currentTab: id,
      active: id
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
    var theHearHistory=this.searchStorage('hearHistory')
    if(typeof(theHearHistory)=='object'){
      console.log('本地已存储')
      console.log('加载完成')
      this.setData({
        progressFlag:true,
        list: theHearHistory
      })
    }else{
      console.log('本地未存储')
      wx.request({
        url: app.globalData.serverURL + 'hearChoice_tolist',
        data: {
          openid: app.globalData.openid
        },
        method: 'GET',
        success: res => {
          console.log('练耳的数据，需要存储')
          console.log(res.data)
          if(typeof(res.data)=='object'){
            console.log('加载完成')
          this.setData({
            progressFlag:true,
            list: res.data
          })
          this.saveToStorage('hearHistory',res.data)
          }else{
            wx.showToast({
              title: '未连接服务器',
              icon:'loading'
            })
          }
          
        },
        error: err => {
          console.log(err)
        }
      })
    }
   
  }
})