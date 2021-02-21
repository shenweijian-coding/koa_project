const DB = require('../db/db')
const { cookieConfig } = require('../config/config');
const { redis } = require('../utils/dbHelper')
const  crypto = require('crypto');
const { ObjectId } = require('mongodb');
// function isAttention(ctx){
//   return new Promise( async(resolve, reject)=>{
//     // 获取cookie内容
//     let eventKey = ctx.cookies.get('eventKey')
//     let openID = ctx.cookies.get('openID')
//     // 通过eventKey 获取存在redis的 openID
//     const redisOpenId = await redis.hget(eventKey, 'openID')
//     // 比较前端返回的和  后台获取的是否相等
//     if(openID === redisOpenId) {
//       //登录状态
//       resolve(true)
//     }else{
//       // 未登录状态
//       resolve(false)
//     }
//   })
// }
// 验证是否登录
function isAttention(ctx){
    return new Promise( async(resolve, reject)=>{
      // 获取cookie内容
      let userId = ctx.cookies.get('userId')
      let userName = ctx.cookies.get('userName')
      const userInfo = await DB.find('userInfo', { '_id':ObjectId(userId) })
      if(userInfo.length !== 1) resolve(false)
      if(userInfo[0].userName !== userName) resolve(false)
      resolve(true)
    })
  }
// 验证是否允许登录
async function login(ctx){
  return new Promise(async (resolve,reject)=>{
    try {
      console.log(ctx.request.body);
      const { userName, userPwd } = ctx.request.body
      if(!userName || !userPwd) resolve('账号密码不允许为空')
      // 都填写了  开始验证
      const userInfo  = await DB.find('userInfo', {'userName':userName})
      if(userInfo.length !== 1) resolve('暂无该账号信息')
      if(userInfo[0].userPwd !== crypto.createHash('md5').update(userPwd).digest("hex")) resolve('密码错误')
      // 账号通过 开始设置cookie
      ctx.cookies.set('userId',userInfo[0]._id, cookieConfig)
      ctx.cookies.set('userName',userInfo[0].userName, cookieConfig)
      resolve('登录成功')
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = { isAttention,login }