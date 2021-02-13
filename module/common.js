const { ObjectId } = require('mongodb')
const DB = require('../db/db')
// 获取首页信息
async function getHomeInfo() {
  return new Promise(async(resolve, reject)=>{
    try {
      const homeInfo = await DB.find('otherInfo', { '_id':ObjectId('602679a622072f47504aca4c')})
      const dialogInfo = homeInfo[0].homeInfo.dialogInfo
      resolve(dialogInfo)
    } catch (error) {
      reject(error)
    }
  })
}
// 第三方解析开关
async function otherDownOne() {
  return new Promise((resolve, reject)=>{
    
  })
}
module.exports = {
  getHomeInfo
}