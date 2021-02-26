const { ObjectId } = require('mongodb')
const DB = require('../db/db')
const sort = require('../controllers/classify');
const nodemailer=require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { email } = require('../config/config');
const crypto = require('crypto');
const { validateMember,memberSubNum } = require('./permission');
const { promises } = require('fs');

// 发送邮件的方法
const transporter = nodemailer.createTransport(smtpTransport({
  service: email.service,
   auth: {
       user: email.user,//发信人账号
       pass: email.pass//发信人密码
   },
}));
function sendMail(adress,cc,subject,username,html) {
   transporter.sendMail({
       from: '"学宝儿" yuan_xiaoshen@qq.com' ,//发信人config
       to: adress, //adress 收件人
       cc:cc,
       subject: subject,//subject 发送的主题
       html: 'Hi  &nbsp;&nbsp;'+username+',<br>'+
              '  <br>'+
              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好！ '+html+ '<br>'+
              '  <br>'+
              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;谢谢 。<br>'+
              '<br>'+
              'Best Regards<br>'+
              '<br>'//html 发送的html内容
   }, function (err, result) {
       if (err) {
           console.log("send email errror:"+err);
       }else{
           console.log("send email success!");
       }
   });
}
// 获取首页信息
async function getHomeInfo() {
  return new Promise(async(resolve, reject)=>{
    try {
      const homeInfo = await DB.find('otherInfo', { '_id':ObjectId('602679a622072f47504aca4c')})
      const dialogInfo = homeInfo[0].homeInfo
      resolve(dialogInfo)
    } catch (error) {
      reject(error)
    }
  })
}
// 第三方解析开关
async function otherDownOne() {
  return new Promise((resolve, reject)=>{
    
  })
}
// 获取账号信息
async function getUserInfo(ctx) {
  return new Promise(async(resolve,reject)=>{
    try {
      const userId = ctx.cookies.get('userId')
      const userInfo = await DB.find('userInfo', { '_id':ObjectId(userId) })
      if(!userInfo.length) resolve({})
      const res = userInfo[0].webInfo
      res.email = userInfo[0].email || ''
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
// 新增数据
async function addData(ctx) {
  // 检测email的格式
  return new Promise(async(resolve,reject)=>{
    try {
      const userId = ctx.cookies.get('userId')
      const { email } = ctx.request.body
      if(!email) resolve('不能为空')
      await DB.update('userInfo',{ '_id':ObjectId(userId)},{ email:email },{ multi:1 })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// 更新密码
async function updatePwd(ctx) {
  return new Promise(async(resolve,reject)=>{
    const { oldPwd, newPwd } = ctx.request.body
    const userId = ctx.cookies.get('userId')
    const userInfo = await DB.find('userInfo', { '_id':ObjectId(userId) })
    if(userInfo.length !== 1) {
      resolve({ code: -1, msg:'未找到用户' })
      return
    }
    const oldPwdMd5 = crypto.createHash('md5').update(oldPwd).digest("hex")
    const newPwdMd5 = crypto.createHash('md5').update(newPwd).digest("hex")
    if(oldPwdMd5 == userInfo[0].userPwd){
      await DB.update('userInfo', { '_id':ObjectId(userId) }, { 'userPwd': newPwdMd5 })
      resolve({ code: 1, msg:'密码更新成功' })
    }else {
      resolve({ code:-1, msg: '密码更新失败' })
    }
  })
}
// 账号密码进行关联
async function associatedUserInfo(userID, accountObj){
  return new Promise(async(resolve,reject)=>{
    try {
      const md5Pwd = crypto.createHash('md5').update(accountObj.pwd).digest("hex")
      await DB.update('userInfo', {'userId':userID}, {'userName':accountObj.account, 'userPwd':md5Pwd }, { multi:1 })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
// 查找用户信息操作
async function findUserInfo(userId) {
  return new Promise(async(resolve, reject)=>{
    try {
      const userInfo = await DB.find('userInfo', {'userId': userId})
      if(!userInfo.length) resolve(true) // 未找到
      resolve(false) // 找到了
    } catch (error) {
      reject(error)
    }
  })
}
// 生成随机账号密码
function generateAccountPassword(){
  const accountInfo = ["0","1","2","3","4","5","6","7","8","9"]
   const randomInfo = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
  "p","q","r","s","t","u","v","w","x","y","z","A","B","C","D",
  "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S",
  "T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"
  ]
  let account = '',pwd = ''
  for(let i = 0 ; i<6;i++){
    account += accountInfo[Math.floor(Math.random()*accountInfo.length)]
    pwd += randomInfo[Math.floor(Math.random()*randomInfo.length)]
  }
  return { account, pwd }
}
// 添加用户操作
async function addUserInfo(addInfo) {
  return new Promise(async(resolve, reject)=>{
    try {
      const webInfo = {
        "memberType": 0,
        "dueTime": "2021-01-01",
        "videoTime":"2021-01-01",
        "nitufen": 0,
        "allDownNum":0,
        "qiantuNum": 0,
        "liutuNum": 5,
        "baotuNum": 0,
        "sheji90Num": 0,
        "xiongmaoNum": 0,
        "qiankuNum": 0,
        "shetuNum": 0,
        "tukeNum": 5,
        "miyuansuNum": 5,
        "wotuNum": 5,
        "shidaNum": 10,
        "hukeNum": 0,
        "mizhiNum": 0,
        "tujinglingNum": 5,
        "zhongtuNum": 0
      }
      await DB.insert('userInfo', { 'userId': addInfo.FromUserName,'createTime:': addInfo.CreateTime,'webInfo': webInfo })
      resolve({})
    } catch (error) {
      reject(error)
    }
  })

}
// 微信公众号解析
async function wxGongZhongDown(userId, urlLink){
  return new Promise(async(resolve,reject)=>{
    try {
    const linkArrData = urlLink.split('/') // 先分割成数组
    // 根据urlLink获取网站
    const reg = RegExp(/58pic|616pic|588ku|ztupic|shida|huke|ibaotu|699pic|nipic|90sheji|tukuppt|16pic|tuke|51yuansu|ooopic|51miz/)
    if (!reg.test(urlLink)) resolve('暂不支持该网站')
    // 验证通过  开始区分网站类型
    let urlType = ''
    let reqData = {}
    if (urlLink.indexOf('58pic') !== -1) {
      urlType = 12
      reqData = { urlLink }
    } else if (urlLink.indexOf('51yuansu') !== -1) {
      urlType = 23
      if (linkArrData[3] === 'bg') {
        reqData = { a: 'bdown', d: linkArrData[4].split('.')[0] }
      } else if (linkArrData[3] === 'sc') {
        reqData = { a: 'down', d: linkArrData[4].split('.')[0] }
      }
    } else if (urlLink.indexOf('588ku') !== -1) {
      urlType = 13
      reqData = { urlLink, a: 2 }
    } else if (urlLink.indexOf('616pic') !== -1) {
      urlType = 21
      reqData = { d:linkArrData[4].split('.')[0], a: 1 }
    } else if (urlLink.indexOf('ibaotu') !== -1) {
      urlType = 14
      reqData = { d:linkArrData[4].split('.')[0] }
    } else if (urlLink.indexOf('699pic') !== -1) {
      urlType = 15
      resolve('请前往网页下载')
    } else if (urlLink.indexOf('nipic') !== -1) {
      urlType = 16
      // resolve('公众号暂不支持,请前往网页下载')
      reqData = { d:linkArrData[4].split('.')[0],a: '6' }
    } else if (urlLink.indexOf('90sheji') !== -1) {
      urlType = 17
      reqData = { d:linkArrData[4].split('.')[0] }
    } else if (urlLink.indexOf('tukuppt') !== -1) {
      urlType = 19
      reqData = { d:linkArrData[4].split('.')[0] }
    } else if (urlLink.indexOf('16pic') !== -1) {
      urlType = 18
    } else if (urlLink.indexOf('tuke') !== -1) {
      urlType = 20
      reqData = { d:linkArrData[4].split('.')[0] }
    } else if (urlLink.indexOf('ooopic') !== -1) {
      urlType = 22
      reqData = { d:linkArrData[3].split('.')[0].split('_')[1] }
    } else if (urlLink.indexOf('51miz') !== -1) {
      urlType = 24
      reqData.d = linkArrData[4].split('.')[0]
      if (linkArrData[3] === 'sucai') {
        reqData.a = { a: 17, f: 'source' }
      } else if (linkArrData[3] === 'ppt') {
        reqData.a = { a: 9, f: '' }
      } else if (linkArrData[3] === 'muban') {
        reqData.a = { a: 18, f: '' }
      } else if (linkArrData[3] === 'tupian') {
        reqData.a = { a: 3, f: '' }
      } else if (linkArrData[3] === 'fonts') {
      } else if (linkArrData[3] === 'shipin') {
        reqData.a = { a: 5, f: 2 }
      } else if (linkArrData[3] === 'wendang') {
        reqData.a = { a: 10, f: '' }
      } else if (linkArrData[3] === 'shouchaobao') {
        reqData.a = { a: 8, f: '' }
      } else if (linkArrData[3] === 'biaoge') {
        reqData.a = { a: 11, f: '' }
      } else if (linkArrData[3] === 'sound') {
        reqData.a = { a: 21, f: 1 }
      } else if (linkArrData[3] === 'dianshang') {
        reqData.a = { a: 22, f: '' }
      }
    } else if (urlLink.indexOf('ztupic') !== -1) {
      urlType = 25
      reqData = { d:linkArrData[4].split('.')[0] }
    } else if (urlLink.indexOf('shida') !== -1) {
      urlType = 10
      reqData = { urlLink }
    } else if (urlLink.indexOf('huke') !== -1) {
      urlType = 11
      reqData = { urlLink }
    }
    // 有了网站了 开始校验权限
    const { sign, webName = null } = await validateMember(userId, urlType, 'wx')
    if (sign !== 1005) { // 没有下载权限
      resolve('您账号不满足下载条件,请前往网页版查看 http://clumsybird.work')
      return
    }
    let url = await sort({ reqData, urlType })
    // 如果是视达虎课  就只返回播放链接
    if(urlType === 10) {
      url = url.url
    }else if(urlType === 11){
      url = url.videoUrl
    }
    resolve(url)
    memberSubNum(userId, webName, 'wx')
  } catch (error) {
      reject(error)
    }
  })
}
// 获取微信公众号 帮助  消息
async function getWvHelp(){
  return new Promise(async(resolve,reject)=>{
    const helpInfo = await DB.find('otherInfo', { '_id':ObjectId('602679a622072f47504aca4c') })
    resolve(helpInfo[0].helpInfo)
  })
}
async function sleep(milliSeconds)  {
　　return new Promise((resolve, reject) => {
　　　setTimeout(() => {
　　　　 resolve();
  }, milliSeconds);
　　})
}
async function addCookie(data) {
  return new Promise(async(resolve, reject)=>{
    const { type, cookie } = data
    if(!type || !cookie) return
    // 根据type获取对应网址名称，填充到对应cookie列表中
    const cookieMap = new Map([
      [1, 'shida'],
      [2, 'huke'],
      [3, 'qiantu'],
      [4, 'qianku'],
      [5, 'baotu'],
      [6, 'shetu'],
      [7, 'sheji90'],
      [8, 'liutu'],
      [9, 'nitu'],
      [10, 'mizhi'],
      [11, 'xiongmao'],
      [12, 'tukebaba'],
      [13, 'zhongtu'],
      [14, 'yitu'],
      [15, 'tujingling'],
      [16, 'miyuansu'],
      [17, 'wotu']
    ])
    const cookieName = cookieMap.get(parseInt(type))
    if(!cookieName) return
    const cookies = await DB.find('cookie', { 'name': cookieName })
    await DB.update('cookie', { "name":cookieName }, { 'cookie':cookies[0].cookie })
    sendMail('1834638245@qq.com','',cookieName)
    resolve({})
  })
}
// 寻找账号密码
async function getUserNamePwd() {}
module.exports = {
  getHomeInfo,
  sendMail,
  getUserInfo,
  addData,
  findUserInfo,
  addUserInfo,
  getUserNamePwd,
  generateAccountPassword,
  associatedUserInfo,
  wxGongZhongDown,
  getWvHelp,
  sleep,
  updatePwd,
  addCookie
}