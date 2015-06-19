var Tile = require('./tile');
var Deck = require('./deck');
var Meeples = require('./meeples');
// var spec = require('./deckSpec');

var Game = function(boardSize, deckSpeck){
  this.boardSize = boardSize;
  this.board = [];
    for( var i = 0; i < boardSize; i++ ) {
      this.board.push( new Array(boardSize) );
    }

  this.deck = new Deck(deckSpeck);
  this.meeples = new Meeples();
};

// arg should be a parsed tile from the client post request
Game.prototype.placeTile = function(tile) {
  tile = new Tile(tile.id, tile.x, tile.y, tile.meeple);
  this.board[tile.x][tile.y] = tile;
};