const { WXMP, cookieConfig } = require('../config/config');
const { SHA1, fmtNormalXML, streamToBuffer, createTimestamp } = require('../utils/mUtils')
const { tmpl } = require('../utils/wechat')
const { redis } = require('../utils/dbHelper')
const Wechat = require('../utils/wechat/wxmp')
const MPConfig = require('../utils/wechat/helper').MP
const got = require('got')
const qr = require('../vendor/qr')
const fs = require('fs')
const DB = require('../db/db')

const MP = new Wechat(MPConfig)

module.exports = async (ctx, next) => {
  const token = WXMP.token
  const { signature, nonce, timestamp, echostr } = ctx.query

  const str = [token, timestamp, nonce].sort().join('')

  const signVerified = SHA1(str) === signature

  if (!signVerified) {
    ctx.status = 404
    return
  }

  if (ctx.method === 'GET') ctx.body = echostr
  else if (ctx.method === 'POST') {
    // 把数组形态的xmlObject转换可读性更高的结构
    // console.log(ctx.request.body);
    const message = fmtNormalXML(ctx.request.body.xml)

    const msgType = message.MsgType
    const msgEvent = message.Event
    const userID = message.FromUserName
    let eventKey = message.EventKey
    let body = null

    if (msgType === 'event') {
      switch (msgEvent) {
        // 关注&取关
        case 'subscribe':
        case 'unsubscribe':
          body = await subscribe(message)
          break
        // 关注后扫码
        case 'SCAN':
          body = '扫码成功'
          break
      }
      
      if (!!eventKey) {
        console.log(eventKey);
        // 有场景值（扫了我们生成的二维码）
        let user = await MP.handle('getUserInfo', userID)
        const wxInfo = {
          "avatar": user.headimgurl,
          "sex": user.sex,
          "name": user.nickname,
          "openId": user.openid
        }
        const webInfo = {
          "memberType": 0,
          "dueTime": "2021-01-01",
          "nitufen": 0,
          "qiantuNum": 10,
          "liutuNum": 10,
          "baotuNum": 10,
          "sheji90Num": 10,
          "xiongmaoNum": 10,
          "qiankuNum": 10,
          "shetuNum": 10,
          "tukeNum": 10,
          "miyuansuNum": 10,
          "wotuNum": 10,
          "shidaNum": 10,
          "hukeNum": 10,
          "mizhiNum": 10,
          "tujinglingNum": 10,
          "zhongtuNum": 5
        }
        console.log(user);
        let userInfo = `${user.nickname}（${user.sex ? '男' : '女'}, ${user.country}${user.province}${user.city}）`
        if (eventKey.slice(0, 8) === 'qrscene_') {
          // 扫码并关注
          // 关注就创建帐号的话可以在这里把用户信息写入数据库完成用户注册
          eventKey = eventKey.slice(8)
          console.log(userInfo + '扫码并关注了公众号，准备写入数据库')
          await DB.insert('userInfo', { 'wxInfo': wxInfo, 'webInfo': webInfo })
          console.log('写入成功');
        } else {
          // 已关注
          console.log(userInfo + '扫码进入了公众号')
        }

        // 更新扫码记录，供浏览器扫码状态轮询
        // const state = await redis.pipeline()
        //             // .hset(eventKey, 'unionID', user.unionid || '') // 仅unionid机制下有效
        //             .hset(eventKey, 'openID', user.openid)
        //             .exec()
        console.log('准备在redis设置openid')
        await redis.hset(eventKey, 'openID', user.openid)
        await redis.expire(eventKey, 172800)
      }
    }

    ctx.type = 'application/xml'
    ctx.body = tmpl(body || ctx.body, message)
  }
}

async function subscribe (message) {
  let userID = message.FromUserName
  if (message.Event === 'subscribe') {
    return '感谢您的关注'
  } else {
    // 用户取消关注后我们不能再通过微信的接口拿到用户信息，
    // 如果要记录用户信息，需要从我们自己的用户记录里获取该信息。
    // 所以建议创建用户时除了unionid，最好把openid也保存起来。
    console.log(userID + '取关了')
  }
}

// const templetData = fs.readFileSync(pathResolve(__dirname, '../vendor/qrcode-templet.html'))

async function createQRCodeMB (ctx, next) {
  let userID = ctx.query.userID
  let type = +ctx.query.type
  let errno = 0
  let responseDate = {}
  let id = createTimestamp()

  let res = await MP.handle('getQRCodeTicket', id)

  if (res === null) errno = 1
  else {
    responseDate = {
      expiresIn: res.expire_seconds,// 图片有效期
      id // 时间戳
    }

    let imgBuffer = await streamToBuffer(qr.image(res.url))
    let imgSrc = imgBuffer.toString('base64')

    if (type === 1) {
      // 返回图片
      ctx.body = `<img src="data:image/png;base64,${imgSrc}" />`
    } else if (type === 2) {
      // 返回一个自带查询状态和跳转的网页
      let templetValue = `
        <script>var imgSrc='${imgSrc}',id='${responseDate.id}',
        timeout=${responseDate.expiresIn},width=100,height=100</script>`

      // ctx.body = templetValue + templetData.toString('utf-8')
      ctx.body = { 
        code: 1,
        id: responseDate.id,
        expiresIn: responseDate.expiresIn,
        imgSrc
      }
    } else {
      // 返回图片内容
      responseDate.imgSrc = imgSrc
    }
  }

  if (!ctx.body) {
    ctx.body = {
      errno,
      ...responseDate
    }
  }
}

async function sweepVerificationCode(ctx, next) {
  let eventKey = ctx.query.id
  const openId = await redis.hget(eventKey, 'openID')
  console.log(openId);
  if(!openId) {
    ctx.body={ errno: 1 }
    return
  }
  const userInfo = await DB.find('userInfo', {"wxInfo.openId": openId})
  if(!userInfo.length){
    ctx.body={ errno: 1 }
    return
  }
  // 将用户名编码
  let userName = Buffer.from(userInfo[0].wxInfo.name).toString('base64')
  console.log(userInfo)
  // 扫码通过  进行cookie发送
  ctx.cookies.set('eventKey', eventKey, cookieConfig)
  ctx.cookies.set('openID', openId, cookieConfig)
  ctx.cookies.set('avatar', userInfo[0].wxInfo.avatar, cookieConfig)
  ctx.cookies.set('name', userName, cookieConfig)
  ctx.body={
    errno:0
  }
}

module.exports.createQRCodeMB = createQRCodeMB
module.exports.sweepVerificationCode = sweepVerificationCode