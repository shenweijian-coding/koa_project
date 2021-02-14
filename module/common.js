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
module.exports = {
  getHomeInfo,
  sendMail
}