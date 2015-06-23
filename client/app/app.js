var app = angular.module('game', [
  'game.home',
  'game.grid',
  'game.deck',
  'game.meeple',
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

app.factory('socket', function () {
  // TODO: Dynamic port allocation - process.env.PORT
  var socket = io('http://localhost:3000');
  
  return {
    on: function(eventName, callback) {
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
  // return {
  //   on: function (eventName, callback) {
  //     socket.on(eventName, function () {
  //       var args = arguments;
  //       $rootScope.$apply(function() {
  //         callback.apply(socket, args);
  //       });
  //     });
  //   },
  //   emit: function (eventName, data, callback) {
  //     socket.emit(eventName, data, function () {
  //       var args = arguments;
  //       $rootScope.$apply(function() {
  //         if (callback) {
  //           callback.apply(socket, args);
  //         }
  //       });
  //     })
  //   }
  // };
});

app.service('Player', function() {
  this.playerData = {};

  this.player = function() {
    return this.playerData;
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


// .run(function ($rootScope, $location, Auth) {
//   // here inside the run phase of angular, our services and controllers
//   // have just been registered and our app is ready
//   // however, we want to make sure the user is authorized
//   // we listen for when angular is trying to change routes
//   // when it does change routes, we then look for the token in localstorage
//   // and send that token to the server to see if it is a real user or hasn't expired
//   // if it's not valid, we then redirect back to signin/signup
//   $rootScope.$on('$routeChangeStart', function (evt, next, current) {
//     if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
//       $location.path('/signin');
//     }
//   });
// });
