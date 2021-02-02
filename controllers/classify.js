// import { baotu, liutu, miyuansu, nitu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotuvip } from "../module/matter"
// import { huke, shida } from "../module/video"
const { baotu, liutu, miyuansu, nitu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotuvip } = require('../module/matter')
const { huke, shida } = require('../module/video')
module.exports = async function sort(ctx) {
  const { urlLink, urlType } = ctx
  console.log(urlLink, urlType);
  let resData
  // 根据传过来的ctx判断是哪个网站的链接
  // const siteInfo = ['shida', 'huke', '51yuansu', 'nipic', '16pic', 'tukuppt', '699pic', '90sheji', 'ooopic']
  switch (urlType) {
    case 10: // 视达
      resData = await shida(urlLink)
      break;
    case 11: // 虎课
      resData = await huke(urlLink)
      break;
    case 12: // 千图
      resData = await qiantu(urlLink)
      break; // 千库
    case 13:
      resData = await qianku(urlLink)
      break;
    case 14: // 包图
      resData = await baotu(urlLink)
      break;
    case 15: // 摄图
      resData = await shetu(urlLink)
      break;
    case 16: // 昵图
      resData = await nitu(urlLink)
      break;
    case 17: // 90设计
      resData = await sheji90(urlLink)
      break;
    case 18: // 六图
      resData = await liutu(urlLink)
      break;
    case 19: // 熊猫
      resData = await xiongmao(urlLink)
      break;
    case 20: // 图克巴巴
      resData = await tukebaba(urlLink)
      break;
    case 21: // 图精灵
      resData = await tujingling(urlLink)
      break;
    case 22: // 我图VIP
      resData = await wotuvip(urlLink)
      break;
    case 23: // 觅元素
      resData = await miyuansu(urlLink)
      break;
    default:
      resData = { msg:'未找到对应site' }
      break;
  }
  return resData
}
