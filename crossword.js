'use strict';

const puzzle = '2001\n0..0\n1000\n0..0';
const words = ['casa', 'alan', 'ciao', 'anta'];

function createArrayPuzzle(emptyPuzzle) {
    let stringLines = String(emptyPuzzle).split(/\r?\n/);
    let arrayLines = [];
    for (let strLine of stringLines) {
        let arrayLine = [];
        for (let char of strLine) {
            arrayLine.push(char);
        }
        arrayLines.push(arrayLine);
    }
    return arrayLines;
}

function validInput(stringPuzzle, arrayPuzzle, words) {
    if (
        typeof stringPuzzle != 'string' ||
        stringPuzzle === '' ||
        arrayPuzzle == null ||
        arrayPuzzle.length == 0 ||
        words == null ||
        !Array.isArray(words) ||
        words.length == 0
    ) {
        return false;
    }

    // row lengths must be equal and rows can include only '.', '0', '1' or '2'
    let lenRow = arrayPuzzle[0].length;
    let cells = 0;
    for (let row of arrayPuzzle) {
        if (row.length != lenRow) {
            return false;
        }

        for (let char of row) {
            if (char != '.' && char != '0' && char != '1' && char != '2'){
                return false;
            }
            if (char == '0' || char == '1' || char == '2') cells++;
        }
    }

    // duplicate words not allowed
    let chars = 0;
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            if (words[i] == words[j]){
                return false;
            } 
        }
        for (const c of words[i]) chars++;
    }

    // clearly too many cells
    if (cells > chars) {
        return false;
    }

    return true;
}

function getStartCoordinates(puzzle) {
    let starts = [];    // [row, column] pairs in that order

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {

            let value = puzzle[i][j];
            if (value != 0 && value != '.') {

                // some are added multiple times
                while (value > 0) {
                    starts.push([i, j]);
                    value--;
                }
            }
        }
    }

    return starts;
}

function wordFits(puzzle, word, coordinates) {
    let directions = [];
    let beforeFirst = '';
    let afterLast = '';

    // try to fit word in both directions
    for (let direction of ['right', 'down']) {

        // multipliers for different directions
        let rowMult = 0;
        let colMult = 0;
        if (direction == 'right') colMult = 1;
        if (direction == 'down') rowMult = 1;

        let success = true;

        // try each letter individually
        for (let i = 0; i < word.length; i++) {
            let row = coordinates[0] + i * rowMult;    // changes at 'down'
            let col = coordinates[1] + i * colMult;    // changes at 'right'

            // fail if word goes past edge
            if (row > puzzle.length - 1 || col > puzzle[0].length) {
                success = false;
                break;
            }

            // fail if cell value isn't one of the allowed
            let cell = puzzle[row][col];
            if (!(cell == 2 || cell == 1 || cell == 0 || cell == word[i])) {
                success = false;
                break;
            }

            // save value of cell before word
            if (i == 0) {
                if (col - 1 * colMult < 0 || row - 1 * rowMult < 0) {
                    beforeFirst = undefined;
                } else {
                    beforeFirst = puzzle[row - 1 * rowMult][col - 1 * colMult]
                }
            }

            // save value of cell after word            
            if (i == word.length - 1) {
                if (col + 1 * colMult > puzzle[0].length - 1 || row + 1 * rowMult > puzzle.length - 1) {
                    afterLast = undefined;
                } else {
                    afterLast = puzzle[row + 1 * rowMult][col + 1 * colMult]
                }
            }

        }
        // fail if usable cells before or after word
        if (!(beforeFirst == '.' || beforeFirst == undefined) || !(afterLast == '.' || afterLast == undefined)) {
            success = false;
        }

        if (success) {
            directions.push(direction)
        }
    }

    return directions;
}

function updatePuzzle(puzzle, word, coordinates, direction) {
    // Shallow copy line by line so original lines don't get modified
    let newPuzzle = [];
    for (let line of puzzle) {
        let newLine = [...line];
        newPuzzle.push(newLine);
    }

    let [rowAdd, colAdd] = [0, 0];
    if (direction == 'down') rowAdd = 1;
    if (direction == 'right') colAdd = 1;

    for (let i = 0; i < word.length; i++) {
        let row = coordinates[0] + i * rowAdd;  // +i happens when down
        let col = coordinates[1] + i * colAdd;  // +i happens when right
        newPuzzle[row][col] = word[i];
    }

    return newPuzzle;
}

function uniqueSolution(solutions, puzzle) {
    let jsonString = JSON.stringify(puzzle);
    for (let sol of solutions) {
        if (jsonString == JSON.stringify(sol)) {
            return false;
        }
    }
    return true;
}

// move solver inside crosswordSolver to not have to pass 'solutions' and 'allStartCoordinates' to it?
function solver(currentPuzzle, words, startIndex, solutions, allStartCoordinates) {

    // Too many solutions, abort
    if (solutions.length > 1) {
        return;
    }

    // Solution complete, end here        
    if (words.length == 0) {
        // Start positions with '2' will spawn duplicate solutions so check uniqueness
        if (uniqueSolution(solutions, currentPuzzle)) {
            solutions.push(currentPuzzle);
        }
        return;
    }

    // Words remain, keep going
    let startCoords = allStartCoordinates[startIndex];
    startIndex++;
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // When word doesn't fit, abandon. Is this 'backtracking'?
        const directions = wordFits(currentPuzzle, word, startCoords);

        // When found fits, recur with updated values
        for (let direction of directions) {
            let newPuzzle = updatePuzzle(currentPuzzle, word, startCoords, direction); // write word into current puzzle
            let newWords = words.slice(0, i).concat(words.slice(i + 1)) // remove word from array
            solver(newPuzzle, newWords, startIndex, solutions, allStartCoordinates);
        }
    }
}

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

    let allStartCoordinates = getStartCoordinates(arrayPuzzle);
    if (allStartCoordinates.length != words.length) {
        console.log("Error");
        return;
    }

    // solver() finds solutions
    let solutions = [];
    solver(arrayPuzzle, words, 0, solutions, allStartCoordinates)

    if (solutions.length != 1) {
        console.log(solutions.length);
        console.log("Error");
        return;
    }

    printPuzzle(solutions[0]);
}

module.exports = { createArrayPuzzle, validInput, getStartCoordinates, wordFits, updatePuzzle, uniqueSolution, crosswordSolver};

//crosswordSolver(puzzle, words);

// TODO:
// x validate inputs
// x automate testing
// x go through audit questions
// - are we following good practices (file structure, separation of concerns etc.)?
// - should we use multiple files?
// - should (Jest) testfile be in its own folder?
// x is it actually backtracking?
// x bigger test cases?
