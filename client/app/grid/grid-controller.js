var grid = angular.module('game.grid');

grid.controller('gridCtrl', function($scope, TileModel, GridService, Player) {
  // Declare our controller wide dependencies
  var grid = GridService.matrix;
  var meeplePlaced = false;
  var tilePlaced = false;

  $scope.orientation = 0;
  $scope.meepmeep = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';   

  socket.on('nextTurn', function(gamestate) {
    if (!gamestate.lastTile) {
      $scope.currentTile = new TileModel(gamestate.nextTile);
    } else {
      $scope.currentTile = new TileModel(gamestate.nextTile);
      GridService.updateGrid(gamestate.lastTile.x, gamestate.lastTile.y, gamestate.lastTile);
      GridService.setCell(gamestate.lastTile, 'lastTile');
    }
    $scope.src = $scope.currentTile.img;
    $scope.$apply();
  });

  socket.on('meepDataRes', function(data) {
    $scope.numMeeps = data.numMeeps;
  });

  $scope.range = function() {
    return new Array(GridService.gridSize);
  };

  $scope.rotate = function() {
    if (Player.isCurrentPlayer() && !tilePlaced) {
      $scope.orientation = ($scope.orientation + 1) % 4;
      $scope.currentTile.rotateRight();
    }
  };

  $scope.clickCell = function(event, x, y) {
    if (tilePlaced) {
      setMeeple(event, x, y);
    } else {
      setTile(x, y, $scope.currentTile);
    }
  };

  $scope.endTurn = function() {
    if (tilePlaced) {
      tilePlaced = false;
      meeplePlaced = false;
      // Need to pass state of meeple placement to others
      $scope.currentTile.meeple.color = Player.getColor();
      $scope.orientation = 0;
      socket.emit('endTurn', $scope.currentTile); 
    } else {
      console.log('Cannot end your turn');
    }
  };

  // TODO: Factor out meeple stuff
  var setMeeple = function(event, x, y) {
    if ($scope.numMeeps > 0 && !meeplePlaced) {
      if ($scope.currentTile.x === x && $scope.currentTile.y === y) {
        $scope.currentTile.meeple.location = 1;
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
      console.log('All outta meeps');
    }
  };

  $scope.cycleMeeple = function(item) {
    if (Player.isCurrentPlayer() && $scope.currentMeeple && meeplePlaced) {     
      var itemID = angular.element(item.target).attr('id');
      $scope.currentMeeple.attr('class', itemID);
      $scope.currentTile.meeple.location = +$scope.currentMeeple.attr('class').slice(-1);
    }
  };

  var setTile = function(x, y, tile) {
    GridService.setTile(x, y, tile, function() {
      tilePlaced = true;
      meeplePlaced = false;
    });
  };

  // Initialize
  (function() {
    GridService.placeInitialTile();
    GridService.resizeGrid();
    socket.emit('meepDataReq', { username: Player.getUsername(), numMeeps: 7 });
  })();

});