var express = require('express');
var bodyParser = require('body-parser');
// var session = require('express-session');
var game = require('./server/game.js');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
var sharedSession = require("express-socket.io-session");

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/client'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// Attach session
app.use(session);

// Share session with io sockets
io.use(sharedSession(session));

var players = {};

io.on('connection', function(socket) {
  // Accept a login event with user's data
  socket.on('login', function(userdata) {
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();
    // console.log(socket.handshake.session);

    if (players[userdata.username]){
      // check for pword match
      if (userdata.password === players[userdata.username]) {
        // Move on with valid login stuff...
      } else {
        // Invalid login handling...
      }
    } else {
      players[userdata.username] = userdata.password;
    }

    
  });
  socket.on('logout', function(userdata) {
    console.log('logout: ', userdata);
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      // Save the data to the session store
      socket.handshake.session.save();
    }
  });

  socket.on('test', function(data){
    var user = socket.handshake.session.userdata.username;
    console.log(user, socket.id);

  });

  // socket.emit('currentTile', game.deck.pop());
  // socket.on('test2', function(data) {
  //   console.log(data);
  // });
  // socket.on();
});




// app.post('/api/placetile', function(req, res) {
//   var data = req.body;
//   console.log('Received the following from the client: ' + JSON.stringify(data));

//   var tile = game.deck.pop();
//   tile.x = data.x;
//   tile.y = data.y;
//   game.placeTile(tile);

//   console.log('Tile placed on board: ' + JSON.stringify(game.board[data.x][data.y]));

//   res.status(200).json({x: data.x, y: data.y, "tile": tile});
// });

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;