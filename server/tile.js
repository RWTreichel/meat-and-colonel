/* this is what a tile should look like   
    {
      id: v9,  //(A thru X) + num 
      orientation: 1  //0 - 3 
    } 
*/


// Dick, I don't know anything about the rules still
// i added a bunch of crap, remove whatever you think we don't need

// also, it might be worth considering having all of these craps wrapped into 
// one `game` somehow, then when we initialize a `game` it'll automagically
// set up everything, then anything we need to do can be accessed through the game

// that would make it easy to have multiple instances of games concurrent sessions as well


var Tile = function(id){
  this.id = id;
  this.orientation = 0;
  this._x = null;
  this._y = null;
  this.meeple = null; // for when we add a meeple
                      // should meeples be their own Class?
                      // i'll let dick decide since  i barely know what they are...
};

Tile.prototype.setCoordinates = function(x, y) {
  this._x = x;
  this._y = y;
};

Tile.prototype.getCoordinates = function() {
  return [this._x, this._y];
};

// refactor once it's decided how meeples will be handled
Tile.prototype.addMeeple = function(meeple) {
  this.meeple = meeple;
};

module.exports = Tile;