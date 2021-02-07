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
  url:'https://huke88.com/course/67312.html'
}).then(res=>{
  const res2 = res.match(/csrf-token" content="(\S*)"/)[1]
  console.log(res2);
},err=>{
  console.log(err);
})