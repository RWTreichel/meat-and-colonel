var grid = angular.module('game.grid');

grid.controller('gridCtrl', function($scope, TileModel, GridService, Player) {
  // Declare our controller wide dependencies
  var gridSize = 13;
  var grid = GridService.matrix;
  var meeplePlaced = false;
  
  $scope.orientation = 0;
  $scope.src = null;
  $scope.meepmeep = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';   

  $scope.range = function() {
    return new Array(gridSize);
  };

  $scope.rotate = function() {
    if ($scope.playerId === socket.id) {
      $scope.orientation = ($scope.orientation + 1) % 4;
      $scope.currentTile.rotateRight();
      // console.log($scope.currentTile);
    }
    // console.log(grid[$scope.currentTile.y][$scope.currentTile.x]);
  };

  var init = function() {
    GridService.placeInitialTile();
    // Create board
    $scope.tilePlaced = false;
    // Dynamically size grid
    angular.element(document.querySelector('.grid-container')).css('width', gridSize * 52 + 'px');

    socket.on('nextTurn', function(gamestate) {
      if (!gamestate.lastTile) {
        $scope.currentTile = new TileModel(gamestate.nextTile);
      } else {
        $scope.currentTile = new TileModel(gamestate.nextTile);
        GridService.updateGrid(gamestate.lastTile.x, gamestate.lastTile.y, gamestate.lastTile);
        // Modify set cell for meeples
        GridService.setCell(gamestate.lastTile, 'lastTile');
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
    if ($scope.tilePlaced) {
      $scope.tilePlaced = false;
      meeplePlaced = false;
      // Need to pass state of meeple placement to others
      $scope.currentTile.meeple.color = Player.getColor();
      socket.emit('endTurn', $scope.currentTile); 
    } else {
      console.log('Cannot end your turn');
    }
  };

  var setMeeple = function(event, x, y) {
    if ($scope.numMeeps > 0 && !meeplePlaced) {
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
    if ($scope.playerId === socket.id && $scope.currentMeeple) {     
      var itemID = angular.element(item.target).attr('id');
      $scope.currentMeeple.attr('class', itemID);
      $scope.currentTile.meeple.location = +$scope.currentMeeple.attr('class').slice(-1);
    }
  };

  var setTile = function(x, y) {
    // Check if it's current player's turn
    if ($scope.playerId === socket.id) {     
      if (!GridService.cellAlreadyExists(x, y)) {
        // Get out current tile generated from nextTurn
        var tile = $scope.currentTile;
        tile.x = x;
        tile.y = y;
        
        if (GridService.validPlacement(tile)) {
          var tilePlaced = true;
          var meeplePlaced = false;
          // We push a new tile onto the grid at xy
          GridService.updateGrid(x, y, tile);
          // Set the background image of grid cell
          GridService.setCell(tile);
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

  init();
});