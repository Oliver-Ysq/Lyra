// pages/practice/practice.js
const app = getApp()
const FileSystemManager = wx.getFileSystemManager()

Page({

  data: {
    singList: ['单声部', '双声部', '视谱即唱', '多项音乐语言阅读'],
    hearList: ['音阶', '音组', '音程', '和弦', '节奏', '音程连接', '和弦连接', '单声部旋律', '双声部旋律']
  },
  sing(e) {
    const id = e.target.dataset.id
    wx.navigateTo({
      url: "/pages/practice/sing_choice/sing_choice?id=" + id
    })
  },
  hear(e) {
    const id = e.target.dataset.id
    wx.navigateTo({
      url: "/pages/practice/hear_choice/hear_choice?id=" + id
    })
  },
  doHearSelectPractice() {
    wx.navigateTo({
      url: './hearSelectPractise/hearSelectPractise',
    })
  },

  onLoad() {


    FileSystemManager.readdir({
      dirPath: wx.env.USER_DATA_PATH,
      success(res) {
        console.log('输出文件')
        console.log(res)
        var i = 0
        for (i = 0; i < res.files.length; i++) {
          var file = res.files[i]
          if (file == 'standardAudio' || file == 'miniprogramLog') {
            continue;
          }
          FileSystemManager.unlink({
            filePath: `${wx.env.USER_DATA_PATH}/${file}`,
            success(res) {
              console.log(res)
            }
          })
        }
      }
    })
  }
})