var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var utils = require('./server/utils');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/client'));

// object holds player username, socket id, and password
var players = {};

io.on('connection', function(socket) {
  // Accept a login event with user's data
  socket.on('login', function(userdata) {
    utils.handleLogin(socket, players, userdata);
    utils.emitNumReady(io, players);
  });

  // currently unused on the client side
  socket.on('logout', function(userdata) {
    utils.handleLogout(socket, players, userdata);
  });

  // data arg will be the tile they placed
  socket.on('endTurn', function(data) { 
   utils.handleEndTurn(io, socket, players, data);
  });

  // indicates that parties are ready to play
  socket.on('playerReady', function(data){
    utils.onPlayersReady(io, players, data);
    utils.emitNumReady(io, players);
  });

  socket.on('disconnect', function(data){
    utils.handleDisconnect(io, players, function(){
      players = {};
    });
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports.app = app;
exports.io = io;
exports.players = players;


