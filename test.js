const axios = require('axios')
const request = require('./utils/request')
const dayjs = require('dayjs')
const DB = require('./db/db')
// const { redis } = require('./utils/dbHelper')
// axios.get('https://download.51miz.com/?m=download&a=download&id=1154782&plate_id=17&format=image',{maxRedirects: 0
// }).then(res=>{
//    console.log(res.headers);
  //  console.log(res.data.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,""));
// })
// const url = 'jQuery17103538063143495809_1611489882849({"status":1,"downurl":"http:\/\/file03.tuke88.com\/202102031346\/f7c794ac5b9cb4101a71cacf777d8251\/zip\/10\/08\/36\/3\/5fa1270553e41.zip"});'
// const downurl = JSON.parse(url.match(/{(\S*)}/)[0]).downurl
// console.log(downurl);
// request({
//   url:'https://huke88.com/course/66688.html',
//   headers: {
//     Cookie:'uuid=502578eae2b49534ec71efc27447c40cc075642ad0a774de08dafa22ada11f5ca%3A2%3A%7Bi%3A0%3Bs%3A4%3A%22uuid%22%3Bi%3A1%3Bs%3A32%3A%2230434426190437eabf376f73d92d9b43%22%3B%7D; FIRSTVISITED=1612244718.94; ISREQUEST=1; login-type=2786360247a6020d6206ee246d88ac1ebcd5b4b63683977f9b320bcc8d114ab4a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22login-type%22%3Bi%3A1%3Bs%3A2%3A%22qq%22%3B%7D; WEBPARAMS=is_pay=1; _identity-usernew=feb85dec0d8462a9915c8bacd8af0208bcf7d37ce0ea279b34518f79f59202fea%3A2%3A%7Bi%3A0%3Bs%3A17%3A%22_identity-usernew%22%3Bi%3A1%3Bs%3A52%3A%22%5B1936955%2C%22yh65ZWQ3i35V5nb_X9ZAEy1mP2rPMtk4%22%2C2592000%5D%22%3B%7D; uv=e76ecd91e942cd3e07b04e3de1055b87b183bd761e6f014445738557738ecf11a%3A2%3A%7Bi%3A0%3Bs%3A2%3A%22uv%22%3Bi%3A1%3Bs%3A32%3A%224f5dca0cdf605c266557da29f3d67213%22%3B%7D; REFERRER_SITE=8f223567ff85754f8768f5c59fb4eade781b3c93e51cad798374e52b6c10204ca%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22REFERRER_SITE%22%3Bi%3A1%3Bs%3A8%3A%22baiduSEO%22%3B%7D; REFERRER_SITE_KEYWORD=ebe40329e63712c0c0f4ba536d3ab401e4da691296b444c7a2ac406afe69c743a%3A2%3A%7Bi%3A0%3Bs%3A21%3A%22REFERRER_SITE_KEYWORD%22%3Bi%3A1%3Bs%3A7%3A%221000000%22%3B%7D; requestChannel=3b64c143d4796bae8aa985f9110f3b4ea19b1d358acc0f88b2618dddacb66195a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22requestChannel%22%3Bi%3A1%3Bs%3A10%3A%22seo%7Cbaidu%7C%22%3B%7D; REFERRER_STATISTICS_RECHARGE=2201e7e7450e08bcec45ee23319619951086f5e799ec46a390fbfeb63ae52580a%3A2%3A%7Bi%3A0%3Bs%3A28%3A%22REFERRER_STATISTICS_RECHARGE%22%3Bi%3A1%3Bi%3A2009%3B%7D; firstVisitData=b20dfed6dff68a625a0e90d2670b00296c986c8db9889a550cd70ebd4a1283f5a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22firstVisitData%22%3Bi%3A1%3Bi%3A1936955%3B%7D; ALLVIP_EXPIRE_FIRST=fbe6d758848746f9fae60bd7dd86a07580d660ab49523e345ee8b1869424ee67a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22ALLVIP_EXPIRE_FIRST%22%3Bi%3A1%3Bi%3A1%3B%7D; IPSTRATIFIED=966e40c1416b75359e7b3f341114a552dfae4dfca5e31e2507764146d446f05ca%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22IPSTRATIFIED%22%3Bi%3A1%3Bi%3A1%3B%7D; ACTIVITY_20201221=1; advanced-frontend=qara2hk0nhfqolu8erio7r4c55; _csrf-frontend=48c0ed3d5120c9dc42079d00f371db687c05237b6ece1bdf0ed970f49db17f5ea%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%224oSEEbNlK-wpgChLFlp9VR7PgIYWnKiX%22%3B%7D; Hm_lvt_a0e66ced62f1926ee48b5f059ad9f039=1612833717,1612833866,1612915945,1612920628; REFERRER_COME_HOST=298dadf6c35598f14de2184c5427a9add3039a42c2948a566e50f3b75903b7c6a%3A2%3A%7Bi%3A0%3Bs%3A18%3A%22REFERRER_COME_HOST%22%3Bi%3A1%3Bi%3A9%3B%7D; Hm_lpvt_a0e66ced62f1926ee48b5f059ad9f039=1612921168'
//   }
// }).then(res1=>{
//   const sign =  res1.match(/csrf-token" content="(\S*)"/)[1]
//   console.log(sign);
//   request({
//     url:'https://huke88.com/download/ajax-download-source-case',
//     method: 'POST',
//     data:`id=66688&type=1&studySourceId=1&confirm=0&_csrf-frontend=${sign}`,
//     headers: {
//       Cookie:'uuid=502578eae2b49534ec71efc27447c40cc075642ad0a774de08dafa22ada11f5ca%3A2%3A%7Bi%3A0%3Bs%3A4%3A%22uuid%22%3Bi%3A1%3Bs%3A32%3A%2230434426190437eabf376f73d92d9b43%22%3B%7D; FIRSTVISITED=1612244718.94; ISREQUEST=1; login-type=2786360247a6020d6206ee246d88ac1ebcd5b4b63683977f9b320bcc8d114ab4a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22login-type%22%3Bi%3A1%3Bs%3A2%3A%22qq%22%3B%7D; WEBPARAMS=is_pay=1; _identity-usernew=feb85dec0d8462a9915c8bacd8af0208bcf7d37ce0ea279b34518f79f59202fea%3A2%3A%7Bi%3A0%3Bs%3A17%3A%22_identity-usernew%22%3Bi%3A1%3Bs%3A52%3A%22%5B1936955%2C%22yh65ZWQ3i35V5nb_X9ZAEy1mP2rPMtk4%22%2C2592000%5D%22%3B%7D; uv=e76ecd91e942cd3e07b04e3de1055b87b183bd761e6f014445738557738ecf11a%3A2%3A%7Bi%3A0%3Bs%3A2%3A%22uv%22%3Bi%3A1%3Bs%3A32%3A%224f5dca0cdf605c266557da29f3d67213%22%3B%7D; REFERRER_SITE=8f223567ff85754f8768f5c59fb4eade781b3c93e51cad798374e52b6c10204ca%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22REFERRER_SITE%22%3Bi%3A1%3Bs%3A8%3A%22baiduSEO%22%3B%7D; REFERRER_SITE_KEYWORD=ebe40329e63712c0c0f4ba536d3ab401e4da691296b444c7a2ac406afe69c743a%3A2%3A%7Bi%3A0%3Bs%3A21%3A%22REFERRER_SITE_KEYWORD%22%3Bi%3A1%3Bs%3A7%3A%221000000%22%3B%7D; requestChannel=3b64c143d4796bae8aa985f9110f3b4ea19b1d358acc0f88b2618dddacb66195a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22requestChannel%22%3Bi%3A1%3Bs%3A10%3A%22seo%7Cbaidu%7C%22%3B%7D; REFERRER_STATISTICS_RECHARGE=2201e7e7450e08bcec45ee23319619951086f5e799ec46a390fbfeb63ae52580a%3A2%3A%7Bi%3A0%3Bs%3A28%3A%22REFERRER_STATISTICS_RECHARGE%22%3Bi%3A1%3Bi%3A2009%3B%7D; firstVisitData=b20dfed6dff68a625a0e90d2670b00296c986c8db9889a550cd70ebd4a1283f5a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22firstVisitData%22%3Bi%3A1%3Bi%3A1936955%3B%7D; ALLVIP_EXPIRE_FIRST=fbe6d758848746f9fae60bd7dd86a07580d660ab49523e345ee8b1869424ee67a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22ALLVIP_EXPIRE_FIRST%22%3Bi%3A1%3Bi%3A1%3B%7D; IPSTRATIFIED=966e40c1416b75359e7b3f341114a552dfae4dfca5e31e2507764146d446f05ca%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22IPSTRATIFIED%22%3Bi%3A1%3Bi%3A1%3B%7D; ACTIVITY_20201221=1; advanced-frontend=qara2hk0nhfqolu8erio7r4c55; _csrf-frontend=48c0ed3d5120c9dc42079d00f371db687c05237b6ece1bdf0ed970f49db17f5ea%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%224oSEEbNlK-wpgChLFlp9VR7PgIYWnKiX%22%3B%7D; Hm_lvt_a0e66ced62f1926ee48b5f059ad9f039=1612833717,1612833866,1612915945,1612920628; REFERRER_COME_HOST=298dadf6c35598f14de2184c5427a9add3039a42c2948a566e50f3b75903b7c6a%3A2%3A%7Bi%3A0%3Bs%3A18%3A%22REFERRER_COME_HOST%22%3Bi%3A1%3Bi%3A9%3B%7D; Hm_lpvt_a0e66ced62f1926ee48b5f059ad9f039=1612921168'
//     }
//   }).then(res=>{
//     console.log(res);
//   },err=>{
//     console.log(err);
//   })
// })

