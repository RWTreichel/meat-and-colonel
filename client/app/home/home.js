var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location, Player){

  $scope.user = 'Player 1';
  $scope.password = 'Carcassonne';

  $scope.options = [
    {
      name: 'Black',
      value: 'black'
    }, 
    {
      name: 'Blue',
      value: 'blue'
    }, 
    {
      name: 'Green',
      value: 'green'
    }, 
    {
      name: 'Red',
      value: 'red'
    }, 
    {
      name: 'Yellow',
      value: 'yellow'
    }
  ];

  $scope.createUser = function() {
    if ($scope.user) {
      // save user data to app service 
      Player.setUsername($scope.user);
      Player.setColor($scope.color);
      
      socket.emit('login', {username: $scope.user, password: $scope.password, color: $scope.color});
      socket.emit('playerReady', $scope.user);
      $scope.user = '';
      $scope.password = '';
      $location.path('game');
    }
  };
});
