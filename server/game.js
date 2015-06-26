var Tile = require('./tile');
var Deck = require('./deck');
var spec = require('./deckSpec');

// players argument should be `players` from app.js
var Game = function(boardSize, deckSpec, players){
  this.ongoing = true; // indicates that game is or is not in session 
  this.boardSize = boardSize;
  this.board = []; // probably don't even need this anymore
    for( var i = 0; i < boardSize; i++ ) {
      this.board.push( new Array(boardSize) );
    }
  this.deck = new Deck(deckSpec);
  this.players = Object.keys(players);
  this.currentPlayer = 0;
};

// TODO: decide where to place start tile on the board;
// TODO: communicate initial board sizes between server and client
// the whole board is not super important right now
// but is arround to support reconnects mid game in the future
// because the client will need an entire game state to redraw
// if you ever want to grow the board size there are some old commits with
// functions to support that

// arg should be a parsed tile from the client post request
Game.prototype.placeTile = function(tile) {
  //tile = new Tile(tile.id, tile.x, tile.y, tile.meeple);
  this.board[tile.x][tile.y] = tile;
};

Game.prototype.nextPlayer = function() {
  if (this.currentPlayer === this.players.length - 1) {
    this.currentPlayer = 0;
  } else {
    this.currentPlayer++;
  }
  return this.players[ this.currentPlayer ];
};

Game.prototype.initialState = function() {
  var gameState = {};
  gameState.lastTile = null;
  gameState.nextPlayer = this.players[0];
  gameState.nextTile = this.deck.pop();
  return gameState;
};

// generates game state for next turn
Game.prototype.update = function(data) {
  var gameState = {};
  var serverTile = new Tile(data.tile.id, data.tile.features, data.tile.x, data.tile.y, data.tile.meeple.color, data.tile.meeple.location);
  this.placeTile(serverTile);
  gameState.lastTile = data.tile;
  gameState.nextPlayer = this.nextPlayer();
  gameState.nextTile = this.deck.pop();
  gameState.board = this.board;
  gameState.meepleRemoved = data.meepleRemoved;
  return gameState;
};

module.exports = Game;
