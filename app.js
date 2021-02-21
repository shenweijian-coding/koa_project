
const Koa=require('koa')
const static = require('koa-static')
const router=require('koa-router')()
const cors = require('koa2-cors')
const XMLParser = require('./middlewares/XMLParser')
const bodyParser= require('koa-bodyparser')
// const compress = require('koa-compress');
//引入子模块
var admin=require('./routes/admin.js')
var api=require('./routes/api.js')
var wechat = require('./routes/wechat')
var app=new Koa();
// 代理转发
// 解决跨域
// const options = { threshold: 2048 };
// app.use(compress(options));
app.use(cors({
  gin: 'http://127.0.0.1:8080',    // 前端地址
  credentials: true
}));
app.use(static(__dirname + '/statics'))
// xml转换json
app.use(XMLParser)
app.use(bodyParser());      // 将模块作为koa的中间件引入
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
//启动路由
app.use(router.routes()).use(router.allowedMethods());

// 启动
app.listen(3000, ()=>{
  console.log('服务已经启动')
});









