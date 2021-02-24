const DB = require('../db/db')
const dayjs = require('dayjs')
const { ObjectId } = require('mongodb')
// 验证会员类型
async function validateMember(ctx, type, tag = 'web') {
  return new Promise(async (resolve,reject)=>{
    try {
      // 获取openId
      let userId
      let urlType
      let userInfo
      if(tag === 'web'){
        userId = ctx.cookies.get('userId')
        urlType = ctx.request.body.urlType
        userInfo = await DB.find('userInfo', { '_id':ObjectId(userId) })
      }else{
        userId = ctx
        urlType = type
        userInfo = await DB.find('userInfo', { 'userId': userId })
      }
      if (userInfo.length !== 1) {
        resolve("您还未注册账号,请发送“我要账号”至本公众号,登录网址 http://clumsybird.work")
      }
      // 获取网站类型
      // 查询解析用户的信息
      const { memberType, dueTime, videoTime, allDownNum } = userInfo[0].webInfo
      // 网站类型
      const freeWebList = [9, 10, 18, 20, 21, 22, 23] // 免费网站
      const tollWebList = [8, 11, 12, 13, 14, 15, 17, 19, 24, 25] // 收费网站
      const totalWeb = new Map([
        [8,'hukeNum'],
        [9,'shidaNum'],
        [10,'shidaNum'],
        [11,'hukeNum'],
        [12,'qiantuNum'],
        [13,'qiankuNum'],
        [14,'baotuNum'],
        [15,'shetuNum'],
        [17,'sheji90Num'],
        [18,'liutuNum'],
        [19,'xiongmaoNum'],
        [20,'tukeNum'],
        [21,'tujiinglingNum'],
        [22,'wotuNum'],
        [23,'miyuansuNum'],
        [24,'mizhiNum'],
        [25,'zhongtuNum'],
      ])
      if(type === 1 || type === 11 || type === 12){ // 视频
        if(freeWebList.includes(urlType)){
          const cur = totalWeb.get(urlType)
          if(userInfo[0].webInfo[cur] <= 0) {
            resolve({ sign:1004 })
          }else{
            resolve({ sign:1005, webName:cur })
          }
        }else if(tollWebList.includes(urlType)){
        // 校验日期是否过期
        if(dayjs().format('YYYY-MM-DD') >= videoTime) { // 过期了
          resolve ({ sign: 1003 })
        }else{
          // 判断是否达到上限
          const cur = totalWeb.get(urlType)
          if(userInfo[0].webInfo[cur] <= 0){
            resolve({ sign:1004 })
          }else{
            resolve({ sign:1005, webName:cur })
          }
        }
        }
      }else{
      // 解析用户是普通版本 解析的是免费
      if (memberType === 0 && freeWebList.includes(urlType)) {
        const cur = totalWeb.get(urlType)
        if(userInfo[0].webInfo[cur] <= 0) {
          resolve({ sign:1004 })
        }else{
          resolve({ sign:1005, webName:cur })
        }
      }else if(memberType === 0 && tollWebList.includes(urlType)){ // 解析用户为普通版 解析的是收费
        if(allDownNum > 0) {
          resolve({ sign:1005 })
        }else{
          resolve({ sign:1002 })
        }
      }else if(memberType === 1 && (tollWebList.includes(urlType) || freeWebList.includes(urlType))) { // 解析用户为赞助版 解析的是收费
        // 校验日期是否过期
        if(dayjs().format('YYYY-MM-DD') >= dueTime) { // 过期了
          resolve ({ sign: 1003 })
        }else{
          // 判断是否达到上限
          const cur = totalWeb.get(urlType)
          if(userInfo[0].webInfo[cur] <= 0){
            resolve({ sign:1004 })
          }else{
            resolve({ sign:1005, webName:cur })
          }
        }
      }
      }
    } catch (error) {
      reject(error)
    }
  })
}
// 相应次数减去
async function memberSubNum(ctx, webName, tag = 'web') {
  return new Promise(async(resolve, reject)=>{
    try {
      // 获取userId
      let userId
      let userInfo
      if(tag === 'web'){
        userId = ctx.cookies.get('userId')
        userInfo = await DB.find('userInfo', { '_id':ObjectId(userId) })
      }else {
        userId = ctx
        userInfo = await DB.find('userInfo', { 'userId':userId })
      }
      console.log('开始减次数');
      const allDownNum = userInfo[0].webInfo.allDownNum
      if( allDownNum > 0 ) {
        if(tag === 'web') {
          await DB.update('userInfo',  {'_id':ObjectId(userId)}, { 'webInfo.allDownNum': allDownNum -1 })
        }else{
          await DB.update('userInfo', {'userId':userId}, { 'webInfo.allDownNum': allDownNum -1 })
        }
        return
      }
      const downNum = userInfo[0].webInfo[webName] - 1
      const property = "webInfo." + webName
      if(tag === 'web') {
        await DB.update('userInfo', {'_id':ObjectId(userId)}, { [property]: downNum })
      }else{
        await DB.update('userInfo', {'userId':userId}, { [property]: downNum }) 
      }
      resolve({})
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  validateMember,
  memberSubNum
}