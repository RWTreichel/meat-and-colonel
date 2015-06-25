var grid = angular.module('game.grid');

grid.factory('TileModel', function() {
  var Tile = function(tilespec) {
    this.id = tilespec.id;
    this.x = tilespec.x || null;
    this.y = tilespec.y || null;
    this.img = this.getImage(tilespec.id);
    this.val = tilespec.val || 2;
    this.orientation = tilespec.orientation;
    this.meeple = {};
    this.features = tilespec.features;
  };
  Tile.prototype.getImage = function(id) {
    // Grab an image from our asset folder to set as img attribute
    return 'assets/img/Tiles/' + id.toUpperCase() + '.png';
  };
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
  
  return Tile;
});