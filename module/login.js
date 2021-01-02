function isAttention(ctx){
  return new Promise((resolve, reject)=>{
    let cookies = ctx.cookies.get('eventKey')
    let cookies2 = ctx.cookies.get('openID')
    console.log("cookie", cookies, cookies2)
    
    if(cookies){
      resolve(true)
    }else{
      resolve(false)
    }
  })
}
module.exports = { isAttention }