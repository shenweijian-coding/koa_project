var httpProxy = require('http-proxy');
const http = require('http')
var proxy = httpProxy.createProxyServer({}); // See (†)

const server = http.createServer(function(req, res) {
  res.setHeader("Access-Control-Allow-Origin","*");
  const url = 'https://down.51miz.com/'
  req.headers.referer = url
  delete req.headers.host;
  proxy.web(req, res, { target: url });
});
proxy.on('error', function(e) {
  console.log(e);
});
server.listen(3001)
