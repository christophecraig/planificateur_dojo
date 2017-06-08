var express = require('express')
var app = express()
var path = require('path')
var http = require('http').createServer(app)
app.set('port', (process.env.PORT || 8080))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

http.listen(8080, function() {
  console.log('listening on :8080')
})