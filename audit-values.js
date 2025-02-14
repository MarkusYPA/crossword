const allPuzzles = [];
const allWordSets = [];

allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allPuzzles.push(`...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`);
allWordSets.push([
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]);

allPuzzles.push(`..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`);
allWordSets.push([
  'popcorn',
  'fruit',
  'flour',
  'chicken',
  'eggs',
  'vegetables',
  'pasta',
  'pork',
  'steak',
  'cheese',
]);

allPuzzles.push(`...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`);
allWordSets.push([
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse());

allPuzzles.push('2001\n0..0\n2000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allPuzzles.push('0001\n0..0\n3000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['casa', 'casa', 'ciao', 'anta']);

allPuzzles.push('');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allPuzzles.push(123);
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allPuzzles.push('');
allWordSets.push(123);

allPuzzles.push('2000\n0...\n0...\n0...');
allWordSets.push(['abba', 'assa']);

allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['aaab', 'aaac', 'aaad', 'aaae']);

module.exports = { allPuzzles, allWordSets };
