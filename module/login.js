const { redis } = require('../utils/dbHelper')
function isAttention(ctx){
  return new Promise( async(resolve, reject)=>{
    // 获取cookie内容
    let eventKey = ctx.cookies.get('eventKey')
    let openID = ctx.cookies.get('openID')
    // 通过eventKey 获取存在redis的 openID
    const redisOpenId = await redis.hget(eventKey, 'openID')
    // 比较前端返回的和  后台获取的是否相等
    if(openID === redisOpenId) {
      //登录状态
      resolve(true)
    }else{
      // 未登录状态
      resolve(false)
    }
  })
}
module.exports = { isAttention }