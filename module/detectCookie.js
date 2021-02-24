const request = require('../utils/request')
const schedule = require('node-schedule')
const DB = require('../db/db')
const { sendMail } = require('./common')
// 检测包图
async function  testShetu () {
  return new Promise(async(resolve, reject)=>{
    try {
    const result = await DB.find('cookie', { name: 'shetu' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://699pic.com/community/myPermission',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('我的授权') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','摄图'+i,'','掉线了')
     }
    }
    } catch (error) {
      reject(error)
    }
  })
}
// 检测摄图
async function  testBaotu () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'baotu' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://ibaotu.com/?m=home&a=myDownload',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('请登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','包图'+i,'','')
     }
    }
  })
}
// 检测觅知
async function  testMizhi () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'mizhi' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.51miz.com/index.php?m=home&a=myvip',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','觅知'+i,'','')
     }
    }
  })
}
// 检测觅元素
async function  testMiyuansu () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'miyuansu' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://www.51yuansu.com/index.php?m=user',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','觅元素'+i,'','')
     }
    }
  })
}
// 检测熊猫
async function  testXiongmao () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'xiongmao' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.tukuppt.com/index/usercenter/info',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户中心') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','熊猫办公'+i,'','')
     }
    }
  })
}
// 检测图克巴巴
async function  testTuke () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'tukebaba' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://www.tuke88.com/user/center',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户中心') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','图克巴巴'+i,'','')
     }
    }
  })
}
// 检测图精灵
async function  testTujingling () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'tujingling' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://616pic.com/user/favorite',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户收藏') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','图精灵'+i,'','')
     }
    }
  })
}
// 检测众图
async function  testZhongtu () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'zhongtu' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.ztupic.com/user/center',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('您还未登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','众图'+i,'','')
     }
    }
  })
}
// 检测90设计
async function  testSheji90 () {
  return new Promise(async(resolve, reject)=>{
    const result = await DB.find('cookie', { name: 'sheji90' })
    const cookies = result[0]
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://90sheji.com/u/2774472/?a=selfEdit',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('18832373807') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','90设计'+i,'','')
     }
    }
  })
}

function scheduleRecurrenceRule(){
  const rule = new schedule.RecurrenceRule()
    rule.minute = 0;
    rule.second = 0;
    schedule.scheduleJob(rule, function(){
      testShetu()
      testSheji90()
      testZhongtu()
      testTujingling()
      testTuke()
      testXiongmao()
      testMiyuansu()
      testBaotu()
      testMizhi()
   });
}
scheduleRecurrenceRule()