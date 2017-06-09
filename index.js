var express = require('express')
var app = express()
var path = require('path')
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var peopleConnected = 0

app.use(express.static(path.join(__dirname, 'public'))) // Cette ligne permet de lire le contenu du dossier 'public'

// Cela fait que peu importe ce qu'il y a après le '/', on retombera sur la page 'index.html'
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {

  peopleConnected++
  console.log('Il y a ' + peopleConnected + 'personnes connectées')
  var edited = []

  socket.on('editing', function (dev) {
    console.log('someone is editing ' + dev)
    edited.push(dev)
    if (edited.length === 2) {
      if (edited[0] === edited[1]) {
        socket.emit('blockEdit', dev)
      }
      edited.shift()
    }
  })

  socket.on('disconnect', function () {
    peopleConnected--
    console.log('Il y a ' + peopleConnected + 'personnes connectées')
  })

})

http.listen(8080, function () {
  console.log('listening on :8080')
})