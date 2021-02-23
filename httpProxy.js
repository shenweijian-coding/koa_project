var httpProxy = require('http-proxy');
const http = require('http')
var proxy = httpProxy.createProxyServer({}); // See (†)

const server = http.createServer(function(req, res) {
  // 众图网  觅知网 需要代理
  let url = ''
  res.setHeader("Access-Control-Allow-Origin","*")
  if(req.url.includes('51miz')) {
    url = 'https://down.51miz.com/'
  } else if(req.url.includes('u')){
    url = 'https://imgpp.ztupic.com/'
  }
  req.headers.referer = url
  delete req.headers.host;
  proxy.web(req, res, { target: url });
});
proxy.on('error', function(e) {
  console.log(e);
});
server.listen(3001)
