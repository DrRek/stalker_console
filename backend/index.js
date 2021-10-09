const proxy_server = require("./app/servers/proxy_server")
require("./app/servers/web_socket_server")
require("./app/servers/web_server")

proxy_server.create()