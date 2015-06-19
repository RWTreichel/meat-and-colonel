/* this is what a tile should look like going to and coming from client
    {
      id: v9,          // (A thru X) + num
      orientation: 1,  // 0 - 3
      x: 13,           // 0 - boardSize
      y: 2,            // 0 - boardSize
      meeple: {}       // ref to actual meeple object see ./meeples.js
    } 
*/

var Tile = function(id, x, y, meeple){
  this.id = id;
  this.orientation = 0;
  this.x = x;
  this.y = y;
  this.meeple = meeple;
};

module.exports = Tile;