const fs = require('fs')
const YAML = require('yaml');
const http = require('http');
import axios from 'axios';
const url = require('url');
const file = fs.readFileSync('./config.yaml', 'utf8')
config = YAML.parse(file)

let lampKey = '-1';

function init() {
  axios.get(`http://${config.gatewayIp}/api/${config.token}/lights`)
  .then(hueStatus => {
    lampKey = Object.keys(hueStatus).find(key => hueStatus[key].name === config.hueLightName);
    console.log("Ready!");
  });
}

init();

async function handle(switchState) {
  axios.get(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}`)
    .then(hueStatus => {
      console.log(lampKey, hueStatus)
      const lampState = hueStatus.state.on;
      axios.put(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}/state`, {
        "on": !lampState,
        "bri": 255
      }).then(() => { console.log("toggled lamp state to " + !lampState + new Date()); });
    }); 
}

http.createServer(function (req, res) {
  const query = url.parse(req.url,true).query; 
  const switchState = query.state; 
  handle(switchState);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("");
}).listen(config.localServerPort);
