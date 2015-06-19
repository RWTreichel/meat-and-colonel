var Meeple = function(color, id){
  this.color = color;
  this.id = id;
  this.occupation = null;
  this.location = null; // int 0-8 based on placement on tile?
};

var Meeples = function(){
  this.blue   = [];
  this.red    = [];
  this.black  = [];
  this.yellow = [];
  this.green  = [];

  for (var i = 0; i < 5; i++) {
    this.blue.push( new Meeple('blue', i) );
    this.red.push( new Meeple('red', i) );
    this.black.push( new Meeple('black', i) );
    this.yellow.push( new Meeple('yellow', i) );
    this.green.push( new Meeple('green', i) );
  }
};

module.exports = Meeples;

var meeps = new Meeples();

console.log(meeps.blue);