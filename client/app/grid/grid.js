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

grid.service('DeckService', function(TileModel) {
  this.deckSpec = {
    a: 2,
    b: 5,
    c: 1,
    d: 4,
    e: 5,
    f: 2,
    g: 1,
    h: 3,
    i: 2,
    j: 3,
    k: 3,
    l: 3,
    m: 2,
    n: 3,
    o: 2,
    p: 3,
    q: 1,
    r: 3,
    s: 2,
    t: 1,
    u: 8,
    v: 9,
    w: 4,
    x: 1
  };

  this.createNewDeck = function() {
    var deck = [];

    for (key in this.deckSpec) {
      for (var i = 0; i < this.deckSpec[key]; i++) {
        deck.push(key);
      }
    }

    return deck;
  };

  this.shuffle = function(deck) {
    if (deck.length === 0) {
      console.log('you dun goofed, your deck is empty');
    }
    var currentIndex = deck.length, temporaryValue, randomIndex;
    while (0 !== currentIndex){
      randomIndex = Math.floor( Math.random () * currentIndex );
      currentIndex -= 1;
      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }
  };


});

// Create our grid controller
grid.controller('gridCtrl', function($scope, TileModel, GridService, DeckService){
  // A function that returns an array of length n
  $scope.orientation = 0;

  $scope.range = function(n) {
    return new Array(n);
  };
  $scope.rotate = function() {
    $scope.orientation = ($scope.orientation + 1) % 4;
  };
  $scope.init = function() {
    // Create board, deck, and then shuffle deck
    $scope.grid = GridService.createEmptyGameBoard();
    $scope.deck = DeckService.createNewDeck();
    DeckService.shuffle($scope.deck);

    socket.on('nextTurn', function(gamestate) {
      updateGrid(gamestate.lastTile.x, gamestate.lastTile.y, gamestate.lastTile);
<<<<<<< HEAD
      setCell(gamestate.lastTile);
=======
    });
  };

  $scope.clickCell = function(event, x, y) {
    if (!cellAlreadyExists(x, y)) {
      // Draw from deck
      var draw = getRandomTile();
      // Create our tile model
      var tile = new TileModel({x:x, y:y}, draw);
      tile.orientation = $scope.orientation;
      $scope.src = tile.img;
      // We push a new tile onto the grid at xy
      updateGrid(x, y, tile);
      // We set the cell's tile background
      setCell(event.target, tile);

      // emit endturn
      socket.emit('endTurn', tile);
    }
  };

  // These functions should be moved into a factory/service
  var updateGrid = function(x, y, tile) {
    $scope.grid[y][x] = tile;
    console.log($scope.grid[y]);
  };

  var cellAlreadyExists = function(x, y) {
    return $scope.grid[y][x] !== null; 
  };

  var setCell = function(tile) {
<<<<<<< HEAD
    var id = '#' + 'x-' + tile.x + '-y-' + tile.y;
    var domElement = angular.element(document.querySelector(id));
=======
    domElement.css('background-size', 'contain');
    domElement.css('background-image', 'url(' + tile.img + ')');
    domElement.css('transform', 'rotate(' + tile.orientation*90 + 'deg)');
  };

  // var setCell = function(target, tile) {
  //   angular.element(target).css('background-size', 'contain');
  //   angular.element(target).css('background-image', 'url(' + tile.img + ')');
  //   angular.element(target).css('transform', 'rotate(' + tile.orientation*90 + 'deg)');
  // };

  var getRandomTile = function() {
    var id = $scope.deck.pop();
    return id;
  };

  // Initialize game board
  $scope.init();
});
