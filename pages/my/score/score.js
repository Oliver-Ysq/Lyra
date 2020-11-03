Page({
  data: {
    selectShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['2019-2020春季学期', '2019-2020秋季学期'], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    score: [{
        singScore: 90,
        hearScore: 85
      },
      {
        singScore: 75,
        hearScore: 90
      }
    ],
    scoreFlag: 1,
    kaoqin:{
      chuqin: 10,
      qingjia: 1,
      quexi: 0,
      kaoqinScore: 90,
    },
    homework:{
      finish: 12,
      after:2,
      undone:1,
      homeworkScore: 95
    }
    
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
  },
  changeScore() {
    this.setData({
      scoreFlag: (this.data.scoreFlag + 1) % 2
    })
  },
  onLoad() {
    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500)
  }
})