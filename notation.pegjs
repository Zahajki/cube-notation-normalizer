{
  var helper = require('./helper.js')
}

Alg
  = _ head:Term _ tail:Alg _ { return head + tail }
  / _ term:Term _ { return term }
  / _ { return "" }

Term
  = g:Group opes:(_ o:Operator { return o })* { return helper.operate(g, opes) }

Group
  = Conjugate
  / Commutator
  / "(" a:Alg ")" { return a }
  / Face

Conjugate
  = "[" a:Alg ":" b:Alg "]" {return helper.conjugate(a, b) }
  // / "<" a:Alg ";" b:Alg ">" {return helper.conjugate(a, b) }

Commutator
  = "[" a:Alg "," b:Alg "]" { return helper.commutator(a, b) }
  // / "[" a:Alg ";" b:Alg "]" { return helper.commutator(a, b) }

Operator
  = Repetition / Prime

Prime "\"'\""
  // '      APOSTROPHE
  // `      GRAVE ACCENT
  // \u00B4 ACUTE ACCENT
  // \u02BC MODIFIER LETTER APOSTROPHE
  // \u2019 RIGHT SINGLE QUOTATION MARK
  // \u2032 PRIME
  // i      LATIN SMALL LETTER I
  = ['`\u00B4\u02BC\u2019\u2032i] { return -1 }

Repetition "number"
  = [*^] _ count:Integer { return count }
  / count:Integer        { return count }

Integer
  = digits:$([0-9]+) { return parseInt(digits, 10) }

Face "face letter"
  = face:[RUFLDB] "w" { return face.toLowerCase() }
  / [RUFLDBMESrufldbxyz]

_
  = (Comment / Whitespace)* { return }

Comment "comment"
  = "//" (![\r\n] .)*
  / "/*" (!"*/" .)* "*/"

Whitespace "whitespace"
  = [ .\t\r\n]+
