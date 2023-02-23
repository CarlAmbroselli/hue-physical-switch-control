const fs = require('fs')
const YAML = require('yaml');
const http = require('http');
const axios = require('axios');
const url = require('url');
const file = fs.readFileSync('./config.yaml', 'utf8')
config = YAML.parse(file)

let lampKey = '-1';

function init() {
  axios.get(`http://${config.gatewayIp}/api/${config.token}/lights`)
  .then(({data}) => {
    lampKey = Object.keys(data).find(key => data[key].name === config.hueLightName);
    console.log("Ready!");
  });
}

init();

async function handle(switchState) {
  axios.get(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}`)
    .then(({data}) => {
      console.log(lampKey, data)
      const lampState = data.state.on;
      axios.put(`http://${config.gatewayIp}/api/${config.token}/lights/${lampKey}/state`, {
        "on": !lampState,
        "bri": 254
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
