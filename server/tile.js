/* this is what a tile should look like going to and coming from client
    {
      id: a,          // (A thru X) + num
      orientation: 1,  // 0 - 3
      x: 13,           // 0 - boardSize
      y: 2,            // 0 - boardSize
      meeple: 7,       // 1-9, location based on a 9 section tile with 1 @ upper left
      feature = {
        n: 'grass',
        s: 'road',
        e: 'grass',
        w: 'grass'
      }
    } 
*/

var Tile = function(id, features, x, y, meepleLocation){
  this.id = id;
  this.x = x;
  this.y = y;
  this.orientation = 0;
  this.features = features;
  this.meeple = meepleLocation;
};

module.exports = Tile;
