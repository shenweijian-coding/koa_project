const sort = require('../controllers/classify');
const { inviteHandlePeople } = require('../module/activity');
const { isAttention } = require('../module/login');
const { nitu } = require('../module/matter');
const { memberSubNum, validateMember } = require('../module/permission');
var router=require('koa-router')();


router.get('/',async (ctx)=>{
ctx.body = 'api默认'
})
/**
 * 1. 验证是否关注
 *  -未关注
 *      弹出公众号二维码 让用户关注
 *  -已关注
 *      返回素材链接
 */
// 视频播放
router.post('/play',async (ctx)=>{
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    // 用户未登录
    if(!userInfo) {
        ctx.body={
            code: 1001,
            msg: 'success'
        }
        return
    }
    // 验证权限 video视频 播放权限
    const { sign, memberType } = await validateMember(ctx)
    console.log('验证完毕', sign, memberType);
    if (sign === 1002) { // 没有下载权限
        return ctx.body = { code:sign }
    } else if (sign === 1003) {
        return ctx.body = { code:sign }
    } else if (sign === 1004) {
        return ctx.body = { code:sign }
    }
    console.log('开始解析链接')
    // 调用视达解析
    const res = await sort(ctx.request.body)
    // 解析成功 相应次数  -1
    await memberSubNum(ctx, memberType)
    ctx.body ={
        data:'success',
        res
    }
})
// 素材解析
router.post('/matter', async (ctx)=>{
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    // 用户未登录
    if(!userInfo) {
        ctx.body={
            code: 1001,
            msg: 'success'
        }
        return
    }
    // 调用解析
    const res = await sort(ctx.request.body)
    ctx.body ={
        data:'success',
        url: res
    }
})
// 昵图下载
router.post('/nitu', async(ctx)=>{
	// 验证是否关注
	const userInfo = await isAttention(ctx)
	// 用户未登录
	if(!userInfo) {
			ctx.body={
					code: 1001,
					msg: 'success'
			}
			return
	}
	// 昵图网解析开始
	const res = await nitu(ctx)
	ctx.body = {
		url: res
	}
})
// 邀请人
router.get('/invite', async (ctx)=>{
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    const res = await inviteHandlePeople(ctx.query)
    ctx.body = res
})
module.exports=router.routes();