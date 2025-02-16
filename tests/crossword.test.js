'use strict';

const { createArrayPuzzle, validInput, getStartPositions } = require('../src/solver/parser');
const { wordFits, updatePuzzle } = require('../src/solver/solver');
const { allPuzzles, allWordSets } = require('./audit-values');


// Array creation
test('make first array puzzle', () => {
    expect(createArrayPuzzle(allPuzzles[0])).toStrictEqual([
        ["2","0","0","1"],
        ["0",".",".","0"],
        ["1","0","0","0"],
        ["0",".",".","0"]
    ]);
});

test('make second array puzzle', () => {
    expect(createArrayPuzzle(allPuzzles[1])).toStrictEqual([
        [".",".",".","1",".",".",".",".",".",".",".",".",".",".","."],
        [".",".","1","0","0","0","0","0","1","0","0","0",".",".","."],
        [".",".",".","0",".",".",".",".","0",".",".",".",".",".","."],
        [".","1",".",".",".",".",".",".","0",".",".",".","1",".","."],
        [".","0",".",".",".",".","1","0","0","0","0","0","0","0","0"],
        ["1","0","0","0","0","0",".",".","0",".",".",".","0",".","."],
        [".","0",".",".",".",".",".","1","0","0","1","0","0","0","."],
        [".","0",".","1",".",".",".",".","0",".","0",".",".",".","."],
        [".","1","0","0","0","0","0","0","0",".","0",".",".",".","."],
        [".","0",".","0",".",".",".",".",".",".","0",".",".",".","."],
        [".","0",".","0",".",".",".",".",".","1","0","0",".",".","."],
        [".",".",".","0",".",".",".",".",".",".","0",".",".",".","."],
        [".",".",".",".",".",".",".",".",".",".","0",".",".",".","."]
    ]);
});


// Input validation
for (let i = 0; i < 4; i++) {
    test('try if first four inputs are valid', () => {
        expect(validInput(allPuzzles[i], createArrayPuzzle(allPuzzles[i]), allWordSets[i])).toBe(true);
    });
}

test('try if inputs 4 many start cells are invalid', () => {
    expect(validInput(allPuzzles[4], createArrayPuzzle(allPuzzles[4]), allWordSets[4])).toBe(false);
});

test('try if inputs 5 start 3 are invalid', () => {
    expect(validInput(allPuzzles[5], createArrayPuzzle(allPuzzles[5]), allWordSets[5])).toBe(false);
});

test('try if inputs 6 repeat word are invalid', () => {
    expect(validInput(allPuzzles[6], createArrayPuzzle(allPuzzles[6]), allWordSets[6])).toBe(false);
});

test('try if inputs 7 empty puzzle are invalid', () => {
    expect(validInput(allPuzzles[7], createArrayPuzzle(allPuzzles[7]), allWordSets[7])).toBe(false);
});

test('try if inputs 8 puzzle number are invalid', () => {
    expect(validInput(allPuzzles[8], createArrayPuzzle(allPuzzles[8]), allWordSets[8])).toBe(false);
});

test('try if inputs 9 word number are invalid', () => {
    expect(validInput(allPuzzles[9], createArrayPuzzle(allPuzzles[9]), allWordSets[9])).toBe(false);
});

test('try if inputs 10 multiple solutions are valid', () => {
    expect(validInput(allPuzzles[10], createArrayPuzzle(allPuzzles[10]), allWordSets[10])).toBe(true);
});

test('try if inputs 11 no solutions are valid', () => {
    expect(validInput(allPuzzles[11], createArrayPuzzle(allPuzzles[11]), allWordSets[11])).toBe(true);
});


// Start Coordinates
test('find start coordinates 0', () => {
    expect(getStartPositions(createArrayPuzzle(allPuzzles[0]))).toStrictEqual([
        { coordinates: [ 0, 0 ], length: 4, direction: 'right' },
        { coordinates: [ 0, 0 ], length: 4, direction: 'down' },
        { coordinates: [ 0, 3 ], length: 4, direction: 'down' },
        { coordinates: [ 2, 0 ], length: 4, direction: 'right' }
      ]);
});

test('find start coordinates 1', () => {
    expect(getStartPositions(createArrayPuzzle(allPuzzles[1]))).toStrictEqual([
        { coordinates: [ 0, 3 ], length: 3, direction: 'down' },
        { coordinates: [ 1, 2 ], length: 10, direction: 'right' },
        { coordinates: [ 1, 8 ], length: 8, direction: 'down' },
        { coordinates: [ 3, 1 ], length: 8, direction: 'down' },
        { coordinates: [ 3, 12 ], length: 4, direction: 'down' },
        { coordinates: [ 4, 6 ], length: 9, direction: 'right' },
        { coordinates: [ 5, 0 ], length: 6, direction: 'right' },
        { coordinates: [ 6, 7 ], length: 7, direction: 'right' },
        { coordinates: [ 6, 10 ], length: 7, direction: 'down' },
        { coordinates: [ 7, 3 ], length: 5, direction: 'down' },
        { coordinates: [ 8, 1 ], length: 8, direction: 'right' },
        { coordinates: [ 10, 9 ], length: 3, direction: 'right' }
      ]);
});

test('find start coordinates 2', () => {
    expect(getStartPositions(createArrayPuzzle(allPuzzles[2]))).toStrictEqual([
        { coordinates: [ 0, 2 ], length: 7, direction: 'down' },
        { coordinates: [ 0, 4 ], length: 5, direction: 'down' },
        { coordinates: [ 0, 7 ], length: 10, direction: 'down' },
        { coordinates: [ 1, 0 ], length: 5, direction: 'right' },
        { coordinates: [ 1, 7 ], length: 4, direction: 'right' },
        { coordinates: [ 3, 2 ], length: 7, direction: 'right' },
        { coordinates: [ 5, 0 ], length: 4, direction: 'right' },
        { coordinates: [ 5, 6 ], length: 5, direction: 'right' },
        { coordinates: [ 6, 4 ], length: 5, direction: 'down' },
        { coordinates: [ 8, 2 ], length: 6, direction: 'right' }
      ]);
});


// Word fits
test('word fits I', () => {
    expect(wordFits('alan', 'a001')).toBe(true);
});
test('word fits II word out of bounds', () => {
    expect(wordFits('alanx', 'a001z')).toBe(false);
});

// Update Puzzle
test('puzzle update', () => {
    expect(updatePuzzle([
        [ 'a', '0', '0', '1' ],
        [ 'l', '.', '.', '0' ],
        [ 'a', '0', '0', '0' ],
        [ 'n', '.', '.', '0' ]
      ], 'anta', { coordinates: [ 0, 0 ], length: 4, direction: 'right' })).toStrictEqual([
        [ 'a', 'n', 't', 'a' ],
        [ 'l', '.', '.', '0' ],
        [ 'a', '0', '0', '0' ],
        [ 'n', '.', '.', '0' ]
      ]);
});
