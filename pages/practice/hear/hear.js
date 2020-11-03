//待完成：
// 1. 获取音乐进度，以变量percent记录
// 2. 调号
// 3. 判断连接条件
// 4. 绘制连接
const app = getApp()
var rpx;
const FileSystemManager=wx.getFileSystemManager()
var progressNum=0;
wx.getSystemInfo({ //获取屏幕宽度
  success: function(res) {
    rpx = res.windowWidth / 375;
  },
})
var interval = 120 * rpx
var gap = 35 * rpx
var startx=100*rpx
var alterShengList=[]
var alterJiangList=[]
var threeMode=-1;
var threeDuration=0;
var allThree=0;


const ctx = wx.createCanvasContext('myCanvas') //画布
const ctxStatic = wx.createCanvasContext('staticCanvas') //静态画布
const ctxFirst = wx.createCanvasContext('firstCanvas') //静态画布
const ctxSelect = wx.createCanvasContext('selectCanvas') //选择画布

var audioCxt = wx.createInnerAudioContext(); //音乐播放器
var audioCxtS = wx.createInnerAudioContext(); //音乐播放器
var timer=setTimeout(function(){})
var timer2=setTimeout(function(){})


var serverURL = "http://192.168.0.105:7890"
var audioURL=''
var lastLine=0
var zhengBeam1=1
var difficulty='01'

var answerPartG = {
  id: '',
  measure: [{
    lineX: 0,
    number: 1,
    note: [],

  }],
  attributes:{
    beats: '3',
    beat_type: '4',
    divisions: '4',
    key:{
      fifths:-7
    },
    clef:{
      sign:'G',
      line:2
    }
  }
}
var nowMeasureG=0
var nowNoteNumberG=-1
var nowHangG=0
var nowSelectNoteG={}
var nowXG=0
var nowYG=0


