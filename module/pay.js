const DB = require('../db/db')
const dayjs = require('dayjs')
async function pay(ctx) {
  return new Promise(async (resolve, reject)=>{
   try {
      // 获取充值用户数据
    const { pay_id, pay_no, pay_time  } = ctx.request.body
    console.log(pay_id);
    await DB.insert('payData', { pay_id, pay_no, pay_time })
    const userInfo = await DB.find('userInfo', {'wxInfo.openId': pay_id})
    // 根据openId获取用户数据
    const webInfo = {
      "memberType": 1,
      "dueTime": dayjs().add(1, 'year').format('YYYY-MM-DD'),
      "nitufen": userInfo[0].webInfo.nitufen,
      "qiantuNum": 10,
      "liutuNum": 20,
      "baotuNum": 10,
      "sheji90Num": 20,
      "xiongmaoNum": 10,
      "qiankuNum": 10,
      "shetuNum": 20,
      "tukeNum": 20,
      "miyuansuNum": 20,
      "wotuNum": 20,
      "shidaNum": 20,
      "hukeNum": 20,
      "mizhiNum": 20,
      "tujinglingNum": 20,
      "zhongtuNum":5
    }
    await DB.update('userInfo', {'wxInfo.openId':pay_id}, {'webInfo': webInfo})
    resolve({})
    // 充值成功
   } catch (error) {
     reject(error)
   }
  })
}

module.exports = {
  pay
}