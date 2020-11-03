// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
let fs=require('fs');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = event.url;
  let method="POST";
  console.log(event)
  return await rp({
    url: url,
    method:'POST',
    formData:{
      // Like <input type="file" name="file">
      name:"file",
      file: {
          value: fs.createReadStream(event.body.fileURL),
           options:{
              filename:event.body.fileName,
              contentType: 'audio/mp3'
          }
        }
    },
    headers: {
       'content-type': 'multipart/form-data' // Is set automatically
    },
    json:true
  })
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      console.error(err)
      return err
    });
}