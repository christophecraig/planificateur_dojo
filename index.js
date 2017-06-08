var express = require('express')
var app = express()
var path = require('path')
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var peopleConnected = 0

app.set('port', (process.env.PORT || 8080))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  peopleConnected ++
  console.log('Il y a ' + peopleConnected + 'personnes connectées')
  var edited = []
  socket.on('editing', function(dev) {
    edited.push(dev)
  })
  socket.on('disconnect', function() {
    peopleConnected --
    console.log('Il y a ' + peopleConnected + 'personnes connectées')
  })
})

http.listen(8080, function() {
  console.log('listening on :8080')
})