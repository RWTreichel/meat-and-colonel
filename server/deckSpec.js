// all of the cards
// verbose, but easily extendable for expansion packs
// the key is the id-letter
// the int in the array is part of the id, and represents how many
  // of a given card there is

var deckSpec = {
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

module.exports = deckSpec;