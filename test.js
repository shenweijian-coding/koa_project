const axios = require('axios')
axios({url:'https://shida66.com/1470.html'})
  .then(res=>{
   console.log(res.data);
  //  console.log(res.data.match(/Params.vid = '(\S*)';/)[0].replace(/[^0-9]/ig,""));
})