'use strict';

const { createArrayPuzzle, validInput, getStartPositions, makeWordMap } = require('./solver/parser');
const { solver } = require('./solver/solver');

const puzzle = '2001\n0..0\n1000\n0..0';
const words = ['casa', 'alan', 'ciao', 'anta'];

//crosswordSolver(puzzle, words);

function printPuzzle(arrayPuzzle) {
    for (let line of arrayPuzzle) {
        for (let char of line) {
            process.stdout.write(char);
        }
        console.log('');
    }
}

function crosswordSolver(stringPuzzle, words) {
    // Puzzle to an array of character arrays for mutability
    let arrayPuzzle = createArrayPuzzle(stringPuzzle);

    if (!validInput(stringPuzzle, arrayPuzzle, words)) {
        console.log("Error");
        return;
    }

    let startPositions = getStartPositions(arrayPuzzle);
    if (startPositions.length != words.length) {
        console.log("Error");
        return;
    }

    // Put words into map where key is length and value array of words
    let wordMap = makeWordMap(words);
    let usedWords = new Map();

    // Solver() finds solutions
    let solutions = [];
    solver(arrayPuzzle, wordMap, usedWords, 0, solutions, startPositions)

    if (solutions.length != 1) {
        console.log("Error");
        return;
    }

    printPuzzle(solutions[0]);
}

module.exports = { crosswordSolver };
