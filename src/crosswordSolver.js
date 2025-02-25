'use strict';

const { createArrayPuzzle, validInput, getStartPositions } = require('./solver/parser');
const { solver, updatePuzzle } = require('./solver/solver');

//const puzzle = '2001\n0..0\n1000\n0..0';
//const words = ['casa', 'alan', 'ciao', 'anta'];

const puzzle = `...1...........
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
..........0....`
const words = [
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
]

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
    let used = []

    // Place any unique length words into puzzle before starting
    const uniqueLengths = findUniques(words)
    if (uniqueLengths.length > 0) {
        [words, arrayPuzzle, startPositions, used] = placeUniques(arrayPuzzle, startPositions, uniqueLengths, words)
    }

    // Especially when no unique lengths, start with trying words with the
    // most crossings so impossible solutions are detected early
    // Or so it would seem
    startPositions = mostCrossingsFirst(startPositions)

    // Solver() finds solutions
    let solutions = []
    solver(arrayPuzzle, words, solutions, startPositions, used, startPositions)

    if (solutions.length != 1) {
        console.log(solutions.length)
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

function placeUniques(arrayPuzzle, startPositions, uniqueLengths, words) {
    let used = []

    // fill uniques
    for (let i = 0; i < startPositions.length; i++) {
        const start = startPositions[i]

        for (let j = 0; j < uniqueLengths.length; j++) {
            if (start.length == uniqueLengths[j].length) {
                arrayPuzzle = updatePuzzle(arrayPuzzle, uniqueLengths[j], start)

                // one start was used
                used.push(start)
                startPositions = startPositions.slice(0, i).concat(startPositions.slice(i + 1))
                i--
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

    return [newWords, arrayPuzzle, startPositions, used]
}

/**
 * 
 * @param {[]} startPositions 
 */
function mostCrossingsFirst(startPositions) {
    let startPoss = []
    let verts = startPositions.filter((sp) => sp.direction == "right")
    let horis = startPositions.filter((sp) => sp.direction == "down")

    for (const v of verts) {
        let counter = 0
        for (const h of horis) {
            if (v.coordinates[1] <= h.coordinates[1] &&
                v.coordinates[1] + v.length >= h.coordinates[1] &&
                v.coordinates[0] >= h.coordinates[0] &&
                v.coordinates[0] <= h.coordinates[0] + h.length) {

                counter++
            }
        }
        v['crosses'] = counter
        startPoss.push(v)
    }

    for (const h of horis) {
        let counter = 0
        for (const v of verts) {

            if (v.coordinates[0] <= h.coordinates[0] &&
                v.coordinates[0] + v.length >= h.coordinates[0] &&
                v.coordinates[1] >= h.coordinates[1] &&
                v.coordinates[1] <= h.coordinates[1] + h.length) {

                counter++
            }

        }
        h['crosses'] = counter
        startPoss.push(h)
    }

    startPoss.sort((a, b) => b.crosses - a.crosses)
    startPoss.forEach((sp) => delete sp.crosses)    // Might not do anything?

    for (let i = 0; i < startPoss.length; i++) {
        startPoss[i]['ind'] = i
    }

    return startPoss
}

module.exports = { crosswordSolver };
