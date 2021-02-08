const DB = require('../db/db')
const dayjs = require('dayjs')
// 验证会员类型
async function validateMember(ctx, type) {
  // 获取openId
  let openID = ctx.cookies.get('openID')
  const userInfo = DB.find('userInfo', { 'wxInfo.openId': openID })
  const { memberType, freeDownNum, tollDownNum } = userInfo.webInfo
  // 网站类型
  const { urlType } = ctx
  const freeWebList = [9, 10, 17, 18, 20, 21, 22, 23] // 免费网站
  const tollWebList = [11, 12, 13, 14, 15, 16, 19, 24] // 收费网站
  /**
   *  memberType 0  // 普通版
   *  memberType 1  // 赞助版
   */
  if( memberType === 0 && freeWebList.includes(urlType)) { // 普通版会员
    /**
     * 普通版 只有当日次数限制
     * 根据传过来的网站类型 判断是否有当前网站权限
     */
    // if() {}
    if (freeDownNum > 0) {
      return {
        memberType,
        sign: 1005
      } // 放行
    } else {
      return {
        sign: 1004,
        memberType
      } // 次数上限
    }
  } else if (memberType === 1 && tollWebList.includes(urlType)) { // 赞助版会员
    /**
     * 赞助版 
     * 查看是否到期时间 
     *    到期: 转换为免费版本
     *    未到期: 放行通过下载
     */

    if (tollDownNum > 0) {
      return {
        memberType,
        sign: 1005
      } // 放行
    } else {
      return {
        memberType,
        sign: 1004
      } // 次数上限
    }
  } else {
    return {
      memberType,
      sign: 1002
    } // 没有权限
  }
}
// 相应次数减去
async function memberSubNum(ctx, memberType) {
  return new Promise((resolve, reject)=>{
    try {
      // 获取openid
      let openID = ctx.cookies.get('openID')
      const userInfo = DB.find('userInfo', { 'wxInfo.openId': openID })
      const memberDownNum = userInfo.webInfo
      if (memberType === 0) {
        await DB.update('userinfo', {"wxInfo.openId": openID}, {$set:{"webInfo.freeDownNum": memberDownNum.freeDownNum-1}})
      } else if (memberType === 1) {
        await DB.update('userinfo', {"wxInfo.openId": openID}, {$set:{"webInfo.tollDownNum": memberDownNum.tollDownNum-1}})
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  validateMember,
  memberSubNum
}