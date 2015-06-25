var grid = angular.module('game.grid');

grid.service('GridService', function(TileModel) {
  
  this.createEmptyGameBoard = function(boardSize) {
    var grid = [];
    var size = boardSize;
    for (var x = 0; x < size; x++) {
      grid[x] = [];
      for (var y = 0; y < size; y++) {
        grid[x][y] = null;
      }
    }
    return grid;
  };

});