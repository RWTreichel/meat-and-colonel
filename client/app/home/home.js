var home = angular.module('game.home', []);

home.controller('homeCtrl', ['$scope', function($scope, $location){

  $scope.usernames = [];
  $scope.user = 'Player 1';

  $scope.createUser = function() {
    if ($scope.user) {
      $scope.usernames.push(this.user);
      $scope.user = '';
      $location.path('/game'); // hmm, does not redirect to game
    }
    // $http.post('../../server/serverStuff.js', null, config)
    //   .success(function(data, status, headers, config) {
    //     $scope[username] = data;
    //   })
    //   .error(function(data, status, headers, config) {
    //     $scope[username] = "ERROR";
    //   });
  };

}]);
