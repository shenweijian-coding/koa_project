// const axios = require('axios')
const request = require('./utils/request')
// axios.get('https://download.51miz.com/?m=download&a=download&id=1154782&plate_id=17&format=image',{maxRedirects: 0
// }).then(res=>{
//    console.log(res.headers);
  //  console.log(res.data.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,""));
// })
// const url = 'jQuery17103538063143495809_1611489882849({"status":1,"downurl":"http:\/\/file03.tuke88.com\/202102031346\/f7c794ac5b9cb4101a71cacf777d8251\/zip\/10\/08\/36\/3\/5fa1270553e41.zip"});'
// const downurl = JSON.parse(url.match(/{(\S*)}/)[0]).downurl
// console.log(downurl);
request({
  url:'https://download.51miz.com/?m=download&a=download&id=569028&plate_id=18',
  maxRedirects: 0,
  headers:{
    Cookie:'ustk=20210202_3083233168_440642505; 51miz_auth=d5b2S0sHrCXUV4vjBWDM1o04L1MCQxV8lTPkygi0MRON9urDNRDN1tPd2gf5GOPmkLJM2PSSTUThOs4Y4UlUc5G7BqZwxmZNZVIVK%2FaxRQ3DJBX7PSDhbTgiVeeapoOYvc2Vpti0YtppI%2FanFPuMv1YOLcpRvLPa3JaNhHN%2FGlp8lsCdML%2Fo9crP1k%2F%2B4AaeQRMaIFJtJpeRi9Qs4svmWs3wlqnkRmu7wM%2BYD1phKm2vEnTaJddZWKKogiCEDlhNCrMYbUqMuEt8bGKa%2FFSog12SByhgf7DuS1oMfTgtiGSFPlgqDiHR8peYrkMRuoe5B%2B0P%2B%2BMrMtumMeGehaQm0BuH702ngQPzrXSJ79ic3yoXnyiIOR0J5JJ4DoCPzJ73mHyqQ1%2BbsH63QgcSPRKU7V8q1LPy3WZEvPFvSWR2ml9voxW9RWla9Al%2F19SvHw; semplan=1; semunit=1; semkeywordid=1; semsource=1; ufrom=111; couponSign=1; Qs_lvt_158497=1612229306%2C1612353680%2C1612402216; Hm_lvt_d8453059bf561226f5e970ffb07bd9d2=1609851314,1612229306,1612353681,1612402216; Hm_lvt_aa0de2c55d65303b7191698178841e01=1609851314,1612229306,1612353681,1612402217; Hm_lvt_819233eaec5f3d414484d07a53aba86a=1609851314,1612229306,1612353681,1612402217; backurl=https%3A%2F%2Fwww.51miz.com%2F%3Fm%3Ddownload%26id%3D1154782%26plate_id%3D17%26format%3Dimage; Qs_pv_158497=3940303491307828700%2C1287301287565929700%2C3462809851709833700%2C544883914118815200%2C948570351098134700; Hm_lpvt_819233eaec5f3d414484d07a53aba86a=1612402329; Hm_lpvt_aa0de2c55d65303b7191698178841e01=1612402330; Hm_lpvt_d8453059bf561226f5e970ffb07bd9d2=1612402330'
  }
}).then(res=>{
  console.log(res);
},err=>{
  console.log(err);
})