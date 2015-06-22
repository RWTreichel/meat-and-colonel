var Tile = require('./tile');
// var spec = require('./deckSpec');


// this is what a deck should look like
  // [ {id: a0, orientation: 0}, {id: a1, orientation: 0}, ... ] 

// takes a `spec` argument
// the spec is an object, it contains letter keys (i.e. a, b, c)
  // and its values are integers representing the number of 
  // each of that card in the deck. 
// if that is confusing just look at the `cards` object below and it might make sense...
var Deck = function(spec){
  this.deck = [];
  for (var key in spec){
    for (var i = 0; i < spec[key]; i++) {
      this.deck.push(new Tile ( key + i ));
    }
  }
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

  // if group approves _ inclusion, replace all that with
  // _.shuffle(this.deck);
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