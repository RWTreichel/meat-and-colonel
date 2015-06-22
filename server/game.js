var Tile = require('./tile');
var Deck = require('./deck');
var Meeples = require('./meeples');
var spec = require('./deckSpec');

var Game = function(boardSize, deckSpeck){
  this.state = 'pregame'; // pregame, ongoing, done 
  this.boardSize = boardSize;
  this.board = [];
    for( var i = 0; i < boardSize; i++ ) {
      this.board.push( new Array(boardSize) );
    }

  this.deck = new Deck(deckSpeck);
  this.meeples = new Meeples();
  this.players = {};
};

// arg should be a parsed tile from the client post request
Game.prototype.placeTile = function(tile) {
  //tile = new Tile(tile.id, tile.x, tile.y, tile.meeple);
  this.board[tile.x][tile.y] = tile;
};

// Temporarily used to instantiate the game.
// This should NOT be here long-term.
var game = new Game (72, spec);

module.exports = game;

