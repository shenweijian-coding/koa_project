const DB = require('../db/db')
const request = require('../utils/request')

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
function baotu() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

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
  return new Promise((resolve, reject) => {
    try {
      const res = await request({
        url: url,
        method: 'POST',
        data: {id: d, kid: a},
        headers: {
          Cookie: cookie,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      console.log(res)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 90设计
function sheji90() {
  return new Promise((resolve, reject) => {
    try {

    } catch (error) {

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
function xiongmao() {
  return new Promise((resolve, reject) => {
    try {

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