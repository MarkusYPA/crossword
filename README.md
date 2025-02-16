# crossword-solver

Finds where given words fit in an empty crossword, as defined in the crosswordSolver.js file itsef.

For example the puzzle
```
2001
0..0
1000
0..0
```
with input words 'casa', 'alan', 'ciao' and 'anta' will yield the result
```
casa
i..l
anta
o..n
```


### How to run

Both of these will run the main program from the project root folder
```
node src/crosswordSolver.js
npm run start
```

#### Testing

Download dependencies (Jest)
```
npm install
```

Run unit tests in with Jest
```
npm test -- -silent
```

Try all audit cases with either of these
```
node tests/run-audit.js
npm run audits
```
Put words into some bigger crosswords with one of these commands
```
node tests/more-cases.js
npm run bigs
```

## Authors
- [Markus Amberla](https://github.com/MarkusYPA)
- [Oleg Balandin](https://github.com/Olegamobile)

