var server = require('../app');
var io = server.io;
var _ = require('lodash');
var Game = require('./game');
var spec = require('./deckSpec');
var gameInProgress = false;

exports.game = null;
// if player already exists in players obj we want to log them back in and not
// create a new user or overwrite their existing stuff other than socket id
// currently useless as the client does not support revival of the lost game state
exports.handleLogin = function(socket, players, userdata){
  if (!gameInProgress){
    // if someone in the session picked that name already
    if (players[userdata.username]){
      // do something good if they fail
      // don't konw what that is yet
    } else {
      // else if they are good to go
      // their info on the players object
      // only do this if the lobby isn't full
      if (Object.keys(players).length < 5) {
        players[ userdata.username ] = {
          username: userdata.username,
          color: userdata.color,
          socket: socket.id,
          ready: false
        };
      }
    }
  }
  console.log('players connected: ', players);
};

exports.handleLogout = function(socket, userdata, players){
  socket.disconnect(true);
};

// used to display number of users connected and ready to play on the home page
// returns array of arrays of ready and unready player names
// [ ['ready'], ['unready', 'unready']]
exports.emitNumReady = function(io, players){
  io.emit('numReady', {
    users: 
      _.map( _.partition(players, {ready: true} ), function(obj){
        return _.pluck(obj, 'username');
      }),
    colorsLeft: 
      _.difference(['red', 'yellow', 'black', 'blue', 'red'], 
        _.pluck(players, 'color'))
  });
};

exports.onPlayersReady = function(io, players, data){
  var username = data;
  // prevent nonexistent username from doing stuff
  // and it won't do stuff if the player is already 'ready'
  if (players[ username ] === undefined || players[username].ready){
    return;
  }
  players[ username ].ready = true;
  var allReady = true;
  for(var player in players){
    allReady = allReady && players[player].ready;
  }
  if (allReady) {
    // Makes sure there are between 2 to 5 players logged in
    // if there are, emit that, create the game, emit the first turn stuff;
    if (Object.keys(players).length >= 2 && Object.keys(players).length <= 5) {
      io.emit('allReady', {});
      gameInProgress = true;
      exports.game = new Game(13, spec, players);
      var gameState = exports.game.initialState();
      gameState.nextPlayer = players[ gameState.nextPlayer ].socket;
      io.emit('nextTurn', gameState);
    } else {
      // TODO: alert that there are not enough people to play the game
      //   also be too many if the untested code to block too many logins fails
      console.log('Invalid number of players: ', Object.keys(players).length);
    }
  }
};

// data arg is {} containing tile: {tilestuff} meeplesRemoved: '[meeple object]'
exports.handleEndTurn = function(io, socket, players, data){
    // verify that player ending turn, is actually the current player
   // there might be a better way to do this using the session
  if (Object.keys(players).length <= 1){
    return;
  }
  console.log(Object.keys(players));
  var name = exports.game.players[ exports.game.currentPlayer ];
  if (players[ name ].socket === socket.id) {

    // this updates the server side game object with all of the info from the
    // player move. will be useful for implementing client reconnections
    var gameState = exports.game.update(data);

    // makes 'nextPlayer' the socket id; client needs to check this
    // to decide if it is their turn;
    gameState.nextPlayer = players[ gameState.nextPlayer ].socket;

    // emit next turn to all connected sockets
    io.emit('nextTurn', gameState);
  }
};

exports.handleDisconnect = function(io, players, cb) {
  io.emit('gameOver', 'gameOver');
  _.forEach(io.sockets.sockets, function(s){
    if (s) {
      s.disconnect(true);
    }
  });
  cb();
  exports.game = null;
  gameInProgress = false;
};
