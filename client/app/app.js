var app = angular.module('game', [
  'game.home',
  'game.grid',
  'game.meeple',
  'game.rules',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'homeCtrl'
    })
    .when('/game', {
      templateUrl: 'app/grid/grid.html',
      controller: 'gridCtrl'
    });
});

app.service('Player', function() {
  this.playerData = {};
  var self = this;
  
  socket.on('nextTurn', function(gamestate) {
    self.playerData.playerId = gamestate.nextPlayer; 
  });

  this.player = function() {
    return this.playerData;
  };

  this.isCurrentPlayer = function() {
    return this.playerData.playerId === socket.id;
  };

  this.setUsername = function(username) {
    this.playerData.username = username;
  };

  this.getUsername = function() {
    return this.playerData.username;
  };

  this.setColor = function(color) {
    this.playerData.color = color;
  };

  this.getColor = function() {
    return this.playerData.color;
  };
});
