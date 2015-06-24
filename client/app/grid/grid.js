// Create our grid module namespace
var grid = angular.module('game.grid', []);

// Returns a tile object
grid.factory('TileModel', function() {
  var Tile = function(tilespec) {
    this.x = tilespec.x || null;
    this.y = tilespec.y || null;
    this.img = this.getImage(tilespec.id);
    this.val = tilespec.val || 2;
    this.orientation = tilespec.orientation;
    this.meeples = null;
    this.features = tilespec.features;
  }
  Tile.prototype.getImage = function(id) {
    // Grab an image from our asset folder to set as img attribute
    return 'assets/img/Tiles/' + id.toUpperCase() + '.png'
  };
  Tile.prototype.rotateRight = function() {
    this.orientation = (this.orientation + 1) % 4;

    var temp = {};
    for (var key in this.features){
      temp[key] = this.features[key];
    }

    this.features.n = temp.w;
    this.features.e = temp.n;
    this.features.s = temp.e;
    this.features.w = temp.s;
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

grid.controller('gridCtrl', function($scope, TileModel, GridService){
  $scope.orientation = 0;
  $scope.src = null;

  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.rotate = function() {
    $scope.orientation = ($scope.orientation + 1) % 4;
    $scope.currentTile.rotateRight();
  };
  $scope.init = function() {
    // Create board
    $scope.grid = GridService.createEmptyGameBoard();
    placeInitialTile();

    socket.on('nextTurn', function(gamestate) {
      if (!gamestate.lastTile) {
        $scope.currentTile = new TileModel(gamestate.nextTile);
      } else {      
        $scope.currentTile = new TileModel(gamestate.nextTile);
        updateGrid(gamestate.lastTile.x, gamestate.lastTile.y, gamestate.lastTile);
        setCell(gamestate.lastTile);
      }
      // Create a tile model
      $scope.playerId = gamestate.nextPlayer; 
      $scope.src = $scope.currentTile.img;
      $scope.$apply();
    });
  };

  $scope.clickCell = function(x, y) {
    // Check if it's current player's turn
    if ($scope.playerId === socket.id) {     
      if (!cellAlreadyExists(x, y)) {
        // Get out current tile generated from nextTurn
        var tile = $scope.currentTile;
        tile.x = x;
        tile.y = y;
        
        if (validPlacement(tile)) {
          // We push a new tile onto the grid at xy
          updateGrid(x, y, tile);
          // Set the background image of grid cell
          setCell(tile);
          // emit endturn
          $scope.orientation = 0;
          socket.emit('endTurn', tile);
        } else {
          console.log('Not a valid placement.')
        }
      }
    } else {
      console.log('not your turn');
    }
  };

  var getImage = function(id) {
    // Grab an image from our asset folder to set as img attribute
    return 'assets/img/Tiles/' + id.toUpperCase() + '.png';
  };

  var validPlacement = function(tile) {
    var canPlace = 0;

    try {
      var northernTile = $scope.grid[tile.y-1][tile.x];
      var easternTile = $scope.grid[tile.y][tile.x+1];
      var westernTile = $scope.grid[tile.y][tile.x-1];
      var southernTile = $scope.grid[tile.y+1][tile.x];
    } catch (err) {
      console.log('tile issues', err);
    }

    if ( (northernTile === null) || (tile.features.n === northernTile.features.s)) {
      canPlace += 1;
    }
    if ( (easternTile === null) || (tile.features.e === easternTile.features.w)) {
      canPlace += 1;
    }
    if ( (southernTile === null) || (tile.features.s === southernTile.features.n)) {
      canPlace += 1;
    }
    if ( (westernTile === null) || (tile.features.w === westernTile.features.e)) {
      canPlace += 1;
    }
    return canPlace === 4;
    // console.log('North', northernTile);
    // console.log('East', easternTile);
    // console.log('West', westernTile);
    // console.log('South', southernTile);
  };

  // These functions should be moved into a factory/service
  var updateGrid = function(x, y, tile) {
    $scope.grid[y][x] = tile;
    // console.log($scope.grid[y]);
  };

  var cellAlreadyExists = function(x, y) {
    return $scope.grid[y][x] !== null; 
  };

  var setCell = function(tile) {
    var id = '#' + 'x-' + tile.x + '-y-' + tile.y;
    angular.element(document).ready(function() {
      var domElement = angular.element(document.querySelector(id));
      domElement.css('background-size', 'contain');
      domElement.css('background-image', 'url(' + tile.img + ')');
      domElement.css('transform', 'rotate(' + tile.orientation*90 + 'deg)');
    });
  };

  var placeInitialTile = function() {
    var x = $scope.grid.length/2, y = $scope.grid.length/2;
    // var x = 0, y = 0;
    var DTile = new TileModel({
      x: x, 
      y: y, 
      id: 'd', 
      features: {

      }, 
      orientation: 0
    });
    updateGrid(x, y, DTile);
    setCell(DTile);
  };

  // Initialize game board
  $scope.init();
});
