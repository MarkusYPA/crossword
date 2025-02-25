'use strict';

const { createArrayPuzzle, validInput, getStartPositions } = require('./solver/parser');
const { solver, updatePuzzle } = require('./solver/solver');

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

    // Slightly faster when starting with long words
    //words.sort((a, b) => b.length - a.length);

    const uniqueLengths = findUniques(words)
    console.log(uniqueLengths)

    if (uniqueLengths.length == 0) {
        // fill slot with most crossings

    } else {
        // fill uniques
        for (let i = 0; i < startPositions.length; i++) {
            const start = startPositions[i]
            for (let j = 0; j < uniqueLengths.length; j++) {
                if (start.length == uniqueLengths[j].length) {
                    arrayPuzzle = updatePuzzle(arrayPuzzle, uniqueLengths[j], start)  

                    // one start was used
                    startPositions = startPositions.slice(0, i).concat(startPositions.slice(i + 1))
                    break
                }
            }
        }

        let newWords = []
        for (const wd1 of words) {
            let notUsed = true
            for (const wd2 of uniqueLengths) {
                if (wd1 == wd2) {
                    notUsed = false
                }
            }
            if (notUsed) newWords.push(wd1)
        }

        words = newWords

        //printPuzzle(arrayPuzzle)
    }

    //return

    // Solver() finds solutions
    let solutions = [];
    solver(arrayPuzzle, words, 0, solutions, startPositions)

    if (solutions.length != 1) {
        console.log("Error");
        return;
    }

    printPuzzle(solutions[0]);
}

function findUniques(words) {
    let uniqs = []
    for (let i = 0; i < words.length; i++) {
        let matches = 0
        for (let j = 0; j < words.length; j++) {
            if (words[i].length == words[j].length) {
                matches++
            }
        }
        if (matches < 2) uniqs.push(words[i])
    }
    return uniqs
}

module.exports = { crosswordSolver };
