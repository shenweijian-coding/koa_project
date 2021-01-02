const request = require('../utils/request')
const DB = require('../db/db')
// 视达网
async function shida(){
  const data = 'vid=2342'
  const result = await DB.find('cookie',{ name:'shida' })
  console.log('开始查找cookie')
  const Cookie = result[0].cookie
  console.log(Cookie)
  if(!Cookie) return
  return new Promise(async (resolve,reject)=>{
    try {
      const res = await request({
        url:'https://shida66.com/?c=VideoInfo&a=getNowPlayUrl',
        method: 'POST',
        data,
        headers:{
          'Cookie':Cookie
        }
      })
      console.log(res)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
module.exports={
  shida
}