// all of the cards
// verbose, but easily extendable for expansion packs
// the key is the id-letter
// the int in the array is part of the id, and represents how many
  // of a given card there is


// deck spec v3, now has land features

var deckSpec = {
  d: {
    quantity: 4,
    features: {
      n: 'road',
      s: 'road',
      e: 'city',
      w: 'grass'
    }
  },
  a: {
    quantity: 2,
    features: {
      n: 'grass',
      s: 'road',
      e: 'grass',
      w: 'grass'
    }
  },
  b: {
    quantity: 5,
    features: {
      n: 'grass',
      s: 'grass',
      e: 'grass',
      w: 'grass'
    }
  },
  c: {
    quantity: 1,
    features: {
      n: 'city',
      s: 'city',
      e: 'city',
      w: 'city'
    }
  },
  e: {
    quantity: 5,
    features: {
      n: 'city',
      s: 'grass',
      e: 'grass',
      w: 'grass'
    }
  },
  f: {
    quantity: 2,
    features: {
      n: 'grass',
      s: 'grass',
      e: 'city',
      w: 'city'
    }
  },
  g: {
    quantity: 1,
    features: {
      n: 'city',
      s: 'city',
      e: 'grass',
      w: 'grass'
    }
  },
  h: {
    quantity: 3,
    features: {
      n: 'grass',
      s: 'grass',
      e: 'city',
      w: 'city'
    }
  },
  i: {
    quantity: 2,
    features: {
      n: 'grass',
      s: 'city',
      e: 'city',
      w: 'grass'
    }
  },
  j: {
    quantity: 3,
    features: {
      n: 'city',
      s: 'road',
      e: 'road',
      w: 'grass'
    }
  },
  k: {
    quantity: 3,
    features: {
      n: 'road',
      s: 'grass',
      e: 'city',
      w: 'road'
    }
  },
  l: {
    quantity: 3,
    features: {
      n: 'road',
      s: 'road',
      e: 'city',
      w: 'road'
    }
  },
  m: {
    quantity: 2,
    features: {
      n: 'city',
      s: 'grass',
      e: 'grass',
      w: 'city'
    }
  },
  n: {
    quantity: 3,
    features: {
      n: 'city',
      s: 'grass',
      e: 'grass',
      w: 'city'
    }
  },
  o: {
    quantity: 2,
    features: {
      n: 'city',
      s: 'road',
      e: 'city',
      w: 'road'
    }
  },
  p: {
    quantity: 3,
    features: {
      n: 'city',
      s: 'road',
      e: 'city',
      w: 'road'
    }
  },
  q: {
    quantity: 1,
    features: {
      n: 'city',
      s: 'grass',
      e: 'city',
      w: 'city'
    }
  },
  r: {
    quantity: 3,
    features: {
      n: 'city',
      s: 'grass',
      e: 'city',
      w: 'city'
    }
  },
  s: {
    quantity: 2,
    features: {
      n: 'city',
      s: 'road',
      e: 'city',
      w: 'city' 
    }
  },
  t: {
    quantity: 1,
    features: {
      n: 'city',
      s: 'road',
      e: 'city',
      w: 'city'
    }
  },
  u: {
    quantity: 8,
    features: {
      n: 'road',
      s: 'road',
      e: 'grass',
      w: 'grass'
    }
  },
  v: {
    quantity: 9,
    features: {
      n: 'grass',
      s: 'road',
      e: 'grass',
      w: 'road'
    }
  },
  w: {
    quantity: 4,
    features: {
      n: 'grass',
      s: 'road',
      e: 'road',
      w: 'road'
    }
  },
  x: {
    quantity: 1,
    features: {
      n: 'road',
      s: 'road',
      e: 'road',
      w: 'road'
    }
  }
};

module.exports = deckSpec;