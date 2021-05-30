const DB = require('../db/db')
const { redis } = require('../utils/dbHelper')
const { baotu, liutu, miyuansu, qianku, qiantu, sheji90, shetu, tujingling, tukebaba, wotu, xiongmao, mizhi, zhongtu } = require('../module/matter')
const { huke, shida, videoFileDown, fileDownHuke } = require('../module/video');
module.exports = async function sort(ctx) {
  return new Promise(async(resolve,reject)=>{
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
    const cookie = result[0].cookie[i]
    if (++i >= cookieLength) i = 0
    redis.set(curDownWebName,i)
    console.log(curDownWebName);
    const resData = eval(`await ${curDownWebName}(${JSON.stringify(reqData)},${JSON.stringify(cookie)})`)
    // return resData
    resolve(resData)
  })
}
