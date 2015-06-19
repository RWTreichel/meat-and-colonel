// Create our deck module namespace
var deck = angular.module('game.deck', []);

// Create our deck controller
deck.controller('deckCtrl', function($scope){
  $scope.src = "assets/img/Tiles/B.png";

  $scope.init = function() {
    
  };
});
