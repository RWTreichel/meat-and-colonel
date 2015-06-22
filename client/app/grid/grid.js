// Create our grid module namespace
var grid = angular.module('game.grid', []);

grid.factory('TileModel', function() {
  // Returns a tile object
  var Tile = function(pos, img, val) {
    this.x = pos.x;
    this.y = pos.y;
    this.img = img;
    this.val = val || 2;
    this.orientation = 0;
    this.meeples = [];
  }
  return Tile;
});

grid.service('GridService', function(TileModel) {
  this.grid = [];
  this.tiles = [];
  this.size = 15;

  this.buildEmptyGameBoard = function() {
    var self = this;
    for (var x = 0; x < self.size * self.size; x++) {
      this.grid[x] = null;
    }
  };
});

// Create our grid controller
grid.controller('gridCtrl', function($scope, TileModel){
  // A function that returns an array of length n
  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.init = function() {
  };
  $scope.clickCell = function(event, x, y) {
    var tile = new TileModel({x:x, y:y}, 'assets/img/Tiles/B.png');
    setCell(event.target, tile);
  };

  var setCell = function(target, tile) {
    console.log('tile is set');
    console.log(tile);
    angular.element(target).css('background-size', 'contain');
    angular.element(target).css('background-image', 'url('+tile.img+')');

    // $(event.target).css('display', 'none');
    // $scope.tile = {x: x, y: y};
    // console.log($event.target);
    // return angular.element($event.target);
  };
});

