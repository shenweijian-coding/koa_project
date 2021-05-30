const { WXMP, cookieConfig } = require('../config/config');
const { SHA1, fmtNormalXML, streamToBuffer, createTimestamp } = require('../utils/mUtils')
const { tmpl } = require('../utils/wechat')
const { redis } = require('../utils/dbHelper')
const Wechat = require('../utils/wechat/wxmp')
const MPConfig = require('../utils/wechat/helper').MP
const qr = require('../vendor/qr')
const DB = require('../db/db');
const { addUserInfo, findUserInfo, addData, generateAccountPassword, associatedUserInfo, wxGongZhongDown, getWvHelp, getUserNamePwd } = require('../module/common');
const { ObjectId } = require('mongodb');

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
    let body = null
    // 如果是文本消息
    if (msgType === 'text') {
      // 我要账号 
      if (/账号/.test(message.Content)) {
        // 查找用户信息  有则提示已经有了   没有则发送账号密码
        const userInfo = await findUserInfo(userID)
        // console.log(userInfo);
        if (!userInfo) {
          body = '账号只能获取1次,您之前已经获取过了,若忘记账号密码,请回复”找回密码“'
        } else {
          // 没有账号  添加数据
          await addUserInfo(message)
          // 添加完成 取出账号密码 并关联数据
          const accountObj = generateAccountPassword(userID)
          // 与之前的数据进行关联
          await associatedUserInfo(userID, accountObj)
          body = `账号：${accountObj.account}
密码：${accountObj.pwd}
登录网址：http://clumsybird.work(PC端打开)
该账号与您微信已自动绑定,将链接发送至本窗口也可下载。
tips:请先使用此账号密码登录,登录后可修改账号密码,方便您记忆~
`
        }
      } else if (/http/.test(message.Content)) {
        const info = message.Content
        if (info.includes('699pic') || info.includes('nipic')) {
          body = '公众号不支持昵图、摄图两个站点，请到网页进行下载哦~'
          ctx.type = 'application/xml'
          ctx.body = tmpl(body || ctx.body, message)
          return
        } else if (info.includes('//m.')) {
          body = '不支持手机端复制的链接，请复制PC端链接'
          ctx.type = 'application/xml'
          ctx.body = tmpl(body || ctx.body, message)
          return
        }
        const url = await wxGongZhongDown(userID, info)
        if (!url) {
          body = '服务器错误，请联系管理员~'
        } else if (url.includes('账号')) {
          body = url
        } else if (url.includes('http')) {
          body = `请点击下方连接

${url}

【链接有有效期,请抓紧使用】`
        } else {
          body = url
        }
      } else if (/帮助/.test(message.Content)) {
        body = await getWvHelp()
      } else if (/找回密码/.test(message.Content)) {
        body = await getUserNamePwd(userID)
      } else {
        body = '暂不支持智能回复，请点击右下角联系公众号运营管理员，谢谢支持！'
      }
    } else if (msgType === 'event') {
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
    } else {
      body = '无法识别您的信息'
    }
    // if (msgType === 'event') {
    //   switch (msgEvent) {
    //     // 关注&取关
    //     case 'subscribe':
    //     case 'unsubscribe':
    //       body = await subscribe(message)
    //       break
    //     // 关注后扫码
    //     case 'SCAN':
    //       body = '扫码成功'
    //       break
    //   }

    //   // if (!!eventKey) {
    //   //   console.log(eventKey);
    //   //   // 有场景值（扫了我们生成的二维码）
    //   //   let user = await MP.handle('getUserInfo', userID)
    //   //   const wxInfo = {
    //   //     "avatar": user.headimgurl,
    //   //     "sex": user.sex,
    //   //     "name": user.nickname,
    //   //     "openId": user.openid
    //   //   }
    //   //   const webInfo = {
    //   //     "memberType": 0,
    //   //     "dueTime": "2021-01-01",
    //   //     "videoTime":"2021-01-01",
    //   //     "nitufen": 0,
    //   //     "qiantuNum": 0,
    //   //     "liutuNum": 10,
    //   //     "baotuNum": 0,
    //   //     "sheji90Num": 0,
    //   //     "xiongmaoNum": 0,
    //   //     "qiankuNum": 0,
    //   //     "shetuNum": 10,
    //   //     "tukeNum": 10,
    //   //     "miyuansuNum": 0,
    //   //     "wotuNum": 0,
    //   //     "shidaNum": 10,
    //   //     "hukeNum": 30,
    //   //     "mizhiNum": 0,
    //   //     "tujinglingNum": 10,
    //   //     "zhongtuNum": 0
    //   //   }
    //   //   console.log(user);
    //   //   let userInfo = `${user.nickname}（${user.sex ? '男' : '女'}, ${user.country}${user.province}${user.city}）`
    //   //   if (eventKey.slice(0, 8) === 'qrscene_') {
    //   //     // 扫码并关注
    //   //     // 关注就创建帐号的话可以在这里把用户信息写入数据库完成用户注册
    //   //     eventKey = eventKey.slice(8)
    //   //     console.log(userInfo + '扫码并关注了公众号，准备写入数据库')
    //   //     await DB.insert('userInfo', { 'wxInfo': wxInfo, 'webInfo': webInfo })
    //   //     console.log('写入成功');
    //   //   } else {
    //   //     const userInfo = await DB.find('userInfo',{ 'wxInfo.openId': user.openid })
    //   //     if(!userInfo.length) await DB.insert('userInfo', { 'wxInfo': wxInfo, 'webInfo': webInfo })
    //   //     // 已关注
    //   //     console.log(userInfo + '扫码进入了公众号')
    //   //   }

    //   //   // 更新扫码记录，供浏览器扫码状态轮询
    //   //   // const state = await redis.pipeline()
    //   //   //             // .hset(eventKey, 'unionID', user.unionid || '') // 仅unionid机制下有效
    //   //   //             .hset(eventKey, 'openID', user.openid)
    //   //   //             .exec()
    //   //   console.log('准备在redis设置openid')
    //   //   await redis.hset(eventKey, 'openID', user.openid)
    //   //   await redis.expire(eventKey, 172800)
    //   // }
    // }
    ctx.type = 'application/xml'
    ctx.body = tmpl(body || ctx.body, message)
  }
}

