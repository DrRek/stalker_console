const fs = require('fs')
const Sniffer = require('web-proxy-sniffer')

module.exports = {
    create: () => {
        const proxy = Sniffer.createServer({
            certAuthority: {
                key: fs.readFileSync(`certificates/key.pem`),
                cert: fs.readFileSync(`certificates/cert.pem`)
            }
        })
    
        proxy.intercept({
            // Intercept before the request is sent
            phase: 'request'
        }, (request, response) => {
            console.log(request.headers)
            request.hostname = "localhost"
            request.headers.host = "localhost"
            request.port = 8084
            return request
        })
    
        proxy.intercept({
            // Intercept before the request is sent
            phase: 'response'
        }, (request, response) => {
            console.log(response)
            return response
        })
    
        proxy.listen(8083)
    }
}