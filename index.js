var express = require('express')
var app = express()
var path = require('path')
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var peopleConnected = 0

app.use(express.static(path.join(__dirname, 'public'))) // Cette ligne permet de lire le contenu du dossier 'public'

// Cela fait que sur localhost:8080, on retombera sur la page 'index.html'
app.get(['/'], function (req, res) {
	res.sendFile(__dirname + '/index.html')
}).get(['/detailedProject'], function (req, res) {
	res.sendFile(__dirname + '/index.html')
}).get(['/resource'], function (req, res) {
	res.sendFile(__dirname + '/index.html')
}).get(['/customer'], function (req, res) {
	res.sendFile(__dirname + '/index.html')
}).get(['/infos'], function (req, res) {
	res.sendFile(__dirname + '/index.html')
}).get(['/public/build.js'], function (req, res) {
	res.sendFile(__dirname + '/public/build.js')
})

var edited = []

var cancelDevEdit = function (dev) {
	for (var i = 0; i < edited.length; i++) {
		if (dev == edited[i]) {
			edited.splice(i, 1)
		}
	}
}

io.on('connection', function (socket) {

	var nowEditing = ''
	peopleConnected++
	console.log(peopleConnected + 'personnes connectées')

	socket.on('editing', function (dev) {
		nowEditing = dev
		var blocking = false
		for (var i = 0; i < edited.length; i++) {
			if (nowEditing == edited[i]) {
				socket.emit('blockEdit', nowEditing)
				blocking = true
				console.log(nowEditing, edited[i])
				break
			} else {
				blocking = false
			}
		}
		if (!blocking) edited.push(nowEditing)
		console.log(edited)
	})

	socket.on('stopEdit', function () {
		cancelDevEdit(nowEditing)
		console.log('stopEdit')
	})
	socket.on('disconnect', function () {
		peopleConnected--
		cancelDevEdit(nowEditing)
	})

})

http.listen(8080, function () {
	console.log('listening on :8080')
})