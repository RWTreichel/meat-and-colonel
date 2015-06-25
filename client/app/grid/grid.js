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
  };
  Tile.prototype.getImage = function(id) {
    // Grab an image from our asset folder to set as img attribute
    return 'assets/img/Tiles/' + id.toUpperCase() + '.png';
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

grid.controller('gridCtrl', function($scope, TileModel, GridService, Player) {
  var gridSize = 13;
  $scope.orientation = 0;
  $scope.src = null;
  $scope.meepmeep = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';   
  var meeplePlaced = false;

  $scope.range = function() {
    return new Array(gridSize);
  };

  $scope.rotate = function() {
    if ($scope.playerId === socket.id) {
      $scope.orientation = ($scope.orientation + 1) % 4;
      $scope.currentTile.rotateRight();
      // console.log($scope.currentTile);
    }
    // console.log($scope.grid[$scope.currentTile.y][$scope.currentTile.x]);
  };

  $scope.init = function() {
    // Create board
    $scope.grid = GridService.createEmptyGameBoard(gridSize);
    $scope.tilePlaced = false;
    placeInitialTile();

    // Dynamically size grid
    angular.element(document.querySelector('.grid-container')).css('width', gridSize * 52 + 'px');

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

    socket.on('meepDataRes', function(data) {
      $scope.numMeeps = data.numMeeps;
    });
    socket.emit('meepDataReq', { username: Player.getUsername(), numMeeps: 7 });
  };

  $scope.clickCell = function(event, x, y) {
    if ($scope.tilePlaced) {
      setMeeple(event, x, y);
    } else {
      setTile(x, y);
    }
  };

  $scope.endTurn = function() {
    if ($scope.currentTile.x !== null) {
      $scope.tilePlaced = false;
      meeplePlaced = false;
      // Need to pass state of meeple placement to others
      socket.emit('endTurn', $scope.currentTile); 
    } else {
      console.log('Cannot end your turn');
    }
  };

  var setMeeple = function(event, x, y) {
    if ($scope.numMeeps > 0) {
      if (!meeplePlaced) {
        if ($scope.currentTile.x === x && $scope.currentTile.y === y) {
          var meepClass = 'meep-x-' + x + '-y-' + y;
          angular.element(event.target).append('<img class="'+meepClass+'" src="'+ $scope.meepmeep +'">');
          $scope.currentMeeple = angular.element(document.querySelector('.'+meepClass));
          $scope.numMeeps--;
          socket.emit('meepDataReq', { username: Player.getUsername(), numMeeps: $scope.numMeeps });
          meeplePlaced = true;
        } else {
          console.log('Can only place meeple on last tile');
        }
      } else {
        console.log('meeple alrdy placed');
      }
    } else {
      console.log('All outta meeps');
    }
  };

  $scope.cycleMeeple = function(item) {
    if ($scope.currentMeeple) {
      var itemID = angular.element(item.target).attr('id');
      $scope.currentMeeple.attr('class', itemID);
    }
  };

  var setTile = function(x, y) {
    // Check if it's current player's turn
    if ($scope.playerId === socket.id) {     
      if (!cellAlreadyExists(x, y)) {
        // Get out current tile generated from nextTurn
        var tile = $scope.currentTile;
        tile.x = x;
        tile.y = y;
        
        if (validPlacement(tile)) {
          var tilePlaced = true;
          var meeplePlaced = false;
          // We push a new tile onto the grid at xy
          updateGrid(x, y, tile);
          // Set the background image of grid cell
          setCell(tile);
          // emit endturn
          $scope.orientation = 0;
          $scope.tilePlaced = true;
          // Call function place meeples

        } else {
          console.log('Not a valid placement.')
        }
      }
    } else {
      console.log('not your turn');
    }
  };

  var validPlacement = function(tile) {
    var canPlace = 0, northernTile, southernTile, easternTile, westernTile;

    ($scope.grid[tile.y-1] !== undefined) &&
      (northernTile = $scope.grid[tile.y-1][tile.x]);

    ($scope.grid[tile.y][tile.x+1] !== undefined) &&
      (easternTile = $scope.grid[tile.y][tile.x+1]);

    ($scope.grid[tile.y][tile.x-1] !== undefined) &&
      (westernTile = $scope.grid[tile.y][tile.x-1]);

    ($scope.grid[tile.y+1] !== undefined) &&
      (southernTile = $scope.grid[tile.y+1][tile.x]);

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
    var x = Math.floor($scope.grid.length/2), y = Math.floor($scope.grid.length/2);
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
    updateGrid(x, y, DTile);
    setCell(DTile);
  };

  // Initialize game board
  $scope.init();
});