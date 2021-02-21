const { ObjectId } = require('mongodb')
const DB = require('../db/db')
const nodemailer=require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { email } = require('../config/config');


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
      const dialogInfo = homeInfo[0].homeInfo.dialogInfo
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
      const openId = ctx.cookies.get('openID')
      console.log('测试2');
      const userInfo = await DB.find('userInfo', { 'wxInfo.openId':openId })
      console.log(userInfo[0]);
      if(!userInfo.length) resolve({})
      const res = userInfo[0].webInfo
      res.email = userInfo[0].email || ''
      resolve(res)
    } catch (error) {
      console.log(error);
      reject(error)
    }
  })
}
// 新增数据
async function addData(ctx) {
  // 检测email的格式
  return new Promise(async(resolve,reject)=>{
    try {
      const openId = ctx.cookies.get('openID')
      const { email } = ctx.request.body
      console.log(openId,email);
      await DB.update('userInfo',{'wxInfo.openId':openId},{ email:email },{ multi:1 })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
// 账号密码进行关联
async function associatedUserInfo(userID, accountObj){
  return new Promise((resolve,reject)=>{
    try {
      await DB.update('userInfo', {'userId':userID},{'userName':accountObj.account})
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
   const randomInfo = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
  "p","q","r","s","t","u","v","w","x","y","z","A","B","C","D",
  "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S",
  "T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"
  ]
  let account = '',pwd = ''
  for(let i = 0 ; i<8;i++){
    account += randomInfo[Math.floor(Math.random()*randomInfo.length)]
    pwd += randomInfo[Math.floor(Math.random()*randomInfo.length)]
  }
  return { account, pwd }
}
// 添加用户操作
async function addUserInfo(addInfo) {
  return new Promise(async(resolve, reject)=>{
    try {
      await DB.insert('userInfo', { 'userId': addInfo.FromUserName,'createTime:': addInfo.CreateTime })
      resolve({})
    } catch (error) {
      reject(error)
    }
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
  associatedUserInfo
}