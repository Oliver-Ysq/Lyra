// components/musicScore/musicScore.js
const app = getApp()
var rpx;
wx.getSystemInfo({ //获取屏幕宽度
  success: function (res) {
    rpx = res.windowWidth / 375;
  },
})
var interval=120*rpx
var ctx;
var lastLine = 0
var zhengBeam1 = 1
var gap = 35 * rpx
var startx = 100 * rpx

var alterShengList = []
var alterJiangList = []
var stepList=['c','d','e','f','g','a','b']

var threeMode = -1;
var threeDuration = 0;
var allThree = 0;

Component({
  /**
   * 组件的属性列表
   */
  
  properties: {
    part: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        //console.log(newVal)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  

  /**
   * 组件的方法列表
   */
  methods: {
    resetReady: function (part) {
      ctx = wx.createCanvasContext('myCanvas', this) //画布
      var that=this
      console.log(this.properties)
      this.setData({
        answerPart: part
      })
      console.log('setPart')
      console.log(this.data.answerPart)
  
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            screenHeight: res.windowHeight,
            screenWidth: res.windowWidth,
            width: res.windowWidth - 20 * rpx,
            scroll_height: res.windowHeight - 166 * rpx,
            white_height: res.windowHeight - 130 * rpx,
          });
        }
      })
      that.redraw()
    },

    //*************************************************画布相关函数 */
    wuxianpu: function (hang) {
      this.setData({
        height: 160 * rpx + hang * (interval)
      })

      //五线谱
      var that = this
      console.log('draw' + hang)
      ctx.moveTo(rpx * 10, rpx * 60 + hang * interval)
      ctx.lineTo(that.data.screenWidth - 30 * rpx, rpx * 60 + hang * interval)
      ctx.moveTo(rpx * 10, rpx * 70 + hang * interval)
      ctx.lineTo(that.data.screenWidth - 30 * rpx, rpx * 70 + hang * interval)
      ctx.moveTo(rpx * 10, rpx * 80 + hang * interval)
      ctx.lineTo(that.data.screenWidth - 30 * rpx, rpx * 80 + hang * interval)
      ctx.moveTo(rpx * 10, rpx * 90 + hang * interval)
      ctx.lineTo(that.data.screenWidth - 30 * rpx, rpx * 90 + hang * interval)
      ctx.moveTo(rpx * 10, rpx * 50 + hang * interval)
      ctx.lineTo(that.data.screenWidth - 30 * rpx, rpx * 50 + hang * interval)
      //小节线

      ctx.stroke()

    },
    drawFifth: function () {
      var that = this
      var alterGap = 8 * rpx
      var fifth = that.data.answerPart.attributes['key-fifths']
      //console.log(fifth)
      //width: 16rpx;
      //height: 48rpx;
      var i = 0
      if (fifth > 0) {
        for (i = 1; i <= fifth; i++) {

          if (i == 1) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx, rpx * 38, 8 * rpx, 24 * rpx)
            alterShengList.push('f')
          } else if (i == 2) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 53, 8 * rpx, 24 * rpx)
            alterShengList.push('c')
          } else if (i == 3) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 33, 8 * rpx, 24 * rpx)
            alterShengList.push('g')
          } else if (i == 4) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 48, 8 * rpx, 24 * rpx)
            alterShengList.push('d')
          } else if (i == 5) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 63, 8 * rpx, 24 * rpx)
            alterShengList.push('a')
          } else if (i == 6) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 40, 8 * rpx, 24 * rpx)
            alterShengList.push('e')
          } else if (i == 7) {
            ctx.drawImage('/image/hear/sheng.png', 46 * rpx + (i - 1) * alterGap, rpx * 58, 8 * rpx, 24 * rpx)
            alterShengList.push('b')
          }
          startx = startx + alterGap
        }
      } else if (fifth < 0) {
        fifth = -fifth
        for (i = 1; i <= fifth; i++) {

          if (i == 1) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 52, 7 * rpx, 24 * rpx)
            alterJiangList.push('b')
          } else if (i == 2) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 37, 7 * rpx, 24 * rpx)
            alterJiangList.push('e')
          } else if (i == 3) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 57, 7 * rpx, 24 * rpx)
            alterJiangList.push('a')
          } else if (i == 4) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 42, 7 * rpx, 24 * rpx)
            alterJiangList.push('d')
          } else if (i == 5) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 62, 7 * rpx, 24 * rpx)
            alterJiangList.push('g')
          } else if (i == 6) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 47, 7 * rpx, 24 * rpx)
            alterJiangList.push('c')
          } else if (i == 7) {
            ctx.drawImage('/image/hear/jiang.png', 46 * rpx + (i - 1) * alterGap, rpx * 67, 7 * rpx, 24 * rpx)
            alterJiangList.push('f')
          }
          startx = startx + alterGap
        }
      }
    },
    //************************高音谱号加拍号 */
    gaoyin: function () {
      var that = this
      startx = 100 * rpx
      alterShengList = []//init
      alterJiangList = []//init

      ctx.drawImage('/image/hear/g.png', 15 * rpx, rpx * 32, 26 * rpx, 70 * rpx)
      that.drawFifth();

      ctx.drawImage('/image/hear/p' + that.data.answerPart.attributes.beats + '.png', startx - 46 * rpx, rpx * 50, 16 * rpx, 20 * rpx)
      ctx.drawImage('/image/hear/p' + that.data.answerPart.attributes.beat_type + '.png', startx - 46 * rpx, rpx * 70, 16 * rpx, 20 * rpx)


    },
    //********************重画所有小节线 */
    drawMeasureLine() {
      var that = this
      var i = 0
      for (i = 0; i < that.data.answerPart.measure.length; i++) {
        var lineX = that.data.answerPart.measure[i].lineX
        var lastNumber = that.data.answerPart.measure[i].note.length - 1
        var hang
        ctx.setStrokeStyle('black')
        if (that.data.nowNoteNumber == -1) {
          if (i == that.data.nowMeasure - 1) {
            ctx.setStrokeStyle("rgb(54, 84, 253)")
            //console.log("设置颜色" + i)
          }
        } else {
          if (i == that.data.nowMeasure) {
            ctx.setStrokeStyle("rgb(54, 84, 253)")
            //console.log("设置颜色" + i)
          }
        }
        if (lastNumber != -1) {
          hang = that.data.answerPart.measure[i].note[lastNumber].hang

        } else if (that.data.answerPart.measure.length != 1) {
          for (var j = 1; j < i; j++) {
            if (that.data.answerPart.measure[i - j].note.length != 0) {
              lastNumber = that.data.answerPart.measure[i - j].note.length - 1
              hang = that.data.answerPart.measure[i - j].note[lastNumber].hang
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
        ctx.draw(true)
      }
    },
    //***********画上下加线 */
    upAndDown(measure, number) {
      var that = this
      var cy = that.data.answerPart.measure[measure].note[number].centery - that.data.answerPart.measure[measure].note[number].hang * interval
      var cx = that.data.answerPart.measure[measure].note[number].x
      if (cy < 55 * rpx || cy > 95 * rpx) {
        var i = 0
        var h;
        if (cy < 55 * rpx) {
          h = (40 * rpx - cy) / 10 * rpx
          for (i = 0; i <= h; i++) {
            ctx.moveTo(cx + 5 * rpx, that.data.answerPart.measure[measure].note[number].hang * interval + 40 * rpx - i * 10 * rpx)
            ctx.lineTo(cx - 15 * rpx, that.data.answerPart.measure[measure].note[number].hang * interval + 40 * rpx - i * 10 * rpx)
          }
        }
        else {
          h = (cy - 100 * rpx) / 10 * rpx
          for (i = 0; i <= h; i++) {
            ctx.moveTo(cx + 5 * rpx, that.data.answerPart.measure[measure].note[number].hang * interval + 100 * rpx + i * 10 * rpx)
            ctx.lineTo(cx - 15 * rpx, that.data.answerPart.measure[measure].note[number].hang * interval + 100 * rpx + i * 10 * rpx)
          }
        }
        ctx.stroke()

      }
    },
    /*************************画符杆 */
    drawStem(measure, number, height, stem, nowAnswerMeasure) {
      var that = this
      // if (that.data.answerPart.measure[measure].note[number].imageName != 'rbing' && that.data.answerPart.measure[measure].note[number].imageName != 'bing'){//改过就别改了
      //   that.resetImage(measure, number, stem, 1)/////记得改stem！！！
      // }
      //that.resetImage(measure, number, stem, 1)/////记得改stem！！！
      //在这里改stem吧

      var centerX = nowAnswerMeasure.note[number].x
      var centerY = nowAnswerMeasure.note[number].centery
      var hang = nowAnswerMeasure.note[number].hang
      var imageName = "bing"
      var result = []
      if (stem == 'up') {
        if (nowAnswerMeasure.note[number].stem != stem || (nowAnswerMeasure.note[number].imageName != 'rbing' && nowAnswerMeasure.note[number].imageName != 'bing')) {//改过就别改了
          centerX = centerX + 2 * rpx
          nowAnswerMeasure.note[number].centerx = centerX//赋值cx
          nowAnswerMeasure.note[number].imageName = imageName
          nowAnswerMeasure.note[number].y = centerY - 24 * rpx
          nowAnswerMeasure.note[number].stem = stem
        }
        nowAnswerMeasure.note[number].height = height
        centerX = nowAnswerMeasure.note[number].centerx
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX, centerY - height)
        result = [centerX, centerY - height, hang, number, nowAnswerMeasure]
      } else {
        if (nowAnswerMeasure.note[number].stem != stem || (nowAnswerMeasure.note[number].imageName != 'rbing' && nowAnswerMeasure.note[number].imageName != 'bing')) {//改过就别改了
          nowAnswerMeasure.note[number].imageName = 'r' + imageName
          nowAnswerMeasure.note[number].y = centerY + 5 * rpx
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
    getHeight(measure, group, long, er, stem, perBeam) {
      var that = this
      var result = []
      // 
      // //console.log('我的y')
      // //console.log(that.centerYtoy0(that.data.answerPart.measure[measure].note[number].centery, that.data.answerPart.measure[measure].note[number].hang))
      if (stem == 'up') {
        var min = 35 * rpx
        var i = 0
        for (i = 0; i < long; i++) {
          var number = that.data.answerPart.measure[measure].groups[group].note[0][0][i]
          ////console.log('i' + number)
          var height = that.centerYtoy0(that.data.answerPart.measure[measure].note[number].centery, that.data.answerPart.measure[measure].note[number].hang) - that.centerYtoy0(that.data.answerPart.measure[measure].note[er[0]].centery, that.data.answerPart.measure[measure].note[er[0]].hang) + perBeam * (er[0] - number) + 35 * rpx
          if (height < min) {
            min = height//记住最短的，最后全体加上
          }
          result.push(height)
        }
      } else if (stem == 'down') {
        var min = 35 * rpx
        var i = 0
        for (i = 0; i < long; i++) {

          var number = that.data.answerPart.measure[measure].groups[group].note[0][0][i]
          ////console.log('i' + number)
          var height = that.centerYtoy0(that.data.answerPart.measure[measure].note[er[0]].centery, that.data.answerPart.measure[measure].note[er[0]].hang) - that.centerYtoy0(that.data.answerPart.measure[measure].note[number].centery, that.data.answerPart.measure[measure].note[number].hang) - perBeam * (er[0] - number) + 35 * rpx
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
    drawBeam8(measure, drawXY, long, stem, perBeam) {
      var that = this
      var up = 4 * rpx
      if (stem == 'down') {
        up = -up
      }
      //同一行直接划线
      if (drawXY[0][2] == drawXY[long - 1][2]) {
        ctx.beginPath() //lianjie
        ctx.moveTo(drawXY[0][0], drawXY[0][1])
        ctx.lineTo(drawXY[long - 1][0], drawXY[long - 1][1])
        ctx.lineTo(drawXY[long - 1][0], drawXY[long - 1][1] + up)
        ctx.lineTo(drawXY[0][0], drawXY[0][1] + up)
        ctx.setFillStyle('black')
        ctx.fill()
        ctx.closePath()
        ctx.stroke()


      } else {//不同行，画到行末
        var i = 0
        var breakList = new Array()
        breakList.push(0)
        for (i = 0; i < drawXY.length; i++) {

          //找到那个断开的i
          if (i != 0 && drawXY[i][2] != drawXY[i - 1][2]) {
            breakList.push(i - 1)
            breakList.push(i)
          }
        }
        breakList.push(drawXY.length - 1)
        var k = 0;
        for (k = 0; k < breakList.length; k = k + 2) {
          //console.log(k)
          var start = []
          var end = []
          start[0] = drawXY[breakList[k]][0]
          start[1] = drawXY[breakList[k]][1]
          end[0] = drawXY[breakList[k + 1]][0]
          end[1] = drawXY[breakList[k + 1]][1]
          //不是头尾
          if (k != 0) {
            start[0] = start[0] - gap / 2
            start[1] = start[1] - perBeam / 2
          }
          if ((k + 1) != breakList.length - 1) {
            end[0] = end[0] + gap / 2
            end[1] = end[1] + perBeam / 2
          }
          ctx.beginPath() //lianjie
          ctx.moveTo(start[0], start[1])
          ctx.lineTo(end[0], end[1])
          ctx.lineTo(end[0], end[1] - 4 * rpx)
          ctx.lineTo(start[0], start[1] - 4 * rpx)
          ctx.setFillStyle('black')
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
        }
      }
      //画16和32
      var j = 0
      for (j = 0; j < long; j++) {
        if (that.data.answerPart.measure[measure].note[drawXY[j][3]].beam.length >= 2) {
          var beam16 = that.data.answerPart.measure[measure].note[drawXY[j][3]].beam[1]
          var up = 7 * rpx
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
          if (that.data.answerPart.measure[measure].note[drawXY[j][3]].beam.length > 2) {/////32
            var beam32 = that.data.answerPart.measure[measure].note[drawXY[j][3]].beam[2]
            var add32 = 1
            var minus32 = -1
            up = up * 2
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

    drawBeam(measure) {
      var that = this
      var group = 0
      var nowAnswerMeasure = that.data.answerPart.measure[measure]
      var setAnswerMeasure = "answerPart.measure[" + measure + "]"
      for (group = 0; group < that.data.answerPart.measure[measure].groups.length; group++) {
        var stem = that.data.answerPart.measure[measure].groups[group].stem
        var lower = that.data.answerPart.measure[measure].groups[group].lower
        var higher = that.data.answerPart.measure[measure].groups[group].higher
        var long = that.data.answerPart.measure[measure].groups[group].note[0][0].length
        //拿到头尾向量
        var head = that.data.answerPart.measure[measure].groups[group].note[0][0][0]
        var tail = that.data.answerPart.measure[measure].groups[group].note[0][0][long - 1]
        //var vector = [that.data.answerPart.measure[measure].note[tail].centerx - that.data.answerPart.measure[measure].note[head].centerx, that.data.answerPart.measure[measure].note[tail].centery - that.data.answerPart.measure[measure].note[head].centery]
        var headHeight = 35 * rpx
        var tailHeight = 35 * rpx
        ////console.log('TAIL'+tail)
        var perBeam = (that.centerYtoy0(that.data.answerPart.measure[measure].note[tail].centery, that.data.answerPart.measure[measure].note[tail].hang) - that.centerYtoy0(that.data.answerPart.measure[measure].note[head].centery, that.data.answerPart.measure[measure].note[head].hang)) / (long - 1)
        var i = 0
        if (stem == 'up') {
          if (higher.length > 1) {
            perBeam = 0
          }
          var height = that.getHeight(measure, group, long, higher, stem, perBeam)
          // //console.log('HEIGHT就UP是')
          // //console.log(height)

          var drawXY = new Array()
          for (i = 0; i < long; i++) {
            var number = that.data.answerPart.measure[measure].groups[group].note[0][0][i]
            var result = that.drawStem(measure, number, height[i], stem, nowAnswerMeasure)
            drawXY.push(result.slice(0, 4))
            nowAnswerMeasure = result[4]
          }

        } else if (stem == 'down') {
          if (lower.length > 1) {
            perBeam = 0
          }
          var drawXY = new Array()
          var height = that.getHeight(measure, group, long, lower, stem, perBeam)
          // //console.log('HEIGHT就DOWN是')
          // //console.log(height)
          for (i = 0; i < long; i++) {
            var number = that.data.answerPart.measure[measure].groups[group].note[0][0][i]
            var result = that.drawStem(measure, number, height[i], stem, nowAnswerMeasure)
            drawXY.push(result.slice(0, 4))
            nowAnswerMeasure = result[4]
          }

        }
        that.drawBeam8(measure, drawXY, long, stem, perBeam)
      }
      that.setData({
        [setAnswerMeasure]: nowAnswerMeasure
      })
    },
    //************************************延音线 */
    drawTie(measureStart, numberStart) {
      var that = this
      var stem = that.data.answerPart.measure[measureStart].note[numberStart].stem
      var measureStop = measureStart
      var numberStop = numberStart + 1
      if (numberStart == that.data.answerPart.measure[measureStart].note.length - 1) {
        measureStop = measureStart + 1
        numberStop = 0
      }
      var startx = that.data.answerPart.measure[measureStart].note[numberStart].centerx
      var starty = that.data.answerPart.measure[measureStart].note[numberStart].centery
      var stopx = that.data.answerPart.measure[measureStop].note[numberStop].centerx
      var stopy = that.data.answerPart.measure[measureStop].note[numberStop].centery
      var centerx;
      var centery;
      if (stem == 'down') {
        startx = startx + 3 * rpx
        stopx = stopx + 3 * rpx
        starty = starty - 10 * rpx
        stopy = stopy - 10 * rpx
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
      if (that.data.answerPart.measure[measureStart].note[numberStart].hang != that.data.answerPart.measure[measureStop].note[numberStop].hang) {
        var centerx1 = startx + gap / 2
        var centery1 = centery - (starty + stopy) / 2 + starty
        var centerx2 = stopx - gap / 2
        var centery2 = centery - (starty + stopy) / 2 + stopy
        ctx.quadraticCurveTo((centerx1 + startx) / 2, (centery1 + starty) / 2 + (centery - (starty + stopy) / 2) / 4, centerx1, centery1)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerx2, centery2)
        ctx.quadraticCurveTo((centerx2 + stopx) / 2, (centery2 + stopy) / 2 + (centery - (starty + stopy) / 2) / 4, stopx, stopy)

      } else {
        ctx.quadraticCurveTo(centerx, centery, stopx, stopy)
      }
      ctx.stroke()

    },
    manage3Up(position, stem, centery, height, hang) {
      var that = this
      var result
      if (position == 'up') {
        if (stem == 'up') {
          result = centery - height - 5 * rpx - interval * hang
        } else {
          result = centery - 5 * rpx - interval * hang
        }
        //console.log('up' + result)
        if (result >= 40 * rpx) {
          result = 40 * rpx
        }
      } else {
        if (stem == 'up') {
          result = centery + 5 * rpx - interval * hang
        } else {
          result = centery + height + 5 * rpx - interval * hang
        }
        //console.log('down' + result)
        if (result <= 100 * rpx) {
          result = 100 * rpx
        }
      }
      //console.log("3lian" + result)
      return result
    },
    //******画3连音 */
    drawThree(measure, number) {
      var that = this
      var startNote = that.data.answerPart.measure[measure].note[number]
      var middleNote = that.data.answerPart.measure[measure].note[number + 1]
      var endNote = that.data.answerPart.measure[measure].note[number + 2]//+++++++++只考虑3个音了啊
      if (typeof (middleNote) == "undefined") {
        middleNote = {
          stem: startNote.stem,
          centerx: that.checkHang(measure, number + 1, that.data.answerPart.measure[measure],that.data.answerPart)[0],
          hang: that.checkHang(measure, number + 1, that.data.answerPart.measure[measure], that.data.answerPart)[1],
          centery: startNote.centery + interval * (that.checkHang(measure, number + 1, that.data.answerPart.measure[measure], that.data.answerPart)[1] - startNote.hang),
          height: startNote.height
        }
        endNote = {
          stem: middleNote.stem,
          centerx: middleNote.centerx + gap,
          hang: middleNote.hang,
          centery: middleNote.centery,
          height: middleNote.height
        }
      } else if (typeof (endNote) == "undefined") {
        endNote = {
          stem: middleNote.stem,
          centerx: that.checkHang(measure, number + 2)[0],
          hang: that.checkHang(measure, number + 2)[1],
          centery: middleNote.centery + interval * (that.checkHang(measure, number + 2)[1] - middleNote.hang),
          height: middleNote.height
        }
      }
      //console.log('endNote')
      //console.log(endNote)
      var noteList = [startNote, middleNote, endNote]
      ctx.beginPath()
      ctx.setLineWidth(0.5)
      if (typeof (endNote) != 'undefined' && typeof (middleNote) != 'undefined') {//only a number 3
        var i = 0
        var max = 0
        var min = 10000 * rpx
        for (i = 0; i < 3; i++) {
          var theNote = noteList[i]
          var theY = that.manage3Up(middleNote.stem, theNote.stem, theNote.centery, theNote.height, theNote.hang)
          if (theY < min) {
            min = theY
          } if (theY > max) {
            max = theY
          }
        }
        if (middleNote.stem == 'up') {
          ctx.moveTo(startNote.centerx, min + interval * startNote.hang)
          ctx.lineTo(startNote.centerx, min + interval * startNote.hang + 5 * rpx)
          ctx.moveTo(startNote.centerx, min + interval * startNote.hang)
          ctx.lineTo(startNote.centerx + gap / 2, min + interval * startNote.hang)
          ctx.setTextBaseline('middle')
          ctx.setFontSize(15)
          ctx.fillText('3', middleNote.centerx, min + interval * middleNote.hang)
          ctx.moveTo(endNote.centerx - gap / 2, min + interval * endNote.hang)
          ctx.lineTo(endNote.centerx, min + interval * endNote.hang)
          ctx.moveTo(endNote.centerx, min + interval * endNote.hang + 5 * rpx)
          ctx.lineTo(endNote.centerx, min + interval * endNote.hang)
        } else if (middleNote.stem == 'down') {
          ctx.moveTo(startNote.centerx, max + interval * startNote.hang)
          ctx.lineTo(startNote.centerx, max + interval * startNote.hang - 5 * rpx)
          ctx.moveTo(startNote.centerx, max + interval * startNote.hang)
          ctx.lineTo(startNote.centerx + gap / 2, max + interval * startNote.hang)
          ctx.setTextBaseline('middle')
          ctx.setFontSize(15)
          ctx.fillText('3', middleNote.centerx, max + interval * middleNote.hang)
          ctx.moveTo(endNote.centerx - gap / 2, max + interval * endNote.hang)
          ctx.lineTo(endNote.centerx, max + interval * endNote.hang)
          ctx.moveTo(endNote.centerx, max + interval * endNote.hang - 5 * rpx)
          ctx.lineTo(endNote.centerx, max + interval * endNote.hang)
        }
      }
      ctx.stroke()
    },

    //******************重新绘图函数 */
    redraw() {
      var that = this
      var lastMeasure = that.data.answerPart.measure.length - 1
      var lastNumber = that.data.answerPart.measure[that.data.answerPart.measure.length - 1].note.length - 1
      //console.log(lastNumber)
      that.checkBeam()//拿到划分依据规则,+++++++++++++++++++++++++++++++++++++++等能连接了记得删掉


      
      //ctx.draw()
      that.gaoyin()
      //这里是每次重绘都要遍历所有音符的部分，为减少遍历次数写在一起
      var k = 0
      var j = 0
      var nowAnswer=that.data.answerPart
      for (k = 0; k <= lastMeasure; k++) {//为了减少setData耗时，只好把循环拿出来了

        //在这里添加处理音符属性的函数
        var nowMeasureNotes = { number: k + 1, note: [], lineX: 0 }
        for (j = 0; j < that.data.answerPart.measure[k].note.length; j++) {
          nowMeasureNotes.note[j] = that.addNote(k, j, nowMeasureNotes,nowAnswer)
        }
        nowMeasureNotes.lineX=that.flushLineX(nowMeasureNotes, nowAnswer.measure[k-1])
        nowAnswer.measure[k] = nowMeasureNotes
      }
      that.setData({
        answerPart:nowAnswer
      })

      that.drawMeasureLine()
      ctx.setStrokeStyle('black')


      for (k = 0; k <= lastMeasure; k++) {

        if (that.data.answerPart.measure[k].note.length != 0 ) {
          that.getZhengAndBeam(k, that.data.answerPart.measure[k].note.length - 1)//每次重绘时刷新一下本小节的连接情况
        }
        //这里添加画符柄的函数!!!
        if (typeof (that.data.answerPart.measure[k].groups) == 'object') {
          that.drawBeam(k)
        }
        for (j = 0; j < that.data.answerPart.measure[k].note.length; j++) {

          that.upAndDown(k, j)
          if (that.data.answerPart.measure[k].note[j].tie == 'start') {
            that.drawTie(k, j)
          }
          if (typeof (that.data.answerPart.measure[k].note[j].three) != "undefined") {
            if (that.data.answerPart.measure[k].note[j].three.flag == 'begin') {
              that.drawThree(k, j)
            }
            ctx.setLineWidth(1)
          }
        }

      }
      var hang = 0
      if (lastNumber != -1 && that.data.answerPart.measure[lastMeasure].note[lastNumber].hang != undefined) {
        hang = that.data.answerPart.measure[lastMeasure].note[lastNumber].hang
      } else {
        for (var i = 2; i < that.data.answerPart.measure.length; i++) {
          if (that.data.answerPart.measure[that.data.answerPart.measure.length - i].note.length != 0) {
            lastMeasure = that.data.answerPart.measure.length - i
            lastNumber = that.data.answerPart.measure[lastMeasure].note.length - 1
            hang = that.data.answerPart.measure[lastMeasure].note[lastNumber].hang
            break;
          }
        }
      }
      var i = 0
      for (i = 0; i <= hang; i++) {
        that.wuxianpu(i)
      }

      ctx.draw(true)
      if (hang != lastLine) {
        //console.log("换了" + hang)
        lastLine = hang
      }
      //console.log(that.data.answerPart)

    },

    

    alter2alterName(alter) {
      if (alter == 1) {
        return 'sheng';
      } else if (alter == 2) {
        return 'csheng'
      } else if (alter == -1) {
        return 'jiang'
      } else if (alter == -2) {
        return 'cjiang'
      } else if (alter == 0) {
        return 'huan'
      }
    },
    //新建栈，判断是否跟随前面的alter
    buildAlterStack(measure, number, name,nowMeasure) {
      var that = this
      var stack = new Array(0)
      stack.push(0)
      var j = 0
      //console.log(alterShengList)
      for (j = 0; j < alterShengList.length; j++) {
        //console.log(name.slice(0, 1).toLowerCase())

        if (alterShengList[j] == name.slice(0, 1).toLowerCase()) {
          stack.push(1)
        }
      }
      for (j = 0; j < alterJiangList.length; j++) {
        if (alterJiangList[j] == name.slice(0, 1).toLowerCase()) {
          stack.push(-1)
        }
      }

      var i = 0
      for (i = 0; i < number; i++) {
        if (nowMeasure.note[i].name == name) {//本小节有相同音高的,检查是否改变alter
          //console.log('发现相同的name')
          if (nowMeasure.note[i].alterImage != 'none') {//有符号，推入栈
            stack.push(nowMeasure.note[i].alter)
          }
        }
      }
      //console.log('stack' + stack.slice(-1)[0])
      return stack.slice(-1)[0]
    },
    dotsYmanager(imageName, measure, noteNumber, name, reset) {
      var that = this
      var dotx = that.data.answerPart.measure[measure].note[noteNumber].x + 16 * rpx
      var doty = that.data.answerPart.measure[measure].note[noteNumber].y
      var setDotX = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].dotx"
      var setDotY = "answerPart.measure[" + measure + "].note[" + (noteNumber) + "].doty"
      if (imageName.startsWith('r')) {
        imageName = imageName.slice(1)
        doty = doty + 5 * rpx
      } else {
        if (imageName.startsWith('4') || imageName.startsWith('2') || imageName == 'bing') {
          doty = doty + 34 * rpx
        } else if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')) {
          doty = doty + 39 * rpx
        } else if (imageName.startsWith('1')) {
          doty = doty + 5 * rpx
        }
      }
      if (name == 'd' || name == 'a' || name == 'f' || name == 'c1' || name == 'e1' || name == 'e1' || name == 'g1' || name == 'b1' || name == 'e1' || name == 'd2' || name == 'f2' || name == 'a2' || name == 'c3' || name == 'e3') {
        doty = doty - 5 * rpx
      }else if(name==null){
        doty = 75 * rpx + that.data.answerPart.measure[measure].note[noteNumber].hang*interval
      }
      if (reset == 1) {
        that.setData({
          [setDotX]: dotx,
          [setDotY]: doty
        })
      }
      return [dotx, doty]
    },

    alterYmanager(alterName, imageName, y) {
      if (imageName.startsWith('r')) {
        imageName = imageName.slice(1)
        if (imageName.startsWith('4') || imageName.startsWith('2') || imageName == 'bing') {
          y = y - 29 * rpx
        } else if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')) {
          y = y - 34 * rpx
        }
      }
      if (imageName.startsWith('8') || imageName.startsWith('16') || imageName.startsWith('32')) {
        y = y + 5 * rpx
      }
      else if (imageName.startsWith('1')) {
        y = y - 29 * rpx
      }
      if (alterName == 'csheng') {
        return y + 7 * rpx
      } else if (alterName.endsWith('jiang')) {
        return y - 6 * rpx
      }
      return y
    },
    //每次删除、添加移动音符时一起刷新alter的位置
    moveAlter(alterName, imageName,x,y) {
      var that = this
      var alterx = x - 12 * rpx
      var altery = y + 23 * rpx
      altery = that.alterYmanager(alterName, imageName, altery)
      return [alterx, altery]
    },

    getZhengAndBeam(measure, number) {
      var that = this
      var i = 0
      var myDuration;
      var notei;
      var divisions = that.data.answerPart.attributes.divisions
      var allDuration = [0, 0, 0];
      var zheng = zhengBeam1
      var lastBeam = 'none'
      var group = -1
      var higher = [0]
      var lower = [0]
      var note = []
      var newAnswerPartMeasure = that.data.answerPart.measure[measure]
      for (i = 0; i < newAnswerPartMeasure.note.length; i++) {
        // var setLastBeam = that.getSetBeam(measure, i - 1)
        myDuration = newAnswerPartMeasure.note[i].duration
        //var notelength = Math.ceil(Math.log(divisions / myDuration) / Math.log(2))
        var notelength

        if (typeof (newAnswerPartMeasure.note[i].normalNotes) != "undefined") {
          notelength = Math.log(that.toName(myDuration, newAnswerPartMeasure.note[i].three.threeDuration, newAnswerPartMeasure.note[i].normalNotes)) / Math.log(2) - 2
        } else {
          notelength = Math.log(that.toName(myDuration)) / Math.log(2) - 2
        }
        allDuration[0] = allDuration[0] + myDuration//先更新一下总时值

        if (i != 0) {
          lastBeam = newAnswerPartMeasure.note[i - 1].beam
        }
        var setMyBeam = that.getSetBeam(measure, i)
        var myBeam = [];
        //如果为4、2、1音符或休止符,则自己为none，前面一定end
        if (myDuration >= divisions || newAnswerPartMeasure.note[i].imageName.startsWith('x')) {
          myBeam = 'none'
          //console.log('上一个是' + (i - 1) + ":" + lastBeam)
          if (i > 0 && lastBeam != 'none') {
            if (i - 1 == 0 || newAnswerPartMeasure.note[i - 2].beam == 'none' || newAnswerPartMeasure.note[i - 2].beam[0] == 'end') {
              //groups[0]:note[0]:[[1,2,3,4]] [1]:[[1,2,3],[]][2]:[[2,3],[]]
              var gro = 0;
              for (gro = 0; gro < newAnswerPartMeasure.groups.length; gro++) {
                function forGroup(value) {
                  var val = 0
                  for (val = 0; val < value.length; val++) {
                    function findEach(value, index, array) {
                      return value == i - 1
                    }
                    if (value[val].findIndex(findEach) != -1) {
                      newAnswerPartMeasure.groups.splice(gro, 1);//删了整个group？
                      group--
                      return;
                    }
                  }
                }
                newAnswerPartMeasure.groups[gro].note.forEach(forGroup)
              }
              //console.log("设置" + (i - 1))
              lastBeam = 'none'
            } else {
              var lasti = 0
              for (lasti = 0; lasti < lastBeam.length; lasti++) {
                lastBeam[lasti] = 'end'
              }
            }

            newAnswerPartMeasure.note[i - 1].beam = lastBeam
            newAnswerPartMeasure = that.resetNote(i - 1, newAnswerPartMeasure)
          }
        } else if (i == newAnswerPartMeasure.note.length - 1) {//小节最后一个，肯定是end或none
          if (lastBeam == 'none' || lastBeam[0] == 'end') {
            myBeam = 'none'
          } else {
            ////console.log('i' + i + 'LENGTH' + Math.log(Math.floor(divisions / myDuration)) / Math.log(2))
            for (notei = 0; notei < notelength; notei++) {
              myBeam[notei] = 'end'
            }
          }

        } else {
          //8分、16分,要看前面有没有能连接的。
          if (allDuration[0] % zheng == 0 || (Math.round(allDuration[0]) % zheng == 0 && Math.abs(Math.round(allDuration[0]) - allDuration[0]) <= 0.01)) {//加入新音符后正好为整，若前面不能连，则不连，前面能连，则自己为end，下一个可能begin
            if (lastBeam == 'none' || lastBeam[0] == 'end') {
              myBeam = 'none'
            } else {
              for (notei = 0; notei < notelength; notei++) {
                myBeam[notei] = 'end'
              }
            }

          } else {//8分16分且不为整，应该和前面/后面连接。
            if (lastBeam == 'none' || lastBeam[0] == 'end') {//前面不给连了，自己开头
              for (notei = 0; notei < notelength; notei++) {
                myBeam[notei] = 'begin'
              }
              //刷新一下16/16+32的前面总时值
              for (notei = 1; notei < notelength; notei++) {
                allDuration[notei] = myDuration
              }

            } else if (lastBeam[0] == 'begin' || lastBeam[0] == 'continue') {//前面给连,则把自己放中间。
              myBeam[0] = 'continue'
            }
          }

        }
        if (myBeam != 'none' && myBeam[0] != 'begin') {
          if (notelength >= 2) {//我是16分/32分
            allDuration[1] = allDuration[1] + myDuration
            if (notelength == 2) {//16分音符，把32的duration清空
              allDuration[2] = 0
            }
            //对于16分[1],凑到beats时值的整数倍就end
            if ((notelength == 3 && allDuration[1] % that.toDuration(that.data.part.attributes.beat_type) == 0) || myBeam[0] == 'end') {
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
                if ((newAnswerPartMeasure.note[i - 2].beam.length < 2)) {
                  lastBeam[1] = 'begin'
                } else {
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
              else {
                myBeam[2] = 'end'
              }
            } else {
              myBeam[2] = myBeam[1]
            }
            if (lastBeam.length == notelength && lastBeam[2] == 'end') {//前面的和自己一样
              if (newAnswerPartMeasure.note[i - 2].beam.length < 3) {
                lastBeam[2] = 'begin'
              } else if (lastBeam[1] == 'continue') {
                lastBeam[2] = 'continue'
              }
            }
          }
          if (typeof (newAnswerPartMeasure.note[i - 1].beam) == 'undefined' || newAnswerPartMeasure.note[i - 1].beam != lastBeam) {
            newAnswerPartMeasure.note[i - 1].beam = lastBeam
            newAnswerPartMeasure = that.resetNote(i - 1, newAnswerPartMeasure)
          }

        }

        //设置自己和前面
        if (typeof (newAnswerPartMeasure.note[i].beam) == 'undefined' || newAnswerPartMeasure.note[i].beam != myBeam) {
          newAnswerPartMeasure.note[i].beam = myBeam
        }

        if (myBeam != 'none') {

          if (myBeam[0] == 'begin') {
            group++ ,
              higher = [i],
              lower = [i]
            note = []
          }
          var stem = 'up'

          for (notei = 0; notei < myBeam.length; notei++) {
            if (myBeam[notei] == 'begin') {
              if (typeof (note[notei]) != 'object') {
                note[notei] = new Array()
              }
              note[notei].push([i])//新建一个数组
            } else {
              ////console.log('这里就是那个啦！！！'+notei)

              if (typeof (note[notei]) != 'object') {
                var a = []
                note[notei] = new Array(a)
              }
              //console.log(note)
              note[notei][note[notei].length - 1].push(i)//加入最后那个数组
            }
          }
          //判断最低
          if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) > that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang)) {
            lower = [i]
          } else if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) == that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang)) {
            lower.push(i)
          }
          //判断最高
          if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) < that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) {
            higher = [i]
          } else if (that.centerYtoy0(newAnswerPartMeasure.note[i].centery, newAnswerPartMeasure.note[i].hang) == that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) {
            higher.push(i)
          }
          //判断stem
          if (Math.abs(80 * rpx - that.centerYtoy0(newAnswerPartMeasure.note[higher[0]].centery, newAnswerPartMeasure.note[higher[0]].hang)) > Math.abs(80 * rpx - that.centerYtoy0(newAnswerPartMeasure.note[lower[0]].centery, newAnswerPartMeasure.note[lower[0]].hang))) {
            stem = 'up'
            if (newAnswerPartMeasure.note[higher[0]].octave >= 5) {
              stem = 'down'
            }
          } else {
            stem = 'up'
            if (newAnswerPartMeasure.note[lower[0]].octave >= 5) {
              stem = 'down'
            }
          }

          if (typeof (newAnswerPartMeasure.groups) == "undefined") {
            newAnswerPartMeasure.groups = new Array()
          }
          newAnswerPartMeasure.groups[group] = {
            note: note,
            stem: stem,
            higher: higher,
            lower: lower
          }
        } else {
          newAnswerPartMeasure = that.resetNote(i, newAnswerPartMeasure)
          // //********************************************************判断一下它的image是否对应，不对的话换回去！！！！！
        }
      }
      if (typeof (newAnswerPartMeasure.groups) == 'object' && group < newAnswerPartMeasure.groups.length - 1) {
        var newGroups = newAnswerPartMeasure.groups.slice(0, group + 1)
        newAnswerPartMeasure.groups = newGroups
      }
      var setNewAnswerPartMeasure = "answerPart.measure[" + measure + "]"
      that.setData({
        [setNewAnswerPartMeasure]: newAnswerPartMeasure
      })
    },
    centerYtoy0(centerY, hang) {
      return centerY + 10 * rpx - interval * hang
    },


    resetNote(i, newAnswerPartMeasure) {
      var that = this
      //********************************************************判断一下它的image是否对应，不对的话换回去！！！！！
      if (!newAnswerPartMeasure.note[i].imageName.startsWith('x') && !newAnswerPartMeasure.note[i].imageName.startsWith(that.toName(newAnswerPartMeasure.note[i].duration))) {
        var stemNew = 'up'
        var imageName;
        if (typeof (newAnswerPartMeasure.note[i].normalNotes) != "undefined") {
          imageName = that.toName(newAnswerPartMeasure.note[i].duration, newAnswerPartMeasure.note[i].three.threeDuration, newAnswerPartMeasure.note[i].normalNotes) + ''
          //console.log('changeImage' + imageName)
        } else {
          imageName = that.toName(newAnswerPartMeasure.note[i].duration) + ''
          //console.log('changeImage' + imageName)
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
        // //console.log("Y在这里呢" + imageName)
        newAnswerPartMeasure.note[i].stem = stemNew
        newAnswerPartMeasure.note[i].imageName = imageName
      }
      return newAnswerPartMeasure
    },
    getSetBeam(measure, number) {
      return "answerPart.measure[" + measure + "].note[" + number + "].beam"
    },

    checkBeam() {
      var that = this
      var zhengBeam;
      var pai = that.data.answerPart.attributes.beats
      //beam[0]:divisions/duration=2  [1]=4  [2]=8
      //Math.log(Math.floor(divisions/duration))/Math.log(2)-1
      if (that.data.answerPart.attributes.beat_type == 4) {
        //42 43以四分的duration为单位分割
        zhengBeam = that.toDuration(that.data.answerPart.attributes.beat_type)
        //that.getZhengAndBeam(zheng, measure, number)
      } else {
        if (pai % 3 == 0) {//3、6、9、12
          zhengBeam = 3 * that.toDuration(that.data.answerPart.attributes.beat_type)
        } else if (pai == 2 || pai == 4) {//2、4
          zhengBeam = 2 * that.toDuration(that.data.answerPart.attributes.beat_type)
        } else {//5、7
          //5：2 3/3 2
          //7：2 2 3
          //8:3 3 2
          //10:3 3 2 2 
          //11: 3 3 3 2先不写了啊啊啊啊啊啊啊*******************************************************
        }
      }
      zhengBeam1 = zhengBeam


    },
    //***********************添加音符各个属性 */
    addNote(measure, number, nowMeasureNotes, nowAnswer) {
      var that = this
      var selectNote = that.data.answerPart.measure[measure].note[number]
      var imageName=''

      //name
      selectNote.name = selectNote.step 
      if(selectNote.step==''||selectNote.step==null){
        imageName='x'
        selectNote.y=60*rpx
      }else{
        if (parseInt(selectNote.octave) - 3 > 0) {
          selectNote.name = selectNote.name.toLowerCase() + (parseInt(selectNote.octave) - 3)
        }
        console.log('NAMENAME'+selectNote.name)
        selectNote.y = that.getY(selectNote.octave, selectNote.step.toLowerCase())
      }

      //获得一下x
      
      var getCheckHang = that.checkHang(measure, number, nowMeasureNotes, nowAnswer) //********刷新x值 */

      //console.log('getcheckHang:'+getCheckHang)
      var x = getCheckHang[0]
      var nowHang = getCheckHang[1]
      var stem = 'up'
      var centerX = x + 2 * rpx

      //先判断一下是否是三连音，赋值threeDuration和normalNotes
      if (typeof (selectNote['actual-notes'])!='undefined'&&selectNote['actual-notes']!=null){
        threeMode++;
        threeDuration=selectNote.duration*3
      }
      if (threeMode >= 0) {//三连音了
        //actual-notes:3,normal-notes:2
        if (threeMode == 0) {
          selectNote.three = {
            flag: 'begin',
            threeDuration: threeDuration,//3连音的总时长
          }
        } else {
          selectNote.three = {
            flag: 'continue',
            threeDuration: threeDuration,//3连音的总时长
          }
        }
        // selectNote.actualNotes = selectNote['actual-notes']
        //   //正常比例
        // selectNote.normalNotes = selectNote['normal-notes'],
        allThree = allThree + selectNote.duration
        if (allThree >= threeDuration) {//满了清空
          threeMode = -1
          allThree = 0
          threeDuration = 0
          selectNote.three.flag = 'end'
        } 
      }

      //  imageName
      imageName = imageName+that.toName(selectNote.duration, selectNote.threeDuration, selectNote.normalNotes)
      if (selectNote.octave >= 5) {
        imageName = "r" + imageName
        stem = 'down'
        centerX = x - 10 * rpx
      }
      if (selectNote.step != ''&&selectNote.step != null) {
      //检查一下alter，赋值altername
        var alterImage = that.alter2alterName(selectNote.alter)
        if (that.buildAlterStack(measure, number, selectNote.name, nowMeasureNotes) == selectNote.alter) {
          alterImage = 'none'
        } else {
          if (selectNote.alter == 0) {
            alterImage = 'huan'
          }
        }
      }
    //添加一个判断dot的函数！
      var dot = that.getDot(selectNote.duration, that.data.answerPart.attributes.divisions, that.toName(selectNote.duration, selectNote.threeDuration, selectNote.normalNotes))
      selectNote.dotImage = dot//
      var dotManage = that.dotsYmanager(imageName, measure, number, selectNote.name, 0)
      selectNote.dotx=dotManage[0],//
      selectNote.doty=dotManage[1]//

      var y=selectNote.y + that.manageY(imageName, nowHang)//
      

      if (selectNote.step != ''&&selectNote.step != null) {
        selectNote.stem = stem,
          selectNote.alterImage = alterImage,
          selectNote.centery = selectNote.y + interval * nowHang - 10 * rpx,
          selectNote.centerx = centerX
        selectNote.height = 35 * rpx
        selectNote.alterx = that.moveAlter(alterImage, imageName, x, y)[0]
        selectNote.altery = that.moveAlter(alterImage, imageName, x, y)[1]

      }
      selectNote.hang = nowHang,//
      selectNote.imageName = imageName//
      selectNote.x = x//
      selectNote.y = y//

      
      return selectNote

    },
    //根据octave和step得到y
    getY(octave, step) {
      var num = stepList.indexOf(step)
      var y = 145 * rpx
      y = y - (octave - 3) * 35 * rpx
      y = y - num * 5 * rpx
      return y
    },
    //获得dotname
    getDot(duration,divisions,imageName){
      var that=this
      imageName=parseInt(imageName)
      var trueDuration=that.toDuration(imageName)
      if(trueDuration*1.5==duration){
        return 'dot'
      } else if (trueDuration * 1.5 == duration){
        return 'ddot'
      }
      return 'none'
    },

    //转换name和duration
    toName: function (duration, threeDuration, normalNotes) {
      var that = this
      duration = parseFloat(duration)
      if (typeof (threeDuration) != 'undefined' && typeof (normalNotes) != 'undefined') {
        duration = threeDuration / normalNotes
      }
      var divisions = parseInt(that.data.answerPart.attributes.divisions)
      ////console.log(Math.pow(2, Math.ceil(Math.log(divisions / duration) / Math.log(2) + 2)))
      return Math.pow(2, Math.ceil(Math.log(divisions / duration) / Math.log(2) + 2))
    },

    toDuration: function (name) {
      name = parseInt(name)
      return parseInt(this.data.answerPart.attributes.divisions) * 4 / name
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
    //***********判断是否换行 */
    checkHang(measure, number, nowMeasureNotes, nowAnswer) { //这里的x是指要放的音符的前一个音符的x
      var that = this

      
      if (number > 0) {
        var x = nowMeasureNotes.note[number - 1].x
        if (x > 309 * rpx) { //***********换行，改hang
          var newhang = nowMeasureNotes.note[number - 1].hang + 1

          return [30 * rpx, newhang]

        } else {
          return [x + gap, nowMeasureNotes.note[number - 1].hang]
        }

      } else if (measure > 0) {
        var newhang = nowAnswer.measure[measure - 1].note[nowAnswer.measure[measure - 1].note.length - 1].hang /////每小节的第一个
        //console.log('measure' + measure)
        var x = nowAnswer.measure[measure - 1].lineX
        if (x > 309 * rpx) { //***********换行，改hang
          newhang = nowAnswer.measure[measure - 1].note[nowAnswer.measure[measure - 1].note.length - 1].hang + 1

          return [30 * rpx, newhang]
        } else {
          if (x == 30 * rpx) { //小节线位置为30时也要换行
            newhang = nowAnswer.measure[measure - 1].note[nowAnswer.measure[measure - 1].note.length - 1].hang + 1
            //var setHang = "answerPart.measure[" + measure + "].note[" + number + "].hang"
            // that.setData({
            //   [setHang]: newhang,
            // })
          }
          //console.log('numberset' + x + gap)
          return [x + gap, newhang]
        }
      } else if (measure == 0) {

        return [startx, 0]
      }
    },

    //***********刷新所有小节线位置,待修改 */
    flushLineX(measure,lastmeasure) {
      var that = this
      // var i = 0
      // for (i = 0; i < that.data.answerPart.measure.length; i++) {
      var lastNumber = measure.note.length - 1
        var lineX
        if (lastNumber == -1 &&typeof(lastmeasure)=='undefined') {
          lineX = 0
        } else if (lastNumber != -1) {
          lineX = measure.note[lastNumber].x + gap
          if (measure.note[lastNumber].x > 309 * rpx) {
            lineX = 30 * rpx
          }
        } else {
          lineX = lastmeasure.lineX + 5 * rpx
        }
        console.log('setline' + lineX)
        return lineX
      // }


    },
  }
})
