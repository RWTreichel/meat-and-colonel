var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location){

  $scope.usernames = [];
  $scope.user = 'Player 1';

  $scope.createUser = function() {
    if ($scope.user) {
      $scope.usernames.push(this.user);
      console.log("New player created: ", this.user);
      console.log('Players: ', $scope.usernames);
      $scope.user = '';
      $location.path('game');
    }
    // $http.post('../../server/serverStuff.js', null, config)
    //   .success(function(data, status, headers, config) {
    //     $scope[username] = data;
    //   })
    //   .error(function(data, status, headers, config) {
    //     $scope[username] = "ERROR";
    //   });
  };

});
