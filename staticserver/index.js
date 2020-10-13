const path = require('path');
const express = require('express')
const morgan = require('morgan');
const expressStaticGzip = require('express-static-gzip');

const staticDir = path.join(__dirname, 'dist');

const ENVs = [
  'IRENE_API_HOST',
  'IRENE_DEVICEFARM_HOST',
  'IRENE_DEVICEFARM_URL',
  'IRENE_API_SOCKET_PATH',
  'ENTERPRISE',
  'IRENE_SHOW_LICENSE',
  'IRENE_ENABLE_REGISTRATION',
  'WHITELABEL_ENABLED',
  'WHITELABEL_NAME',
  'WHITELABEL_LOGO',
  'WHITELABEL_THEME'
]

const app = express();
function getRuntimeConfig() {
  const content = {};
  for (const env of ENVs) {
    const value = process.env[env];
    if(value) {
      content[env] = value;
    }
  }
  return JSON.stringify(content);
}
app.use(morgan('tiny'));
app.get('/runtimeconfig.js', function(req, res){
  const config = `var runtimeGlobalConfig=${getRuntimeConfig()};`;
  res.send(config);
})
app.use(expressStaticGzip(staticDir, {
  serveStatic: {
    'index': ['index.html']
  }
}))
app.use(function(req, res) {
  res.sendFile(path.join(staticDir, "index.html"))
})
app.listen(4200, function(){
  console.log('server listening on port ' + 4200);
})
