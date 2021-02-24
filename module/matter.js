const DB = require('../db/db')
const request = require('../utils/request')
const axios = require('axios')
const { ObjectId } = require('mongodb')
const { redis } = require('../utils/dbHelper')

// 觅元素
async function miyuansu(reqData, cookie) {
  const { d, a } = reqData
  const url = `http://www.51yuansu.com/index.php?m=ajax&a=${a}&id=${d}`
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
      if(!res.url) resolve({})
      resolve(res.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 图克巴巴
async function tukebaba(reqData, cookie) {
  const { d } = reqData // 获取素材id
  const t = new Date().getTime()
  const url = `http://www.tuke88.com/index/down?callback=jQuery17103538063143495809_1611489882849&pid=${d}&_=${t}`
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        headers: {
          Cookie: cookie
        }
      })
      if(!res) resolve({})
      const downurl = JSON.parse(res.match(/{(\S*)}/)[0]).downurl
      resolve(downurl)
    } catch (error) {
      reject(error)
    }
  })
}
// 觅知网
async function mizhi(reqData, cookie) {
  const { d, a } = reqData // 获取素材id
  const url = `https://download.51miz.com/?m=download&a=download&id=${d}&plate_id=${a.a}&format=${a.f}`
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie,
        }
      })
      console.log(res);
      if(!res) resolve({})
      downurl = res.replace('https://down.51miz.com', 'http://clumsybird.work:3001')
      resolve(downurl)
    } catch (error) {
      reject(error)
    }
  })
}
// 千图
async function qiantu(reqData, cookie) {
  // 搞定第三方
  const res = gaoding(reqData, cookie)
  return res
}
// 千库
async function qianku(reqData, cookie) {
  const res = gaoding(reqData, cookie)
  return res
}
// 包图
async function baotu(reqData, cookie) {
  const { d } = reqData
  const url = `https://ibaotu.com/?m=downloadopen&a=open&id=${d}&down_type=1&&attachment_id=`
  return new Promise(async (resolve, reject) => {
    try {
      const ip = '183.199.244.80'
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie,
          'x-forwarded-for': ip,
          'Proxy-Client-IP': ip,
          'WL-Proxy-Client-IP': ip
        }
      })
      if(!res) resolve()
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 摄图
async function shetu(reqData, cookie) {
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
    } else if (type.includes('vector')) {// 设计模板
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
  return new Promise(async (resolve, reject) => {
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
async function nitu(ctx) {
  const { a, d } = ctx.request.body
  const url = 'http://down.nipic.com/ajax/download_go'
  // 查找cookie
  const result = await DB.find('cookie', { name: 'nitu' })
  const cookie = result[0].cookie[0]
  if (!cookie) return
  return new Promise(async (resolve, reject) => {
    try {
      // 先去获取这个素材需要多少昵图分
      const source = await request({
        url: `http://down.nipic.com/download?id=${d}`,
        headers: {
          Cookie: cookie,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'  
        }      
      })
      // 消耗多少分
      const nitufen = source.match(/<span><b class="font-tahoma red1"> (\S*) <\/b>/)[1]
      // 取出用户有多少分
      const userId = ctx.cookies.get('userId')
      const userInfo = await DB.find('userInfo', {"_id":ObjectId(userId)})
      const userNitufen = userInfo[0].webInfo.nitufen
      if (userNitufen < nitufen){
        resolve('昵图分不足，快去获取赞助版呐')
        return
      }
      const res = await request({
        url: url,
        method: 'POST',
        data: `id=${d}&kid=${a}`,
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      if(!res.data.url)  resolve('服务器错误')
      // 将昵图分减去相应
      await DB.update("userInfo", {"_id":ObjectId(userId)},{ "webInfo.nitufen":userNitufen - nitufen})
      resolve(res.data.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 90设计
async function sheji90(reqData, cookie) {
  const { d } = reqData
  const url = 'http://90sheji.com/index.php?m=inspireAjax&a=getDownloadLink'
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
      if(!res.link) resolve({})
      resolve(res.link)
    } catch (error) {
      reject(error)
    }
  })
}
// 六图
async function liutu(reqData, cookie) {
  const { urlLink } = reqData
  const d = urlLink.match(/pic_(\S*).html/)[1]
  console.log(d);
  return new Promise(async(resolve, reject) => {
    try {
      const res = await request({
        url:`https://www.16pic.com/down/down?id=${d}&from=1`,
        headers: {
          Cookie:cookie,
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      if(!res.res_data) resolve({})
      resolve(res.res_data)
    } catch (error) {
      reject(error)
    }
  })
}
// 熊猫
async function xiongmao(reqData, cookie) {
  const { d } = reqData
  const t = new Date().getTime()
  const url = `https://www.tukuppt.com/index/down?callback=jQuery171019846911166143233_1612348431741&pid=${d}&code=&ispng=0&_=${t}`
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
async function tujingling(reqData, cookie) {
  const {d, a} = reqData
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url:`http://616pic.com/api/download?id=${d}&type=${a}&code=`,
        headers:{
          Cookie:cookie
        }
      })
      resolve(res.url)
    } catch (error) {
      reject(error)
    }
  })
}
// 我图
async function wotu(reqData, cookie) {
  const { d } = reqData
  const url = `https://downloads.ooopic.com/down_newfreevip.php?action=down&id=${d}&token=&_Track=657370b92f802e1f655d0c780db69fca&detailv=`
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: url,
        maxRedirects: 0,
        headers: {
          Cookie: cookie
        }
      })
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 众图网
async function zhongtu(reqData, cookie) {
  const { d } = reqData
  return new Promise(async (resolve, reject)=>{
    try {
      const res = await request({
        url: 'https://www.ztupic.com/api/goods/DownloadByMember',
        method: 'post',
        headers:{
          Cookie:cookie
        },
        data: 'id='+d
      })
      if(!res.data) resolve({})
      const downUrl = res.data.data.url.replace('https://imgpp.ztupic.com', 'http://clumsybird.work:3001')
      resolve(downUrl)
    } catch (error) {
      reject(error)
    }
  })
}
// 第三方解析程序 ---搞定素材
async function gaoding(reqData, cookie) {
  const { urlLink, code = '' } = reqData
  console.log(urlLink, code, cookie);
  return new Promise(async (resolve, reject)=>{
    try {
      const res = await request({
        url: 'https://gaodings.com/index/index/parse.html',
        method: 'POST',
        data: `link=${urlLink}&code=${code}`,
        headers: {
          Cookie: cookie
        }
      })
      console.log(res)
      resolve(res.urlList)
    } catch (error) {
      reject(error)
    }
  })
}
// 第三方解析程序 蚂蚁素材
async function mayi(url, cookie) {
  return new Promise((resolve,reject)=>{
    const res = request({
      url: 'http://www.5ici.cn/index/get_down',
      method: 'POST',
      headers: {
        Cookie: 'PHPSESSID=orht8968t2t50peja5vkctjbg5'
      }
    })
    if(!res.url) resolve({})
    resolve(res.url)
  })
}

module.exports = {
  miyuansu,
  tukebaba,
  wotu,
  tujingling,
  xiongmao,
  liutu,
  sheji90,
  nitu,
  shetu,
  baotu,
  qianku,
  qiantu,
  mizhi,
  zhongtu
}