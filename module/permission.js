const DB = require('../db/db')
const dayjs = require('dayjs')
// 验证会员类型
async function validateVideo(ctx) {

}
// 验证会员类型
async function validateMember(ctx, type) {
  return new Promise(async (resolve,reject)=>{
    try {
      // 获取openId
      let openID = ctx.cookies.get('openID')
      // 获取网站类型
      const { urlType } = ctx.request.body
      // 查询解析用户的信息
      const userInfo = await DB.find('userInfo', { 'wxInfo.openId': openID })
      const { memberType, dueTime, videoTime } = userInfo[0].webInfo
      // 网站类型
      const freeWebList = [9, 10, 17, 18, 20, 21, 22, 23] // 免费网站
      const tollWebList = [8,11, 12, 13, 14, 15, 19, 24, 25] // 收费网站
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
      console.log('开始判断该用户会员');
      if(type === 1){ // 视频
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
          console.log('该用户已过期');
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
        return  resolve({ sign:1002 })
      }else if(memberType === 1 && (tollWebList.includes(urlType) || freeWebList.includes(urlType))) { // 解析用户为赞助版 解析的是收费
        // 校验日期是否过期
        if(dayjs().format('YYYY-MM-DD') >= dueTime) { // 过期了
          console.log('该用户已过期');
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
async function memberSubNum(ctx, webName) {
  return new Promise(async(resolve, reject)=>{
    try {
      // 获取openid
      let openID = ctx.cookies.get('openID')
      const userInfo = await DB.find('userInfo', { 'wxInfo.openId': openID })
      const downNum = userInfo[0].webInfo[webName] - 1
      const property = "webInfo." + webName
      await DB.update('userInfo', {"wxInfo.openId": openID}, { [property]: downNum })
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