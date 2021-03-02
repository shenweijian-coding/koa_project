const DB = require('./db/db')
const schedule = require('node-schedule')
const dayjs = require('dayjs')
const { ObjectId } = require('mongodb')
const { sleep } = require('./module/common')
// 将userInfo 表中的信息进行初始化操作
async function updateNumInfo() {
  const userInfoList = await DB.find('userInfo', {})
  let newNumData = {}
  for (let i = 0; i < userInfoList.length; i++) {
    // 判断是不是会员
    const { _id } = userInfoList[i]
    const { dueTime, videoTime, nitufen,allDownNum } = userInfoList[i].webInfo
    if(dueTime > dayjs().format('YYYY-MM-DD')) { // 是素材会员
      newNumData = {
        "memberType": 1,
        "dueTime": dueTime,
        "videoTime": videoTime,
        "nitufen": nitufen,
        "qiantuNum": 10,
        "liutuNum": 20,
        "baotuNum": 10,
        "sheji90Num": 20,
        "allDownNum": allDownNum,
        "xiongmaoNum": 10,
        "qiankuNum": 10,
        "shetuNum": 10,
        "tukeNum": 20,
        "miyuansuNum": 20,
        "wotuNum": 10,
        "shidaNum": 20,
        "hukeNum": 0,
        "mizhiNum": 10,
        "tujinglingNum": 10,
        "zhongtuNum": 5
    }
    }else if(dueTime > dayjs().format('YYYY-MM-DD') && videoTime > dayjs().format('YYYY-MM-DD')) { // 素材会员 + 视频会员
      newNumData = {
        "memberType": 1,
        "dueTime": dueTime,
        "videoTime": videoTime,
        "nitufen": nitufen,
        "allDownNum": allDownNum,
        "qiantuNum": 10,
        "liutuNum": 20,
        "baotuNum": 10,
        "sheji90Num": 20,
        "xiongmaoNum": 10,
        "qiankuNum": 10,
        "shetuNum": 10,
        "tukeNum": 20,
        "miyuansuNum": 20,
        "wotuNum": 10,
        "shidaNum": 20,
        "hukeNum": 30,
        "mizhiNum": 15,
        "tujinglingNum": 10,
        "zhongtuNum": 5
    }
    } else { // 免费版本
      newNumData = {
        "memberType": 0,
        "dueTime": '2021-01-01',
        "videoTime": '2021-01-01',
        "nitufen": nitufen,
        "allDownNum":allDownNum,
        "qiantuNum": 0,
        "liutuNum": 5,
        "baotuNum": 0,
        "sheji90Num": 0,
        "xiongmaoNum": 0,
        "qiankuNum": 0,
        "shetuNum": 0,
        "tukeNum": 10,
        "miyuansuNum": 5,
        "wotuNum": 5,
        "shidaNum": 10,
        "hukeNum": 0,
        "mizhiNum": 10,
        "tujinglingNum": 5,
        "zhongtuNum": 0
    }
    }
    // 开始更新
    await DB.update('userInfo', { '_id':ObjectId(_id) },{ 'webInfo':newNumData })
    await sleep(400)
  }
}
function scheduleRecurrenceRule(){
  const rule = new schedule.RecurrenceRule()
  rule.hour = 0
  rule.minute = 0
  rule.second = 0
  schedule.scheduleJob(rule, function(){
    updateNumInfo()
  });
}
scheduleRecurrenceRule()