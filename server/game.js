var Tile = require('./tile');
var Deck = require('./deck');
var spec = require('./deckSpec');
var _    = require ('lodash');

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
// functions to support that. there's only like 300 commits, good luck finding them...

// put a tile object in the server game board
Game.prototype.placeTile = function(tile) {
  this.board[ tile.x ][ tile.y ] = 
    new Tile(tile.id, tile.features, tile.x, tile.y);
};

Game.prototype.placeMeeple = function(data) {
  var tile = this.board[ data.tileX ][ data.tileY ];
  console.log(tile);
  tile.meeple.color = data.color;
  tile.meeple.loaction = data.pos;
};

// removes a meeple from a a tile at given coordinates
Game.prototype.removeMeeple = function(data) {
  var tile = this.board[ data.tileX ][ data.tileY ];
  tile.meeple.color = null;
  tile.meeple.loaction = null;
};

Game.prototype.nextPlayer = function() {
  this.currentPlayer = ++this.currentPlayer % this.players.length;
  return this.players[ this.currentPlayer ];
};


// set up the first round
Game.prototype.initialState = function() {
  var gameState = {};
  gameState.lastTile = null;
  gameState.nextPlayer = this.players[0];
  gameState.nextTile = this.deck.pop();
  return gameState;
};

// generates game state for next turn
Game.prototype.update = function(data) {
  // get data for gameState emission
  var gameState = {};
  gameState.lastTile = data.tile;
  gameState.nextPlayer = this.nextPlayer();
  gameState.nextTile = this.deck.pop();
  gameState.board = this.board;
  return gameState;
};

module.exports = Game;
