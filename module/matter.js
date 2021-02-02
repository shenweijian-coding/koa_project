// const request = require('../util/request')
const request = require('../utils/request')

// 觅元素
function miyuansu(){
  return new Promise(async (resolve, reject)=>{
    try {
      // 对请求参数进行psd 还是png
      // has_aq_show: "1"
      // status: 0
      // url: "http://down.51yuansu.com/pic3/04/01/92/f76f155fe3fb37b9dafc897818b984c8.png?auth_key=1611491583-0-0-a357844d857c1ef83f6d9eb4a370a365"
      const type = 'psd'
      const id = 'qllwltgpfy'
      const url = `http://www.51yuansu.com/index.php?m=ajax&a=down&id=${id}`
      const cookie = ''
      const res = await request({
        url: url,
        headers:{
          Cookie:cookie
        }
      })
    } catch (error) {
      
    }
  })
}
// 图克巴巴
function tukebaba(){
  return new Promise(async (resolve, reject)=>{
    try {
      const pid = 'k9g54ykgv1'
      const timestamp = new Date().getTime()
      const url = `http://www.tuke88.com/index/down?callback=jQuery17103538063143495809_1611489882849&pid=${pid}&_=${timestamp}`
      // {
      //   "status": 1,
      //   "downurl": "http://file03.tuke88.com/202101242007/56a525c0a1fae7892a5a39fc3969b971/zip/10/00/04/5/5c51515eaf10b.zip"
      // }
      const cookie = ''
      const res = await request({
        url: url,
        headers:{
          Cookie:cookie
        }
      })
      resolve(res)
    } catch (error) {
      
    }
  })
}
// 千图
function qiantu(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 千库
function qianku(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 包图
function baotu(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 摄图
function shetu(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 昵图
function nitu(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 90设计
function sheji90(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 六图
function liutu(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 熊猫
function xiongmao(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 图精灵
function tujingling(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}
// 我图
function wotuvip(){
  return new Promise((resolve, reject)=>{
    try {
     
    } catch (error) {
      
    }
  })
}

module.exports={
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