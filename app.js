
const Koa=require('koa')
const router=require('koa-router')()
const cors = require('koa2-cors')
const XMLParser = require('./middlewares/XMLParser')
const bodyParser= require('koa-bodyparser')
//引入子模块
var admin=require('./routes/admin.js')
var api=require('./routes/api.js')
var wechat = require('./routes/wechat')
var app=new Koa();
// 代理转发
// 解决跨域
app.use(cors({
  origin: 'http://localhost:8080',    // 前端地址
  credentials: true
}));
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









