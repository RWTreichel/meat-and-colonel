var rules = angular.module('game.rules', []);

rules.controller('rulesCtrl', function($scope) {
  $scope.overlayClass = "white_content";

  $scope.displayBlock = { "display":"block" };
  $scope.displayNone = { "display":"none" };    

  $scope.lightStyle = $scope.displayNone;
  $scope.fadeStyle = $scope.displayNone;
});