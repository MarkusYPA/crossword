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

function findCrossings(used, remaining) {
    if (used.length == 0) {
        return remaining
    }

    let crossMap = new Map()

    for (let i = 0; i < remaining.length; i++) {
        const r = remaining[i]
        let counter = 0
        let crossingThis = new Set()

        for (const u of used) {

            if (u.direction == "down" && r.direction == "right") {
                if (u.coordinates[0] <= r.coordinates[0] &&
                    u.coordinates[0] + u.length >= r.coordinates[0] &&
                    u.coordinates[1] >= r.coordinates[1] &&
                    u.coordinates[1] <= r.coordinates[1] + r.length) {

                    remaining[i]['ind'] = i
                    crossingThis.add(r)
                    counter++
                }
            }

            if (u.direction == "right" && r.direction == "down") {
                if (u.coordinates[1] <= r.coordinates[1] &&
                    u.coordinates[1] + u.length >= r.coordinates[1] &&
                    u.coordinates[0] >= r.coordinates[0] &&
                    u.coordinates[0] <= r.coordinates[0] + r.length) {

                    remaining[i]['ind'] = i
                    crossingThis.add(r)
                    counter++
                }
            }

        }

        if (!crossMap.has(counter)) {
            crossMap.set(counter, new Set())
        }

        // keep track of how many used words this slot crosses
        crossingThis.forEach(sp => crossMap.get(counter).add(sp));
    }

    // return the starting positions with the most crossings
    let mosts = crossMap.get(Math.max(...crossMap.keys()))

    //return mosts
    return [...mosts]
}

function solver(currentPuzzle, words, solutions, startPositions, used, remaining) {

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

    // get startPositions that cross with the current solution
    const crossings = findCrossings(used, remaining)


    for (let i = 0; i < crossings.length; i++) {
        // Check compatibility with this
        let wordOnPuzzle = getWordOnPuzzle(currentPuzzle, crossings[i]);

        for (let j = 0; j < words.length; j++) {

            // Try if words fit 
            if (words[j].length == crossings[i].length && wordFits(words[j], wordOnPuzzle)) {
                // write word into current puzzle
                let newPuzzle = updatePuzzle(currentPuzzle, words[j], crossings[i]);
                // remove word from array
                let newWords = words.slice(0, j).concat(words.slice(j + 1))

                let newUsed = [...used]
                newUsed.push(crossings[i])

                let newRemaining = remaining.slice(0, crossings[i]['ind']).concat(remaining.slice(crossings[i]['ind'] + 1))


                // Recur with updated values
                solver(newPuzzle, newWords, solutions, startPositions, newUsed, newRemaining);
            }
        }
    }
}


module.exports = { solver, wordFits, updatePuzzle };
