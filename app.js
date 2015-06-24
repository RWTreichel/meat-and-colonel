var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});
var sharedSession = require('express-socket.io-session');
var Game = require('./server/game.js');
var spec = require('./server/deckSpec');
var game, readyCount = 0;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/client'));

// Attach session
app.use(session);

// Share session with io sockets
io.use(sharedSession(session));

// object holds player username, socket id, and password
var players = {};

io.on('connection', function(socket) {
  // Accept a login event with user's data
  socket.on('login', function(userdata) {
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();

    if (players[userdata.username]){
      // check for password match
      if (userdata.password === players[userdata.username].password) {
        // Move on with valid login stuff...
        console.log("Welcome back!");
        players[userdata.username].socket = socket.id;
      } else {
        // Invalid login handling...
        console.log('Wrong password!');
      }
    } else {
      // If player is logging in for the first time, register
      // their info on the players object
      players[ userdata.username ] = { 
        password: userdata.password,
        color: userdata.color, 
        numMeeps: 7, 
        socket: socket.id,
        ready: false
      };
      console.log(players);
    }
    io.emit('numReady', {ready: readyCount, total: Object.keys(players).length});
  });

  socket.on('logout', function(userdata) {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      // Save the data to the session store
      socket.handshake.session.save();
        io.emit('numReady', {ready: readyCount, total: Object.keys(players).length});

    }
  });

  socket.on('endTurn', function(data) { // data will be the tile they placed

   // verify that player ending turn, is actually the current player
    var name = game.players[ game.currentPlayer ];

    if (players[name].socket === socket.id) {
      var gameState = game.update(data); // return gamestate

      // makes 'nextPlayer' the socket id; client needs to check this
      // to decide if it is their turn;
      gameState.nextPlayer = players[ gameState.nextPlayer ].socket;

      // emit next turn to all connected sockets
      io.emit('nextTurn', gameState);
    } else {
      console.log("Not your turn!");
    }
  });

  // indicates that all parties are ready to play
  // potentially refactor to need 'ready' from all connected players
  socket.on('playerReady', function(data){

    // on 'playersRead' emission the client needs to send their username;
    var username = data;

    // so if somehow the wrong username gets sent it won't crash the thing
    if (players[username] === undefined){
      return;
    }

    // mark each player as ready as they emit this. 
    // when all players are ready emit an 'all players ready'

    players[ username ].ready = true;
    readyCount++;

    var allReady = true;
    for(var player in players){
      allReady = allReady && players[player].ready;
    }

    if (allReady) {
      // Makes sure there are between 2 to 5 players logged in
      // if there are, emit that, create the game, emit the first turn stuff;
      if (Object.keys(players).length >= 2 && Object.keys(players).length <= 5) {
        console.log('All players ready!');
        io.emit('allReady', {});
        game = new Game(72, spec, players);
        var gameState = game.initialState();
        gameState.nextPlayer = players[ gameState.nextPlayer ].socket;
        io.emit('nextTurn', gameState);
      } else {
        console.log('Invalid number of players: ', Object.keys(players).length);
      }
    } else {
      // if everyone isn't ready emit the num that are
      io.emit('numReady', {ready: readyCount, total: Object.keys(players).length});
    }
  });

  // send num of meeps and meep color to client side
  socket.on('meepDataReq', function(data) {
    // client side sends current username
    console.log("XXXXXXX", data);
    var numMeeps = players[data.username].numMeeps;
    // var meepColor = players[data.username].color;

    socket.emit('meepDataRes', { numMeeps: numMeeps });
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
