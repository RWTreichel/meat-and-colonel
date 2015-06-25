var grid = angular.module('game.grid');

grid.service('GridService', function(TileModel, Player) {

  this.gridSize = 13;

  this.createEmptyGameBoard = function(boardSize) {
    var matrix = [];
    for (var x = 0; x < boardSize; x++) {
      matrix[x] = [];
      for (var y = 0; y < boardSize; y++) {
        matrix[x][y] = null;
      }
    }

    this.gridSize = boardSize;
    return matrix;
  };

 this.placeInitialTile = function() {
    var x = Math.floor(this.gridSize/2), y = Math.floor(this.gridSize/2);
    // var x = 0, y = 0;
    var DTile = new TileModel({
      x: x, 
      y: y, 
      id: 'd', 
      features: {
        n: 'city',
        e: 'road',
        w: 'road',
        s: 'grass'
      }, 
      orientation: 0
    });
    this.updateGrid(x, y, DTile);
    this.setCell(DTile);
    // return DTile;
  };

  this.updateGrid = function(x, y, tile) {
    this.matrix[y][x] = tile;
  };

  this.cellAlreadyExists = function(x, y) {
    return this.matrix[y][x] !== null; 
  };

  this.validPlacement = function(tile) {
    var canPlace = 0, northernTile, southernTile, easternTile, westernTile;

    (this.matrix[tile.y-1] !== undefined) &&
      (northernTile = this.matrix[tile.y-1][tile.x]);

    (this.matrix[tile.y][tile.x+1] !== undefined) &&
      (easternTile = this.matrix[tile.y][tile.x+1]);

    (this.matrix[tile.y][tile.x-1] !== undefined) &&
      (westernTile = this.matrix[tile.y][tile.x-1]);

    (this.matrix[tile.y+1] !== undefined) &&
      (southernTile = this.matrix[tile.y+1][tile.x]);

    if (
      (northernTile !== undefined) && 
      ((northernTile === null) || (tile.features.n === northernTile.features.s)) ) {
        canPlace += 1;
    }
    if ( 
      (easternTile !== undefined) &&
      ((easternTile === null) || (tile.features.e === easternTile.features.w)) ) {
        canPlace += 1;
    }
    if ( 
      (southernTile !== undefined) &&
      ((southernTile === null) || (tile.features.s === southernTile.features.n)) ) {
        canPlace += 1;
    }
    if ( 
      (westernTile !== undefined) &&
      ((westernTile === null) || (tile.features.w === westernTile.features.e)) ) {
        canPlace += 1;
    }

    if ( 
      northernTile === null &&
      easternTile  === null &&
      westernTile  === null &&
      southernTile === null ) {
        return false;
    } else {
      return canPlace === 4;
    }
  };

  this.setCell = function(tile, option) {
    var id = '#' + 'x-' + tile.x + '-y-' + tile.y;

    angular.element(document).ready(function() {
      var domElement = angular.element(document.querySelector(id));
      domElement.css('background-size', 'contain');
      domElement.css('background-image', 'url(' + tile.img + ')');
      domElement.css('transform', 'rotate(' + tile.orientation*90 + 'deg)');

      if (option === 'lastTile' && 
          tile.meeple.color !== undefined && 
          tile.meeple.color !== Player.getColor()
        ) {
        var meepleSource = 'assets/img/Meeples/meeple_' + tile.meeple.color + '.png'
        var meepleClass = 'pos-' + tile.meeple.location;
        var meepleElement = angular.element('<img class="'+ meepleClass +'" src="' + meepleSource + '">');
        domElement.append(meepleElement);
      }
    });
  };

  this.matrix = this.createEmptyGameBoard(this.gridSize);
});