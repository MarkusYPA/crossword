
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

module.exports = { solver, wordFits, updatePuzzle, uniqueSolution};
