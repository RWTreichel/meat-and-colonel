var Tile = require('./tile');
var Deck = require('./deck');
var Meeples = require('./meeples');
var spec = require('./deckSpec');




var Game = function(boardSize, deckSpeck){
  this.board = [];
    for( var i = 0; i < boardSize; i++ ) {
      this.board.push( new Array(boardSize) );
    }

  this.deck = new Deck(deckSpeck);
  this.meeples = new Meeples();

};

// Game.prototype.placeTile = function(tile) {
//   var location = tile.getCoordinates;
//   this.board[ location[0] ][ location[1] ] = tile;
// };


var game = new Game(10, spec);

console.log(game);