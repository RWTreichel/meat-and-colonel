var Board = function(size){
  this.grid = [];
  for( var i = 0; i < size; i++ ) {
    this.grid.push( new Array(size) );
  }
};

Board.prototype.placeTile = function(tile) {
  // plan is for each active cell in the board to hold 
  // a ref to an actual instance of a tile
  // somehow..... 
};

// var a = new Board(71);
// console.log(a.grid);