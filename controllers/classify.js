const DB = require('../db/db')
const { redis } = require('../utils/dbHelper')
const { baotu, liutu, miyuansu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotu, xiongmao, mizhi, zhongtu } = require('../module/matter')
const { huke, shida, videoFileDown, fileDownHuke } = require('../module/video');
module.exports = async function sort(ctx) {
  const { reqData, urlType } = ctx
  const webMap = new Map([
    [8, 'fileDownHuke'],
    [9, 'videoFileDown'],
    [10, 'shida'],
    [11, 'huke'],
    [12, 'qiantu'],
    [13, 'qianku'],
    [14, 'baotu'],
    [15, 'shetu'],
    [25, 'zhongtu'],
    [17, 'sheji90'],
    [18, 'liutu'],
    [19, 'xiongmao'],
    [20, 'tukebaba'],
    [21, 'tujingling'],
    [22, 'wotu'],
    [23, 'miyuansu'],
    [24, 'mizhi'],
  ])
  const curDownWebName = webMap.get(urlType)
  // 查找cookie
  const result = await DB.find('cookie', { name: curDownWebName })
  // 先取出 cookie 的长度
  const cookieLength = result[0].cookie.length
  let i = await redis.get(curDownWebName) || 0
  console.log(i);
  const cookie = result[0].cookie[i]
  if (++i >= cookieLength) i = 0
  redis.set(curDownWebName,i)
  console.log(curDownWebName);
  const resData = await eval(`${curDownWebName}(${JSON.stringify(reqData)},${JSON.stringify(cookie)})`)
  return resData

  // switch (urlType) {
  //   case 8: // 视频素材下载 虎课
  //     resData = await fileDownHuke(reqData)
  //     break
  //   case 9: // 视频素材下载 视达
  //     resData = await videoFileDown(reqData)
  //     break
  //   case 10: // 视达
  //     resData = await shida(reqData)
  //     break;
  //   case 11: // 虎课
  //     resData = await huke(reqData)
  //     break;
  //   case 12: // 千图
  //     resData = await qiantu(reqData)
  //     break; // 千库
  //   case 13: // 千库网
  //     resData = await qianku(reqData)
  //     break;
  //   case 14: // 包图
  //     resData = await baotu(reqData)
  //     break;
  //   case 15: // 摄图
  //     resData = await shetu(reqData)
  //     break;
  //   case 17: // 90设计
  //     resData = await sheji90(reqData)
  //     break;
  //   case 18: // 六图
  //     resData = await liutu(reqData)
  //     break;
  //   case 19: // 熊猫
  //     resData = await xiongmao(reqData)
  //     break;
  //   case 20: // 图克巴巴
  //     resData = await tukebaba(reqData)
  //     break;
  //   case 21: // 图精灵
  //     resData = await tujingling(reqData)
  //     break;
  //   case 22: // 我图VIP
  //     resData = await wotu(reqData)
  //     break;
  //   case 23: // 觅元素
  //     resData = await miyuansu(reqData)
  //     break;
  //   case 24: // 觅知网
  //     resData = await mizhi(reqData)
  //     break;
  //   case 25: // 众图网
  //     resData = await zhongtu(reqData)
  //     break;
  //   default:
  //     resData = { msg:'未找到对应site' }
  //     break;
  // }
}
