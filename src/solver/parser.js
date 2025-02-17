'use strict';

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
    let starts = 0;
    for (let row of arrayPuzzle) {
        if (row.length != lenRow) {
            return false;
        }

        for (let char of row) {
            if (char != '.' && char != '0' && char != '1' && char != '2') {
                return false;
            }
            if (char == '0' || char == '1' || char == '2') cells++;
            if (char == 1 || char == 2) starts += Number(char);
        }
    }

    // starting positions must match amount of words
    if (starts != words.length) {
        return false;
    }

    // duplicate words not allowed
    let chars = 0;
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            if (words[i] == words[j]) {
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

function getStartPositions(puzzle) {
    let starts = [];    // [{[row, column], length, direction}, ...]

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {

            let value = puzzle[i][j];
            if (value != 0 && value != '.') { // Cell is marked as a starting point
                let coordinates = [i, j];

                // try to fit word in both directions
                for (let direction of ['right', 'down']) {

                    // multipliers for different directions
                    let rowMult = 0;
                    let colMult = 0;
                    if (direction == 'right') colMult = 1;
                    if (direction == 'down') rowMult = 1;

                    // preceding cell must not be writeable
                    let precedingIsWriteable = true;
                    if (j - 1 * colMult < 0 || i - 1 * rowMult < 0) {
                        precedingIsWriteable = false;
                    } else {
                        if (puzzle[i - 1 * rowMult][j - 1 * colMult] == '.') {
                            precedingIsWriteable = false;
                        }
                    }
                    if (precedingIsWriteable) continue;

                    // count writeable cells going forward
                    let length = 0;
                    while (true) {
                        let row = coordinates[0] + length * rowMult;    // changes at 'down'
                        let col = coordinates[1] + length * colMult;    // changes at 'right'

                        // stop when word goes past edge or cell is non-writeable
                        if (row > puzzle.length - 1 || col > puzzle[0].length - 1) {
                            break;
                        } else if (puzzle[row][col] == '.') {
                            break;
                        }

                        length++;
                    }

                    // store starting postition with length and direction of expected word
                    if (length > 1) {
                        starts.push({ coordinates: coordinates, length: length, direction: direction });
                    }

                }
            }
        }
    }

    return starts;
}

function makeWordMap(words) {   
    let longest = 0;
    for (let wd of words) {
        if (wd.length > longest) {
            longest = wd.length;
        }
    }

    // Put words into separate arrays by length and under key of length
    const wordMap = new Map()
    while (longest > 0) {
        let sameLength = [];
        for (let wd of words) {
            if (wd.length == longest) {
                sameLength.push(wd);
            }
        }
        if (sameLength.length != 0){
            wordMap.set(longest, [...sameLength]);
        }        
        longest--;
    }

    return wordMap;
}

module.exports = { createArrayPuzzle, validInput, getStartPositions, makeWordMap };