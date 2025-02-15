'use strict';

const { auditCases } = require('./audit-values');
const {crosswordSolver} = require('./crossword');


for (let i = 0; i < auditCases.length; i++) {
    console.log(auditCases[i].title);
    crosswordSolver(auditCases[i].puzzle, auditCases[i].words);
    if (i != auditCases.length - 1) console.log();
}