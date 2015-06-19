var Tile = require('./tile');

// this is what a deck should look like
  // [ {id: a0, orientation: 0}, {id: a1, orientation: 0}, ... ] 

// takes a `spec` argument
// the spec is an object, it contains letter keys (i.e. a, b, c)
  // and its values are arrays that contain integers representing the number of 
  // each card in the deck. 
// if that is confusing just look at the `cards` object below and it might make sense...
var Deck = function(spec){
  this.deck = [];
  for (var key in spec){
    for (var i = 0; i < spec[key].length; i++) {
      this.deck.push(new Tile ( key + spec[key][i] ));
    }
  }
};

// fisher yates shuffle yolo
// operates on this.deck
Deck.prototype.shuffle = function() {
  if (this.deck.length === 0) {
    console.log('you dun goofed');
  }
  var currentIndex = this.deck.length, temporaryValue, randomIndex;
  while (0 !== currentIndex){
    randomIndex = Math.floor( Math.random () * currentIndex);
    currentIndex -= 1;
    temporaryValue = this.deck[currentIndex];
    this.deck[currentIndex] = this.deck[randomIndex];
    this.deck[randomIndex] = temporaryValue;
  }
};

// returns the card from the top of the deck
Deck.prototype.pop = function() {
  return this.deck.pop();
};

module.exports = Deck;