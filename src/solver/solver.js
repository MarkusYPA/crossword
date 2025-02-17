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

function solver(currentPuzzle, wordMap, usedWords, startIndex, solutions, startPositions) {

    // Too many solutions, abort
    if (solutions.length > 1) {
        return;
    }

    // Solution complete, end here        
    if (usedWords.size == startPositions.length) {
        solutions.push(currentPuzzle);
        return;
    }

    // Words remain, keep going
    let startPosition = startPositions[startIndex];
    startIndex++;

    const words = wordMap.get(startPosition.length);

    // Check compatibility with this
    let wordOnPuzzle = getWordOnPuzzle(currentPuzzle, startPosition);
    for (let i = 0; i < words.length; i++) {

        // Try if words fit 
        if (!(usedWords.has(words[i])) && wordFits(words[i], wordOnPuzzle)) {
            // write word into current puzzle
            let newPuzzle = updatePuzzle(currentPuzzle, words[i], startPosition);
            // add used word to map
            let newUsedWords = new Map(usedWords).set(words[i], true);

            // Recur with updated values
            solver(newPuzzle, wordMap, newUsedWords, startIndex, solutions, startPositions);
        }        
    }
}

module.exports = { solver, wordFits, updatePuzzle };
