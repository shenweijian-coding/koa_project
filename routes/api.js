const { post } = require('got');
const sort = require('../controllers/classify');
const { inviteHandlePeople } = require('../module/activity');
const { getHomeInfo, getUserInfo, addData, updatePwd, addCookie } = require('../module/common');
const { isAttention, login } = require('../module/login');
const { nitu } = require('../module/matter');
const { pay } = require('../module/pay');
const { memberSubNum, validateMember } = require('../module/permission');
var router = require('koa-router')();


router.get('/', async (ctx) => {
    ctx.body = 'api默认'
})
router.post('/login',async (ctx) => {
    try {
        const msg = await login(ctx)
        ctx.body = {
            msg: msg
        }
    } catch (error) {
        console.log(error)
    }
})
// 获取用户信息
/**
 * 1. 验证是否关注
 *  -未关注
 *      弹出公众号二维码 让用户关注
 *  -已关注
 *      返回素材链接
 */
// 视频播放
router.post('/play', async (ctx) => {
    // 验证是否关注
    const isLogin = await isAttention(ctx)
    // 用户未登录
    if (!isLogin) {
        ctx.body = {
            code: 1001,
            msg: '请先登录'
        }
        return
    }
    // 验证权限 video视频 播放权限
    const { sign, webName = null } = await validateMember(ctx, 1)
    if (sign === 1002) { // 没有下载权限
        return ctx.body = { code: sign, msg: '未赞助，请点击【赞助充值】' }
    } else if (sign === 1003) {
        return ctx.body = { code: sign, msg: '赞助到期，请点击【赞助充值】' }
    } else if (sign === 1004) {
        return ctx.body = { code: sign, msg: '今日次数已用尽，请充值或明日再来~' }
    }
    // 调用
    const res = await sort(ctx.request.body)
    // 解析成功 相应次数  -1
    memberSubNum(ctx, webName)
    ctx.body = {
        code: 1005,
        res
    }
})
// 素材解析
router.post('/matter', async (ctx) => {
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    // 用户未登录
    if (!userInfo) {
        ctx.body = {
            code: 1001,
            msg: '请先登录'
        }
        return
    }
    const { sign, webName = null } = await validateMember(ctx)
    if (sign === 1002) { // 没有下载权限
        return ctx.body = { code: sign, msg: '未赞助，请点击【赞助充值】' }
    } else if (sign === 1003) {
        return ctx.body = { code: sign, msg: '赞助到期，请点击【赞助充值】' }
    } else if (sign === 1004) {
        return ctx.body = { code: sign, msg: '今日次数已用尽，请充值或明日再来~' }
    }
    console.log('开始解析素材');
    // 调用解析
    const res = await sort(ctx.request.body)
    console.log('下载地址'+ res);
    // 解析成功 相应次数  -1
    if(res.toString().indexOf('//') !== -1){
      await memberSubNum(ctx, webName)
      console.log('次数减去');
    }
    ctx.body = {
        code: 1005,
        url: res
    }
})
// 昵图下载
router.post('/nitu', async (ctx) => {
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    // 用户未登录
    if (!userInfo) {
        ctx.body = {
            code: 1001,
            msg: 'error'
        }
        return
    }
    // 昵图网解析开始
    const res = await nitu(ctx)
    if(res.includes('http')){
        ctx.body = {
            code: 1005,
            url: res
        }
    }else{
        ctx.body = {
            code: 1001,
            msg: res
        }
    }
})
// 邀请人
router.get('/invite', async (ctx) => {
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    const res = await inviteHandlePeople(ctx.query)
    ctx.body = res
})
// 测试 ip
router.get('/iptest', async (ctx) => {

})
// 支付接口
/**
 * pay_id 支付人 openId
 * price  价格
 * pay_no 支付订单号
 */
router.post('/pay', async (ctx) => {
  await pay(ctx)
  ctx.body = 'success'
})
// 获取首页信息
router.get('/info', async (ctx) => {
  const res = await getHomeInfo()
  ctx.body = { code: 1, info: res }
})
// 获取账号信息
router.get('/userinfo', async (ctx) => {
  // 验证是否关注
  const userInfo = await isAttention(ctx)
  // 用户未登录
  if (!userInfo) {
    ctx.body = {
      code: 1001,
      msg: 'success'
    }
    return
  }
  const res = await getUserInfo(ctx)
  ctx.body = { info: res }
})
// 新增用户数据
router.post('/add', async(ctx)=> {
	  // 验证是否关注
		const userInfo = await isAttention(ctx)
		// 用户未登录
		if (!userInfo) {
			ctx.body = {
				code: 1001,
				msg: 'success'
			}
			return
		}
	
    await addData(ctx)
			ctx.body = {
					code: 1001,
					msg: '添加成功'
			}
})
// 更新密码
router.post('/updatepwd', async(ctx)=>{
   	  // 验证是否关注
		const userInfo = await isAttention(ctx)
		// 用户未登录
		if (!userInfo) {
			ctx.body = {
				code: 1001,
				msg: 'success'
			}
			return
		}
        const res = await updatePwd(ctx)
        ctx.body = res

})
// 新增cookie
router.post('/addcookie',async(ctx)=>{
    await addCookie(ctx.request.body)
    ctx.body = {}
})
module.exports = router.routes();