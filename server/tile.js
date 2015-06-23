/* this is what a tile should look like going to and coming from client
    {
      id: a,          // (A thru X) + num
      orientation: 1,  // 0 - 3
      x: 13,           // 0 - boardSize
      y: 2,            // 0 - boardSize
      meeple: ** to do, meeple location stuff**
      feature = {
        n: 'grass',
        s: 'road',
        e: 'grass',
        w: 'grass'
      }
    } 
*/

var Tile = function(id, features, x, y, meeple){
  this.id = id;
  this.x = x;
  this.y = y;
  this.orientation = 0;
  this.features = features;
  this.meeple = meeple;
};

// use this on client side and remove from here.
// will make tile validation easier if features
// rotate with tile.
Tile.prototype.rotateRight = function() {
  this.orientation = (this.orientation + 1) % 4;

  var temp = {};
  for (var key in this.features){
    temp[key] = this.features[key];
  }

  this.features.n = temp.w;
  this.features.e = temp.n;
  this.features.s = temp.e;
  this.features.w = temp.s;
};

module.exports = Tile;

// Below here is a simple demo, uncomment to see rotation in action
// rotation should be a client side function, but it's here until
// someone on front end needs it

// var feat = {
//       n: 'grass',
//       s: 'road',
//       e: 'grass',
//       w: 'grass'
//     };

// var tile = new Tile('a', feat);

// console.log(tile);
// tile.rotateRight();
// console.log(tile);
// tile.rotateRight();
// console.log(tile);
