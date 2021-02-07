const DB = require('../db/db')
const request = require('../utils/request')
const axios = require('axios')

// 觅元素
async function miyuansu(reqData) {
  /**
   * {
   *    d:qllwltgpfy, // 素材编号
   *    a:down || bdown || downPsd || bdownPsd // 下载的类型 素材 png psd 背景 png psd
   * }
   * {
   *  has_aq_show: "1"
      status: 0
      url: "http://download.51yuansu.com/backgd/00/57/08/5645926eda934f008a6bef9015f97fb2.zip?auth_key=1612311901-0-0-7ea0b026824875e5863cab9c3c0b32cd"
   * }
   */
  const { d, a } = reqData
  const url = `http://www.51yuansu.com/index.php?m=ajax&a=${a}&id=${d}`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'miyuansu' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  // 请求播放链接
  return new Promise(async (resolve, reject) => {
    try {
      // 请求png素材
      const res = await request({
        url: url,
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      console.log(res)
      resolve(res.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 图克巴巴
async function tukebaba(reqData) {
  const { d } = reqData // 获取素材id
  const t = new Date().getTime()
  const url = `http://www.tuke88.com/index/down?callback=jQuery17103538063143495809_1611489882849&pid=${d}&_=${t}`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'tukebaba' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        headers: {
          Cookie: cookie
        }
      })
      console.log(res)
      const downurl = JSON.parse(res.match(/{(\S*)}/)[0]).downurl
      console.log(downurl);
      resolve(downurl)
    } catch (error) {
      reject(error)
    }
  })
}
// 觅知网
async function mizhi(reqData) {
  /**
   * {
   * d:id,
   * a:plate_id,
   * t:2
   * }
   */
  const { d, a } = reqData // 获取素材id
  const url = `https://download.51miz.com/?m=download&a=download&id=${d}&plate_id=${a.a}&format=${a.f}`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'mizhi' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    console.log('url', url);
    try {
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie,
        }
      })
      // https://down.51miz.com/ 代理转发
      // http://127.0.0.1/element/00/89/58/41/51miz-E895841-B39F85F7.png
      downurl = res.replace('https://down.51miz.com', 'http://127.0.0.1:3001')
      console.log(downurl)
      resolve(downurl)
    } catch (error) {
      reject(error)
    }
  })
}
// 千图
async function qiantu(reqData) {
  // 搞定第三方
  const res = gaoding(reqData.urlLink)
  return res
}
// 千库
function qianku() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

    }
  })
}
// 包图
async function baotu(reqData) {
  const { d } = reqData
  const url = `https://ibaotu.com/?m=downloadopen&a=open&id=${d}&down_type=1&&attachment_id=`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'baotu' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie,
        }
      })
      console.log(res)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 摄图
