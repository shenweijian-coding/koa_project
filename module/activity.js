const DB = require('../db/db')

async function inviteHandlePeople (inviteInfo) {
  // 获取邀请人的唯一id  被邀请人code 邀请人code
  const { inviteCode,mineCode } = inviteInfo
  return new Promise(async (resolve,reject)=>{
    try {
      const userInfo = await DB.find('userInfo', {'inviteInfo.mineCode': mineCode})
      if(!userInfo.length) resolve('查找失败')
      // 找到对应的code  填入数据库
      const res = await DB.insert('userInfo',{ 'inviteInfo.inviteUserList': inviteCode })
      resolve('success')
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  inviteHandlePeople
}