
const Koa=require('koa')
const static = require('koa-static')
const router=require('koa-router')()
const cors = require('koa2-cors')
const XMLParser = require('./middlewares/XMLParser')
const bodyParser= require('koa-bodyparser')
// const sslify = require('koa-sslify').default;
const path = require('path')
const compress = require('koa-compress');
//引入子模块
const admin=require('./routes/admin.js')
const api=require('./routes/api.js')
// const https = require('https')
// const http = require('http')
const fs = require('fs')
const wechat = require('./routes/wechat')
const app=new Koa();
// 代理转发
// 解决跨域
const options = {
  threshold: 1024
}
app.use(compress(options))
const httpsOption = {
  key: fs.readFileSync('./config/2_clumsybird.work.key'),
  cert: fs.readFileSync('./config/1_clumsybird.work.pem'),
} 
// app.use(cors({
//    origin: 'http://localhost:8080',
//    credentials: true
//  }));
// xml转换json
app.use(XMLParser)
app.use(bodyParser());      // 将模块作为koa的中间件引入
app.use(static(path.resolve(__dirname + '/statics')),{
  setHeaders:(res, path, stats)=>{
    res.setHeaders({'Cache-Control':'max-age=60' })
  }
})
// app.use(sslify)
/*
  /admin   配置子路由  层级路由
 /admin/user
 */
router.use('/admin',admin.routes());
/*
 /api/
 */
router.use('/api',api);   /*在模块里面暴露路由并且启动路由*/

/**
 * wechat
 */
router.use('/wechat',wechat)

app.use(async (ctx, next) => {
  await next();
  if(parseInt(ctx.status) === 404 ){
    ctx.response.redirect("/")
  }
})
//启动路由
app.use(router.routes()).use(router.allowedMethods());

// http.createServer(app.callback()).listen(3000)
// https.createServer(httpsOption, app.callback()).listen(3001)
// 启动
app.listen(80, ()=>{
  console.log('服务已经启动')
});









