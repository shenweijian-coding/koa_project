// const axios = require('axios')
// axios({url:'https://shida66.com/1470.html'})
//   .then(res=>{
//    console.log(res.data);
//   //  console.log(res.data.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,""));
// })
const url = 'jQuery17103538063143495809_1611489882849({"status":1,"downurl":"http:\/\/file03.tuke88.com\/202102031346\/f7c794ac5b9cb4101a71cacf777d8251\/zip\/10\/08\/36\/3\/5fa1270553e41.zip"});'
const downurl = JSON.parse(url.match(/{(\S*)}/)[0]).downurl
console.log(downurl);