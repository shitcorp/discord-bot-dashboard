const http = require('http')

exports.run = (port) => {
  http.createServer((req, res) => {
    res.write('Hello!')
    res.end()
  }).listen(port)
}