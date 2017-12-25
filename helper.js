var repeat = require('lodash/repeat')

function invert (sequence) {
  var chunked = sequence.match(/(.)\1*/g)
  if (chunked == null) return ''
  return chunked
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
  if (operators.length == 0)
    return sequence
  
  var result = sequence
  for (var i = 0; i < operators.length; i++) {
    var operator = operators[i]
    if (0 < operator)
      result = repeat(result, operator)
    else
      result = invert(result)
  }
  return result
}

module.exports.invert = invert
module.exports.conjugate = conjugate
module.exports.commutator = commutator
module.exports.operate = operate
