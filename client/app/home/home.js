var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location, socket){

  $scope.user = 'Player 1';
  $scope.password = 'Carcassonne';

  $scope.createUser = function() {
    if ($scope.user) {
      socket.emit('login', {username: $scope.user, password: $scope.password});
      $scope.user = '';
      $scope.password = '';
      $location.path('game');
    }
  };
});
