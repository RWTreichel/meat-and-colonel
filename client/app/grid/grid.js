// Create our grid module namespace
var grid = angular.module('grid', []);

// Create our grid controller
grid.controller('gridCtrl', function($scope){
  // A function that returns an array of length n
  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.init = function() {
    // Create our controller
  };
});