// const day01 = '2021-01-04'
// console.log(dayjs().add(1, 'year').format('YYYY-MM-DD'))
// const day02 = dayjs('2021-3-8').format('YYYY-MM-DD')
// console.log(day01,day02);
// console.log(day01<day02)

// axios({
//   url: 'http://down.nipic.com/download?id=22893084',
//   headers: {
//     Cookie: 'Hm_lvt_d60c24a3d320c44bcd724270bc61f703=1612921212,1613000850,1613092269,1613176108; verifyCode=2dc12ecad790a690; VerifyToken=FTA+rqO7jHUDEj8jpaNcpio73Eyz3Qkj/yvgeEU6mcvPyfmKerGRiXHeYhGLgsK2; NSESSIONID=OWViYWZmOGU0ZTUzNjY1Yl0yMDIxLzAyLzEzIDIwOjI4OjI5XTQ2YjI1NThiOWQyOWYxMWE=|31078584|CB250; NIPICLOGIN=; isQuickLogin=0; NipicCode=4; Hm_lpvt_d60c24a3d320c44bcd724270bc61f703=1613181006Hm_lvt_d60c24a3d320c44bcd724270bc61f703=1612921212,1613000850,1613092269,1613176108; verifyCode=2dc12ecad790a690; VerifyToken=FTA+rqO7jHUDEj8jpaNcpio73Eyz3Qkj/yvgeEU6mcvPyfmKerGRiXHeYhGLgsK2; NSESSIONID=OWViYWZmOGU0ZTUzNjY1Yl0yMDIxLzAyLzEzIDIwOjI4OjI5XTQ2YjI1NThiOWQyOWYxMWE=|31078584|CB250; NIPICLOGIN=; isQuickLogin=0; NipicCode=4; Hm_lpvt_d60c24a3d320c44bcd724270bc61f703=1613181006',
//     Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'  }
// }).then(res=>{
//   const nitufen = res.data.match(/<span><b class="font-tahoma red1"> (\S*) <\/b>/)[1]
//   console.log(nitufen);
// })
// async function test() {
//   for (let i = 0; i < 100; i++) {
//     console.log(i);
//     await sleep(1000)
//   }
// }
// async function sleep(milliSeconds)  {
//   　　return new Promise((resolve, reject) => {
//   　　　setTimeout(() => {
//   　　　　 resolve();
//       }, milliSeconds);
//   　　})
// }
// async function test() {
//   redis.set('test',true,'EX',1)
//   let isGo = await redis.get('test')
//   console.log(isGo)
//   if(!isGo) console.log('是true')
//   await sleep(1000)
//   isGo = await redis.get('test')
//   console.log(isGo)
// }
// test()

// async function test() {
  // console.log('执行');
    // 查找cookie
    // const result = await DB.find('cookie', { name: 'gaoding' })
    // // 先取出 cookie 的长度
    // const cookieLength = result[0].cookie.length
    // let i = await redis.get('gaoding') || 0
    // const cookie = result[0].cookie[i]
    // if (++i >= cookieLength) i = 0
    // redis.set('gaoding',i)
// }
// const tag = 'test'
// eval(`${tag}()`)
// console.log(await redis.get('test'));

const { sendMail } = require('./module/common')
function test() {
  //DB.updateMany('cookie',{ name:'shida' },{ cookie:"100" })
  sendMail('1834638245@qq.com','','摄图','','掉线了')
}
test()