const axios = require('axios')
axios({
  url:'https://down.51miz.com/element/01/15/47/13/51miz-E1154713-177F0A52.png?sign=e933aedfe666d1fb87febbd62491adf7&t=601a9eac&attname=',
  referer:'https://www.51miz.com/'
})
  .then(res=>{
   console.log(res.data);
  //  console.log(res.data.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,""));
})
// const url = 'jQuery17103538063143495809_1611489882849({"status":1,"downurl":"http:\/\/file03.tuke88.com\/202102031346\/f7c794ac5b9cb4101a71cacf777d8251\/zip\/10\/08\/36\/3\/5fa1270553e41.zip"});'
// const downurl = JSON.parse(url.match(/{(\S*)}/)[0]).downurl
// console.log(downurl);