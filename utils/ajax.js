// const baseUrl = "http://103.46.128.45:43304";
// /*
//  * 用promise封装wx.request
//  * 传入具体请求的接口url，接口请求方式method，请求数据data
//  */
// const ajax = ({ url: url, method: method, data: data }) =>{
//   new Promise((resolve, reject) => {
//     wx.request({
//       url: `${baseUrl}${url}`,
//       // 若不传method参数，默认使用post方法
//       method: method ? method : "POST",
//       data: data,
//       header: {
//         "content-type": "application/x-www-form-urlencoded"
//       },
//       // 请求成功使用resolve函数
//       success: res => resolve(res),
//       // 请求失败使用reject函数
//       error: err => reject(err)
//     });
//   });
// }


// module.exports = {
//   ajax:ajax
// }
