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
// 千图
function qiantu() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

    }
  })
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
  return new Promise(async(resolve, reject) => {
    try {
      const res = await axios({
        url:url,
        headers:{
          Cookie:cookie,
          
        }
      })
      console.log(res.headers);
      resolve(res.headers.Location)
    } catch (error) {
      reject(error)
    }
  })
}
// 摄图
function shetu() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

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
        data:`id=${d}&kid=${a}`,
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
          Cookie:cookie,
          'X-Requested-With': 'XMLHttpRequest',
          'Referer':`http://90sheji.com/?m=Inspire&a=download&id=${d}`
        },
        data:`id=${d}`
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
  return new Promise(async(resolve, reject) => {
    try {
      const res = await request({
        url:url,
        headers:{
          Cookie:cookie,
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
function tujingling() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

    }
  })
}
// 我图
function wotuvip() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

    }
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
  qiantu
}