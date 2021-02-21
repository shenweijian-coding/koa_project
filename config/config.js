// 数据库
const app = {
  dbUrl: 'mongodb://127.0.0.1:27017',
  // dbUrl: 'mongodb://nodejs:swj250176@1.15.123.213:27017',
  dbName:'dbSuCai'
}
// cookie
const cookieConfig = {
  maxAge:172800000,            // 一个数字表示从 Date.now() 得到的毫秒数
  // expires: new Date() + 1000 * 60,        // 过期的 Date,如不设置就和session类似，关闭浏览器此cookie失效
  path: '/',                  // 路径, 默认是'/'
  domain: '',                // 域名
  secure: false,              // 安全 cookie   默认false，设置成true表示只有 https可以访问
  httpOnly: false,            // 是否只是服务器可访问 cookie, 默认是 true
  overwrite: true             // 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。
}
// session
const sessionConfig = {
  key: 'koa:sess', // cookie key (默认koa：sess)
  maxAge: 86400000, // cookie的过期时间,毫秒，默认为1天
  overwrite: true, // 是否覆盖    (默认default true)
  httpOnly: true, // cookie是否只有服务器端可以访问,默认为true
  signed: true, // 签名默认true
  rolling: false, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, // (boolean) 会话即将到期时,续订会话
}
// 微信公众号
// const WXMP = {
//   appID: 'wx4abdcadb13793f2d',
//   appSecret: '85c86c0a7db82db92f4883959cb3a662',
//   token: 'shenweijian'
// }
const WXMP = {
  appID: 'wx10718ba590743aeb',
  appSecret: 'fa816a95aae0f46a0d561ea5b9dbb499',
  token: 'shenweijian'
}
// redis
const CACHE = {
  host: 'localhost',
  port: 6379
}

// 邮箱
const email = {
  port:587,
  host:"qq",
  service:"qq",
  user: 'yuan_xiaoshen@qq.com',//发信邮箱账号
  pass: 'yypquvvdkkjlddja'//发信邮箱密码，这里的密码用的安全管家生成的动态密码，不是普通的qq登录密码等（邮箱--设置--账户--POP3服务--开启POP3、SMTP服务生成的密码）
}
/**
 * 1001  用户未登录
 * 
 */
module.exports = { app, WXMP, CACHE, cookieConfig, email }