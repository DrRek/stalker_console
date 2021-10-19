const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const uuid = require("uuid");

let clients = {};

const wss = new WebSocket.Server({ port: 8084 });
wss.on("connection", (ws, req) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    ws.close(3000, { message: "No token provided!" })
    return
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err)
      ws.close(3000, { message: "Unauthorized!" })
      return
    }
    req.userId = decoded.id;

    console.log("New client connected");
    clients[req.userId] = {
      "client": ws,
      "pending_requests": {}
    };

    ws.on("close", () => {
      console.log("Client has disconnected");
      delete clients[req.userId]
    });

    ws.on("message", (data) => {
      const {
        data: postData,
        headers,
        status,
        id: currentId,
      } = JSON.parse(data);
      console.log("proxied response from client")

      delete headers["content-encoding"];
      delete headers["content-length"];

      const { pending_requests } = clients[req.userId]
      const res = pending_requests[currentId];

      res.writeHead(status, headers);
      res.write(JSON.stringify(postData));
      res.end();
    });
  });
});
console.log("web socket is listening on port 8084");

const options = {
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
};

https
  .createServer(options, function (req, res) {
    const user_id_mongo = req.headers["user-id-mongo"]
    delete req.headers["user-id-mongo"]
    const request_id = uuid.v4()

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const { client, pending_requests } = clients[user_id_mongo]
      client.send(
        JSON.stringify({
          id: request_id,
          method: req.method,
          url: req.url,
          httpVersion: req.httpVersion,
          rawHeaders: req.rawHeaders,
          data: data,
        })
      );
      pending_requests[request_id] = res;
    });
  })
  .listen(8082);
console.log("https server for socket is listening on port 8082");