Page({
  
  data: {
    //画布初始设置
    width: 350 * rpx,
    height: 160 * rpx,
    white_height: 440 * rpx,
    scroll_height: 395 * rpx,
    screenHeight: 667 * rpx,
    screenWidth: 375 * rpx,
    lastLine: 0,

    rpx: 0,

    showAnswer: false,
    isRuleTrue: true,



    dotsShow: 0,
    shengShow: 0,
    xiuShow: 0,

    activeSymbol: '',
    activeNotes: 4,
    //以下三个flag决定弹出折叠框时候dots xiu sheng图标的有无
    dotsFlag: 0,
    xiuFlag: 0,
    shengFlag: 0,
   

    firstScroll: true,
    secondScroll: false,
    uploadFlag: false,
    arrow: 0,
    arrowFlag: false,
    onloadFlag: true,
    playFlag:false,
    progressMusicFlag:true,

    assFlag: 0,
    assistantImage: ['/image/sing/assistant/1.png', '/image/sing/assistant/2.png', '/image/sing/assistant/3.png'],
    pianoPosition: [{position:1,
      name: 'c',
      tie: 'none',
      step: 'c',
      octave: 3,
      alter: 1,
      alterImage: 'sheng',
      y: 145 * rpx,
      x: 100 * rpx},
     {position:2,
       name: 'd',
       tie: 'none',
       step: 'd',
       octave: 3,
       alter: 1,
       alterImage: 'sheng',
       y: 140 * rpx,
       x: 100 * rpx
     },
     {position:4,
       name: 'f',
       tie: 'none',
       step: 'f',
       octave: 3,
       alter: 1,
       alterImage: 'sheng',
       y: 130 * rpx,
       x: 100 * rpx
     } , {position:5,
       name: 'g',
       tie: 'none',
       step: 'g',
       octave: 3,
       alter: 1,
       alterImage: 'sheng',
       y: 125 * rpx,
       x: 100 * rpx
     },
     {position:6,
       name: 'a',
       tie: 'none',
       step: 'a',
       octave: 3,
       alter: 1,
       alterImage: 'sheng',
       y: 120 * rpx,
       x: 100 * rpx
     } ,{position:8,
       name: 'c1',
       tie: 'none',
       step: 'c',
       octave: 4,
       alter: 1,
       alterImage: 'sheng',
       y: 110 * rpx,
       x: 100 * rpx
     } ,
     {position:9,
       name: 'd1',
       tie: 'none',
       step: 'd',
       octave: 4,
       alter: 1,
       alterImage: 'sheng',
       y: 105 * rpx,
       x: 100 * rpx
     } ,{position:11,
       name: 'f1',
       tie: 'none',
       step: 'f',
       octave: 4,
       alter: 1,
       alterImage: 'sheng',
       y: 95 * rpx,
       x: 100 * rpx
     }, 
     {position:12,
       name: 'g1',
       tie: 'none',
       step: 'g',
       octave: 4,
       alter: 1,
       alterImage: 'sheng',
       y: 90 * rpx,
       x: 100 * rpx
     }, 
     {position:13,
       name: 'a1',
       tie: 'none',
       step: 'a',
       octave: 4,
       alter: 1,
       alterImage: 'sheng',
       y: 85 * rpx,
       x: 100 * rpx
     },
      {position:15,
        name: 'c2',
        tie: 'none',
        step: 'c',
        octave: 5,
        alter: 1,
        alterImage: 'sheng',
        y: 75 * rpx,
        x: 100 * rpx
     }, {position:16,
        name: 'd2',
        tie: 'none',
        step: 'd',
        octave: 5,
        alter: 1,
        alterImage: 'sheng',
        y: 70 * rpx,
        x: 100 * rpx}
     , {position:18,
       name: 'f2',
       tie: 'none',
       step: 'f',
       octave: 5,
       alter: 1,
       alterImage: 'sheng',
       y: 60 * rpx,
       x: 100 * rpx}, 
       {position:19,
         name: 'g2',
         tie: 'none',
         step: 'g',
         octave: 5,
         alter: 1,
         alterImage: 'sheng',
         y: 55 * rpx,
         x: 100 * rpx
       }, {position:20,
         name: 'a2',
         tie: 'none',
         step: 'a',
         octave: 5,
         alter: 1,
         alterImage: 'sheng',
         y: 50 * rpx,
         x: 100 * rpx}, 
         {position:22,
        name: 'c3',
        tie: 'none',
        step: 'c',
        octave: 6,
        alter: 1,
        alterImage: 'sheng',
        y: 40 * rpx,
        x: 100 * rpx
      }, {
        position: 23,
        name: 'd3',
        tie: 'none',
        step: 'd',
        octave: 6,
        alter: 1,
        alterImage: 'sheng',
        y: 35 * rpx,
        x: 100 * rpx}],
    pianoName: [{
      name: 'c',
      tie: 'none',
      step: 'c',
      octave: 3,
      alter: 0,
      alterImage:'none',
      y: 145 * rpx,
      x: 100 * rpx
    }, {
      name: 'd',
      tie: 'none',
      step: 'd',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 140 * rpx,
      x: 100 * rpx
    }, {
      name: 'e',
      tie: 'none',
      step: 'e',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 135 * rpx,
      x: 100 * rpx
    }, {
      name: 'f',
      tie: 'none',
      step: 'f',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 130 * rpx,
      x: 100 * rpx
    }, {
      name: 'g',
      tie: 'none',
      step: 'g',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 125 * rpx,
      x: 100 * rpx
    }, {
      name: 'a',
      tie: 'none',
      step: 'a',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 120 * rpx,
      x: 100 * rpx
    }, {
      name: 'b',
      tie: 'none',
      step: 'b',
      octave: 3,
      alter: 0,
      alterImage: 'none',
      y: 115 * rpx,
      x: 100 * rpx
    }, {
      name: 'c1',
      tie: 'none',
      step: 'c',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 110 * rpx,
      x: 100 * rpx
    }, {
      name: 'd1',
      tie: 'none',
      step: 'd',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 105 * rpx,
      x: 100 * rpx
    }, {
      name: 'e1',
      tie: 'none',
      step: 'e',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 100 * rpx,
      x: 100 * rpx
    }, {
      name: 'f1',
      tie: 'none',
      step: 'f',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 95 * rpx,
      x: 100 * rpx
    }, {
      name: 'g1',
      tie: 'none',
      step: 'g',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 90 * rpx,
      x: 100 * rpx
    }, {
      name: 'a1',
      tie: 'none',
      step: 'a',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 85 * rpx,
      x: 100 * rpx
    }, {
      name: 'b1',
      tie: 'none',
      step: 'b',
      octave: 4,
      alter: 0,
      alterImage: 'none',
      y: 80 * rpx,
      x: 100 * rpx
    }, {
      name: 'c2',
      tie: 'none',
      step: 'c',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 75 * rpx,
      x: 100 * rpx
    }, {
      name: 'd2',
      tie: 'none',
      step: 'd',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 70 * rpx,
      x: 100 * rpx
    }, {
      name: 'e2',
      tie: 'none',
      step: 'e',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 65 * rpx,
      x: 100 * rpx
    }, {
      name: 'f2',
      tie: 'none',
      step: 'f',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 60 * rpx,
      x: 100 * rpx
    }, {
      name: 'g2',
      tie: 'none',
      step: 'g',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 55 * rpx,
      x: 100 * rpx
    }, {
      name: 'a2',
      tie: 'none',
      step: 'a',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 50 * rpx,
      x: 100 * rpx
    }, {
      name: 'b2',
      tie: 'none',
      step: 'b',
      octave: 5,
      alter: 0,
      alterImage: 'none',
      y: 45 * rpx,
      x: 100 * rpx
    }, {
      name: 'c3',
      tie: 'none',
      step: 'c',
      octave: 6,
      alter: 0,
      alterImage: 'none',
      y: 40 * rpx,
      x: 100 * rpx
    }, {
      name: 'd3',
      tie: 'none',
      step: 'd',
      octave: 6,
      alter: 0,
      alterImage: 'none',
      y: 35 * rpx,
      x: 100 * rpx
    }, {
      name: 'e3',
      tie: 'none',
      step: 'e',
      octave: 6,
      alter: 0,
      alterImage: 'none',
      y: 30 * rpx,
      x: 100 * rpx
    }],
    
    uploadStatus: false,
    showListStatus: false,
    animationData: '',

    percent: 0,
    showBoard: 0,
    comment: '你已经超过了50%的同学了！撒花~ 注意小节和音符时值的判断哦！',

    

    lists: [{ //请求到的歌曲列表，added表示是否被加入错题本
      name: 'A',
      added: 0,
      done: 1,
      highScore: 90,
      partId:'1020301'
    }, {
      name: 'B',
      added: 0,
      done: 0,
      highScore: 0,
      partId: '1020302'
    }, {
      name: 'C',
      added: 1,
      done: 1,
      highScore: 70,
      partId: '1020303'
    }],
    activeMusic: 0, //当前播放的歌曲编号
    songSum: 13,

    activeScore: -1, //当前歌曲的分数

    nowMeasure: 0,
    nowNoteNumber: -1,
    nowHang: 0,
    nowSelectNote: '',
    nowX: '',
    nowY: '',
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
          },
          {
            step: '',
            octave: '',
            tie: '',
            duration: '2',
            alter: '',
            x: 60 * rpx,
            y: 30 * rpx
          }
        ],

      }],
      attributes: {
        beats: '4',
        beat_type: '4',
        divisions: '4',
        key: {
          fifths:2
        },
        clef: {
          sign: 'G',
          line: 2
        }
      }
    },
    //************用户添加的内容 */

    

    // answerPart: {
    //   id: '',
    //   measure: [{
    //     lineX: 0,
    //     number: 1,
    //     note: [],

    //   }],
    //   attributes: {
    //     beats: '3',
    //     beat_type: '4',
    //     divisions: '4',
    //     key:{
    //       fifths:-7
    //     },
    //     clef:{
    //       sign:'G',
    //       line:2
    //     }
    //   }
    // },
    //   answerPart:
    //   {
    //     id: '',
    //     measure:
    //       [{
    //         lineX:200*rpx,
    //         number: '',
    //         note: [{
    //           step: '',
    //           octave: '',
    //           tie: '',
    //           duration: '4',
    //           alter: '',
    //           x: 80 * rpx,
    //           y: 30 * rpx
    //         }, {
    //           step: '',
    //           octave: '',
    //           tie: '',
    //           duration: '8',
    //           alter: '',
    //           x: 100 * rpx,
    //           y: 30 * rpx
    //         },
    //         {
    //           step: '',
    //           octave: '',
    //           tie: '',
    //           duration: '2',
    //           alter: '',
    //           x: 60 * rpx,
    //           y: 30 * rpx
    //         }
    //         ],

    //       }],
    //     attributes:
    //     {
    //       beats: '3',
    //       beat_type: '4',
    //       divisions: '4'
    //     }
    //   },
    firstLineNotes: [{
      id: 1,
      name: 1,
      width: 40,
      height: 24,
      marginLeft: -20,
      marginTop: -12,
    }, {
      id: 2,
      name: 2,
      width: 24,
      height: 72,
      marginLeft: -12,
      marginTop: -36,
    }, {
      id: 3,
      name: 4,
      width: 24,
      height: 72,
      marginLeft: -12,
      marginTop: -36,
    }, {
      id: 4,
      name: 8,
      width: 42,
      height: 72,
      marginLeft: -21,
      marginTop: -36,
    }, {
      id: 5,
      name: 16,
      width: 40,
      height: 72,
      marginLeft: -20,
      marginTop: -36,
    }, {
      id: 6,
      name: 32,
      width: 38,
      height: 72,
      marginLeft: -19,
      marginTop: -36,
    }],

    dotsList: [{
      id: 1,
      name: 'dot',
      width: 16,
      height: 16,
      marginLeft: -8,
      marginTop: -8,
    }, {
      id: 2,
      name: 'ddot',
      width: 28,
      height: 12,
      marginLeft: -14,
      marginTop: -6,
    }, {
      id: 3,
      name: 'yan',
      width: 48,
      height: 16,
      marginLeft: -24,
      marginTop: -8,
    }, {
      id: 4,
      name: 'threel',
      width: 56,
      height: 16,
      marginLeft: -28,
      marginTop: -8,
    }],
    shengsList: [{
      id: 1,
      name: 'sheng',
      width: 16,
      height: 48,
      marginLeft: -8,
      marginTop: -24,
    }, {
      id: 2,
      name: 'csheng',
      width: 32,
      height: 32,
      marginLeft: -16,
      marginTop: -16,
    }, {
      id: 3,
      name: 'jiang',
      width: 14,
      height: 48,
      marginLeft: -7,
      marginTop: -24,
    }, {
      id: 4,
      name: 'cjiang',
      width: 26,
      height: 48,
      marginLeft: -13,
      marginTop: -24,
    }, {
      id: 5,
      name: 'huan',
      width: 12,
      height: 48,
      marginLeft: -6,
      marginTop: -24,
      }, {
        id: 6,
        name: 'none',
        width: 32,
        height: 32,
        marginLeft: -16,
        marginTop: -16,
      }],
    xiusList: [{
      id: 1,
      name: '1',
      width: 45,
      height: 12,
      marginLeft: -22.5,
      marginTop: -6,
    }, {
      id: 2,
      name: '2',
      width: 45,
      height: 12,
      marginLeft: -22.5,
      marginTop: -6,
    }, {
      id: 3,
      name: '4',
      width: 16,
      height: 48,
      marginLeft: -8,
      marginTop: -24,
    }, {
      id: 4,
      name: '8',
      width: 26,
      height: 40,
      marginLeft: -13,
      marginTop: -20,
    }, {
      id: 5,
      name: '16',
      width: 32,
      height: 56,
      marginLeft: -16,
      marginTop: -28,
    }, {
      id: 6,
      name: '32',
      width: 28,
      height: 56,
      marginLeft: -14,
      marginTop: -28,
    }]

  },




  //*页面加载函数 */
  onLoad(options) {
    this.setSongInfo()
    console.log('optionid')
    console.log(options)
    this.setData({
      rpx: rpx,

    })
    //*************************************页面加载函数 */

    var that = this;

    //***********************************拿到选择的题组 */
    console.log(options.id)
    //**********************************画布初始化 */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          onloadFlag: true,
          questionId: options.id,
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          width: res.windowWidth - 20 * rpx,
          height: 160 * rpx,
          scroll_height: res.windowHeight - 332 * rpx,
          white_height: res.windowHeight - 260* rpx,
          rpx:rpx
          // scroll_height: res.windowHeight - 272 * rpx
        });
        
        //that.redraw()//+++++++++++++++++++++++++++++++++++++++如果不连接服务器的话这里要放回来
        
      }
    });
    //请求标准音
    //先从本地内存找历史记录。没有再说
     FileSystemManager.access({
      path:wx.env.USER_DATA_PATH +'/standardAudio',
      success(res){
        console.log(res)
        if(res.errMsg=="access:ok"){
          console.log('本地已存储标准音')
        }else{
          console.log('本地未存储标准音')
          wx.request({ //查找所有曲目
            url: app.globalData.serverURL + 'standard_voice',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.downloadAndSave(app.globalData.serverURL + res.data,'standardAudio')
            }
          });
          
        }
        
      },
      fail(res1){
        console.log(res1)
        console.log('本地未存储标准音')
          wx.request({ //查找所有曲目
            url: app.globalData.serverURL + 'standard_voice',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.downloadAndSave(app.globalData.serverURL + res.data,'standardAudio')
            }
          });
      }
    })
    
    

    //****************************************拿到本套题的信息和每题id */
    console.log('Question' + that.data.questionId)
    difficulty=options.difficulty
    wx.request({
      url: app.globalData.serverURL + 'get_info', //函数名待改
      data: {
        questionId: that.data.questionId,
        difficulty: options.difficulty,
        //questionId: '004',
        openid:app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data) //输出一下

        if (typeof res.data == "object") { //如果拿到的信息有效
          //console.log(res.data.length)
          that.setData({
            lists: res.data,
            songSum: res.data.length,
            partId: res.data[0].partId,
            openid:app.globalData.openid
          })
          audioURL = app.globalData.serverURL+res.data[0].audio_path
          var j = 0
          for (j = 0; j < res.data.length; j++) {
            if (res.data[j].done == 0) {
              that.setData({
                activeMusic: j,
                partId: res.data[j].partId,
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

  init() {
    var that = this

    that.gaoyin()
    ctxFirst.draw()
    that.wuxianpu(0)
    ctxStatic.draw()
    ctxSelect.draw()
    ctx.draw()
    //********************************请求本题的信息 */
    console.log('初始化')
    that.setData({
      onloadFlag:false//++++++++++++++++++++++++++++++++++++++++++++++连上服务器记得改回去
    })
    that.getPart()
    that.checkNotes()//检查错题本
    that.setSongInfo()
  },


  //*************************************************画布相关函数 */
  drawNotes(canvas,imageName,x,y){
///**************/



  var w=0
  var h=0
    switch(imageName){
      case '1':w=17*rpx;h=10.5*rpx;break;
      case '1s':w=17*rpx;h=10.5*rpx;break;
      case 'r1':w=17*rpx;h=10.5*rpx;break;
      case 'r1s':w=17*rpx;h=10.5*rpx;break;
      case '2':w=14*rpx;h=41*rpx;break;
      case '2s':w=14*rpx;h=41*rpx;break;
      case 'r2':w=14*rpx;h=41*rpx;break;
      case 'r2s':w=14*rpx;h=41*rpx;break;
      case '4':w=14*rpx;h=41*rpx;break;
      case '4s':w=14*rpx;h=41*rpx;break;
      case 'r4':w=14*rpx;h=41*rpx;break;
      case 'r4s':w=14*rpx;h=41*rpx;break;
      case '8':w=24*rpx;h=45*rpx;break;
      case '8s':w=24*rpx;h=45*rpx;break;
      case 'r8':w=14.5*rpx;h=40*rpx;break;
      case 'r8s':w=14.5*rpx;h=40*rpx;break;
      case '16':w=24*rpx;h=45*rpx;break;
      case '16s':w=24*rpx;h=45*rpx;break;
      case 'r16':w=13.5*rpx;h=47.5*rpx;break;
      case 'r16s':w=13.5*rpx;h=47.5*rpx;break;
      case '32':w=24*rpx;h=45*rpx;break;
      case '32s':w=24*rpx;h=45*rpx;break;
      case 'r32':w=13.5*rpx;h=49*rpx;break;
      case 'r32s':w=13.5*rpx;h=49*rpx;break;
      case 'bing':w=14*rpx;h=41*rpx;break;
      case 'bings':w=14*rpx;h=41*rpx;break;
      case 'rbing':w=14*rpx;h=41*rpx;break;
      case 'rbings':w=14*rpx;h=41*rpx;break;

      case 'sheng':w=8*rpx;h=24*rpx;break;
      case 'csheng':w=10*rpx;h=10*rpx;break;
      case 'jiang':w=7*rpx;h=24*rpx;break;
      case 'cjiang':w=13*rpx;h=24*rpx;break;
      case 'huan':w=6*rpx;h=24*rpx;break;
      case 'dot':w=4*rpx;h=4*rpx;break;
      case 'dot':w=9*rpx;h=4*rpx;break;

      case 'x1':w=14*rpx;h=6*rpx;break;
      case 'x1s':w=14*rpx;h=6*rpx;break;
      case 'x2':w=14*rpx;h=6*rpx;break;
      case 'x2s':w=14*rpx;h=6*rpx;break;
      case 'x4':w=8.5*rpx;h=26*rpx;break;
      case 'x4s':w=8.5*rpx;h=26*rpx;break;
      case 'x8':w=11.5*rpx;h=20*rpx;break;
      case 'x8s':w=11.5*rpx;h=20*rpx;break;
      case 'x16':w=15.5*rpx;h=30*rpx;break;
      case 'x16s':w=15.5*rpx;h=30*rpx;break;
      case 'x32':w=18.5*rpx;h=40*rpx;break;
      case 'x32s':w=18.5*rpx;h=40*rpx;break;





    }
    canvas.drawImage('../../../image/hear/'+imageName+'.png', x-10*rpx, y-10*rpx, w, h)
    console.log('选择'+imageName)
  },






  wuxianpu: function(hang) {
    this.setData({
      height: 160 * rpx + hang * (interval)
    })

    //五线谱
    var that = this
    console.log('draw' + hang)
    ctxStatic.moveTo(rpx * 10, rpx * 60 + hang * interval)
    ctxStatic.lineTo(that.data.screenWidth - 30 * rpx, rpx * 60 + hang * interval)
    ctxStatic.moveTo(rpx * 10, rpx * 70 + hang * interval)
    ctxStatic.lineTo(that.data.screenWidth - 30 * rpx, rpx * 70 + hang * interval)
    ctxStatic.moveTo(rpx * 10, rpx * 80 + hang * interval)
    ctxStatic.lineTo(that.data.screenWidth - 30 * rpx, rpx * 80 + hang * interval)
    ctxStatic.moveTo(rpx * 10, rpx * 90 + hang * interval)
    ctxStatic.lineTo(that.data.screenWidth - 30 * rpx, rpx * 90 + hang * interval)
    ctxStatic.moveTo(rpx * 10, rpx * 50 + hang * interval)
    ctxStatic.lineTo(that.data.screenWidth - 30 * rpx, rpx * 50 + hang * interval)
    //小节线

    ctxStatic.stroke()

  },
  drawFifth:function(){
    var that=this
    var alterGap=8*rpx
    var fifth=that.data.part.attributes['key-fifths']
    console.log(fifth)
    //width: 16rpx;
    //height: 48rpx;
    var i=0
    if(fifth>0){
      for(i=1;i<=fifth;i++){
        
        if(i==1){
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx, rpx *38, 8 * rpx, 24* rpx)
          alterShengList.push('f')
        }else if(i==2){
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 53, 8 * rpx, 24 * rpx)
          alterShengList.push('c')
        } else if (i == 3) {
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 33, 8 * rpx, 24 * rpx)
          alterShengList.push('g')
        } else if (i == 4) {
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 48, 8 * rpx, 24 * rpx)
          alterShengList.push('d')
        } else if (i == 5) {
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 63, 8 * rpx, 24 * rpx)
          alterShengList.push('a')
        } else if (i == 6) {
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 40, 8 * rpx, 24 * rpx)
          alterShengList.push('e')
        } else if (i == 7) {
          ctxFirst.drawImage('../../../image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 58, 8 * rpx, 24 * rpx)
          alterShengList.push('b')
        }
        startx = startx + alterGap
      }
    }else if(fifth<0){
      fifth=-fifth
      for (i = 1; i <= fifth; i++) {
        
        if (i == 1) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 52,7 * rpx, 24 * rpx)
          alterJiangList.push('b')
        } else if (i == 2) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 37, 7 * rpx, 24 * rpx)
          alterJiangList.push('e')
        } else if (i == 3) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 57, 7 * rpx, 24 * rpx)
          alterJiangList.push('a')
        } else if (i == 4) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 42, 7 * rpx, 24 * rpx)
          alterJiangList.push('d')
        } else if (i == 5) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 62, 7 * rpx, 24 * rpx)
          alterJiangList.push('g')
        } else if (i == 6) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 47, 7 * rpx, 24 * rpx)
          alterJiangList.push('c')
        } else if (i == 7) {
          ctxFirst.drawImage('../../../image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 67, 7 * rpx, 24 * rpx)
          alterJiangList.push('f')
        }
        startx = startx + alterGap
      }
    }
  },
  //************************高音谱号加拍号 */
  gaoyin: function() {
    var that = this
    startx=100*rpx
    alterShengList=[]//init
    alterJiangList=[]//init

    ctxFirst.drawImage('../../../image/hear/g.png', 15 * rpx, rpx * 32, 26 * rpx, 70 * rpx)
    that.drawFifth();

    ctxFirst.drawImage('../../../image/hear/p' + that.data.part.attributes.beats + '.png', startx-46 * rpx, rpx * 50, 16 * rpx, 20 * rpx)
    ctxFirst.drawImage('../../../image/hear/p' + that.data.part.attributes.beat_type + '.png', startx-46 * rpx, rpx * 70, 16 * rpx, 20 * rpx)
    ctxFirst.stroke()


  },
  //********************重画所有小节线 */
  drawMeasureLine() {
    var that = this
    var i = 0
    for (i = 0; i < answerPartG.measure.length; i++) {
      var lineX = answerPartG.measure[i].lineX
      var lastNumber = answerPartG.measure[i].note.length - 1
      var hang;
      ctx.setStrokeStyle('black')
      if (nowNoteNumberG == -1) {
        if (i == nowMeasureG - 1) {
          ctx.setStrokeStyle("rgb(54, 84, 253)")
          console.log("设置颜色" + i)
        }
      } else {
        if (i == nowMeasureG) {
          ctx.setStrokeStyle("rgb(54, 84, 253)")
          console.log("设置颜色" + i)
        }
      }
      if (lastNumber != -1) {
        hang = answerPartG.measure[i].note[lastNumber].hang

      } else if (answerPartG.measure.length != 1) {
        for (var j = 1; j < i; j++) {
          if (answerPartG.measure[i - j].note.length != 0) {
            lastNumber = answerPartG.measure[i - j].note.length - 1
            hang = answerPartG.measure[i - j].note[lastNumber].hang
            break;
          }
        }

      }
      if (lineX == 30 * rpx) {
        hang = hang + 1
      }
      ctx.moveTo(lineX, rpx * 50 + hang * interval)
      ctx.lineTo(lineX, rpx * 90 + hang * interval)
      ctx.stroke()
    }
    ctx.draw()
  },
  //***********画上下加线 */
  upAndDown(measure,number){
    var that=this
    var cy = answerPartG.measure[measure].note[number].centery - answerPartG.measure[measure].note[number].hang*interval
    var cx = answerPartG.measure[measure].note[number].x
    if(cy<55*rpx||cy>95*rpx){
      var i=0
      var h;
      if (cy < 55 * rpx){
        h=(40*rpx-cy)/10*rpx
        for (i = 0; i <= h; i++) {
          ctx.moveTo(cx+5*rpx, answerPartG.measure[measure].note[number].hang * interval+40*rpx - i * 10 * rpx)
          ctx.lineTo(cx - 15 * rpx, answerPartG.measure[measure].note[number].hang * interval +40*rpx - i * 10 * rpx)
        }
      }
      else{
        h = (cy-100*rpx) / 10 * rpx
        for (i = 0; i <= h; i++) {
          ctx.moveTo(cx + 5 * rpx, answerPartG.measure[measure].note[number].hang * interval +100*rpx + i * 10 * rpx)
          ctx.lineTo(cx - 15 * rpx, answerPartG.measure[measure].note[number].hang * interval +100*rpx + i * 10 * rpx)
        }
      }
      ctx.stroke()
      
    }
  },
  /*************************画符杆 */
  drawStem(measure, number, height, stem, nowAnswerMeasure){
    var that=this


    var centerX = nowAnswerMeasure.note[number].x
    var centerY = nowAnswerMeasure.note[number].centery
    var hang = nowAnswerMeasure.note[number].hang
    var imageName = "bing"
      var result=[]
      if (stem=='up'){
        if (nowAnswerMeasure.note[number].stem != stem || (nowAnswerMeasure.note[number].imageName != 'rbing' && nowAnswerMeasure.note[number].imageName != 'bing')) {//改过就别改了
        centerX = centerX + 2 * rpx
        nowAnswerMeasure.note[number].centerx=centerX//赋值cx
          nowAnswerMeasure.note[number].imageName =imageName
          nowAnswerMeasure.note[number].y = centerY-24*rpx
          nowAnswerMeasure.note[number].stem=stem
        }
        nowAnswerMeasure.note[number].height = height
        centerX = nowAnswerMeasure.note[number].centerx
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX,centerY-height)
        result = [centerX, centerY - height, hang, number, nowAnswerMeasure]
      }else{
        if (nowAnswerMeasure.note[number].stem!=stem||(nowAnswerMeasure.note[number].imageName != 'rbing' && nowAnswerMeasure.note[number].imageName != 'bing')) {//改过就别改了
        nowAnswerMeasure.note[number].imageName = 'r' + imageName
        nowAnswerMeasure.note[number].y = centerY +5 * rpx
        nowAnswerMeasure.note[number].centerx = centerX - 10 * rpx//赋值cx
        nowAnswerMeasure.note[number].stem = stem
        }
        nowAnswerMeasure.note[number].height = height
        centerX = nowAnswerMeasure.note[number].centerx
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX, centerY + height)
        result = [centerX, centerY + height, hang, number, nowAnswerMeasure]
      }
      ctx.stroke()
      return result;
    
  },
  getHeight(measure, group, long,er,stem,perBeam){
    var that=this
    var result=[]
    // 
    // console.log('我的y')
    // console.log(that.centerYtoy0(answerPartG.measure[measure].note[number].centery, answerPartG.measure[measure].note[number].hang))
    if(stem=='up'){
      var min=35*rpx
      var i = 0
      for (i = 0; i < long; i++) {
        var number = answerPartG.measure[measure].groups[group].note[0][0][i]
        //console.log('i' + number)
        var height = that.centerYtoy0(answerPartG.measure[measure].note[number].centery, answerPartG.measure[measure].note[number].hang) - that.centerYtoy0(answerPartG.measure[measure].note[er[0]].centery, answerPartG.measure[measure].note[er[0]].hang) + perBeam * (er[0] - number) + 35 * rpx
        if(height<min){
          min=height//记住最短的，最后全体加上
        }
        result.push(height)
      }
    }else if(stem=='down'){
      var min=35*rpx
      var i = 0
      for (i = 0; i < long; i++) {
        
        var number = answerPartG.measure[measure].groups[group].note[0][0][i]
        //console.log('i' + number)
      var height = that.centerYtoy0(answerPartG.measure[measure].note[er[0]].centery, answerPartG.measure[measure].note[er[0]].hang) - that.centerYtoy0(answerPartG.measure[measure].note[number].centery, answerPartG.measure[measure].note[number].hang) - perBeam * (er[0] - number) + 35 * rpx
        if (height < min) {
          min = height//记住最短的，最后全体加上
        }
        result.push(height)
      }
      
    }
    var k = 0
    for (k = 0; k < long; k++) {
      result[k] = result[k] + (35 * rpx - min)
    }
    return result
  },
  drawBeam8(measure,drawXY,long,stem,perBeam){
    var that=this
    var up=4*rpx
    if(stem=='down'){
      up=-up
    }
      //同一行直接划线
      if (drawXY[0][2] == drawXY[long - 1][2]) {
        ctx.beginPath() //lianjie
        ctx.moveTo(drawXY[0][0], drawXY[0][1])
        ctx.lineTo(drawXY[long - 1][0], drawXY[long - 1][1])
        ctx.lineTo(drawXY[long - 1][0], drawXY[long - 1][1] +up)
        ctx.lineTo(drawXY[0][0], drawXY[0][1] +up)
        ctx.setFillStyle('black')
        ctx.fill()
        ctx.closePath()
        ctx.stroke()


      }else{//不同行，画到行末
      var i=0
      var breakList=new Array()
        breakList.push(0)
        for(i=0;i<drawXY.length;i++){
          
          //找到那个断开的i
          if(i!=0&&drawXY[i][2]!=drawXY[i-1][2]){
              breakList.push(i - 1)
              breakList.push(i)
          }
        }
        breakList.push(drawXY.length-1)
      var k=0;
      for(k=0;k<breakList.length;k=k+2){
        console.log(k)
        var start=[]
        var end=[]
        start[0] = drawXY[breakList[k]][0]
        start[1] = drawXY[breakList[k]][1]
        end[0] = drawXY[breakList[k + 1]][0]
        end[1] = drawXY[breakList[k + 1]][1]
        //不是头尾
        if(k!=0){
          start[0]=start[0]-gap/2
          start[1]=start[1]-perBeam/2
        }
        if((k+1)!=breakList.length-1){
          end[0] = end[0] + gap / 2
          end[1] = end[1] + perBeam / 2
        }
        ctx.beginPath() //lianjie
        ctx.moveTo(start[0], start[1])
        ctx.lineTo(end[0], end[1])
        ctx.lineTo(end[0], end[1]- 4 * rpx)
        ctx.lineTo(start[0], start[1] - 4 * rpx)
        ctx.setFillStyle('black')
        ctx.fill()
        ctx.closePath()
        ctx.stroke()
      }
    }
    //画16和32
    var j=0
    for(j=0;j<long;j++){
      if (answerPartG.measure[measure].note[drawXY[j][3]].beam.length>=2){
        var beam16 = answerPartG.measure[measure].note[drawXY[j][3]].beam[1]
        var up =7 * rpx
        var add16 = 1
        var minus16 = -1
        if (stem == 'down') {
          up = -7 * rpx
        }
        if (beam16 == 'begin') {
          minus16 = 0
        } else if (beam16 == 'end') {
          add16 = 0
        }

        ctx.beginPath() //lianjie
        ctx.moveTo(drawXY[j][0] + minus16 * gap / 2, drawXY[j][1] + up + minus16 * perBeam / 2)
        ctx.lineTo(drawXY[j][0] + add16 * gap / 2, drawXY[j][1] + up + add16 * perBeam / 2)
        ctx.lineTo(drawXY[j][0] + add16 * gap / 2, drawXY[j][1] + add16 * perBeam / 2 + up + up / Math.abs(up) * 3 * rpx)
        ctx.lineTo(drawXY[j][0] + minus16 * gap / 2, drawXY[j][1] + minus16 * perBeam / 2 + up + up / Math.abs(up) * 3 * rpx)
        ctx.setFillStyle('black')
        ctx.fill()
        ctx.closePath()
        ctx.stroke()
        if (answerPartG.measure[measure].note[drawXY[j][3]].beam.length > 2){/////32
          var beam32 = answerPartG.measure[measure].note[drawXY[j][3]].beam[2]
          var add32 = 1
          var minus32 = -1
          up = up*2
          if (beam32 == 'begin') {
            minus32 = 0
          } else if (beam32 == 'end') {
            add32 = 0
          }

          ctx.beginPath() //lianjie
          ctx.moveTo(drawXY[j][0] + minus32 * gap / 2, drawXY[j][1] + up + minus32 * perBeam / 2)
          ctx.lineTo(drawXY[j][0] + add32 * gap / 2, drawXY[j][1] + up + add32 * perBeam / 2)
          ctx.lineTo(drawXY[j][0] + add32 * gap / 2, drawXY[j][1] + add32 * perBeam / 2 + up + up / Math.abs(up) * 3 * rpx)
          ctx.lineTo(drawXY[j][0] + minus32 * gap / 2, drawXY[j][1] + minus32 * perBeam / 2 + up + up / Math.abs(up) * 3 * rpx)
          ctx.setFillStyle('black')
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
        }
      }
      

    }
    
  },

  drawBeam(measure){
    var that = this
    var group = 0
    var nowAnswerMeasure = answerPartG.measure[measure]
    // var setAnswerMeasure="answerPart.measure["+measure+"]"
    for (group = 0; group < answerPartG.measure[measure].groups.length; group++) {
      var stem = answerPartG.measure[measure].groups[group].stem
      var lower = answerPartG.measure[measure].groups[group].lower
      var higher = answerPartG.measure[measure].groups[group].higher
      var long = answerPartG.measure[measure].groups[group].note[0][0].length
      //拿到头尾向量
      var head = answerPartG.measure[measure].groups[group].note[0][0][0]
      var tail = answerPartG.measure[measure].groups[group].note[0][0][long - 1]

      var perBeam = (that.centerYtoy0(answerPartG.measure[measure].note[tail].centery, answerPartG.measure[measure].note[tail].hang) - that.centerYtoy0(answerPartG.measure[measure].note[head].centery, answerPartG.measure[measure].note[head].hang)) / (long - 1)
      var i = 0
      if (stem == 'up') {
        if (higher.length > 1) {
          perBeam= 0
        }
        var height = that.getHeight(measure, group, long, higher, stem, perBeam)

        
        var drawXY=new Array()
        for (i = 0; i < long; i++) {
          var number = answerPartG.measure[measure].groups[group].note[0][0][i]
          var result = that.drawStem(measure, number, height[i], stem, nowAnswerMeasure)
          drawXY.push(result.slice(0,4))
          nowAnswerMeasure=result[4]
        }
        
      } else if (stem == 'down') {
        if (lower.length > 1) {
          perBeam=0
        }
        var drawXY = new Array()
        var height = that.getHeight(measure, group, long, lower, stem, perBeam)
        // console.log('HEIGHT就DOWN是')
        // console.log(height)
        for (i = 0; i < long; i++) {
          var number =answerPartG.measure[measure].groups[group].note[0][0][i]
          var result = that.drawStem(measure, number, height[i], stem, nowAnswerMeasure)
          drawXY.push(result.slice(0, 4))
          nowAnswerMeasure = result[4]
        }

      }
      that.drawBeam8(measure,drawXY, long, stem,perBeam)
    }
    answerPartG.measure[measure]=nowAnswerMeasure
    // that.setData({
    //   [setAnswerMeasure]:nowAnswerMeasure
    // })
  },
