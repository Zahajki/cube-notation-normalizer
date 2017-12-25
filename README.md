# cube-notation-normalizer
There are several number of rubik's cube related programs on npm, and many of them has their own function to parse algorithms. Typically, these functions only support limited syntax of algorithm notation.

This library intends to be a base for this kind of programs to support broad syntax of algorithm notation.

## Install
```console
$ npm install cube-notation-normalizer
```

## Simple usage
```js
const normalize = require('cube-notation-normalizer');

const ugly = "(rU R' U`) (r' FRF' )  ";

// default, human-readable format
normalize(ugly);
// => "r U R' U' r' F R F'"

// machine-friendly format
normalize(ugly, {
  separator: '',
  useModifiers: false,
  uniformCenterMoves: 'slice'
});
// => "RMMMURRRUUURRRMFRFFF"
```

## Supported syntax and fearures
#### Whitespaces and comments
```js
normalize(`
R        U
R'U' // sexy move
/*
R' F R F' <- sledgehammer
*/
`);
// => "R U R' U'"
```

#### Invert
```js
normalize("R' U` R´ Uʼ R’ U′ Ri");
// => "R' U' R' U' R' U' R'"

normalize("(R U F)'");
// => "F' U' R'"
```

#### Repetitions
```js
normalize("R3 U18 (F D)2");
// => "R' U2 F D F D"

// '*' and '^' are optional
normalize("R*2 U^18 (F D)*2");
// => "R2 U2 F D F D"
```

#### Conjugates and commutators
```js
normalize("[F: R]");
// => "F R F'"

normalize("[R, U]");
// => "R U R' U'"

normalize("[F: [R, U]]");
// => "F R U R' U' F'"
```

#### Obvious optimization
```js
normalize("U4");
// => ""

normalize("U R4 U");
// => "U2"

normalize("R L R");
// => "R2 L"
```

## API
### normalize(algorism[, options])
#### algorithm
Algorithm notation string to normalize.

#### options
Object with following format. All properties are optional.
```js
{
  separator: ' ',
  useModifiers: true,
  uniformCenterMoves: false,  // false | 'rotation' | 'slice'
  invert: false
}
```

##### separator
Separator string inserted between each turn. (default `' '`)

##### useModifiers
If `true`, returned notation includes modifier letters `'` and `2`. If `false`, inverted turns and half turns are represented as repetition. (default `true`)
```js
normalize("R' U2", { useModifiers: false });
// => "R R R U U"
```

##### uniformCenterMoves
If `'rotation'` or `'slice'`, turns with center moves (`M`, `x`, `r`, etc.) are converted and unified to rotation moves (`x`, `y` and `z`) or slice moves (`M`, `E` and `S`). (default `false`)
```js
normalize("r E", { uniformCenterMoves: 'rotation' });
// => "L' x U D' y'"

normalize("r y", { uniformCenterMoves: 'slice' });
// => "R M' U D' E'"
```

##### invert
If `true`, algorithm will be inverted.
```js
normalize("R U R' U'", { invert: true });
// => "U R U' R'"
```

### normalize.SyntaxError
[PEG.js](https://pegjs.org/) error class thrown from the parser.
