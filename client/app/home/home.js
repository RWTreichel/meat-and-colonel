var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location, socket){

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
      socket.emit('login', {username: $scope.user, password: $scope.password, color: $scope.color});
      $scope.user = '';
      $scope.password = '';
      $location.path('game');
    }
  };
});
