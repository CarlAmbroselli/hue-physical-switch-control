const fs = require('fs')
const YAML = require('yaml');
const http = require('http');
const fetch = require('node-fetch');
const url = require('url');
const file = fs.readFileSync('./config.yaml', 'utf8')
config = YAML.parse(file)

let lampKey = '-1';

function init() {
  fetch(`http://${config.gatewayIp}/api/${config.token}/lights`)
  .then(res => res.json())
  .then(hueStatus => {
    lampKey = Object.keys(hueStatus).find(key => hueStatus[key].name === config.hueLightName);
    console.log("Ready!");
  });
}

init();

async function handle(switchState) {
  fetch(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}`)
    .then(res => res.json())
    .then(hueStatus => {
      console.log(lampKey, hueStatus)
      const lampState = hueStatus.state.on;
      fetch(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}/state`, {
          "method": "PUT",
          "headers": {
                "Content-Type": "application/json; charset=utf-8"
          },
          "body": `{"on":${!lampState}}`
      }).then(() => { console.log("toggled lamp state to " + !lampState); });
    }); 
}

http.createServer(function (req, res) {
  const query = url.parse(req.url,true).query; 
  const switchState = query.state; 
  handle(switchState);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("");
}).listen(config.localServerPort);