async function shetu(reqData) {
  // 先获取素材类型
  const { urlLink = null, p = null, b = null, t = null, f = null, } = reqData
  if(!urlLink) return
  let repData = ''
  // 如果有值 说明是获取素材类别
  if (urlLink.includes('699pic')) {
    const source = await request({ url: urlLink })
    const type = source.match(/data-type="(\S*)"><span>/)[0]
    if (type.includes('photo')) { // 照片
      repData = 1
    } else if (type.includes('originality')) {// 创意背景
      repData = 2
    } else if (type.includes('gif')) { // gif图
      repData = 3
    } else if (type.includes('chahua')) { // 插画
      repData = 4
    } else if (type.includes('ppt')) {// ppt
      repData = 5
    } else if (type.includes('muban')) {// 设计模板
      repData = 6
    } else if (type.includes('yuansu')) { // 免扣元素
      repData = 7
    } else if (type.includes('video')) {
      repData = 8
    } else if (type.includes('music')) {
      repData = 9
    } else if (type.includes('peitu')) {
      repData = 10
    }
    return Promise.resolve(repData)
  }
  // 没有值 说明是获取下载链接的
  /**
   * p-->pid
   * b-->byso
   * b-->ycate
   * f-->fileType  1-->  download/getDownloadUrl  2-->  newdownload/design  3-->newdownload/yuansu  4-->download/video?id=
   *               5 --> music/download  6--> newdownload/phoneMap
  */
  let reqShetuData = ''
  if (urlLink.includes('video')) {
    reqShetuData = `fileType=${f}&page_num=1&download_from=186&video_rate=2`
  } else if (urlLink.includes('music')) {
    reqShetuData = `music_id=${p}&type=1&sid=0&page=0`
  } else {
    reqShetuData = `pid=${p}&byso=0&bycat=${t}&filetype=${f}`
  }
  // 根据type的参数 拼接对应的url
  let url = `https://699pic.com/${urlLink}`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'shetu' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    console.log('提交参数:', reqShetuData);
    console.log("提交地址", url);
    try {
      const res = await request({
        url: url,
        method: 'POST',
        headers: {
          Cookie:cookie,
          'x-requested-with': 'XMLHttpRequest'
        },
        data:reqShetuData
      })
      console.log(res);
      if(res.hasOwnProperty('url')){
        resolve(res.url)
      }else if(res.hasOwnProperty('src')){
        resolve(res.src)
      }else{
        resolve()
      }
    } catch (error) {
      reject(error)
    }
  })
}
// 昵图
async function nitu(reqData) {
  const { a, d } = reqData
  const url = 'http://down.nipic.com/ajax/download_go'
  // 查找cookie
  const result = await DB.find('cookie', { name: 'nitu' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        method: 'POST',
        data: `id=${d}&kid=${a}`,
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      console.log(res)
      resolve(res.data.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 90设计
async function sheji90(reqData) {
  const { d } = reqData
  const url = 'http://90sheji.com/index.php?m=inspireAjax&a=getDownloadLink'
  // 查找cookie
  const result = await DB.find('cookie', { name: 'sheji90' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        method: 'POST',
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': `http://90sheji.com/?m=Inspire&a=download&id=${d}`
        },
        data: `id=${d}`
      })
      console.log(res)
      resolve(res.link)
    } catch (error) {
      reject(error)
    }
  })
}
// 六图
function liutu() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

    }
  })
}
// 熊猫
async function xiongmao(reqData) {
  const { d } = reqData
  const t = new Date().getTime()
  const url = `https://www.tukuppt.com/index/down?callback=jQuery171019846911166143233_1612348431741&pid=${d}&code=&ispng=0&_=${t}`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'xiongmao' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      const downurl = JSON.parse(res.match(/{(\S*)}/)[0]).downurl
      resolve(downurl)
    } catch (error) {

    }
  })
}
// 图精灵
async function tujingling(reqData) {
  const {d, a} = reqData
  return new Promise(async (resolve, reject) => {
     // 查找cookie
    const result = await DB.find('cookie', { name: 'tujingling' })
    console.log('开始查找cookie');
    const cookie = result[0].cookie
    if (!cookie) return
    try {
      const res = await request({
        url:`http://616pic.com/api/download?id=${d}&type=${a}&code=`,
        headers:{
          Cookie:cookie
        }
      })
      console.log(res)
      resolve(res.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 我图
async function wotuvip(reqData) {
  const { d } = reqData
  const url = `https://downloads.ooopic.com/down_newfreevip.php?action=down&id=${d}&token=&_Track=657370b92f802e1f655d0c780db69fca&detailv=`
  // 查找cookie
  const result = await DB.find('cookie', { name: 'wotu' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie
        }
      })
      console.log(res)
      resolve(res)
    } catch (error) {

    }
  })
}
// 第三方解析程序 ---搞定素材
async function gaoding(url) {
  // 查找cookie
  const result = await DB.find('cookie', { name: 'gaoding' })
  console.log('开始查找cookie');
  const cookie = result[0].cookie
  if (!cookie) return
  return new Promise(async (resolve, reject)=>{
    const res = await request({
      url: 'https://gaodings.com/index/index/parse.html',
      method: 'POST',
      data: `link=${url}&code=`,
      headers: {
        Cookie: cookie
      }
    })
    console.log(res)
    resolve(res.urlList['立即下载'])
  })
}
module.exports = {
  miyuansu,
  tukebaba,
  wotuvip,
  tujingling,
  xiongmao,
  liutu,
  sheji90,
  nitu,
  shetu,
  baotu,
  qianku,
  qiantu,
  mizhi
}