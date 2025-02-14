'use strict';

const puzzle = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`
const words = [
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
]

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

    // horizontal and vertical tries are quite repetitive. Can we improve?

    // try horizontal (right)
    let success = true;
    for (let i = 0; i < word.length; i++) {
        let row = coordinates[0];
        let col = coordinates[1] + i;
        if (row > puzzle.length - 1 || col > puzzle[0].length) {
            success = false;
            break;
        }

        let cell = puzzle[row][col];
        if (!(cell == 2 || cell == 1 || cell == 0 || cell == word[i])) {
            success = false;
        }

        // save value of cell before word
        if (i == 0) {
            if (col - 1 < 0) {
                beforeFirst = undefined;
            } else {
                beforeFirst = puzzle[row][col - 1]
            }
        }

        // save value of cell after word
        if (i == word.length - 1) {
            if (col + 1 > puzzle[0].length - 1) {
                afterLast = undefined;
            } else {
                afterLast = puzzle[row][col + 1]
            }
        }
    }
    // No fit if theres room before or after the word
    if (!(beforeFirst == '.' || beforeFirst == undefined) || !(afterLast == '.' || afterLast == undefined)) {
        success = false;
    }

    if (success) {
        directions.push('right')
    }

    // try vertical (down)
    beforeFirst = '';
    afterLast = '';
    success = true;
    for (let i = 0; i < word.length; i++) {
        let row = coordinates[0] + i;
        let col = coordinates[1];
        if (row > puzzle.length - 1 || col > puzzle[0].length) {
            success = false;
            break;
        }

        let cell = puzzle[row][col];
        if (!(cell == 2 || cell == 1 || cell == 0 || cell == word[i])) {
            success = false;
        }

        // save value of cell before word
        if (i == 0) {
            if (row - 1 < 0) {
                beforeFirst = undefined;
            } else {
                beforeFirst = puzzle[row - 1][col]
            }
        }

        // save value of cell after word
        if (i == word.length - 1) {
            if (row + 1 > puzzle.length - 1) {
                afterLast = undefined;
            } else {
                afterLast = puzzle[row + 1][col]
            }
        }
    }
    // No fit if theres room before or after the word
    if (!(beforeFirst == '.' || beforeFirst == undefined) || !(afterLast == '.' || afterLast == undefined)) {
        success = false;
    }

    if (success) {
        directions.push('down')
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
    if (words.length == 0) { // Checking with (words.length == 0) or startIndex > allStartCoordinates.length - 1?
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
        const directions = wordFits(currentPuzzle, word, startCoords);

        for (let direction of directions) {
            let newPuzzle = updatePuzzle(currentPuzzle, word, startCoords, direction); // write word into current puzzle
            let newWords = words.slice(0, i).concat(words.slice(i + 1)) // remove word from array
            solver(newPuzzle, newWords, startIndex, solutions, allStartCoordinates);
        }
    }
}

function printPuzzle(arrayPuzzle){
    for (let line of arrayPuzzle) {
        for (let char of line) {
            process.stdout.write(char);
        }
        console.log();
    }
}

function crosswordSolver(stringPuzzle, words) {
    // TODO?: Check words
    // - is it an array (of stings)
    // - duplicate words

    // Puzzle to an array of character arrays for mutability
    let arrayPuzzle = createArrayPuzzle(stringPuzzle);
    // TODO: Check input puzzle: 
    // - Do we check if it's a string?
    // - not empty
    // - allow: 0, 1, 2 and .
    // - lines must be same length
    // - don't allow: more cells than chars in words

    let allStartCoordinates = getStartCoordinates(arrayPuzzle);
    if (allStartCoordinates.length != words.length) {
        console.log("Error");
        return;
    }    

    // solver() finds solutions
    let solutions = [];
    solver(arrayPuzzle, words, 0, solutions, allStartCoordinates)

    if (solutions.length != 1) {
        console.log("Error");
        return;
    }

    printPuzzle(solutions[0]);
}

crosswordSolver(puzzle, words);


// TODO:
// - validate inputs
// - automate testing
// - go through audit questions
// - are we following good practices (file structure, separation of concerns etc.)?
// - should we use multiple files?
