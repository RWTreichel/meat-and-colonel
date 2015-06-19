// Create our grid module namespace
var grid = angular.module('game.grid', []);

// Create our grid controller
grid.controller('gridCtrl', function($scope){
  // A function that returns an array of length n
  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.init = function() {
    // Create our controller
  };
  $scope.clickCell = function($event, x, y) {
    // setCell(x, y);
    console.log($event.target);
  };

  var setCell = function($event, x, y) {
    // $scope.tile = {x: x, y: y};
    // console.log($event.target);
    // return angular.element($event.target);
  };
});

