const https = require('https');
const fs = require('fs');
const WebSocket = require("ws");

let client = null
let pending_requests = {}
let id = 0
  
const wss = new WebSocket.Server({ port: 8084 });
wss.on("connection", ws => {
    console.log("New client connected")
    client = ws

    ws.on("close", () => {
        console.log("Client has disconnected")
        client = null
    })

    ws.on("message", (data) => {
        const { data:postData, headers, status, id:currentId } = JSON.parse(data)

        delete headers["content-encoding"]
        delete headers["content-length"]
        const res = pending_requests[currentId]
        console.log(headers["content-length"])
        console.log(headers)
        console.log(postData)
        console.log(JSON.stringify(postData).length)

        res.writeHead(status, headers)
        res.write(JSON.stringify(postData))
        res.end()
    })
})

const options = {
  key: fs.readFileSync('certificates/key.pem'),
  cert: fs.readFileSync('certificates/cert.pem')
};

https.createServer(options, function (req, res) {
  console.log("m here")

  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    //tutto quello che ora mi serve passare a marchibugio è: method, url, httpVersion, rawHeaders e data
    client.send(JSON.stringify({
      "id": id,
      "method": req.method,
      "url": req.url,
      "httpVersion": req.httpVersion,
      "rawHeaders": req.rawHeaders,
      "data": data,
    }))

    pending_requests[id] = res
  })

}).listen(8082);