//************************************延音线 */
drawTie(measureStart,numberStart){
  var that=this
  var stem = answerPartG.measure[measureStart].note[numberStart].stem
  var measureStop = measureStart
  var numberStop = numberStart+1
  if (numberStart == answerPartG.measure[measureStart].note.length-1){
    measureStop = measureStart+1
    numberStop=0
  }
  var startx = answerPartG.measure[measureStart].note[numberStart].centerx
  var starty = answerPartG.measure[measureStart].note[numberStart].centery
  var stopx = answerPartG.measure[measureStop].note[numberStop].centerx
  var stopy = answerPartG.measure[measureStop].note[numberStop].centery
  var centerx;
  var centery;
  if(stem=='down'){
    startx=startx+3*rpx
    stopx=stopx+3*rpx
    starty=starty-10*rpx
    stopy=stopy-10*rpx
    centerx = (startx + stopx) / 2
    centery = (starty + stopy) / 2 - 8 * rpx
  }
  if (stem == 'up') {
    startx = startx - 5 * rpx
    stopx = stopx - 5 * rpx
    starty = starty + 10 * rpx
    stopy = stopy + 10 * rpx
    centerx = (startx + stopx) / 2
    centery = (starty + stopy) / 2 + 8 * rpx
  }
  ctx.beginPath()
  ctx.moveTo(startx, starty)
  if (answerPartG.measure[measureStart].note[numberStart].hang != answerPartG.measure[measureStop].note[numberStop].hang){
    var centerx1=startx+gap/2
    var centery1 = centery- (starty + stopy) / 2 +starty
    var centerx2=stopx-gap/2
    var centery2 = centery - (starty + stopy) / 2 + stopy
    ctx.quadraticCurveTo((centerx1 + startx) / 2, (centery1 + starty) / 2 + (centery - (starty + stopy) / 2)/4, centerx1, centery1)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerx2, centery2)
    ctx.quadraticCurveTo((centerx2 + stopx) / 2, (centery2 + stopy) / 2+(centery - (starty + stopy) / 2) / 4, stopx, stopy)

  }else{
    ctx.quadraticCurveTo(centerx, centery, stopx, stopy)
  }
  ctx.stroke()

},
manage3Up(position,stem,centery,height,hang){
  var that=this
  var result
  if(position=='up'){
    if(stem=='up'){
      result = centery - height -5*rpx- interval * hang
    }else{
      result = centery - 5 * rpx - interval * hang
    }
    console.log('up'+result)
    if(result>=40*rpx){
      result = 40 * rpx
    }
  }else{
    if (stem == 'up') {
      result = centery + 5 * rpx - interval * hang
    } else {
      result = centery + height+5*rpx - interval * hang
    }
    console.log('down' + result)
    if (result <= 100 * rpx) {
      result =100 * rpx
    }
  }
  console.log("3lian" + result)
  return result
},
//******画3连音 */
drawThree(measure,number){
  var that=this
  var startNote = answerPartG.measure[measure].note[number]
  var middleNote = answerPartG.measure[measure].note[number+1]
  var endNote = answerPartG.measure[measure].note[number+2]//+++++++++只考虑3个音了啊
  if(typeof(middleNote)=="undefined"){
    middleNote={
      stem:startNote.stem,
      centerx:that.checkHang(measure,number+1)[0],
      hang: that.checkHang(measure, number + 1)[1],
      centery: startNote.centery + interval * (that.checkHang(measure, number + 1)[1]-startNote.hang),
      height:startNote.height
    }
    endNote={
      stem: middleNote.stem,
      centerx: middleNote.centerx+gap,
      hang: middleNote.hang,
      centery: middleNote.centery,
      height: middleNote.height
    }
  } else if (typeof (endNote) == "undefined"){
    endNote = {
      stem: middleNote.stem,
      centerx: that.checkHang(measure, number + 2)[0],
      hang: that.checkHang(measure, number + 2)[1],
      centery: middleNote.centery + interval * (that.checkHang(measure, number + 2)[1] - middleNote.hang),
      height: middleNote.height
    }
  }
  console.log('endNote')
  console.log(endNote)
  var noteList=[startNote,middleNote,endNote]
  ctx.beginPath()
  ctx.setLineWidth(0.5)
  if (typeof (endNote) != 'undefined' && typeof (middleNote) != 'undefined'){//only a number 3
      var i=0
      var max=0
      var min=10000*rpx
      for(i=0;i<3;i++){
        var theNote = noteList[i]
        var theY = that.manage3Up(middleNote.stem, theNote.stem, theNote.centery, theNote.height, theNote.hang)
        if(theY<min){
          min=theY
        }if(theY>max){
          max=theY
        }
      }
    if (middleNote.stem=='up'){
      ctx.moveTo(startNote.centerx, min + interval * startNote.hang)
      ctx.lineTo(startNote.centerx, min + interval * startNote.hang+5*rpx)
      ctx.moveTo(startNote.centerx, min + interval * startNote.hang)
      ctx.lineTo(startNote.centerx + gap / 2, min + interval * startNote.hang)
      ctx.setTextBaseline('middle')
      ctx.setFontSize(15)
      ctx.fillText('3', middleNote.centerx, min + interval * middleNote.hang)
      ctx.moveTo(endNote.centerx - gap / 2, min + interval * endNote.hang)
      ctx.lineTo(endNote.centerx, min + interval * endNote.hang)
      ctx.moveTo(endNote.centerx, min + interval * endNote.hang+5*rpx)
      ctx.lineTo(endNote.centerx, min + interval * endNote.hang)
    } else if (middleNote.stem == 'down'){
      ctx.moveTo(startNote.centerx, max + interval * startNote.hang)
      ctx.lineTo(startNote.centerx, max + interval * startNote.hang - 5 * rpx)
      ctx.moveTo(startNote.centerx, max + interval * startNote.hang)
      ctx.lineTo(startNote.centerx + gap / 2, max + interval * startNote.hang)
      ctx.setTextBaseline('middle')
      ctx.setFontSize(15)
      ctx.fillText('3', middleNote.centerx, max + interval * middleNote.hang)
      ctx.moveTo(endNote.centerx - gap/2, max + interval * endNote.hang)
      ctx.lineTo(endNote.centerx, max + interval * endNote.hang)
      ctx.moveTo(endNote.centerx, max + interval * endNote.hang - 5 * rpx)
      ctx.lineTo(endNote.centerx,max + interval * endNote.hang)
    }
    }
    ctx.stroke()
},


  drawSelect(){
    var that=this
    if(nowNoteNumberG!=-1){
      console.log('画花花花啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊')
      var imageName=answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName+'s'
      this.drawNotes(ctxSelect,imageName,answerPartG.measure[nowMeasureG].note[nowNoteNumberG].x,answerPartG.measure[nowMeasureG].note[nowNoteNumberG].y)
      ctxSelect.draw()
    }
    
  },
  //******************重新绘图函数 */
  redraw() {
    var that = this
    var lastMeasure = answerPartG.measure.length - 1
    var lastNumber = answerPartG.measure[answerPartG.measure.length - 1].note.length - 1
    var hang = 0
    if (lastNumber != -1 && answerPartG.measure[lastMeasure].note[lastNumber].hang != undefined) {
      hang = answerPartG.measure[lastMeasure].note[lastNumber].hang
    } else {
      for (var i = 2; i < answerPartG.measure.length; i++) {
        if (answerPartG.measure[answerPartG.measure.length - i].note.length != 0) {
          lastMeasure = answerPartG.measure.length - i
          lastNumber = answerPartG.measure[lastMeasure].note.length - 1
          hang = answerPartG.measure[lastMeasure].note[lastNumber].hang
          break;
        }
      }
    }
    console.log(lastNumber)
    //that.checkBeam()//拿到划分依据规则,+++++++++++++++++++++++++++++++++++++++等能连接了记得删掉
    

    
    if (hang < lastLine) {
      console.log("换了" + hang)
      lastLine=hang
      var i = 0
    for (i = 0; i <= hang; i++) {
      that.wuxianpu(i)
    }
      ctxStatic.draw(false)
  } else if(hang > lastLine){
    console.log('画布加一行啦啦啦啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊')
    that.wuxianpu(hang)
    ctxStatic.draw(true)
  }
    
    // that.wuxianpu(hang)
    that.drawMeasureLine()
    ctx.setStrokeStyle('black')
    
    //这里是每次重绘都要遍历所有音符的部分，为减少遍历次数写在一起
    var k = 0
    var j=0
    for (k = 0; k <= lastMeasure; k++) {
      if (answerPartG.measure[k].note.length!=0&&k>=nowMeasureG){
        that.getZhengAndBeam(k, answerPartG.measure[k].note.length - 1)//每次重绘时刷新一下本小节的连接情况
      }
      //这里添加画符柄的函数!!!
      if (typeof (answerPartG.measure[k].groups) == 'object') {
        that.drawBeam(k)
      }
      for (j = 0; j < answerPartG.measure[k].note.length; j++) {
        
        that.upAndDown(k,j)
        if (answerPartG.measure[k].note[j].tie=='start'){
          that.drawTie(k,j)
        }
        if (typeof (answerPartG.measure[k].note[j].three)!="undefined"){
          if (answerPartG.measure[k].note[j].three.flag=='begin'){
            that.drawThree(k,j)
          }
          ctx.setLineWidth(1)
        }
        //画音符
        this.drawNotes(ctx,answerPartG.measure[k].note[j].imageName,answerPartG.measure[k].note[j].x,answerPartG.measure[k].note[j].y)
        //画升降
        if(answerPartG.measure[k].note[j].alterImage!='none'&&answerPartG.measure[k].note[j].alterImage!=null){
          this.drawNotes(ctx,answerPartG.measure[k].note[j].alterImage,answerPartG.measure[k].note[j].alterx,answerPartG.measure[k].note[j].altery)
        }
        //画附点
        if(answerPartG.measure[k].note[j].dotImage!='none'&&answerPartG.measure[k].note[j].dotImage!=null){
          this.drawNotes(ctx,answerPartG.measure[k].note[j].dotImage,answerPartG.measure[k].note[j].dotx,answerPartG.measure[k].note[j].doty)
        }
      }
      
    }
    ctx.draw(true)
    this.drawSelect()
    
    
  },

  
  canvasToTempImage: function () {
    wx.canvasToTempFilePath({
      canvasId: "myCanvas",
      success: (res) => {
        let tempFilePath = res.tempFilePath;
        this.setData({
          imagePath: tempFilePath,
        });
      }
    }, this);
  },


  //*****************音频播放相关函数****************** */
  handlePlay(){
    var that=this
    
    if(that.data.playFlag==false){
      FileSystemManager.access({
        path:wx.env.USER_DATA_PATH +'/'+that.data.partId,
        success(res){
          console.log(res)
          if(res.errMsg=="access:ok"){
            console.log('本地已存储该音频')
            console.log('播放音乐' + wx.env.USER_DATA_PATH +'/'+that.data.partId)
            audioCxt.src = wx.env.USER_DATA_PATH +'/'+that.data.partId;
            audioCxt.play()
            that.setData({
              progressMusicFlag:true
            })
          }else{
            console.log('本地未存储该音频')
            that.downloadAndSave(audioURL,that.data.partId)
            console.log('播放音乐' + audioURL)
            audioCxt.src = audioURL;
            audioCxt.play()
            
          }
          
        },
        fail(res1){
          console.log(res1)
          console.log('本地未存储该音频')
            that.downloadAndSave(audioURL,that.data.partId)
            console.log('播放音乐' + audioURL)
            audioCxt.src = audioURL;
            audioCxt.play()
        }
      })
      
    }else{
      console.log('暂停播放')
      audioCxt.pause();
    }
    that.setData({
      playFlag: !that.data.playFlag,
      progressMusicFlag:false
    })
  },


  handleAssTap() {
    // 点击小助手后的状态变化
    if (this.data.isRuleTrue == false) {
      if (this.data.showAnswer == false) {
        let tmp = this.data.assFlag
        if (tmp == 0) {
          
          }
        if (tmp == 1) {
          
          }
        this.setData({
          assFlag: (tmp + 1) % 2,
        })
      } else {//*************************************啥叫播放答案？？？？ */
        let tmp = this.data.assFlag % 2 + 1
        if (tmp == 1){
          console.log('播放答案')
          this.getMyAudio()
        } 
        if (tmp == 2) {
          console.log('暂停播放')
          audioCxt.pause();
        }
        this.setData({
          assFlag: tmp
        })
      }
    } else if (this.data.isRuleTrue == true) {
      this.setData({
        isRuleTrue: false,
      })
    }
  },
  onShow() {
    // 监听音乐播放
    let that = this
    audioCxt.onPlay(() => {
      that.timer && clearInterval(that.timer)
      that.timer = setInterval(() => {
        
        let per = (audioCxt.currentTime / audioCxt.duration) * 10000
            that.setData({
              percent: Math.round(per) / 100 + '',
            })
          
      }, 1000)
    })

    // 监听背景音频暂停事件
    audioCxt.onPause(() => {
      clearInterval(that.timer)
    })
    audioCxt.onEnded(() =>{
      that.setData({
        playFlag:false
      })
    })
    
        // 监听助手音频暂停事件
        
        audioCxtS.onEnded(() =>{
          if (this.data.isRuleTrue == false) {
            if (this.data.showAnswer == true) {
              console.log('暂停音频')
              this.setData({
                assFlag: 2
              })
            }
          }
        })
      
    
  },


  setTouchMove(e) {
    
    var that=this
      if (e.touches[0].clientX >= 72.5*rpx && e.touches[0].clientX <= 262.5*rpx) {
        console.log(e)
        let percent = (e.touches[0].clientX - 70*rpx) / 190*rpx * 10000
        this.setData({
          percent: Math.round(percent) / 100
        })
        this.data.current = ((this.data.percent / 100) * audioCxt.duration).toFixed(3)
        that.setProgress()
      }
  },

  setProgress() {
    let that = this
    console.log('bindtouchend')
    
    console.log('ALL' + audioCxt.duration)
    
        if(that.data.current != audioCxt.currentTime){
          console.log('CURRENT' + typeof(that.data.current))
          audioCxt.stop()
          audioCxt.seek(parseInt(that.data.current))
          //audioCxt.play()//播放音乐
          setTimeout(() => {
            audioCxt.play()//播放音乐
          }, 500)
          audioCxt.onSeeked(()=>{
            
            console.log('sEEK' + that.data.current)
            
          })

            
            
        }
          
  },
