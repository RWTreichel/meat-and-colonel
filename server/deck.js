var Tile = require('./tile');
var _ = require('lodash');
// var spec = require('./deckSpec');

// this is what a deck should look like
  // [ {id: u, orientation: 0, features: {...}, x: undefined, y: undefined}, 
    // {id: c, orientation: 0, features: {...}, x: undefined, y: undefined}, ... ] 

// takes a `spec` argument
// the spec is an object, it contains a letter keys which represent the type of card
  // a quantity property which is the number of cards for each type
  // and a features property, which describes the features on each direction of the tile
// if that is confusing, require('./deckSpec'), make a deck, and check it out

var Deck = function(spec){
  this.deck = [];
  for (var key in spec){
    for (var i = 0; i < spec[key].quantity; i++) {
      this.deck.push(new Tile ( key, spec[key].features ));
    }
  }
  this.startTile = this.deck.pop();
  this.deck = _.shuffle(this.deck);
};

// removes and returns the card from the top of the deck
Deck.prototype.pop = function() {
  return this.deck.pop();
};

// returns the card at the top of the deck without removing it
Deck.prototype.peek = function() {
  return _.last(this.deck);
};

module.exports = Deck;
