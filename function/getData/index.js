// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = event.url;
  let method = event.method;
  console.log(event);
  return await rp({
      url: url,
      method: method,
      qs: event.qs,
      body: event.body,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    })
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      console.log(err)
      return 'fail'
    });
}