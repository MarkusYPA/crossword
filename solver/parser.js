
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
            if (char != '.' && char != '0' && char != '1' && char != '2') {
                return false;
            }
            if (char == '0' || char == '1' || char == '2') cells++;
        }
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

module.exports = { createArrayPuzzle, validInput, getStartCoordinates };