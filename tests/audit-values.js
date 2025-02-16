'use strict';

const allTitles = [];
const allPuzzles = [];
const allWordSets = [];

allTitles.push('Case 01: Short puzzle with \'anta\'');
allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allTitles.push('Case 02: Vacation');
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

allTitles.push('Case 03: Foods');
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

allTitles.push('Case 04: Vacation with reversed words');
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

allTitles.push('Case 05: Too many starts overall');
allPuzzles.push('2001\n0..0\n2000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allTitles.push('Case 06: Too high a number for starts in one cell');
allPuzzles.push('0001\n0..0\n3000\n0..0');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allTitles.push('Case 07: Duplicate word');
allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['casa', 'casa', 'ciao', 'anta']);

allTitles.push('Case 08: No cells at all');
allPuzzles.push('');
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allTitles.push('Case 09: Invalid puzzle type');
allPuzzles.push(123);
allWordSets.push(['casa', 'alan', 'ciao', 'anta']);

allTitles.push('Case 10: No cells and invalid words type');
allPuzzles.push('');
allWordSets.push(123);

allTitles.push('Case 11: Too many solutions');
allPuzzles.push('2000\n0...\n0...\n0...');
allWordSets.push(['abba', 'assa']);

allTitles.push('Case 12: No solution');
allPuzzles.push('2001\n0..0\n1000\n0..0');
allWordSets.push(['aaab', 'aaac', 'aaad', 'aaae']);

let auditCases = [];

for (let i = 0; i < allTitles.length; i++) {
  auditCases.push({title: allTitles[i], puzzle: allPuzzles[i], words: allWordSets[i]})
}

module.exports = { allPuzzles, allWordSets, auditCases };
