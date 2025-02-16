'use strict';

const { auditCases } = require('./audit-values');
const {crosswordSolver} = require('../crosswordSolver');

for (let i = 0; i < auditCases.length; i++) { 
    console.log('\n' + auditCases[i].title);
    crosswordSolver(auditCases[i].puzzle, auditCases[i].words);
}

