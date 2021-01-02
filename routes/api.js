const { shida } = require('../module/video');
const { isAttention } = require('../module/login')
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
router.get('/play',async (ctx)=>{
    // 验证是否关注
    const userInfo = await isAttention(ctx)
    // console.log(ctx.header);
    if(!userInfo) {
        ctx.body={
            code: -1,
            msg: '您还未关注登录，无法使用，请先关注！'
        }
        return
    }
    console.log('开始解析链接')
    // 调用视达解析
    const res = await shida()
    ctx.body ={
        data:'success',
        res
    }
})

module.exports=router.routes();