//**********************************************错题本 */
  handleNotesTap() {
    // 处理加入错题本事件
    var that=this
    //add
    if (that.data.lists[that.data.activeMusic].added!=1){
      that.addToNotes()

    }else{//delete
       that.deleteNotes()
    }

  },


  //隐藏遮盖层
  hideRule: function() {
    this.setData({
      isRuleTrue: false,
    })
  },
  yincha() {
    //播放标准音
    console.log('播放了标准音')
    audioCxtS.src = app.globalData.standardAudio;
    console.log(audioCxtS.src)
    audioCxtS.play()
  },
  showModal(modalName) {
    this.setData({
      modalName: modalName
    })
  },
  hideModal(e) {
    var that=this
    this.setData({
      modalName: null
    })
    if (e.currentTarget.dataset.modal=='last'){
      that.setLast(e.currentTarget.dataset.name)
    } else if (e.currentTarget.dataset.modal == 'next'){
      that.setNext(e.currentTarget.dataset.name)
    } else if (e.currentTarget.dataset.modal!=null){
      that.changePart(e.currentTarget.dataset.modal, e.currentTarget.dataset.name)
    }
  },
  handleLastTap() {
    //切换上一首歌
    var that=this
    if (that.data.isRuleTrue == false) {
      that.showModal('last')
    }
  },
  setLast(feedback){
    var that=this
    let data = this.data
    if (feedback == 'ok') {
      let active = data.activeMusic
      var newId = that.data.lists[(active - 1 + data.lists.length) % data.lists.length].partId
      this.setData({
        activeMusic: (active - 1 + data.lists.length) % data.lists.length,
        activeScore: 0,
        partId: newId
      })
      that.init()
      console.log('上一首')
    }
  },
  handleNextTap() {
    //切换下一首
    var that = this
    if (that.data.isRuleTrue == false) {
      that.showModal('next')
    }
  },
  setNext(feedback){
    var that = this
    let data = this.data
    if (feedback == 'ok') {
      let active = data.activeMusic
      var newId = that.data.lists[(active + 1) % data.lists.length].partId
      this.setData({
        activeMusic: (active + 1) % data.lists.length,
        activeScore: 0,
        partId: newId
      })
      that.init()
      console.log('下一首')
    }
  },

  
  
  handleUploadTap() {
    var that=this
    // 弹出list
    if(answerPartG.measure[0].note.length==0){
      wx.showToast({
        title: '请输入音符！',
        icon:'none'
      })
    }else{
      this.uploadAnswer()
    if (this.data.isRuleTrue == false) {
      //动画效果
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out",
        delay: 0
      })
      this.animation = animation
      animation.translateY(500).step()
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 40)
      //功能实现
      let score = 99 //此处的分数应由后台评定后拿到
      this.setData({
        animationData: animation.export(),
        progressFlag:false,
        uploadStatus: true,
        showAnswer: true,
        assFlag: 2, //表情变化
        arrowFlag: true,
        arrow: 1,
        showBoard: 1,
        activeScore: score
      })
      //如果本次评分是当前歌曲的历史最高分，则更改数据
      if (score > this.data.lists[this.data.activeMusic].highest_score) {
        let temp = "lists[" + this.data.activeMusic + "].highest_score"
        this.setData({
          [temp]: score
        })
      }


       //修改本地访问记录数组
    var theHearHistory=this.searchStorage('hearHistory')
    if(theHearHistory!=null){
      console.log('本地已存储')
      theHearHistory[parseInt(that.data.partId.slice(1,3))-1][parseInt(difficulty)-1][0]=theHearHistory[parseInt(that.data.partId.slice(1,3))-1][parseInt(difficulty)-1][0]+1
      console.log('修改hear记录本地存储')
      this.saveToStorage('hearHistory',theHearHistory)
    }

    }
    }

    
  },
  

  hideUpload(e) {
    var that=this
    let flg = e.target.dataset.id
    if (flg == 0) {
      //重做
      console.log('重做')
      that.init()
    } else {
      //订正
      console.log('订正')
    }
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        uploadStatus: false,
        showAnswer: false,
        assFlag: 0,
      })
    }.bind(this), 120)
    this.setData({
      animationData: animation.export(),
      arrowFlag: false,
      showBoard: 0
    })
  },

  setSongInfo() {
    //请求到歌曲总数，并赋值给songSum
    wx.setNavigationBarTitle({
      title: this.data.activeMusic + 1 + '/' + this.data.songSum,
    })
  },
  //*******************************list************************ */
  chooseQuestion(e) {
    console.log(e.currentTarget.dataset.id)
    var that=this
    that.hideList()
    that.showModal(e.currentTarget.dataset.id)
  },
  changePart(index,feedback){
    var that=this
    if(feedback=='ok'){
      that.setData({
        activeMusic: index,
        partId: that.data.lists[index].partId
      })
      that.init()
    }
  },
  showList() {
    var that=this
    // 弹出list
    if (this.data.isRuleTrue == false) {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out",
        delay: 0
      })
      this.animation = animation
      animation.translateY(500).step()
      this.setData({
        animationData: animation.export(),
        showListStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 40)
    }
  },
  hideList() {
    // 隐藏list
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
    this.redraw()
    
  },
  // 以下为hear页面的新函数****************************************************
  //dots sheng xiu的折叠面板选中逻辑
  handleDotsTap() {
    let tmp = this.data.dotsShow
    let flag = this.data.dotsFlag
    //flag==1代表打开了折叠框
    //此处的active变量是下一个状态，也就是关闭折叠框
    // let active = (flag == 1 ? '4' : 'dot')
    if (this.data.shengShow == 0 & this.data.xiuShow == 0) {
      this.setData({
        dotsShow: (tmp + 1) % 2,
        dotsFlag: (flag + 1) % 2,
        // activeNotes: active
      })
    } else if (this.data.shengShow == 1) {
      this.setData({
        shengShow: 0,
        shengFlag: 0,
        dotsShow: 1,
        dotsFlag: 1,
        activeSymbol: 'dot'
      })
    } else {
      this.setData({
        xiuShow: 0,
        xiuFlag: 0,
        dotsShow: 1,
        dotsFlag: 1,
        activeSymbol: 'dot'
      })
    }
  },

  handleShengTap() {
    let tmp = this.data.shengShow
    let flag = this.data.shengFlag
    // let active = (flag == 1 ? '1' : 'sheng')
    if (this.data.dotsShow == 0 & this.data.xiuShow == 0) {
      this.setData({
        shengShow: (tmp + 1) % 2,
        shengFlag: (flag + 1) % 2,
        // activeNotes: active
      })
    } else if (this.data.dotsShow == 1) {
      this.setData({
        dotsShow: 0,
        dotsFlag: 0,
        shengShow: 1,
        shengFlag: 1,
        activeSymbol: 'sheng'
      })
    } else {
      this.setData({
        xiuShow: 0,
        xiuFlag: 0,
        shengShow: 1,
        shengFlag: 1,
        activeSymbol: 'sheng'
      })
    }
  },
  handleXiuTap() {
    let tmp = this.data.xiuShow
    let flag = this.data.xiuFlag
    // let active = (flag == 1 ? '1' : 'x2')
    if (this.data.dotsShow == 0 & this.data.shengShow == 0) {
      this.setData({
        xiuShow: (tmp + 1) % 2,
        xiuFlag: (flag + 1) % 2,
        // activeSymbol: active
      })
    } else if (this.data.dotsShow == 1) {
      this.setData({
        dotsShow: 0,
        dotsFlag: 0,
        xiuShow: 1,
        xiuFlag: 1,
        activeSymbol: 'x2'
      })
    } else {
      this.setData({
        shengShow: 0,
        shengFlag: 0,
        xiuShow: 1,
        xiuFlag: 1,
        activeSymbol: 'x2'
      })
    }
  },

  // 处理按钮点击部分
  handleItemTap(e) {
    const id = e.currentTarget.dataset.id
    const active = parseInt(this.data.firstLineNotes[id - 1].name)
    if(this.data.activeNotes!=active){
      this.setData({
        activeNotes: active
      })
    }
  },
  //***********************************处理点击附点的情况 */
  handleDotsItemTap(e) {
    var that = this
    const name = e.currentTarget.dataset.name
    if (nowNoteNumberG == -1 && name!="threel") {
      wx.showToast({
        title: '请先输入音符',
        icon: 'none'
      })
    }else{
      this.setData({
        activeSymbol: name,
        dotsShow: 0,
        dotsFlag: 0
      })
      this.dotsManager(name)
    }
    
  },
  dotsManager(dotName){
    console.log('dotName'+dotName)
    var that=this
    if (dotName == 'threel') {
      that.addThree(nowMeasureG, nowNoteNumberG)
    }else{
      var imageName = answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName
      var duration = answerPartG.measure[nowMeasureG].note[nowNoteNumberG].duration
      // var setDotImage = "answerPart.measure[" + nowMeasureG + "].note[" + nowNoteNumberG + "].dotImage"
      // var setDuration = "answerPart.measure[" + nowMeasureG + "].note[" + nowNoteNumberG + "].duration"

      that.dotsYmanager(imageName, nowMeasureG, nowNoteNumberG, answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name)
      if (dotName == 'dot') {
        if (answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage=='dot'){
          duration = duration / 1.5
        } else if (answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage == 'ddot'){
          duration = duration / 1.75
        }
        duration = duration * 1.5
        // that.setData({
        //   [setDotImage]: dotName,
        //   [setDuration]: duration
        // })
        answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage=dotName
        answerPartG.measure[nowMeasureG].note[nowNoteNumberG].duration=duration

      } else if (dotName == 'ddot') {
        if (answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage == 'dot') {
          duration = duration / 1.5
        } else if (answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage == 'ddot') {
          duration = duration / 1.75
        }
        duration = duration * 1.75
        // that.setData({
        //   [setDotImage]: dotName,
        //   [setDuration]: duration
        // })
        answerPartG.measure[nowMeasureG].note[nowNoteNumberG].dotImage=dotName
        answerPartG.measure[nowMeasureG].note[nowNoteNumberG].duration=duration
      } else if (dotName == 'yan') {
        that.addYan(nowMeasureG, nowNoteNumberG)
      }
    }
    that.redraw()
    
    
  },
  dotsYmanager(imageName,measure,noteNumber,name,reset){
    var that=this
    var dotx = answerPartG.measure[measure].note[noteNumber].x + 16 * rpx
    var doty = answerPartG.measure[measure].note[noteNumber].y
    // var setDotX = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].dotx"
    // var setDotY = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].doty"
    if (imageName.startsWith('r')) {
      imageName = imageName.slice(1)
      doty = doty + 5 * rpx
    }else{
      if (imageName.startsWith('4') || imageName.startsWith('2') || imageName == 'bing') {
        doty=doty+34*rpx
      } else if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')) {
        doty = doty + 39 * rpx
      } else if (imageName.startsWith('1')){
        doty=doty+5*rpx
      }
    }
    if (name == 'd' || name == 'a' || name == 'f' || name == 'c1' || name == 'e1' || name == 'e1' || name == 'g1' || name == 'b1' || name == 'e1' || name == 'd2' || name == 'f2' || name == 'a2' || name == 'c3' || name == 'e3'){
      doty=doty-5*rpx
    }
    if (reset==1){
      // that.setData({
      //   [setDotX]: dotx,
      //   [setDotY]: doty
      // })
      answerPartG.measure[measure].note[noteNumber].dotx=dotx
      answerPartG.measure[measure].note[noteNumber].doty=doty
    }
    return [dotx,doty]    
  },

  //添加延音线
  addYan(measure,number){
    
    var that=this
    that.flushEachX(1) //对选择的后面的所有音符位置刷新
    var setLastNoteTie = "answerPart.measure[" + measure + "].note[" + number + "].tie"
    var setNewNote = "answerPart.measure[" + measure + "].note[" + (number + 1) + "]"

    let newNote = JSON.parse(JSON.stringify(answerPartG.measure[measure].note[number]))
    
    newNote.tie='stop'
    var getCheckHang = that.checkHang(measure, number+1) //********刷新x值 */
    var x = getCheckHang[0]
    var nowHang = getCheckHang[1]
    newNote.hang=nowHang
    newNote.x=x
    newNote.y = newNote.y + (nowHang - answerPartG.measure[measure].note[number].hang)*interval
    newNote.centery = newNote.centery + (nowHang - answerPartG.measure[measure].note[number].hang) * interval
    newNote.alterImage='none'
    if (newNote.stem == 'down') {
      newNote.centerx = x- 10 * rpx
    } else {
      newNote.centerx = x + 2 * rpx
    }
    console.log(newNote)

    answerPartG.measure[ measure].note[number].tie='start'
    answerPartG.measure[ measure ].note[ (number + 1) ]=newNote
    nowNoteNumberG=number+1
    // that.setData({
    //   nowNoteNumber:number+1,
    //   [setLastNoteTie]:'start',
    //   [setNewNote]:newNote
    // })
    that.moveAlter(nowMeasureG, nowNoteNumberG, 1)
    that.dotsYmanager(answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName, nowMeasureG, nowNoteNumberG, answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name, 1)
    that.flushLineX() //**********刷新最后的小节线位置 */
    that.flushLaterX(1) //刷新之后的小节的位置
    that.redraw()


  },
  //**********添加三连音 */
  addThree(masure, number){
    var that=this
    threeMode=0
    threeDuration=that.toDuration(that.data.activeNotes)*2
    // that.setData({
    //   activeNotes: that.data.activeNotes*2
    // })
    //之后添加画出3连音空间的函数

  },

  //**********************************处理点击升降号的情况 */
  handleShengsItemTap(e) {
    var that=this
    const name = e.currentTarget.dataset.name
    if (nowNoteNumberG == -1 || answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName.startsWith('x')){
      wx.showToast({
        title: '请先输入音符',
        icon:'none'
      })
    }else{
      this.setData({
        activeSymbol: name,
        shengShow: 0,
        shengFlag: 0
      })
      this.alterManager(name)
    }
    
  },
  alterManager(alterName){
    console.log("alter:"+alterName)
    var that = this
    var alter=0
    // var setAlter = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG) + "].alter"
    if(alterName == 'none') {
      alter= 0
    } else {
      alter = that.alterName2alter(alterName)//先拿到name对应的alter
      }
    that.checkAndEditAlter(nowNoteNumberG, alter, alterName,0)//按照正确的对应来设置自己，之后再检查
    console.log('imageName'+answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName)
    that.checkLaterhigh(answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name, alter, alterName)//然后放到check里检测是否需要调整自己的alter和后面的name
    // that.setData({
    //   [setAlter]:alter
    // })
    that.redraw()
  },
  alterName2alter(alterName){
    if (alterName == 'sheng') {
      return 1;
    } else if (alterName == 'csheng') {
      return 2
    } else if (alterName == 'jiang') {
      return -1
    } else if (alterName == 'cjiang') {
      return -2
    } else if (alterName == 'huan') {
      return 0
    } 
  },
  alter2alterName(alter){
    if (alter == 1) {
      return 'sheng';
    } else if (alter == 2) {
      return 'csheng'
    } else if (alter == -1) {
      return 'jiang'
    } else if (alter == -2) {
      return 'cjiang'
    } else if (alter ==0) {
      return 'huan'
    }
  },
  alterYmanager(alterName,imageName,y){
    if(imageName.startsWith('r')){
      imageName=imageName.slice(1)
      if (imageName.startsWith('4') || imageName.startsWith('2') || imageName == 'bing'){
        y=y-29*rpx
      } else if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')){
        y=y-34*rpx
      }
    }
    if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')){
      y=y+5*rpx
    }
    else if (imageName.startsWith('1')){
      y=y-29*rpx
    }
    if (alterName == 'csheng') {
      return y + 7 * rpx
    } else if (alterName.endsWith('jiang')) {
      return y-6*rpx
    }
    return y
  },
  //每次删除、添加移动音符时一起刷新alter的位置
  moveAlter(measure,noteNumber,reset){
    var that=this
    if (answerPartG.measure[measure].note[noteNumber].alter==null){
      return [null,null];
    }
    var alterx = answerPartG.measure[measure].note[noteNumber].x - 12 * rpx
    var altery = answerPartG.measure[measure].note[noteNumber].y + 23 * rpx
    // var setAlterX = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].alterx"
    // var setAlterY = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].altery"
    altery = that.alterYmanager(answerPartG.measure[measure].note[noteNumber].alterImage, answerPartG.measure[measure].note[noteNumber].imageName, altery)
    if(reset==1){
      // that.setData({
      //   [setAlterX]: alterx,
      //   [setAlterY]: altery
      // })
      answerPartG.measure[measure].note[ (noteNumber)].alterx=alterx
      answerPartG.measure[measure].note[ (noteNumber)].altery=altery

    }
    return [alterx,altery]
  },
  //校验myalter和alterName的对应，并自动修改alterImage
  checkAndEditAlter(noteNumber,myalter,alterName,check){
    console.log('number'+noteNumber)
    console.log('myalter'+myalter)
    console.log('alterName'+alterName)
    var that=this
    var alter=0
    var returnNumber=0
    var alterx = answerPartG.measure[nowMeasureG].note[noteNumber].x - 12 * rpx
    var altery = answerPartG.measure[nowMeasureG].note[noteNumber].y + 23 * rpx
    // var setAlter = "answerPart.measure[" + nowMeasureG + "].note[" + (noteNumber) + "].alter"
    // var setAlterX = "answerPart.measure[" + nowMeasureG + "].note[" + (noteNumber) + "].alterx"
    // var setAlterY = "answerPart.measure[" + nowMeasureG + "].note[" + (noteNumber) + "].altery"
    // var setAlterImage = "answerPart.measure[" + nowMeasureG + "].note[" + (noteNumber) + "].alterImage"
    if(check==0){
      console.log('跳过检查，给啥是啥')
      
    }else{
      alter = that.alterName2alter(alterName)
      if (myalter != alter) {//不一致,按myalter修改image
        alterName = that.alter2alterName(myalter)
        console.log('不一致' + myalter)
        returnNumber = 1
      } else {
        console.log('一致' + myalter)
        // if (myalter == 0 && answerPartG.measure[nowMeasureG].note[noteNumber].alterImage=='huan')
      }
    }
    
    //拿到应该有的y
    altery = that.alterYmanager(alterName, answerPartG.measure[nowMeasureG].note[noteNumber].imageName, altery)
    console.log('note'+noteNumber+'alter'+myalter)
    //按照alter修改image，不改alter
    // that.setData({
    //   [setAlterImage]: alterName,
    //   [setAlterX]: alterx,
    //   [setAlterY]: altery
    // })
    answerPartG.measure[ nowMeasureG ].note[noteNumber].alterx=alterx
    answerPartG.measure[ nowMeasureG ].note[noteNumber].altery=altery
    answerPartG.measure[ nowMeasureG ].note[noteNumber].alterImage=alterName
    return returnNumber
  },

  //判断前面是否有和它相同音高的音符，如果有则alter也一致。在add中调用
  checkSamehigh(name,alter){
    var that=this
    var i=nowNoteNumberG-1
    if(alter!=0||i==-1){
      return 0;
    }

    return that.buildAlterStack(nowMeasureG, nowNoteNumberG, name)
  },
  checkLaterhigh(name, alter,alterImage){
    var that=this
    var alterNow = alter
    var setAlter = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG) + "].alter"
    //  当取消升降号时：
    //本身：看前面有没有升降，有就跟前面的，没有就0////////////这里最好用栈实现一下
    if (alterImage == 'none') {
      alterNow=0
      // var j1 = nowNoteNumberG - 1
      // for (j1 = nowNoteNumberG - 1; j1 >= 0; j1--) {
      //   if (answerPartG.measure[nowMeasureG].note[j1].alterImage != 'none') {
      //     alterNow = answerPartG.measure[nowMeasureG].note[j1].alter
      //   }
      // }
      alterNow = that.buildAlterStack(nowMeasureG, nowNoteNumberG, name)
      console.log('alterNow'+alterNow)
    }
    // that.setData({
    //   [setAlter]: alterNow
    // })
    answerPartG.measure[nowMeasureG ].note[nowNoteNumberG].alter=alterNow
    //后面：把接下来第一个不符合的改成它应该的name，遍历到第一次出现升降号停止
    that.flushLaterAlter(name)
  },
  flushLaterAlter(name){
    var that=this
    var length = answerPartG.measure[nowMeasureG].note.length
    var i = nowNoteNumberG + 1
    for (i = nowNoteNumberG + 1; i < length; i++) {
      if (answerPartG.measure[nowMeasureG].note[i].name == name) {//本小节有相同音高的,检查是否改变alter
        console.log('发现相同的name')
        if (answerPartG.measure[nowMeasureG].note[i].alterImage != 'none') {//已经有符号就不管了
          break;
        } else {//没有符号的
          //后面
          var stackAlter = that.buildAlterStack(nowMeasureG,i, name)
          var image = that.alter2alterName(stackAlter)
          if (that.checkAndEditAlter(i, answerPartG.measure[nowMeasureG].note[i].alter, image, 1) == 1) {
            break;
          }
          //当添加升降/还原号时：
          //本身：改就完事
          //后面：把接下来第一个name和alter不对应的改name不改alter
        }
      }
    }
  },
  //新建栈，判断是否跟随前面的alter
  buildAlterStack(measure,number,name){
    var that = this
    var stack=new Array(0)
    stack.push(0)
    var j=0
    console.log(alterShengList)
    for(j=0;j<alterShengList.length;j++){
      console.log(name.slice(0, 1).toLowerCase())
      
      if (alterShengList[j]==name.slice(0,1).toLowerCase()){
        stack.push(1)
      }
    }
    for (j = 0; j < alterJiangList.length; j++) {
      if (alterJiangList[j] == name.slice(0, 1).toLowerCase()) {
        stack.push(-1)
      }
    }

    var i=0
    //var length = answerPartG.measure[measure].note.length
    for(i=0;i<number;i++){
      if (answerPartG.measure[measure].note[i].name == name) {//本小节有相同音高的,检查是否改变alter
        console.log('发现相同的name')
        if (answerPartG.measure[measure].note[i].alterImage != 'none') {//有符号，推入栈
          stack.push(answerPartG.measure[measure].note[i].alter)
        }
      }
    }
    console.log('stack'+stack.slice(-1)[0])
    return stack.slice(-1)[0]
  },
  flushAllAlter(measure){
    var that=this
    var i=0
    for(i=0;i<answerPartG.measure[measure].note.length;i++){
      that.flushLaterAlter(answerPartG.measure[measure].note[i].name)
    }
  },

  //***************************处理点击休止符的情况 */
  handleXiusItemTap(e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      activeSymbol: name,
      shengShow: 0,
      shengFlag: 0
    })
    this.xiuzhiManager(parseInt(name))
  },
  xiuzhiManager(xiu) {
    var that = this
    that.flushEachX(1) //对选择的后面的所有音符位置刷新
    //*************接下来在选择的后面添加音符 */
    // var setNewNote = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG + 1) + "]"
    // var setNewNoteHang = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG + 1) + "].hang"
    // var setNewNoteX = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG + 1) + "].x"

    // var setNewNoteY = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG + 1) + "].y"
    
    // var imageName = ''

    // that.setData({
    //   // [setNewNote]: {
    //   //   step: null,
    //   //   octave: null,
    //   //   tie: null,
    //   //   duration: that.toDuration(xiu),
    //   //   alter: null,
    //   //   imageName: "x" + xiu,
    //   // },
      
    //   nowNoteNumber: nowNoteNumberG + 1, //***********判断一下小节？ */
    //   nowSelectNote: answerPartG.measure[nowMeasureG].note[nowNoteNumberG + 1],

    // })
    answerPartG.measure[nowMeasureG].note[ (nowNoteNumberG + 1) ]={
      step: null,
      octave: null,
      tie: null,
      duration: that.toDuration(xiu),
      alter: null,
      imageName: "x" + xiu,
    },
    nowNoteNumberG=nowNoteNumberG + 1
    nowSelectNoteG=answerPartG.measure[nowMeasureG].note[nowNoteNumberG + 1]

    var getXHang = that.checkHang(nowMeasureG, nowNoteNumberG) //********刷新x值 */
    var x = getXHang[0]
    var nowHang = getXHang[1]

    // that.setData({
    //   nowHang: nowHang,
    //   [setNewNoteHang]: nowHang,
    //   [setNewNoteX]: x,
    //   [setNewNoteY]: 60 * rpx + that.manageY("x" + xiu, nowHang),
    // })

    nowHangG=nowHang
    answerPartG.measure[nowMeasureG ].note[nowNoteNumberG ].hang=nowHang
    answerPartG.measure[ nowMeasureG ].note[ nowNoteNumberG ].x=x
    answerPartG.measure[nowMeasureG].note[ nowNoteNumberG  ].y= 60 * rpx + that.manageY("x" + xiu, nowHang)

    that.moveAlter(nowMeasureG, nowNoteNumberG,1)//刷新alter的位置
    that.dotsYmanager(answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName, nowMeasureG, nowNoteNumberG, answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name,1)
    that.flushLineX() //**********刷新最后的小节线位置 */
    that.flushLaterX(1) //刷新之后的小节的位置
    that.redraw()
  },



  canvasTap(e) { //******判断选择小节线 */
    console.log(e)
    //console.log(document.body.scrollTop)
    // this.setData({
    //   nowX: e.detail
    // })
    nowXG=e.detail
  },
  //**************************************加小节 */
  addBarLine() {
    //添加小节线功能
    console.log('添加小节线')
    var that = this
    if (answerPartG.measure[answerPartG.measure.length - 1].note.length == 0 && nowNoteNumberG == -1) {
      wx.showToast({
        title: '请勿重复点击',
        icon: 'none'
      })
    } else if (nowNoteNumberG == answerPartG.measure[nowMeasureG].note.length - 1 && nowMeasureG != answerPartG.measure.length - 1) {

      // that.setData({
      //   nowMeasure: nowMeasureG + 1,
      //   nowNoteNumber: -1
      // })
      nowMeasureG=nowMeasureG+1
      nowNoteNumberG=-1
    } else {
      //**********绘制的函数应该在redraw()统一写,这里只有更新measure的函数 */
      // var setLineX = "answerPart.measure[" + nowMeasureG + "].lineX"
      // var setMeasureNumber = "answerPart.measure[" + nowMeasureG + "].number"
      //*********记得新建一个measure数组，另外考虑一下在中间插入小节线的情况，可以等flushX改完写 */
      var createNewMeasure = "answerPart.measure[" + (nowMeasureG + 1) + "]"
      var lineX = answerPartG.measure[nowMeasureG].note[nowNoteNumberG].x + gap
      if (answerPartG.measure[nowMeasureG].note[nowNoteNumberG].x > 309 * rpx) {
        lineX = 30 * rpx
      }
      // that.setData({
      //   //*******改本小节的信息 */
      //   [setLineX]: lineX,

      // })
      answerPartG.measure[nowMeasureG ].lineX=lineX

      if (nowMeasureG == answerPartG.measure.length - 1 && nowNoteNumberG == answerPartG.measure[nowMeasureG].note.length - 1) { //在最后添加，直接加新的小节
        // that.setData({
        //   //*********向后添加新的小节 */
        //   [createNewMeasure]: {
        //     lineX: lineX, //先初始化为lineX
        //     number: nowMeasureG + 2,
        //     note: []
        //   },
        //   nowMeasure: nowMeasureG + 1, //设为下一小节
        //   nowNoteNumber: -1
        // })
        answerPartG.measure[ (nowMeasureG + 1) ]={
          lineX: lineX, //先初始化为lineX
          number: nowMeasureG + 2,
          note: []
        },
        nowMeasureG=nowMeasureG + 1, //设为下一小节
        nowNoteNumberG=-1

      } else {
        var newAnswerPart = answerPartG
        if (nowMeasureG != answerPartG.measure.length - 1) {
          //要先挪动后面的小节
          //***********这里修改后面的小节标号 */
          var i = answerPartG.measure.length - 1
          for (i = answerPartG.measure.length; i > nowMeasureG; i--) {
            if (i == answerPartG.measure.length) {
              console.log("小节的末尾是这个啦" + i)
              // measureNumber=i+1
              // measureX=0
              newAnswerPart.measure.push({
                number:i+1,
                lineX:0,
                note:[]
              })
            }
            newAnswerPart.measure[i].note = newAnswerPart.measure[i - 1].note

          }
        }

        //接下来把后面的音符放到新的小节中
        var note = []
        note = newAnswerPart.measure[nowMeasureG].note.slice(nowNoteNumberG + 1)
        //var newNowMeasure = "answerPart.measure[" + nowMeasureG + "].note"
        newAnswerPart.measure[nowMeasureG].note = newAnswerPart.measure[nowMeasureG].note.slice(0, nowNoteNumberG + 1)
        newAnswerPart.measure[nowMeasureG + 1] = {
          lineX: lineX, //先初始化为lineX
          number: nowMeasureG + 2,
          note: note
        }
        // that.setData({
        //   answerPart:newAnswerPart

        // })
        answerPartG=newAnswerPart

        that.flushAllAlter(nowMeasureG + 1)
        that.flushLineX()
        that.flushLaterX(1)
        that.redraw()

        // that.setData({
        //   nowMeasure: nowMeasureG + 1, //设为下一小节
        //   nowNoteNumber: -1
        // })
        nowMeasureG=nowMeasureG + 1
        nowNoteNumberG=-1
      }


    }


  },
  cleanInMeasure(){
    var that=this
    console.log("clean" + nowNoteNumberG)
    var name = answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name
    that.flushEachX(-1)

    var delNote = "answerPart.measure[" + nowMeasureG + "].note"
    // that.setData({
    //   [delNote]: answerPartG.measure[nowMeasureG].note.slice(0, answerPartG.measure[nowMeasureG].note.length - 1)
    // })
    answerPartG.measure[nowMeasureG ].note=answerPartG.measure[nowMeasureG].note.slice(0, answerPartG.measure[nowMeasureG].note.length - 1)

    that.flushLaterAlter(name)//如果删除的是音符，刷新一下后面的alter

    var nowHang;
    if (nowNoteNumberG == 0 && nowMeasureG != 0) {
      nowHang = answerPartG.measure[nowMeasureG - 1].note[answerPartG.measure[nowMeasureG - 1].note.length - 1].hang
    } else if (nowNoteNumberG == 0 && nowMeasureG == 0) {
      nowHang = 0
    } else {
      nowHang = answerPartG.measure[nowMeasureG].note[nowNoteNumberG - 1].hang
    }
    // that.setData({
    //   nowNoteNumber: nowNoteNumberG - 1,
    //   nowHang: nowHang
    // })
    nowNoteNumberG=nowNoteNumberG - 1,
    nowHangG=nowHang

    that.flushLineX()
    that.flushLaterX(-1)
    timer2=setTimeout(function(){
      that.redraw();
    },0)
  },



  //***********************************删除 */
  clean() {
    //删除功能
    console.log('删除')
    
    
    var that = this
    //先重置定时器
    clearTimeout(timer2)


    // 1.在小节内删除，把本小节内的全部往前挪，刷新小节线，再把之后小节的全部往前挪。
    if (nowNoteNumberG >= 0) {
      var newAnswerPartMeasure=answerPartG.measure[nowMeasureG]
      if (typeof (newAnswerPartMeasure.note[nowNoteNumberG].three) != "undefined") {//删除的是3连音中的音

      // threeMode = 1
      // threeDuration = newAnswerPartMeasure.note[nowNoteNumberG].normalNotes * newAnswerPartMeasure.note[nowNoteNumberG].duration
      // //如果下一个不为空，则直接赋给它自己的three等
       var n = -2
      if (newAnswerPartMeasure.note[nowNoteNumberG].three.flag == 'end') {
        n = 0
      } else if (newAnswerPartMeasure.note[nowNoteNumberG].three.flag == 'continue') {
        n = -1
      }
        // that.setData({
        //   nowNoteNumber: nowNoteNumberG - n
        // })
        nowNoteNumberG=nowNoteNumberG - n

        var m=0
      for (m = 0; m <3; m++) {
        if (typeof(newAnswerPartMeasure.note[nowNoteNumberG])!="undefined"){
          that.cleanInMeasure()
        }else{
          // that.setData({
          //   nowNoteNumber: nowNoteNumberG - 1
          // })
          nowNoteNumberG=nowNoteNumberG - 1
        }
      }
    }else{
        that.cleanInMeasure()
    }
      
    } 
    
    
    else { // 2.删除第一个音符时，nowNoteNumber=-1,此时直接删除中间的小节线，做之前添加小节的逆变换（？）
      if (nowMeasureG!=0){
        //先把后面小节的音符放到上一小节中
        var note = []
        note = answerPartG.measure[nowMeasureG].note
        // var newNowMeasure = "answerPart.measure[" + (nowMeasureG - 1) + "].note"
        // that.setData({
        //   [newNowMeasure]: answerPartG.measure[nowMeasureG - 1].note.concat(note),
        //   nowNoteNumber: answerPartG.measure[nowMeasureG - 1].note.length - 1,
        //   nowMeasure: nowMeasureG - 1
        // })
        answerPart.measure[(nowMeasureG - 1) ].note=answerPartG.measure[nowMeasureG - 1].note.concat(note)
        nowNoteNumberG=answerPartG.measure[nowMeasureG - 1].note.length - 1,
        nowMeasureG=nowMeasureG - 1

        //*************改一下之后的位置 */
        var j = nowNoteNumberG
        for (j = nowNoteNumberG + 1; j < answerPartG.measure[nowMeasureG].note.length; j++) {
          ////////////////////////重置所有x
          var setMyX = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].x"
          var myX
          //console.log('j:'+j)
          //console.log('now'+nowNoteNumberG)
          //console.log('lastX' + answerPartG.measure[nowMeasureG].note[j - 1].x)
          myX = that.checkHang(nowMeasureG, j)[0] //*******记得要判断大于309 */
          console.log('移动myX' + myX)
          // that.setData({
          //   [setMyX]: myX //**************************记得重置一下hang和y */
          // })
          answerPartG.measure[nowMeasureG ].note[ j ].x=myX

          if (myX > 309 * rpx) { //换行
            var setHang = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].hang"
            var setY = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].y"
            var setCenterY = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].centery"
            // that.setData({
            //   [setHang]: answerPartG.measure[nowMeasureG].note[j].hang - 1,
            //   [setY]: answerPartG.measure[nowMeasureG].note[j].y - interval,
            //   [setCenterY]: answerPartG.measure[nowMeasureG].note[j].centery - interval
            // })
            answerPartG.measure[nowMeasureG].note[ j ].hang=answerPartG.measure[nowMeasureG].note[j].hang - 1
            answerPartG.measure[nowMeasureG].note[ j ].y=answerPartG.measure[nowMeasureG].note[j].y - interval
            answerPartG.measure[nowMeasureG ].note[ j ].centery=answerPartG.measure[nowMeasureG].note[j].centery - interval
          }
          that.moveAlter(nowMeasureG, j,1)//刷新alter的位置
          that.dotsYmanager(answerPartG.measure[nowMeasureG].note[j].imageName, nowMeasureG, j, answerPartG.measure[nowMeasureG].note[j].name,1)
        }
        //that.flushLineX()
        //不是末尾小节，要先挪动后面的小节
        //***********这里修改后面的小节标号 */
        var removeLaterMeasure = "answerPart.measure"
        var measure = answerPartG.measure
        measure.splice(nowMeasureG + 1, 1)

        // that.setData({
        //   [removeLaterMeasure]: measure
        // })
        answerPartG.measure=measure

        var i = answerPartG.measure.length - 1
        for (i = answerPartG.measure.length - 1; i > nowMeasureG; i--) {
          // var setMeasureNumber = "answerPart.measure[" + i + "].number"
          // that.setData({
          //   [setMeasureNumber]: i + 1
          // })
          answerPartG.measure[ i ].number=i + 1

        }

        // var nowHang = answerPartG.measure[nowMeasureG].note[answerPartG.measure[nowMeasureG].note.length - 1].hang

        nowHangG=answerPartG.measure[nowMeasureG].note[answerPartG.measure[nowMeasureG].note.length - 1].hang
        // that.setData({
        //   nowHang: nowHang
        // })
        that.flushAllAlter(nowMeasureG)
      }
      else{
        wx.showToast({
          title: '请先输入音符',
          icon:'none'
        })
      }
      that.flushLineX()
      that.flushLaterX(-1)

      timer2=setTimeout(function(){
        that.redraw();
      },0)
    }
    
    
  },


  handleArrowTap() {
    let tmp = this.data.arrow
    let board = this.data.showBoard
    this.setData({
      showBoard: (board + 1) % 2,
      arrow: (tmp + 1) % 2
    })
  },

  getZhengAndBeam(measure,number){
    var that=this
    var i=0
    var myDuration;
    var notei;
    var divisions = answerPartG.attributes.divisions
    var allDuration=[0,0,0];
    var zheng=zhengBeam1
    var lastBeam='none'
    var group=-1
    var higher=[0]
    var lower=[0]
    var note = []
    var newAnswerPartMeasure = answerPartG.measure[measure]
    for (i = 0; i < newAnswerPartMeasure.note.length;i++){
      // var setLastBeam = that.getSetBeam(measure, i - 1)
      myDuration = newAnswerPartMeasure.note[i].duration
      //var notelength = Math.ceil(Math.log(divisions / myDuration) / Math.log(2))
      var notelength

        if (typeof (newAnswerPartMeasure.note[i].normalNotes) != "undefined"){
          notelength = Math.log(that.toName(myDuration, newAnswerPartMeasure.note[i].three.threeDuration, newAnswerPartMeasure.note[i].normalNotes)) / Math.log(2) - 2
      }else{
        notelength = Math.log(that.toName(myDuration)) / Math.log(2) - 2
      }
      allDuration[0] = allDuration[0] + myDuration//先更新一下总时值

      if(i!=0){
        lastBeam = newAnswerPartMeasure.note[i - 1].beam
      } 
      var setMyBeam = that.getSetBeam(measure,i)
      var myBeam=[];
      //如果为4、2、1音符或休止符,则自己为none，前面一定end
      if (myDuration >= divisions || newAnswerPartMeasure.note[i].imageName.startsWith('x')) {
        myBeam='none'
        console.log('上一个是'+(i-1)+":"+lastBeam)
        if (i > 0 && lastBeam!='none'){
          if (i - 1 == 0 || newAnswerPartMeasure.note[i - 2].beam == 'none'|| newAnswerPartMeasure.note[i - 2].beam[0] == 'end' ){
            //groups[0]:note[0]:[[1,2,3,4]] [1]:[[1,2,3],[]][2]:[[2,3],[]]
            var gro=0;
            for (gro = 0; gro < newAnswerPartMeasure.groups.length;gro++){
              function forGroup(value) {
                var val=0
                for(val=0;val<value.length;val++){
                  function findEach(value, index, array){
                    return value==i-1
                  }
                  if(value[val].findIndex(findEach)!=-1){
                    newAnswerPartMeasure.groups.splice(gro, 1);//删了整个group？
                    // console.log("删了" + (i - 1))
                    // console.log(newAnswerPartMeasure.groups)
                    group--
                    return;
                  }
                }
              }
              newAnswerPartMeasure.groups[gro].note.forEach(forGroup)
            }
            console.log("设置" + (i - 1))
            lastBeam='none'
          }else{
            var lasti = 0
            for (lasti = 0; lasti < lastBeam.length; lasti++) {
              lastBeam[lasti] = 'end'
            }
          }
          
          newAnswerPartMeasure.note[i-1].beam=lastBeam
          newAnswerPartMeasure = that.resetNote(i-1, newAnswerPartMeasure)

        }
      } else if (i == newAnswerPartMeasure.note.length-1){//小节最后一个，肯定是end或none
        if (lastBeam == 'none' || lastBeam[0] == 'end') {
          myBeam = 'none'
        }else{
          //console.log('i' + i + 'LENGTH' + Math.log(Math.floor(divisions / myDuration)) / Math.log(2))
          for (notei = 0; notei < notelength ; notei++) {
            myBeam[notei] = 'end'
          }
        }

      }else{
        //8分、16分,要看前面有没有能连接的。
        if (allDuration[0] % zheng == 0 ||( Math.round(allDuration[0]) % zheng == 0&&Math.abs(Math.round(allDuration[0]) - allDuration[0] )<= 0.01)) {//加入新音符后正好为整，若前面不能连，则不连，前面能连，则自己为end，下一个可能begin
          if (lastBeam=='none'||lastBeam[0]=='end'){
            myBeam='none'
          }else{
            for (notei = 0; notei < notelength; notei++) {
              myBeam[notei] = 'end'
            }
          }

        }else{//8分16分且不为整，应该和前面/后面连接。
          if(lastBeam=='none'||lastBeam[0]=='end'){//前面不给连了，自己开头
            for (notei = 0; notei < notelength; notei++) {
              myBeam[notei] = 'begin'
            }
            //刷新一下16/16+32的前面总时值
            for (notei = 1; notei < notelength; notei++) {
              allDuration[notei] = myDuration
            }

          } else if (lastBeam[0] == 'begin' || lastBeam[0] == 'continue'){//前面给连,则把自己放中间。
            myBeam[0] = 'continue'
          }
        }
        
      }
      if (myBeam != 'none' && myBeam[0] != 'begin') {
        // console.log('i' + i + 'LENGTH' + Math.floor( Math.log(divisions / myDuration)/ Math.log(2)))
        // console.log('i' + i + 'LENGTH' + notelength)
        if (notelength >= 2) {//我是16分/32分
          allDuration[1] = allDuration[1] + myDuration
          if (notelength == 2) {//16分音符，把32的duration清空
            allDuration[2] = 0
          }
          //对于16分[1],凑到beats时值的整数倍就end
          if ((notelength == 3 && allDuration[1] % that.toDuration(that.data.part.attributes.beat_type) == 0)||myBeam[0]=='end') {
            myBeam[1] = 'end'
            allDuration[1] = 0//清空之前存的
            //先处理一下前面的
            if (lastBeam.length == notelength && lastBeam[1] == 'end' & lastBeam[0] != 'end') {//前面的和自己一样
              if ((newAnswerPartMeasure.note[i - 2].beam.length < 2)) {
                lastBeam[1] = 'begin'
              } else {
                lastBeam[1] = 'continue'
              }
            }
          } else if (allDuration[1] == myDuration) {//第一个/前面整数
            myBeam[1] = 'begin'
          } else {
            myBeam[1] = 'end'
            if (lastBeam.length >= 2 && lastBeam[1] == 'end' && lastBeam[0] != 'end') {//前面的和自己一样
              if ((newAnswerPartMeasure.note[i - 2].beam.length < 2)){
                lastBeam[1]='begin'
              }else{
                lastBeam[1] = 'continue'
              }
              
            }
          }
        }
        if (notelength == 3) {//我是32分（再处理一次）//对于32分[2],如果【1】为continue,则如果前面有就往前连
          allDuration[2] = allDuration[2] + myDuration
          if (myBeam[1] == 'continue') {//只有在中间的能连
            if (allDuration[1] == myDuration) {//第一个/前面整数
              myBeam[2] = 'begin'
            }
            else{
              myBeam[2] = 'end'
            }
          } else {
            myBeam[2] = myBeam[1]
          }
          if (lastBeam.length == notelength && lastBeam[2] == 'end') {//前面的和自己一样
            if (newAnswerPartMeasure.note[i - 2].beam.length<3){
              lastBeam[2] = 'begin'
            }else if(lastBeam[1]=='continue'){
              lastBeam[2] = 'continue'
            }
          }
        }
        // console.log('lastOne')
        // console.log(lastBeam)
        if (typeof (newAnswerPartMeasure.note[i - 1].beam) == 'undefined' || newAnswerPartMeasure.note[i - 1].beam!=lastBeam){
          newAnswerPartMeasure.note[i-1].beam = lastBeam
          // console.log('改了上一个')
          // console.log(lastBeam)
          newAnswerPartMeasure = that.resetNote(i-1, newAnswerPartMeasure)
        }

      }

      //设置自己和前面
       console.log(i + '的是')
       console.log(myBeam)
       console.log('这里是总时值', '单位时值为' + zheng)
       console.log(allDuration)
      if (typeof (newAnswerPartMeasure.note[i].beam) == 'undefined' || newAnswerPartMeasure.note[i].beam!=myBeam){
        newAnswerPartMeasure.note[i].beam=myBeam

      }
      
      if(myBeam!='none'){
        console.log('MYBEAM')
        console.log(myBeam)
        if (myBeam[0] == 'begin') {
          group++,
          higher=[i],
          lower=[i]
          note=[]
        }
        var stem='up'
        // if (answerPartG.measure[measure].groups[group].note!=null){
        //   note= answerPartG.measure[measure].groups[group].note
        // }
        // var setGroupsNote = "answerPart.measure[" + measure + "].groups[" + group + "].note"
        // var setGroupsStem = "answerPart.measure[" + measure + "].groups[" + group + "].stem"
        // var setGroupsHigh = "answerPart.measure[" + measure + "].groups[" + group + "].higher"
        // var setGroupsLow = "answerPart.measure[" + measure + "].groups[" + group + "].lower"
        for(notei=0;notei<myBeam.length;notei++){
          if (myBeam[notei]=='begin'){
            if(typeof(note[notei])!='object'){
              note[notei]=new Array()
            }
            note[notei].push([i])//新建一个数组
          }else{
            //console.log('这里就是那个啦！！！'+notei)
            
            if (typeof (note[notei]) != 'object') {
              var a=[]
              note[notei] = new Array(a)
            }
            console.log(note)
            note[notei][note[notei].length-1].push(i)//加入最后那个数组
          }
        }
        //判断最低
        // console.log('NOWLOWER')
        // console.log(lower)
        if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) > that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang)){
          lower=[i]
        } else if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) == that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang)){
          lower.push(i)
        }
        //判断最高
        if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) < that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) {
          higher = [i]
        } else if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) == that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) {
          higher.push(i)
        }
        //判断stem
        if (Math.abs(80 * rpx - that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) > Math.abs(80 * rpx - that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang))){
          stem = 'up'
          if (newAnswerPartMeasure.note[higher[0]].octave >= 5) {
            stem = 'down'
          }
        }else{
          stem='up'
          if (newAnswerPartMeasure.note[lower[0]].octave>=5){
            stem='down'
          }
        }
        //groups[0]:note[0]:[[1,2,3,4]] [1]:[[1,2,3],[]][2]:[[2,3],[]]
                  //stem:
                  //higher:
                  //lower:
                  //
        //that.resetImage(measure,i)
        //selectNote.y + interval * nowHang-10*rpx,
        if (typeof (newAnswerPartMeasure.groups)=="undefined"){
          newAnswerPartMeasure.groups=new Array()
        }
        newAnswerPartMeasure.groups[group]={
          note:note,
          stem:stem,
          higher:higher,
          lower:lower
        }

      }else{
         newAnswerPartMeasure=that.resetNote(i, newAnswerPartMeasure)
        // //********************************************************判断一下它的image是否对应，不对的话换回去！！！！！
      }
    }
    if (typeof (newAnswerPartMeasure.groups) == 'object' && group < newAnswerPartMeasure.groups.length - 1) {
      var newGroups = newAnswerPartMeasure.groups.slice(0,group+1)

      newAnswerPartMeasure.groups=newGroups
    }
    // var setNewAnswerPartMeasure = "answerPart.measure[" + measure + "]"
    // that.setData({
    //   [setNewAnswerPartMeasure]: newAnswerPartMeasure
    // })
    answerPartG.measure[measure]=newAnswerPartMeasure
  },
  centerYtoy0(centerY,hang){
    return centerY+10*rpx-interval*hang
  },


  resetNote(i,newAnswerPartMeasure){
    var that=this
    //********************************************************判断一下它的image是否对应，不对的话换回去！！！！！
    if (!newAnswerPartMeasure.note[i].imageName.startsWith('x') && !newAnswerPartMeasure.note[i].imageName.startsWith(that.toName(newAnswerPartMeasure.note[i].duration))) {
      var stemNew = 'up'
      var imageName;
      if (typeof(newAnswerPartMeasure.note[i].normalNotes)!="undefined"){
        imageName = that.toName(newAnswerPartMeasure.note[i].duration, newAnswerPartMeasure.note[i].three.threeDuration, newAnswerPartMeasure.note[i].normalNotes) + ''
        console.log('changeImage'+imageName)
      }else{
        imageName = that.toName(newAnswerPartMeasure.note[i].duration) + ''
        console.log('changeImage' + imageName)
      }
      if (newAnswerPartMeasure.note[i].octave >= 5) {
        stemNew = 'down'
      } else {
        stemNew = 'up'
      }
      if (stemNew == 'down') {
        imageName = 'r' + imageName
      }
      newAnswerPartMeasure.note[i].y = that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) + that.manageY(imageName, newAnswerPartMeasure.note[i].hang)
      // console.log("Y在这里呢" + imageName)
      newAnswerPartMeasure.note[i].stem = stemNew
      newAnswerPartMeasure.note[i].imageName = imageName
    }
      return newAnswerPartMeasure
  },

  getSetBeam(measure,number){
    return "answerPart.measure[" + measure + "].note[" + number + "].beam"
  },
  checkBeam(){
    var that=this
    var zhengBeam;
    var pai = answerPartG.attributes.beats
    //beam[0]:divisions/duration=2  [1]=4  [2]=8
    //Math.log(Math.floor(divisions/duration))/Math.log(2)-1
    if (answerPartG.attributes.beat_type==4){
      //42 43以四分的duration为单位分割
      zhengBeam = that.toDuration(answerPartG.attributes.beat_type)
        //that.getZhengAndBeam(zheng, measure, number)
    } else{
      if(pai%3==0){//3、6、9、12
        zhengBeam = 3 * that.toDuration(answerPartG.attributes.beat_type)
      } else if (pai == 2||pai==4){//2、4
        zhengBeam = 2 * that.toDuration(answerPartG.attributes.beat_type)
      }else{//5、7
        //5：2 3/3 2
        //7：2 2 3
        //8:3 3 2
        //10:3 3 2 2 
        //11: 3 3 3 2先不写了啊啊啊啊啊啊啊*******************************************************
      }
    }
    zhengBeam1=zhengBeam

      
  },

  //************************************添加音符函数 */
  addNotesW(e) {
    var that = this
    var selectNote = e.currentTarget.dataset.selectnote
    
    //先重置定时器
    clearTimeout(timer)


    console.log(selectNote)
    that.flushEachX(1) //对选择的后面的所有音符位置刷新
    //*************接下来在选择的后面添加音符 */
    var setNewNote = "answerPart.measure[" + nowMeasureG + "].note[" + (nowNoteNumberG + 1) + "]"
    var imageName = that.data.activeNotes+''
    
    
    
    //检查黑键点击时前面是否已经是升
    
    var alterImage = that.alter2alterName(selectNote.alter)
    if (that.buildAlterStack(nowMeasureG, nowNoteNumberG+1, selectNote.name) == selectNote.alter) {
      alterImage = 'none'
    } else {
      if (selectNote.alter == 0) {
        alterImage = 'huan'
      }
    }
    var getCheckHang = that.checkHang(nowMeasureG, nowNoteNumberG+1) //********刷新x值 */
    var x = getCheckHang[0]
    var nowHang = getCheckHang[1]
    var stem = 'up'
    var centerX = x + 2 * rpx
    if (selectNote.octave >= 5) {
      imageName = "r"+imageName
      stem = 'down'
      centerX = x-10 * rpx
    }
    selectNote.duration = that.toDuration(that.data.activeNotes),
      console.log(imageName)
    selectNote.dotImage = 'none',
    selectNote.stem=stem,
      selectNote.alterImage=alterImage,
      selectNote.hang=nowHang,
      selectNote.imageName = imageName
      selectNote.centery = selectNote.y + interval * nowHang - 10 * rpx,
      selectNote.centerx = centerX
      selectNote.x=x
      selectNote.y = selectNote.y + that.manageY(imageName, nowHang)
      selectNote.height=35*rpx


    if (threeMode >= 0) {//三连音了
        //actual-notes:3,normal-notes:2
        if(threeMode==0){
          selectNote.three={
            flag:'begin',
            threeDuration:threeDuration,//3连音的总时长
          }
        }else{
          selectNote.three = {
            flag: 'continue',
            threeDuration: threeDuration,//3连音的总时长
          }
        }
        selectNote.actualNotes = 3,
          //正常比例
          selectNote.normalNotes = threeDuration / selectNote.duration,
          selectNote.duration = selectNote.duration * selectNote.normalNotes / 3
          allThree = allThree + selectNote.duration
      if (allThree >= threeDuration) {//满了清空
        threeMode = -1
        allThree = 0
        threeDuration = 0
        selectNote.three.flag='end'
      }else{
        threeMode++;
      }
    }

    // that.setData({
    //   [setNewNote]: selectNote,
    //   nowNoteNumber: nowNoteNumberG + 1, //***********判断一下小节？ */
    //   nowHang: nowHang,
    //   nowSelectNote: selectNote
    // })
    answerPartG.measure[nowMeasureG].note[ (nowNoteNumberG + 1)]=selectNote
    nowNoteNumberG=nowNoteNumberG + 1
    nowHangG=nowHang,
    nowSelectNoteG= selectNote



    that.moveAlter(nowMeasureG, nowNoteNumberG,1)
    that.dotsYmanager(answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName,nowMeasureG,nowNoteNumberG, answerPartG.measure[nowMeasureG].note[nowNoteNumberG].name,1)
    that.flushLineX() //**********刷新最后的小节线位置 */
    that.flushLaterX(1) //刷新之后的小节的位置

    this.drawNotes(ctx,answerPartG.measure[nowMeasureG].note[nowNoteNumberG].imageName,answerPartG.measure[nowMeasureG].note[nowNoteNumberG].x,answerPartG.measure[nowMeasureG].note[nowNoteNumberG].y)
    ctx.draw(true)
    timer=setTimeout(function(){
      that.redraw();
    },0)
    
    
  },
  //*******转换一下duration和name */
  toName: function(duration,threeDuration,normalNotes) {
    var that=this
    duration = parseFloat(duration)
    if (typeof(threeDuration) != 'undefined' && typeof(normalNotes)!= 'undefined'){
      duration=threeDuration/normalNotes
    }
    var divisions=parseInt(answerPartG.attributes.divisions)
    //console.log(Math.pow(2, Math.ceil(Math.log(divisions / duration) / Math.log(2) + 2)))
    return Math.pow(2,Math.ceil(Math.log(divisions / duration) / Math.log(2)+2))
  },
  toDuration: function(name) {
    name = parseInt(name)
    return parseInt(answerPartG.attributes.divisions) * 4 / name
  },
  //**************设置偏移值 */
  manageY(name, hang) {
    if (name.startsWith('r')) {
      name = name.slice(1)
      if (name.startsWith('2') || name.startsWith('4') || name == 'bing') {
        return interval * hang - 5 * rpx
      } else if (name.startsWith('8') || name.startsWith('16') || name.startsWith('32')) {
        return interval * hang - 5 * rpx
      } else if (name.substring(0, 1) == '1') {
        return interval * hang - 5 * rpx
      }
    } else if (name.startsWith('x')) {
      name = name.slice(1)
      if (name.startsWith('4')) {
        return interval * hang + 5 * rpx
      } else if (name.startsWith('8') || name.startsWith('16')) {
        return interval * hang + 10 * rpx
      } else if (name.substring(0, 1) == '1') {
        return interval * hang + 10 * rpx
      } else if (name.substring(0, 1) == '2') {
        return interval * hang + 15 * rpx
      } else if (name.startsWith('32')) {
        return interval * hang
      }
    } else {
      if (name.startsWith('2') || name.startsWith('4') || name == 'bing') {
        return interval * hang - 34 * rpx
      } else if (name.startsWith('8') || name.startsWith('16') || name.startsWith('32')) {
        return interval * hang - 39 * rpx
      } else if (name.substring(0, 1) == '1') {
        return interval * hang - 5 * rpx
      }
    }



  },
  //***************当在中间插入时，必须刷新所有后面的音符位置**************** */
  flushLaterX(num) {
    var that = this
    
    //*************改的小节后面的小节，只要改x */
    var i = nowMeasureG + 1
    for (i = nowMeasureG + 1; i < answerPartG.measure.length; i++) {
      var newAnswerPartMeasure = answerPartG.measure[i]
      var j = answerPartG.measure[i].note.length
      for (j = 0; j < answerPartG.measure[i].note.length; j++) {
        //var resetMyX = "answerPart.measure[" + i + "].note[" + j + "].x"
        var getCheckHang = that.checkHang(i, j)
        var myX = getCheckHang[0] //该小节的第一个，返回上个小节的末尾小节线位置
        var stem = newAnswerPartMeasure.note[j].stem
        //console.log('i' + i + 'j' + j + "myX" + myX)
        newAnswerPartMeasure.note[j].x = myX
        if (stem == 'down') {
          newAnswerPartMeasure.note[j].centerx = myX - 10 * rpx
        } else {
          newAnswerPartMeasure.note[j].centerx = myX + 2 * rpx
        }

        if (num == 1 && myX == 30 * rpx) { //换行
          console.log("修改y" + answerPartG.measure[i].note[j].y + interval)
          newAnswerPartMeasure.note[j].hang = newAnswerPartMeasure.note[j].hang+1
          newAnswerPartMeasure.note[j].y = newAnswerPartMeasure.note[j].y + interval
          newAnswerPartMeasure.note[j].centery = newAnswerPartMeasure.note[j].centery + interval

          
        } else if (num == -1 && myX > 309 * rpx) {
          newAnswerPartMeasure.note[j].hang = newAnswerPartMeasure.note[j].hang- 1
          newAnswerPartMeasure.note[j].y = newAnswerPartMeasure.note[j].y - interval
          newAnswerPartMeasure.note[j].centery = newAnswerPartMeasure.note[j].centery - interval
 
          console.log("修改y" + answerPartG.measure[i].note[j].y)
        }
        
      }
      //这里需要先set一次data
      // var setAnswerI = "answerPart.measure[" + i + "]"
      // that.setData({
      //   [setAnswerI]: newAnswerPartMeasure
      // })
      answerPartG.measure[ i ]=newAnswerPartMeasure

      for (j = 0; j < answerPartG.measure[i].note.length; j++) {//因为下面的函数要使用data里的东西，所以要
        var getMoveAlter = that.moveAlter(i, j, 0)
        var getDotsXY = that.dotsYmanager(newAnswerPartMeasure.note[j].imageName, i, j, newAnswerPartMeasure.note[j].name, 0)
        newAnswerPartMeasure.note[j].alterx = getMoveAlter[0]//刷新alter的位置
        newAnswerPartMeasure.note[j].altery = getMoveAlter[1]//刷新alter的位置
        newAnswerPartMeasure.note[j].dotx = getDotsXY[0]
        newAnswerPartMeasure.note[j].doty = getDotsXY[1]
      }
      


      //**********改每个小节的小节线，因为后面的j要用到 */
      var setLineX = "answerPart.measure[" + i + "].lineX"
      var lastNumber = answerPartG.measure[i].note.length - 1
      var lineX
      if (lastNumber != -1) {
        lineX = answerPartG.measure[i].note[lastNumber].x + gap
        if (answerPartG.measure[i].note[lastNumber].x > 309 * rpx) {
          lineX = 30 * rpx
        }
      } else {
        lineX = answerPartG.measure[i].lineX
      }
      console.log('setline' + lineX)
      // that.setData({
      //   [setLineX]: lineX,
      //   [setAnswerI]: newAnswerPartMeasure//再设置一次
      // })
      answerPartG.measure[ i ].lineX=lineX
      answerPartG.measure[ i ]=newAnswerPartMeasure
    }
  },
  flushEachX(num) {
    var that = this
    var newAnswerPartMeasure = answerPartG.measure[nowMeasureG]
    //**************要改的小节 */
    if (num == 1) {
      //先改一下tie
      var setTie
      //var setMyTie = "answerPart.measure[" + nowMeasureG + "].note[" + nowNoteNumberG+ "].tie"
      console.log(newAnswerPartMeasure)
      if ((nowNoteNumberG == -1 && newAnswerPartMeasure.note.length > 0 && newAnswerPartMeasure.note[0].tie == 'stop') || (nowNoteNumberG != -1&&newAnswerPartMeasure.note[nowNoteNumberG].tie == 'start')) {
        if (nowNoteNumberG == newAnswerPartMeasure.note.length - 1) {//最后一个，改后面的小节的第一个
          answerPartG.measure[(nowMeasureG + 1)].note[ 0 ].tie= 'none'
        } else {
          answerPart.measure[nowMeasureG].note[(nowNoteNumberG + 1) ].tie= 'none'
        }
        if (nowNoteNumberG == -1 ){
          answerPartG.measure[(nowMeasureG - 1)].note[(answerPartG.measure[(nowMeasureG - 1)].note.length-1) ].tie='none'
          // that.setData({
          //   [setTie]: 'none',
          //   [setMyTie]: 'none'
          // })

        }else{
          answerPartG.measure[nowMeasureG].note[nowNoteNumberG].tie='none'
          // that.setData({
          //   [setTie]: 'none',
          //   [setMyTie]: 'none'
          // })
        }
        
      } 

      if (nowNoteNumberG != answerPartG.measure[nowMeasureG].note.length - 1) { //如果是最后一个，直接往后加/删除,不进入该if操作
        var j = answerPartG.measure[nowMeasureG].note.length
        for (j = answerPartG.measure[nowMeasureG].note.length; j > nowNoteNumberG + 1; j--) {
          ////////////////////////重置所有x
          // var setLaterNote = "answerPart.measure[" + nowMeasureG + "].note[" + j + "]"
          // var setMyX = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].x"
          var myX
          //console.log('j:'+j)
          //console.log('now'+nowNoteNumberG)
          //console.log('lastX' + answerPartG.measure[nowMeasureG].note[j - 1].x)
          var getCheckHang = that.checkHang(nowMeasureG, j)
          myX = getCheckHang[0]
          var a = 0;
          for (a = 0; a < answerPartG.measure[0].note.length; a++) {
            console.log(answerPartG.measure[0].note[a].hang)
          }
          newAnswerPartMeasure.note[j] = newAnswerPartMeasure.note[j-1]
          newAnswerPartMeasure.note[j].x=myX
          var stem = newAnswerPartMeasure.note[j].stem
          if (stem == 'down') {
            newAnswerPartMeasure.note[j].centerx = myX - 10 * rpx
          } else {
            newAnswerPartMeasure.note[j].centerx = myX + 2 * rpx
          }

          if (myX == 30 * rpx) { //换行
            newAnswerPartMeasure.note[j].hang = newAnswerPartMeasure.note[j].hang + 1
            newAnswerPartMeasure.note[j].y = newAnswerPartMeasure.note[j].y + interval
            newAnswerPartMeasure.note[j].centery = newAnswerPartMeasure.note[j].centery + interval
          }
          
        }
        //这里需要先set一次data
        // var setAnswerI = "answerPart.measure[" + nowMeasureG + "]"
        // that.setData({
        //   [setAnswerI]: newAnswerPartMeasure
        // })
        answerPartG.measure[nowMeasureG]=newAnswerPartMeasure

        for (j = 0; j < answerPartG.measure[nowMeasureG].note.length; j++) {//因为下面的函数要使用data里的东西，所以要
          var getMoveAlter = that.moveAlter(nowMeasureG, j, 0)
          var getDotsXY = that.dotsYmanager(newAnswerPartMeasure.note[j].imageName, nowMeasureG, j, newAnswerPartMeasure.note[j].name, 0)
          newAnswerPartMeasure.note[j].alterx = getMoveAlter[0]//刷新alter的位置
          newAnswerPartMeasure.note[j].altery = getMoveAlter[1]//刷新alter的位置
          newAnswerPartMeasure.note[j].dotx = getDotsXY[0]
          newAnswerPartMeasure.note[j].doty = getDotsXY[1]
        }
          // that.moveAlter(nowMeasureG, j,0)//刷新alter的位置
          // that.dotsYmanager(answerPartG.measure[nowMeasureG].note[j].imageName, nowMeasureG,j, answerPartG.measure[nowMeasureG].note[j].name,0)

        // that.setData({
        //   [setAnswerI]: newAnswerPartMeasure//重新set一次
        // })
        answerPartG.measure[nowMeasureG]=newAnswerPartMeasure

      }
    } else if (num == -1) {
      console.log("num" + num)
      // var needToMinus=new Array()
      var j = nowNoteNumberG
      var getCheckHang=[0,0]
      //注意判断一下延音线的情况啊
      var setTie
      if (newAnswerPartMeasure.note[nowNoteNumberG].tie == 'start') {
        if (nowNoteNumberG == newAnswerPartMeasure.note.length-1){//最后一个，改后面的小节的第一个
          answerPartG.measure[ (nowMeasureG+1) ].note[ 0 ].tie='none'
        }else{
          answerPart.measure[nowMeasureG ].note[ (nowNoteNumberG+1) ].tie='none'
        }
        // that.setData({
        //   [setTie]: 'none'
        // })
      } else if (newAnswerPartMeasure.note[nowNoteNumberG].tie == 'stop'){
        if (nowNoteNumberG == 0) {//第一个，改前面的小节的最后一个
          answerPartG.measure[ (nowMeasureG - 1) ].note[ 0 ].tie='none'
        } else {
          answerPartG.measure[ nowMeasureG ].note[ (nowNoteNumberG - 1) ].tie='none'
        }
        // that.setData({
        //   [setTie]: 'none'
        // })
      }

      for (j = nowNoteNumberG; j < answerPartG.measure[nowMeasureG].note.length - 1; j++) {
        console.log("开始清除" + j)
        ////////////////////////重置所有x
        // var setLaterNote = "answerPart.measure[" + nowMeasureG + "].note[" + j + "]"
        // var setMyX = "answerPart.measure[" + nowMeasureG + "].note[" + j + "].x"
        var myX
        getCheckHang = that.checkHang(nowMeasureG, j)
        myX = getCheckHang[0] //*******记得要判断大于309 */
        console.log('移动myX' + myX)
        newAnswerPartMeasure.note[j] = newAnswerPartMeasure.note[j + 1]
        newAnswerPartMeasure.note[j].x = myX
        var stem = newAnswerPartMeasure.note[j].stem
        if (stem == 'down') {
          newAnswerPartMeasure.note[j].centerx = myX - 10 * rpx
        } else {
          newAnswerPartMeasure.note[j].centerx = myX + 2 * rpx
        }

        if (myX >= 309 * rpx) { //换行
          newAnswerPartMeasure.note[j].hang = newAnswerPartMeasure.note[j].hang - 1
          newAnswerPartMeasure.note[j].y = newAnswerPartMeasure.note[j].y - interval
          newAnswerPartMeasure.note[j].centery = newAnswerPartMeasure.note[j].centery - interval
          // needToMinus.push(j);
        }
        
      }
      //这里需要先set一次data
      // var setAnswerI = "answerPart.measure[" + nowMeasureG + "]"
      // that.setData({
      //   [setAnswerI]: newAnswerPartMeasure
      // })
      answerPartG.measure[ nowMeasureG ]=newAnswerPartMeasure

      for (j = 0; j < answerPartG.measure[nowMeasureG].note.length - 1; j++) {//因为下面的函数要使用data里的东西，所以要
        var getMoveAlter = that.moveAlter(nowMeasureG, j, 0)
        var getDotsXY = that.dotsYmanager(newAnswerPartMeasure.note[j].imageName, nowMeasureG, j, newAnswerPartMeasure.note[j].name, 0)
        newAnswerPartMeasure.note[j].alterx = getMoveAlter[0]//刷新alter的位置
        newAnswerPartMeasure.note[j].altery = getMoveAlter[1]//刷新alter的位置
        newAnswerPartMeasure.note[j].dotx = getDotsXY[0]
        newAnswerPartMeasure.note[j].doty = getDotsXY[1]
      }

      // that.setData({
      //   [setAnswerI]: newAnswerPartMeasure//重新set一次
      // })
      answerPartG.measure[ nowMeasureG ]=newAnswerPartMeasure

    }






  },
  //***********判断是否换行 */
  checkHang(measure, number) { //这里的x是指要放的音符的前一个音符的x
    var that = this
    if (number > 0) {
      var x = answerPartG.measure[measure].note[number - 1].x
      if (x > 309 * rpx) { //***********换行，改hang
        var newhang = answerPartG.measure[measure].note[number - 1].hang + 1

        return [30 * rpx, newhang]

      } else {
        return [answerPartG.measure[measure].note[number - 1].x + gap, answerPartG.measure[measure].note[number - 1].hang]
      }

    } else if (measure > 0) {
      var newhang = answerPartG.measure[measure - 1].note[answerPartG.measure[measure - 1].note.length - 1].hang /////每小节的第一个
      console.log('measure' + measure)
      var x = answerPartG.measure[measure - 1].lineX
      if (x > 309 * rpx) { //***********换行，改hang
        newhang = answerPartG.measure[measure - 1].note[answerPartG.measure[measure - 1].note.length - 1].hang + 1

        return [30 * rpx,newhang]
      } else {
        if (x == 30 * rpx) { //小节线位置为30时也要换行
          newhang = answerPartG.measure[measure - 1].note[answerPartG.measure[measure - 1].note.length - 1].hang + 1

        }
        console.log('numberset' + x + gap)
        return [x + gap,newhang]
      }
    } else if (measure == 0) {

      return [startx,0]
    }
  },
  //***********刷新所有小节线位置,待修改 */
  flushLineX() {
    var that = this
    var i = 0
    for (i = 0; i < answerPartG.measure.length; i++) {
      var setLineX = "answerPart.measure[" + i + "].lineX"
      var lastNumber = answerPartG.measure[i].note.length - 1
      var lineX
      if (lastNumber == -1 && i == 0) {
        lineX = 0
      } else if (lastNumber != -1) {
        lineX = answerPartG.measure[i].note[lastNumber].x + gap
        if (answerPartG.measure[i].note[lastNumber].x > 309 * rpx) {
          lineX = 30 * rpx
        }
      } else {
        lineX = answerPartG.measure[i - 1].lineX + 5 * rpx
      }
      console.log('setline' + lineX)
      // that.setData({
      //   [setLineX]: lineX
      // })
      answerPartG.measure[ i ].lineX=lineX
    }


  },

  //*************选择函数 */
  selectTap(e) {
    console.log(e)
    var that = this
    var selectNote = e.currentTarget.dataset.selectnote
    // console.log(selectNote)
    // var setNewNoteImageName = "answerPart.measure[" + e.currentTarget.dataset.nowmeasure + "].note[" + e.currentTarget.dataset.nownotenumber + "].imageName"
    if (JSON.stringify(selectNote) == JSON.stringify(nowSelectNoteG)) {
      console.log(true)
      var lastMeasure = answerPartG.measure.length - 1
      var lastNumber = answerPartG.measure[answerPartG.measure.length - 1].note.length - 1
      // that.setData({
      //   //[setNewNoteImageName]: selectNote.imageName.substring(0,selectNote.imageName.length-1),
      //   nowMeasure: lastMeasure,
      //   nowNoteNumber: lastNumber,
      //   nowHang: answerPartG.measure[lastMeasure].note[lastNumber].hang,
      //   nowSelectNote: answerPartG.measure[lastMeasure].note[lastNumber]

      // })
      answerPartG.measure[e.currentTarget.dataset.nowmeasure ].note[e.currentTarget.dataset.nownotenumber].imageName=selectNote.imageName.substring(0,selectNote.imageName.length-1),
      nowMeasureG= lastMeasure
      nowNoteNumberG= lastNumber
      nowHangG= answerPartG.measure[lastMeasure].note[lastNumber].hang,
      nowSelectNoteG= answerPartG.measure[lastMeasure].note[lastNumber]


    } else {
      console.log(false)
      // that.setData({
      //   //[setNewNoteImageName]: selectNote.imageName + "s",
      //   nowMeasure: e.currentTarget.dataset.nowmeasure,
      //   nowNoteNumber: e.currentTarget.dataset.nownotenumber,
      //   nowHang: selectNote.hang,
      //   nowSelectNote: selectNote


      // })
      nowMeasureG= e.currentTarget.dataset.nowmeasure
      nowNoteNumberG= e.currentTarget.dataset.nownotenumber,
      nowHangG= selectNote.hang
      nowSelectNoteG= selectNote
    }
    this.drawSelect()

  },

  
  //*************************服务器连接函数 */

  //***拿到本part的所有内容 */
  getPart() {
    var that = this

    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_part', //函数名待改
      data: {
        partId: this.data.partId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (typeof res.data == "object") {
          var part=res.data
        //  part.attributes.key={'key-fifths':0} //+++++++++++++++++++++++++++++++++++++++++++++++++++改掉fifths以后记得去掉
        var attribute=Object.assign({}, part.attributes);
          var answerPart={id:1,
          measure:[{lineX:0,number:1,note:[]}],
            attributes: attribute}
            answerPart.attributes.divisions = answerPart.attributes.divisions*48
          var setAnswerPartId = 'answerPart.id'
          //var setAnswerAttributes = 'answerPart.attributes'
          that.setData({
            part:part,
            //[setAnswerPartId]: this.data.partId,
            // [setAnswerAttributes]: res.data.attributes
            //answerPart:answerPart,
            onloadFlag: false,
            
          })
          answerPartG=answerPart
          nowMeasureG=0
          nowNoteNumberG=-1
          nowHangG=0
          //*********************初始化画布 */+++++++++++++++++++++++下面这行只有连接服务器时才能用
          
          that.checkBeam()//拿到划分依据规则
          audioURL = app.globalData.serverURL + that.data.lists[that.data.activeMusic].audio_path
        

        }
      }
    })

  },
  uploadAnswer() {
    var that = this
    console.log(app.globalData.openid);
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_hear_score', //函数名待改
      data: {
        part: answerPartG,
        partId:that.data.partId,
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("上传答案完成")
        console.log(res.data)
        that.setData({
          activeScore:res.data.score.toFixed(2),
          progressFlag:true,
        })
        
        let myComponent =that.selectComponent('#musicScore'); 
          myComponent.resetReady(that.data.part);

      }
    })

  },
  //********访问错题本 */
  addToNotes() {
    var that=this
    var tmp = "lists[" + that.data.activeMusic + "].added"
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'insert_distinct_wrong_list', //函数名待改
      data: {
        partId: this.data.partId,
        openid: app.globalData.openid,
        // mark: that.data.activeScore,
        // difficulty: difficulty,
        // part:answerPartG
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (parseInt(res.data) == 1) {
            wx.showToast({
              title: '成功添加到错题本',
              icon: 'success'
            })
          that.setData({
            [tmp]: 1 //标记为已经加入错题本
          })
            return 1;
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'none'
            })
            
          }
        
      }
    })
    return 0;
  },
  //********检查错题本 */
  checkNotes() {
    var that = this
    console.log('userId:' + app.globalData.openid)
    let tmp = "lists[" + this.data.activeMusic + "].added"
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'seek_wrong_rec', //函数名待改
      data: {
        partId: this.data.partId,
        openid: app.globalData.openid,
        difficulty:difficulty
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
          if (parseInt(res.data) == 1) {
           that.setData({
             [tmp]: 1 //标记为已经加入错题本
          })
            return 1;
          } else if (parseInt(res.data)==0){
            that.setData({
              [tmp]: 0 //标记为未加入错题本
            })
            
          }
        
      }
    })
    return 0
  },
  //********删除错题本 */
  deleteNotes() {
    let tmp = "lists[" + this.data.activeMusic + "].added"
    var that=this
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'del_wrong_rec', //函数名待改
      data: {
        partId: this.data.partId,
        openid: app.globalData.openid
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
              [tmp]: 0 //标记为wei加入错题本
            })
            return 1;
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
            
          }
        
      }
    })
    return 0;
  },
  getMyAudio(){
    wx.request({ //查找所有曲目
      url: app.globalData.serverURL + 'get_myself_audio', //函数名待改
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        audioCxtS.src = app.globalData.serverURL+res.data;
        console.log(audioCxtS.src)
        audioCxtS.play()  
      }
    })

  },



  //存储到缓存
  saveToStorage(key,data){
    wx.setStorage({
      key: key,
      data: data
    })
  },

  //缓存搜索
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
  downloadAndSave: function (url,path) {
    var that = this
    wx.downloadFile({
      url: url,
      filePath: wx.env.USER_DATA_PATH +'/'+path,
      success: function (res) {
        console.log('成功下载'+res.filePath)
        var filePath = res.filePath
        that.setData({
          progressMusicFlag:true
        })
        wx.saveFile({
          tempFilePath:  filePath,
          success (res) {
            console.log('文件保存成功')
            console.log(res.savedFilePath)
            
          }
        })
      }
    })
  },
  
})