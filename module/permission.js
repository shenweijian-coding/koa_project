const DB = require('../db/db')
const dayjs = require('dayjs')
// 验证会员类型
async function validateMember(ctx, type) {
  return new Promise(async (resolve,reject)=>{
      // 获取openId
  let openID = ctx.cookies.get('openID')
  const userInfo = await DB.find('userInfo', { 'wxInfo.openId': openID })
  // console.log('用户信息', userInfo);
  const { memberType, freeDownNum, tollDownNum, dueTime } = userInfo[0].webInfo
  // 网站类型
  const { urlType } = ctx.request.body
  console.log(urlType)
  const freeWebList = [9, 10, 17, 18, 20, 21, 22, 23] // 免费网站
  const tollWebList = [8,11, 12, 13, 14, 15, 19, 24] // 收费网站
  /**
   *  memberType 0  // 普通版
   *  memberType 1  // 赞助版
   */
  if( memberType === 0 && freeWebList.includes(urlType)) { // 普通版会员
    /**
     * 普通版 只有当日次数限制
     * 根据传过来的网站类型 判断是否有当前网站权限
     */
    console.log('普通版')
    if (freeDownNum > 0) {
      resolve ({
        memberType,
        sign: 1005
      }) // 放行
    } else {
      resolve ({
        sign: 1004,
        memberType
      }) // 次数上限
    }
  } else if (memberType === 1 && (tollWebList.includes(urlType) || freeWebList.includes(urlType))) { // 赞助版会员
    /**
     * 赞助版 
     * 查看是否到期时间 
     *    到期: 转换为免费版本
     *    未到期: 放行通过下载
     */
    console.log('会员版')
    if(dayjs().format('YYYY-MM-DD') > dueTime) { // 过期了
      resolve ({
        memberType,
        sign: 1003
      })
    }
    if (tollDownNum > 0) {
      resolve ({
        memberType,
        sign: 1005
      }) // 放行
    } else {
      resolve ({
        memberType,
        sign: 1004
      }) // 次数上限
    }
  } else {
    resolve ({
      memberType,
      sign: 1002
    }) // 没有权限
  }
  })
}
// 相应次数减去
async function memberSubNum(ctx, memberType) {
  return new Promise(async(resolve, reject)=>{
    try {
      // 获取openid
      let openID = ctx.cookies.get('openID')
      const userInfo = await DB.find('userInfo', { 'wxInfo.openId': openID })
      const memberDownNum = userInfo[0].webInfo
      if (memberType === 0) {
        await DB.update('userInfo', {"wxInfo.openId": openID}, {"webInfo.freeDownNum": memberDownNum.freeDownNum-1})
      } else if (memberType === 1) {
        await DB.update('userInfo', {"wxInfo.openId": openID}, {"webInfo.tollDownNum": memberDownNum.tollDownNum-1})
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  validateMember,
  memberSubNum
}