async function subscribe(message) {
  let userID = message.FromUserName
  if (message.Event === 'subscribe') {
    // console.log(userID + '关注了')
    const helpInfo = await DB.find('otherInfo', { '_id': ObjectId('602679a622072f47504aca4c') })
    return helpInfo[0].helpInfo
  } else {
    // 用户取消关注后我们不能再通过微信的接口拿到用户信息，
    // 如果要记录用户信息，需要从我们自己的用户记录里获取该信息。
    // 所以建议创建用户时除了unionid，最好把openid也保存起来。
    // console.log(userID + '取关了')
    DB.remove('userInfo', { 'userId': userID })
    // 后期会发送邮件
  }
}

// const templetData = fs.readFileSync(pathResolve(__dirname, '../vendor/qrcode-templet.html'))

async function createQRCodeMB(ctx, next) {
  // let userID = ctx.query.userID
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
  if (!openId) {
    ctx.body = { errno: 1 }
    return
  }
  const userInfo = await DB.find('userInfo', { "wxInfo.openId": openId })
  if (!userInfo.length) {
    ctx.body = { errno: 1 }
    return
  }
  // 将用户名编码
  let userName = Buffer.from(userInfo[0].wxInfo.name).toString('base64')
  // 扫码通过  进行cookie发送
  ctx.cookies.set('eventKey', eventKey, cookieConfig)
  ctx.cookies.set('openID', openId, cookieConfig)
  ctx.cookies.set('avatar', userInfo[0].wxInfo.avatar, cookieConfig)
  ctx.cookies.set('name', userName, cookieConfig)
  ctx.body = {
    errno: 0
  }
}

module.exports.createQRCodeMB = createQRCodeMB
module.exports.sweepVerificationCode = sweepVerificationCode