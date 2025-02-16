
function wordFits(word, wordOnPuzzle) {
    for (let i = 0; i < wordOnPuzzle.length; i++) {
        if ( wordOnPuzzle[i] != 0 && wordOnPuzzle[i] != 1 && wordOnPuzzle[i] != word[i] && wordOnPuzzle[i] != 2 ) {
            return false;
        }
    }
    return true;
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

function getWordOnPuzzle(puzzle, startCoords) {
    let word = '';
    let coords = [...startCoords.coordinates];
    for (let i = 0; i < startCoords.length; i++) {
        word += puzzle[coords[0]][coords[1]];
        if (startCoords.direction == 'right') coords[1]++;
        if (startCoords.direction == 'down') coords[0]++;
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

    // 4/4 Only try words that have correct length

    // Check words compatibilities with this
    let wordOnPuzzle = getWordOnPuzzle(currentPuzzle, startCoords);
    for (let i = 0; i < words.length; i++) {

        // When it fits, recur with updated values
        if (words[i].length == startCoords.length && wordFits(words[i], wordOnPuzzle)) {
            let newPuzzle = updatePuzzle(currentPuzzle, words[i], startCoords.coordinates, startCoords.direction); // write word into current puzzle
            let newWords = words.slice(0, i).concat(words.slice(i + 1)) // remove word from array
            solver(newPuzzle, newWords, startIndex, solutions, allStartCoordinates);
        }
    }
}

module.exports = { solver, wordFits, updatePuzzle, uniqueSolution };
