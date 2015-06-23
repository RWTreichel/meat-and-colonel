var Tile = require('./tile');
// var spec = require('./deckSpec');

// this is what a deck should look like
  // [ {id: u, orientation: 0, features: {...}, x: undefined, y: undefined}, 
    // {id: c, orientation: 0, features: {...}, x: undefined, y: undefined}, ... ] 

// takes a `spec` argument
// the spec is an object, it contains a letter keys which represent the type of card
  // a quantity property which is the number of cards for each type
  // and a features property, which describes the features on each direction of the tile
// if that is confusing, require('./deckSpec') and make a deck. 
var Deck = function(spec){
  this.deck = [];
  for (var key in spec){
    for (var i = 0; i < spec[key].quantity; i++) {
      this.deck.push(new Tile ( key, spec[key].features ));
    }
  }
  this.startTile = this.deck.pop();
  Deck.prototype.shuffle.call(this);
};

// classic fisher-yates shuffle
// operates on this.deck
Deck.prototype.shuffle = function() {
  if (this.deck.length === 0) {
    console.log('you dun goofed, your deck is empty');
  }
  var currentIndex = this.deck.length, temporaryValue, randomIndex;
  while (0 !== currentIndex){
    randomIndex = Math.floor( Math.random () * currentIndex );
    currentIndex -= 1;
    temporaryValue = this.deck[currentIndex];
    this.deck[currentIndex] = this.deck[randomIndex];
    this.deck[randomIndex] = temporaryValue;
  }
};

// removes and returns the card from the top of the deck
Deck.prototype.pop = function() {
  return this.deck.pop();
};

// returns the card at the top of the deck without removing it
Deck.prototype.peek = function() {
  return this.deck[ this.deck.length - 1 ];
};

module.exports = Deck;
