var Meeple = function(color, id, occupation, location){
  this.color = color;
  this.id = id;
  this.occupation = occupation;
  this.location = location; // int 0-8 based on placement on tile?
};

// creates a collection of all of the meeples needed for one game
// each player's meeples are in their own array
// i.e. var meeps = new Meeples(); meeps.blue === [{meeple},{meeple} ...]
var Meeples = function(){
  var colors = ['blue', 'red', 'black', 'yellow', 'green'];
  for (var j = 0; j < colors.length; j++) {
    var color = colors[j];
    this[color] = [];
    for (var k = 0; k < 5; k++) {
      this[color].push( new Meeple(color, k) );
    }
  }
};

module.exports = Meeples;