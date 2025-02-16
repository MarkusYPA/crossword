'use strict';

function wordFits(word, wordOnPuzzle) {
    for (let i = 0; i < wordOnPuzzle.length; i++) {
        if (wordOnPuzzle[i] != 0 && wordOnPuzzle[i] != word[i] && wordOnPuzzle[i] != 1 && wordOnPuzzle[i] != 2) {
            return false;
        }
    }
    return true;
}

function updatePuzzle(puzzle, word, startPosition) {
    // Shallow copy each line so original lines don't get modified
    let newPuzzle = puzzle.map(line => [...line]);

    const row = startPosition.coordinates[0];
    const col = startPosition.coordinates[1];

    if (startPosition.direction == 'down') {
        for (let i = 0; i < word.length; i++) {
            newPuzzle[row + i][col] = word[i];
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            newPuzzle[row][col + i] = word[i];
        }
    }

    return newPuzzle;
}

function getWordOnPuzzle(puzzle, startPosition) {
    let word = '';
    const coords = startPosition.coordinates;

    if (startPosition.direction == 'down') {
        for (let i = 0; i < startPosition.length; i++) {
            word += puzzle[coords[0] + i][coords[1]];
        }
    } else {
        for (let i = 0; i < startPosition.length; i++) {
            word += puzzle[coords[0]][coords[1] + i];
        }
    }

    return word;
}

function solver(currentPuzzle, words, startIndex, solutions, startPositions) {

    // Too many solutions, abort
    if (solutions.length > 1) {
        return;
    }

    // Solution complete, end here        
    if (words.length == 0) {
        solutions.push(currentPuzzle);
        return;
    }

    // Words remain, keep going
    let startPosition = startPositions[startIndex];
    startIndex++;

    // Check compatibility with this
    let wordOnPuzzle = getWordOnPuzzle(currentPuzzle, startPosition);
    for (let i = 0; i < words.length; i++) {

        // Try if words fit 
        if (words[i].length == startPosition.length && wordFits(words[i], wordOnPuzzle)) {
            // write word into current puzzle
            let newPuzzle = updatePuzzle(currentPuzzle, words[i], startPosition);
            // remove word from array
            let newWords = words.slice(0, i).concat(words.slice(i + 1))

            // Recur with updated values
            solver(newPuzzle, newWords, startIndex, solutions, startPositions);
        }        
    }
}

module.exports = { solver, wordFits, updatePuzzle };
