var defaults = require('lodash/defaults')
var Notation = require('./notation.js')
var helper = require('./helper.js')

var parse = Notation.parse

function normalize (notation, options) {
  options = defaults(options, {
    separator: ' ',
    useModifiers: true,
    uniformCenterMoves: false,  // false | 'rotation' | 'slice'
    invert: false
  })

  var sequence = parse(notation)

  if (options.invert)
    sequence = helper.invert(sequence)
  
  if (options.uniformCenterMoves)
    sequence = convertCenterMoves(sequence, options.uniformCenterMoves)
  
  sequence = shrink(sequence)

  if (options.useModifiers)
    return toHumanReadable(sequence, options.separator)
  else {
    if (!options.separator)
      return sequence
    else
      return sequence.split('').join(options.separator)
  }
}

var MODIFIER = [, '', '2', "'"]

function toHumanReadable (sequence, separator) {
  var moves = sequence.match(/(.)\1*/g)
  return moves
    .map(move => move.charAt(0) + MODIFIER[move.length])
    .join(separator)
}

var CENTER_MOVES_REPLACEMENT = {
  rotation: [
    { pat: /r/g, rep: parse("x L'") },
    { pat: /l/g, rep: parse("x' R") },
    { pat: /u/g, rep: parse("y D") },
    { pat: /d/g, rep: parse("y' U") },
    { pat: /f/g, rep: parse("z B") },
    { pat: /b/g, rep: parse("z' F") },
    { pat: /M/g, rep: parse("x R L'") },
    { pat: /E/g, rep: parse("y' U D'") },
    { pat: /S/g, rep: parse("z F' B") },
  ],
  slice: [
    { pat: /r/g, rep: parse("R M'") },
    { pat: /l/g, rep: parse("L M") },
    { pat: /u/g, rep: parse("U E'") },
    { pat: /d/g, rep: parse("D E") },
    { pat: /f/g, rep: parse("F S") },
    { pat: /b/g, rep: parse("B S'") },
    { pat: /x/g, rep: parse("R M' L'") },
    { pat: /y/g, rep: parse("U E' D'") },
    { pat: /z/g, rep: parse("F S B'") },
  ]
}

function convertCenterMoves (sequence, kind) {
  var table = CENTER_MOVES_REPLACEMENT[kind]
  for (var i = 0; i < table.length; i++) {
    sequence = sequence.replace(table[i].pat, table[i].rep)
  }
  return sequence
}

function shrink (sequence) {
  do {
    var oldLength = sequence.length
    sequence = sortAxisChunk(sequence)
    sequence = removeQuadruplets(sequence)
    var newLength = sequence.length
  } while (oldLength != newLength);
  return sequence
}

function removeQuadruplets (sequence) {
  var regexp = /(.)\1{3}/g
  while (regexp.test(sequence)) {
    sequence = sequence.replace(regexp, '')
  }
  return sequence
}

function sortAxisChunk (sequence) {
  var chunked = sequence.match(/[RLMxrl]+|[UDEyud]+|[FBSzfb]+/g)
  if (chunked == null) return ''
  return chunked
    .map(chunk => chunk.split('').sort(compareFace).join(''))
    .join('')
}

var FACE_ORDER = {
  R: 0, L: 1, M: 2, x: 3, r: 4, l: 5,
  U: 0, D: 1, E: 2, y: 3, u: 4, d: 5,
  F: 0, B: 1, S: 2, z: 3, f: 4, b: 5,
}

function compareFace (a, b) {
  return FACE_ORDER[a] - FACE_ORDER[b]
}

module.exports = normalize
module.exports.SyntaxError = Notation.SyntaxError
