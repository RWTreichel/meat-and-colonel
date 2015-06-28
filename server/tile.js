/* this is what a tile should look like going to and coming from client
    {
      id: a,          // (A thru X) + num
      orientation: 1,  // 0 - 3
      x: 13,           // 0 - boardSize
      y: 2,            // 0 - boardSize
      meeple: {...},   // color and location, don't even knwo what location is at this point
      feature = {
        n: 'grass',
        s: 'road',
        e: 'grass',
        w: 'grass'
      }
    } 
*/

var Tile = function(id, features, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
  this.orientation = 0;
  this.features = features;
  this.meeple = {
    color: null,
    location: null
  };
};

module.exports = Tile;
