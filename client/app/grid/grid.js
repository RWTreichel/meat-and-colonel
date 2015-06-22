// Create our grid module namespace
var grid = angular.module('game.grid', []);

// Returns a tile object
grid.factory('TileModel', function() {
  var Tile = function(pos, id, val) {
    this.x = pos.x;
    this.y = pos.y;
    this.img = this.getImage(id);
    this.val = val || 2;
    this.orientation = 0;
    this.meeples = null;
  }
  Tile.prototype.getImage = function(id) {
    // Grab an image from our asset folder to set as img attribute
    return 'assets/img/Tiles/' + id.toUpperCase() + '.png'
  };
  return Tile;
});

grid.service('GridService', function(TileModel) {
  
  this.createEmptyGameBoard = function() {
    var grid = [];
    var size = 72;
    for (var x = 0; x < size; x++) {
      grid[x] = [];
      for (var y = 0; y < size; y++) {
        grid[x][y] = null;
      }
    }
    return grid;
  };

});

// Create our grid controller
grid.controller('gridCtrl', function($scope, TileModel, GridService){
  // A function that returns an array of length n
  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.init = function() {
    $scope.grid = GridService.createEmptyGameBoard();
  };
  $scope.clickCell = function(event, x, y) {
    if (!cellAlreadyExists(x, y)) {
      // Draw from deck
      var draw = getRandomTile();
      // Create our tile model
      var tile = new TileModel({x:x, y:y}, draw.id);
      // We push a new tile onto the grid at xy
      updateGrid(x, y, tile);
      // We set the cell's tile background
      setCell(event.target, tile);
    }
  };

  var updateGrid = function(x, y, tile) {
    $scope.grid[y][x] = tile;
    console.log($scope.grid[y]);
  };

  var cellAlreadyExists = function(x, y) {
    return $scope.grid[y][x] !== null; 
  };

  var setCell = function(target, tile) {
    angular.element(target).css('background-size', 'contain');
    angular.element(target).css('background-image', 'url(' + tile.img + ')');
  };

  var getRandomTile = function() {
    var tile = deckstub.pop();
    return tile;
  };

  $scope.init();
});

