const request = require('../utils/request')
const DB = require('../db/db')
const { default: axios } = require('axios')
// 视达网
async function shida(reqData) {
  // 先查看url是否携带vid 没有则查找 有则直接用
  // Series
  // VideoInfo
  const { urlLink} = reqData
  let c = ''
  if(urlLink.indexOf('Series') !== -1) {
    c = 'Series'
  } else {
    c = 'videoInfo'
  }
  const shidaSource =  await request({url:urlLink})
  let vid = shidaSource.match(/Params.vid = '(\S*)';/)[1]
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
        url:`https://shida66.com/?c=${c}&a=getNowPlayUrl`,
        method: 'POST',
        data: d,
        headers:{
          'Cookie':Cookie
        }
      })
      if(!res.url || res.url === '') resolve({})
      console.log(res)
      saveShidaVideoUrl({ d:vid, url:res.url })
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
async function huke(reqData) {
  // 查找视达cookie
  const result = await DB.find('cookie',{ name:'huke' })
  console.log('开始查找cookie')
  const Cookie = result[0].cookie
  if(!Cookie) return
  // 获取视频链接 必须是手机链接
  let { urlLink } = reqData
  urlLink = urlLink.replace('huke88.com', 'm.huke88.com')
  const hukeId = urlLink.match(/course\/(\S*)\.html/)[1]
  console.log(urlLink);
  const hukeSource =  await request({
    url:urlLink,
    headers: {
      Cookie: Cookie
    }
  })
  let _csrfFrontend = hukeSource.match(/csrf-token" content="(\S*)"/)[1]
  console.log(hukeId, _csrfFrontend);
  const url = `https://m.huke88.com/video/video-url`

  return new Promise(async(resolve, reject)=>{
    try {
      const res = await request({
        url: url,
        method: 'POST',
        headers: {
          Cookie: Cookie,
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: `id=${hukeId}&_csrf-frontend=${_csrfFrontend}`
        // data: 'id=67251&_csrf-frontend=HtUJbRqTYfV7LorYYVyuPLhPctnqT8ODZhT5tXQYWThPr0ccKukgkExvuI8CC8d1jgFClJs49NQtLc7NQH86Uw%3D%3D'
      })
      console.log(res)
      res.data.sign = _csrfFrontend
      res.data.d = hukeId
      // res.data.isShowDown = isShowDown
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
// 视频素材下载 视达
async function videoFileDown(reqData){
  const { vid, sid } = reqData
  return new Promise(async (resolve,reject)=>{
    // 查找视达cookie
    const result = await DB.find('cookie',{ name:'shida' })
    console.log('开始查找cookie')
    const Cookie = result[0].cookie
    if(!Cookie) return
    const res = await request({
      url:`https://shida66.com/?c=VideoInfo&a=hasPlayPower&vid=${vid}&sid=${sid}&cid=508&fake=2`,
      headers:{
        Cookie:Cookie,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    console.log(res);
    if(!res.source) resolve({})
    resolve(res.source)
  })
}
// 视频素材下载 虎课网
async function fileDownHuke(reqData) {
  return new Promise(async(resolve,reject)=>{
    try {
    // 查找视达cookie
    const result = await DB.find('cookie',{ name:'huke' })
    console.log('开始查找cookie')
    const Cookie = result[0].cookie
    if(!Cookie) return
    const { d , type, urlLink } = reqData
    const hukeSource =  await request({
      url:urlLink,
      headers: {
        Cookie: Cookie
      }
    })
    let sign = hukeSource.match(/csrf-token" content="(\S*)"/)[1]
    console.log(sign);
    const res = await request({
      url:'https://huke88.com/download/ajax-download-source-case',
      method:'POST',
      data: `id=66688&type=${type}&studySourceId=1&confirm=0&_csrf-frontend=${sign}`,
      headers: {
        Cookie: Cookie
      }
    })
    console.log(res);
    if(!res) resolve({})
    resolve(res.download_url)
    } catch (error) {
      reject(error)
    }
  })
}
// 存视达网播放视频练级
async function saveShidaVideoUrl(saveData) {
  const { d, url } = saveData
// return new Promise(async(resolve,reject)=>{
    // 查找库中是否有该url
    // 有 返回
    // 没有 存入库中
    const curVideoUrl = await DB.find('shidaPlayUrl', { 'd': d })
    if(curVideoUrl.length) return
    await DB.insert('shidaPlayUrl', { 'd':d, 'url':url })
  // })
}
module.exports={
  shida,
  huke,
  videoFileDown,
  fileDownHuke
}