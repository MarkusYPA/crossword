
function wordFits(word, wordOnPuzzle) {
    for (let i = 0; i < wordOnPuzzle.length; i++) {
        if (wordOnPuzzle[i] != 0 && wordOnPuzzle[i] != word[i] && wordOnPuzzle[i] != 1 && wordOnPuzzle[i] != 2) {
            return false;
        }
    }
    return true;
}

function updatePuzzle(puzzle, word, coordinates, direction) {
    // Shallow copy each line so original lines don't get modified
    let newPuzzle = puzzle.map(line => [...line]);

    const row = coordinates[0];
    const col = coordinates[1];

    if (direction == 'down') {
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

function uniqueSolution(solutions, puzzle) {
    let jsonString = JSON.stringify(puzzle);
    for (let sol of solutions) {
        if (jsonString == JSON.stringify(sol)) {
            return false;
        }
    }
    return true;
}

function getWordOnPuzzle(puzzle, startCoords) {
    let word = '';
    const coords = startCoords.coordinates;

    if (startCoords.direction == 'down') {
        for (let i = 0; i < startCoords.length; i++) {
            word += puzzle[coords[0]+i][coords[1]];
        }
    } else {
        for (let i = 0; i < startCoords.length; i++) {
            word += puzzle[coords[0]][coords[1]+i];
        }
    }

    return word;
}

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

    // Check words compatibilities with this
    let wordOnPuzzle = getWordOnPuzzle(currentPuzzle, startCoords);
    for (let i = 0; i < words.length; i++) {

        // When it fits, recur with updated values
        if (words[i].length == startCoords.length && wordFits(words[i], wordOnPuzzle)) {
            let newPuzzle = updatePuzzle(currentPuzzle, words[i], startCoords.coordinates, startCoords.direction); // write word into current puzzle
            let newWords = words.slice(0, i).concat(words.slice(i + 1)) // remove word from array
            solver(newPuzzle, newWords, startIndex, solutions, allStartCoordinates);
            continue;
        }
    }
}

module.exports = { solver, wordFits, updatePuzzle, uniqueSolution };
