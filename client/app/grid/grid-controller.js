var grid = angular.module('game.grid');

grid.controller('gridCtrl', function($scope, TileModel, GridService, Player, notify) {
  // Declare our controller wide dependencies
  var grid = GridService.matrix;
  var meeplePlaced = false;
  var tilePlaced = false;
  notify.config({duration: 1000, templateUrl: 'app/templates/notifications.html'});
  
  $scope.orientation = 0;

  // Set starting number of meeples on grid instantiation.
  // numMeeps should be altered later on only by placing and taking back meeples.
  $scope.numMeeps = 7;

  // Set client's meeple color. This line should only run once (Meeple color doesn't change).
  $scope.meepleColor = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';

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

  socket.on('numReady', function(data){
    if(_.includes(data.users[0], Player.getUsername())){
      angular.element(document.getElementById('ready')).remove();
    }
  });

  socket.on('placeTile', function(tile) {
    // Incoming tile object properties: {x, y, img, orientation}

    // Locate the proper tile element.
    var id = 'x-' + tile.x + '-y-' + tile.y;
    var tileElement = angular.element(document.getElementById(id));

    // Set the tile at that location.
    tileElement.css('background-size', 'contain');
    tileElement.css('background-image', 'url(' + tile.img + ')');
    tileElement.css('transform', 'rotate(' + tile.orientation*90 + 'deg)');
  });

  socket.on('placeMeeple', function(data) {
    // Incoming data object properties: {tileX, tileY, pos, colorPath}

    // Locate the proper tile.
    var id = 'x-' + data.tileX + '-y-' + data.tileY;
    var tileElement = angular.element(document.getElementById(id));

    // Append the placed meeple at that location.
    var meeple = '<img id="meep-' + id + '" class="pos-' + data.pos + '" src="' + data.colorPath + '">';
    angular.element(tileElement).append(meeple);

    // Only enable a click handler on the current player's tile.
    // Other clients get the meeple, but they can't pick it up because
    // their tiles never register a click handler.
    if (Player.isCurrentPlayer()) {
      angular.element(tileElement).on('click', function(event) {
        event.preventDefault();
        socket.emit('removeMeeple', { tileX: data.tileX, tileY: data.tileY });
        angular.element(this).off('click');
      });
    }
  });

  socket.on('removeMeeple', function(data) {
    // Incoming data object properties: {tileX, tileY}

    // Locate the proper meeple <img> element and remove it.
    var id = 'meep-x-' + data.tileX + '-y-' + data.tileY;
    var meepleElement = angular.element(document.getElementById(id));

    // Identify the removed meeple's color to determine if the player
    // should have their meeple count incremented.
    var colorPath = angular.element(meepleElement).attr('src');
    // Index 1 is the match produced by the capturing parentheses.
    var color = /_(.*)\./.exec(colorPath)[1];

    meepleElement.remove();

    // Update the current player's meeple total and view if needed.
    if (Player.getColor() ===  color) {
      $scope.numMeeps++;
      $scope.$apply();
    }
  });

  $scope.ready = function(){
    socket.emit('playerReady', Player.getUsername());
  };

  // Needed purely so that ng-repeat works for the meeples display.
  $scope.repeatMeeples = function(numMeeps) {
    return new Array(numMeeps);
  };
  
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
      $scope.orientation = 0;
      socket.emit('endTurn', {tile: $scope.currentTile}); 
    } else {
      notify('Cannot end your turn');
    }
  };

  var setMeeple = function(event, x, y) {
    if ($scope.numMeeps <= 0) {
      notify('All outta meeps');

    } else if (meeplePlaced) {
      notify('You have already placed a meeple this turn.');

    } else if ($scope.currentTile.x === x && $scope.currentTile.y === y) {
        $scope.numMeeps--;
        // Restrict players to only dropping one meeple per turn by setting the meeplePlaced flag to true.
        meeplePlaced = true;

        // Tiles are subdivided into 9 clickable areas indexed as shown below:
        //      C[1] C[2] C[3]
        // R[0]:  1    2    3
        // R[1]:  4    5    6
        // R[2]:  7    8    9
        // Identify the row and column where the click occurred, and offset
        // the placed meeple by (column + 3 * row) so it displays in the right
        // cell of the tile's 3x3 clickable grid.
        var row = Math.floor(event.offsetY / (event.target.clientHeight / 3));
        var column = 1 + Math.floor(event.offsetX / (event.target.clientWidth / 3));
        socket.emit('placeMeeple', {
          tileX: x,
          tileY: y,
          pos: (column + 3*row),
          colorPath: $scope.meepleColor,
          color: Player.getColor()
        });
      } else {
        notify('Can only place meeple on last tile');
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
  })();

});