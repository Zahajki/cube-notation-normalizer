var repeat = require('lodash/repeat')

function invert (sequence) {
  return chop(sequence)
    .reverse()
    .join('').replace(/(.)/g, '$1$1$1')
}

function conjugate (a, b) {
  return a + b + invert(a)
}

function commutator (a, b) {
  return a + b + invert(a) + invert(b)
}

function operate (sequence, operators) {
  if (operators.length === 0) return sequence

  var result = sequence
  for (var i = 0; i < operators.length; i++) {
    var operator = operators[i]
    if (0 < operator) {
      result = repeat(result, operator)
    } else {
      result = invert(result)
    }
  }
  return result
}

function chop (sequence) {
  var chopped = sequence.match(/(.)\1*/g)
  return chopped === null ? [] : chopped
}

module.exports.invert = invert
module.exports.conjugate = conjugate
module.exports.commutator = commutator
module.exports.operate = operate
module.exports.chop = chop
