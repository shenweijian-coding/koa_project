const request = require('../utils/request')
const DB = require('../db/db')
const { default: axios } = require('axios')
// 视达网
async function shida(reqData) {
  // 先查看url是否携带vid 没有则查找 有则直接用
  const { urlLink } = reqData
  const shidaSource =  await request({url:urlLink})
  let vid = shidaSource.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,'')
  let isShowDown = /素材\+源文件下载/.test(shidaSource)
  let d = `vid=${vid}`
  // 查找视达cookie
  const result = await DB.find('cookie',{ name:'shida' })
  console.log('开始查找cookie')
  const Cookie = result[0].cookie
  if(!Cookie) return
  // 万事俱备  请求播放链接
  return new Promise(async (resolve,reject)=>{
    try {
      const res = await request({
        url:'https://shida66.com/?c=VideoInfo&a=getNowPlayUrl',
        method: 'POST',
        data: d,
        headers:{
          'Cookie':Cookie
        }
      })
      // 携带上vid
      res.vid = vid
      res.isShowDown = isShowDown
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 虎课网
async function huke() {
 
}
module.exports={
  shida,
  huke
}