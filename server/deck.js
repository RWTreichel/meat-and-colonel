
// this is what a deck should look like
  // [ {id: a0, orientation: 0}, {id: a1, orientation: 0}, ... ] 



// takes a `spec` argument
// the spec is an object, it contains letter keys (ie a, b c)
  // and values are an array that contain integers representing the number of 
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

Deck.prototype.shuffle = function() {
  // fisher yates shuffle yolo
  // operates on this.deck
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

// all of the cards
// verbose, but easily extendable for expansion packs
// the key is the id-letter
// the int in the array is part of the id, and represents how many
  // of a given card there is
var cards = {
  a: [0, 1],
  b: [0, 2, 3, 4],
  c: [0],
  d: [0, 1, 2, 3],
  e: [0, 1, 2, 3, 4],
  f: [0, 1],
  g: [0],
  h: [0, 1, 2],
  i: [0, 1],
  j: [0, 1, 2],
  k: [0, 1, 2],
  l: [0, 1, 2],
  m: [0, 1],
  n: [0, 1, 2],
  o: [0, 1],
  p: [0, 1, 2],
  q: [0],
  r: [0, 1, 2],
  s: [0, 1],
  t: [0],
  u: [0, 1, 2, 3, 4, 5, 6, 7],
  v: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  w: [0, 1, 2, 3],
  x: [0]
};