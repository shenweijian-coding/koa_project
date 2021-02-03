// import { baotu, liutu, miyuansu, nitu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotuvip } from "../module/matter"
// import { huke, shida } from "../module/video"
const { baotu, liutu, miyuansu, nitu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotuvip } = require('../module/matter')
const { huke, shida } = require('../module/video')
module.exports = async function sort(ctx) {
  const { reqData, urlType } = ctx
  console.log(reqData, urlType);
  let resData
  // 根据传过来的ctx判断是哪个网站的链接
  // const siteInfo = ['shida', 'huke', '51yuansu', 'nipic', '16pic', 'tukuppt', '699pic', '90sheji', 'ooopic']
  switch (urlType) {
    case 10: // 视达
      resData = await shida(reqData)
      break;
    case 11: // 虎课
      resData = await huke(reqData)
      break;
    case 12: // 千图
      resData = await qiantu(reqData)
      break; // 千库
    case 13:
      resData = await qianku(reqData)
      break;
    case 14: // 包图
      resData = await baotu(reqData)
      break;
    case 15: // 摄图
      resData = await shetu(reqData)
      break;
    case 16: // 昵图
      resData = await nitu(reqData)
      break;
    case 17: // 90设计
      resData = await sheji90(reqData)
      break;
    case 18: // 六图
      resData = await liutu(reqData)
      break;
    case 19: // 熊猫
      resData = await xiongmao(reqData)
      break;
    case 20: // 图克巴巴
      resData = await tukebaba(reqData)
      break;
    case 21: // 图精灵
      resData = await tujingling(reqData)
      break;
    case 22: // 我图VIP
      resData = await wotuvip(reqData)
      break;
    case 23: // 觅元素
      resData = await miyuansu(reqData)
      break;
    default:
      resData = { msg:'未找到对应site' }
      break;
  }
  return resData
}
