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
var _ = require('lodash');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/client'));
app.use(session);
io.use(sharedSession(session));

// object holds player username, socket id, and password
var players = {};

io.on('connection', function(socket) {
  // Accept a login event with user's data
  socket.on('login', function(userdata) {
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();

    // if player already exists in players obj we want to log them back in and not
    // create a new user or overwrite their existing stuff other than socket id
    // currently useless as the client does not support revival of the lost game state
    if (players[userdata.username]){
      if (userdata.password === players[userdata.username].password) {
        players[userdata.username].socket = socket.id;
      } else {
        // TODO: Invalid login handling...
        console.log('Wrong password!');
      }
    } else {
      // If player is logging in for the first time, register
      // their info on the players object
      // only do this if the lobby isn't full
      if (Object.keys(players).length < 5) {
        players[ userdata.username ] = {
          username: userdata.username,
          password: userdata.password,
          color: userdata.color, 
          numMeeps: 7, 
          socket: socket.id,
          ready: false
        };
      } else {
        // TODO: alert that the game is full
        console.log('game full');
      }
      console.log(players);
    }
    // emit numready whenever there is a new connection
    // used to display number of users connected and ready to play on the home page
    io.emit('numReady', _.map( _.partition(players, {ready: true}), function(obj){
      return _.pluck(obj, 'username');
    }));
  });

  // currently unused on the client side
  socket.on('logout', function(userdata) {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
      io.emit('numReady', _.map( _.partition(players, {ready: true}), function(obj){
        return _.pluck(obj, 'username');
      }));
    }
  });

  // data will be the tile they placed
  socket.on('endTurn', function(data) { 
   // verify that player ending turn, is actually the current player
   // there might be a better way to do this using the session
    var name = game.players[ game.currentPlayer ];

    if (players[ name ].socket === socket.id) {
      // this updates the server side game object with all of the info from the
      // player move. will be useful for implementing client reconnections
      var gameState = game.update(data);

      // makes 'nextPlayer' the socket id; client needs to check this
      // to decide if it is their turn;
      gameState.nextPlayer = players[ gameState.nextPlayer ].socket;

      // emit next turn to all connected sockets
      io.emit('nextTurn', gameState);
    }
      // TODO: (maybe) alert the client that they are trying to end their turn
      // when it isn't their turn
  });

  // indicates that parties are ready to play
  socket.on('playerReady', function(data){

    // on 'playersReady' emission the client needs to send their username;
    // maybe refactor to also require the socket.id so that user A can't ready 
    // user B through the console
    var username = data;

    // prevent nonexistent username from doing stuff
    // and it won't do stuff if the player is already 'ready'
    if (players[ username ] === undefined || players[username].ready){
      return;
    }

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
        io.emit('allReady', {});
        game = new Game(13, spec, players);
        var gameState = game.initialState();
        gameState.nextPlayer = players[ gameState.nextPlayer ].socket;
        io.emit('nextTurn', gameState);
      } else {
        // TODO: alert that there are not enough people to play the game
        //   also be too many if the untested code to block too many logins fails
        console.log('Invalid number of players: ', Object.keys(players).length);
      }
    }
    // emit numReady every time someone readys up 
    io.emit('numReady', _.map( _.partition(players, {ready: true}), function(obj){
      return _.pluck(obj, 'username');
    }));
  });

  // send num of meeps and meep color to client side
  socket.on('meepDataReq', function(data) {
    // client side sends current username
    if (data.numMeeps) {
      players[ data.username ].numMeeps = data.numMeeps;
      socket.emit('meepDataRes', { numMeeps: data.numMeeps });
    } else {
      socket.emit('meepDataRes', { numMeeps: players[ data.username ].numMeeps });
    }
    // var meepColor = players[data.username].color;
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
