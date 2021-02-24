const DB = require('../db/db')
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
async function pay(ctx) {
  return new Promise(async (resolve, reject)=>{
   try {
      // 获取充值用户数据
      /**
       * pay_id   openId
       * pay_no   订单号
       * pay_time 支付时间
       * price 价格
       */
    const { pay_id, pay_no, pay_time, price } = ctx.request.body
    await DB.insert('payData', { pay_id, pay_no, pay_time, price })
    const userInfo = await DB.find('userInfo', {'_id': ObjectId(pay_id)})
    // 根据付的钱对应权限
    if (price === '70.00' || price === '70') { // 年卡
      const webInfo = {
        "memberType": 1,
        "dueTime": dayjs().add(1, 'year').format('YYYY-MM-DD'),
        "videoTime": userInfo[0].webInfo.videoTime,
        "nitufen": userInfo[0].webInfo.nitufen,
        "allDonwNum":0,
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
        "hukeNum": 0,
        "mizhiNum": 20,
        "tujinglingNum": 20,
        "zhongtuNum":5
      }
      await DB.update('userInfo', {'_id': ObjectId(pay_id)}, {'webInfo': webInfo})
    } else if (price === '12.00' || price === '12'){ // 月卡
      const webInfo = {
        "memberType": 1,
        "dueTime": dayjs().add(1, 'month').format('YYYY-MM-DD'),
        "videoTime": userInfo[0].webInfo.videoTime,
        "nitufen": userInfo[0].webInfo.nitufen,
        "qiantuNum": 10,
        "allDonwNum":0,
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
        "hukeNum": 30,
        "mizhiNum": 20,
        "tujinglingNum": 20,
        "zhongtuNum":5
      }
      await DB.update('userInfo', {'_id': ObjectId(pay_id)}, {'webInfo': webInfo})
    } else if (price === '4.00' || price === '4') { // 1000昵图分
      const nitufen = userInfo[0].webInfo.nitufen + 1000
      await DB.update('userInfo', {'_id': ObjectId(pay_id)}, {'webInfo.nitufen': nitufen})
    } else if (price === '10.00' || price === '10') { // 5000昵图分
      const nitufen = userInfo[0].webInfo.nitufen + 10000
      await DB.update('userInfo', {'_id': ObjectId(pay_id)}, {'webInfo.nitufen': nitufen})
    } else if (price === '30.00' || price === '30') { // 虎课
      const videoTime =dayjs().add(1, 'year').format('YYYY-MM-DD')
      await DB.update('userInfo', {'_id': ObjectId(pay_id)}, {'webInfo.videoTime':videoTime})
    } else if (price === '1.00' || price === '1') { // 仅下载1次
      await DB.update('userInfo', {'_id':ObjectId(pay_id)},{ 'webInfo.allDownNum': 1 })
    }
    // 根据openId获取用户数据
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