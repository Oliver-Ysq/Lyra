// pages/chooseIdentity/chooseIdentity.js
Page({
  data: {
  },
  handleStudentTap() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  handleTeacherTap(){
    console.log('教师端')
  }
})