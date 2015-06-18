var Board = function(size){
  this.grid = [];
  for( var i = 0; i < size; i++ ) {
    this.grid.push( new Array(size) );
  }
};

Board.prototype.placeTile = function(tile) {
  // body...
};

var a = new Board(71);