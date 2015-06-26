var grid = angular.module('game.grid');

grid.controller('gridCtrl', function($scope, TileModel, GridService, Player, notify) {
  // Declare our controller wide dependencies
  var grid = GridService.matrix;
  var meepleRemoved = undefined;
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
    if (gamestate.meepleRemoved) {
      GridService.updateMeeples(gamestate.meepleRemoved.color, gamestate.meepleRemoved.x, gamestate.meepleRemoved.y);
    }
    meepleRemoved = undefined;
    $scope.src = $scope.currentTile.img;
    $scope.$apply();
  });

  // Needed purely so that ng-repeat works.
  $scope.repeatMeeples = function(numMeeps) {
    return new Array(numMeeps);
  }
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
    if (!event.shiftKey) {
      if (tilePlaced) {
        setMeeple(event, x, y);
      } else {
        setTile(x, y, $scope.currentTile);
      }
    }
  };

  $scope.endTurn = function() {
    if (tilePlaced) {
      tilePlaced = false;
      meeplePlaced = false;
      // Need to pass state of meeple placement to others
      $scope.currentTile.meeple.color = Player.getColor();
      $scope.orientation = 0;
      socket.emit('endTurn', {tile: $scope.currentTile, meepleRemoved: meepleRemoved}); 
    } else {
      notify('Cannot end your turn');
    }
  };

  // TODO: Factor out meeple stuff
  var setMeeple = function(event, x, y) {
    if ($scope.numMeeps > 0 && !meeplePlaced) {
      if ($scope.currentTile.x === x && $scope.currentTile.y === y) {
        // Assign the meeple's default location.
        $scope.currentTile.meeple.location = 1;
        var meepCoords = 'meep-x-' + x + '-y-' + y;
        var meepColor = Player.getColor();
        angular.element(event.target).append('<img data-color=' + meepColor + ' data-coords="'+meepCoords+'" src="'+ $scope.meepmeep +'">')
          .on('click',  pickupMeeple);
        $scope.currentMeeple = angular.element(document.querySelector('img[data-coords="'+ meepCoords +'"]'));
        $scope.numMeeps--;
        // Restrict players to only dropping one meeple per turn by setting the meeplePlaced flag to true.
        meeplePlaced = true;
      } else {
        notify('Can only place meeple on last tile');
      }
    } else {
      notify("Can't place meeple");
    }
  };

  var pickupMeeple = function(event) {
    // Avoid the click event from bubbling up through the DOM.
    event.stopPropagation();
    if (Player.isCurrentPlayer()) {
      if (event.shiftKey) {
        var imageSrc = angular.element(this).children('img').attr('src');
        // Check player's color matches the meep 
        if (Player.getColor() === imageSrc.match(/_(.*)\.png/)[1]) {
          var meep = angular.element(event.target);
          var meepData = meep.attr('data-coords');
          var meepColor = meep.attr('data-color');
          var parsedData = meepData.match(/x-(\d)+-y-(\d)+/);
          meepleRemoved = {
            color: meepColor,
            x: parsedData[1],
            y: parsedData[2]
          };
          meep.remove();
          $scope.numMeeps++;
          socket.emit('meepDataReq', { username: Player.getUsername(), numMeeps: $scope.numMeeps });
        }
      }
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
    //socket.emit('meepDataReq', { username: Player.getUsername(), numMeeps: 7 });
  })();

});