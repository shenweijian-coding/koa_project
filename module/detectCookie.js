const request = require('../utils/request')
const schedule = require('node-schedule')
const DB = require('../db/db')
const { sendMail } = require('./common')
// 检测包图
async function  testShetu () {
  return new Promise(async(resolve, reject)=>{
    try {
    const result = await DB.find('cookie', { name: 'shetu' })
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://699pic.com/community/myPermission',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('我的授权') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'shetu' },{ cookie:cookies[i] })
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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://ibaotu.com/?m=home&a=myDownload',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('请登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'baotu' },{ cookie:cookies[i] })
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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.51miz.com/index.php?m=home&a=myvip',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'mizhi' },{ cookie:cookies[i] })
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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://www.51yuansu.com/index.php?m=user',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'miyuansu' },{ cookie:cookies[i] })

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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.tukuppt.com/index/usercenter/info',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户中心') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'xiongmao' },{ cookie:cookies[i] })

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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://www.tuke88.com/user/center',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户中心') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'tukebaba' },{ cookie:cookies[i] })

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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://616pic.com/user/favorite',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('用户收藏') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'tujingling' },{ cookie:cookies[i] })

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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://www.ztupic.com/user/center',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('您还未登录') !== -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'zhongtu' },{ cookie:cookies[i] })

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
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://90sheji.com/',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('上传赚钱') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'sheji90' },{ cookie:cookies[i] })

       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','90设计'+i,'','')
     }
    }
  })
}

// 检测视达网
async function testShida () {
  return new Promise(async(resolve,reject)=>{
    const result = await DB.find('cookie', { name: 'shida' })
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'https://shida66.com/info.html',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('左下角的我') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'shida' },{ cookie:cookies[i] })
       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','视达网'+i,'','')
     }
    }
  })
}
// 昵图网掉线
async function testNitu(){
  return new Promise(async(resolve,reject)=>{
    const result = await DB.find('cookie', { name: 'nitu' })
    if(!result.length) return
    const cookies = result[0].cookie
    for (let i = 0; i < cookies.length; i++) {
      const source = await request({
        url: 'http://user.nipic.com/transaction/index?type=8',
        headers: {
          Cookie:cookies[i]
        }
     })
     if (source.indexOf('交易记录') === -1) {
       // 说明掉线了  需要邮箱通知  并删除该cookie
       DB.updateMany('cookie',{ name:'nitu' },{ cookie:cookies[i] })

       // await DB.remove('cookie',{}) // 删除cookie
       sendMail('1834638245@qq.com','','昵图网'+i,'','')
     }
    }
  })
}
// async function test
function scheduleRecurrenceRule(){
  const rule = new schedule.RecurrenceRule()
    rule.minute = 0;
    rule.second = 0;
    schedule.scheduleJob(rule, function(){
      console.log('开始检测');
      testShetu()
      testSheji90()
      testZhongtu()
      testTujingling()
      testTuke()
      testXiongmao()
      testMiyuansu()
      testBaotu()
      testMizhi()
      testShida()
      testNitu()
   });
}
scheduleRecurrenceRule();
(()=>{
  console.log('开始检测');
  // testShetu()
  testSheji90()
  // testZhongtu()
  // testTujingling()
  // testTuke()
  // testXiongmao()
  // testMiyuansu()
  // testBaotu()
  // testMizhi()
  // testShida()
  testNitu()
})()