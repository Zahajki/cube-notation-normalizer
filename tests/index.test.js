const normalize = require('../index.js')

describe('supported syntax', () => {
  test('empty', () => {
    expect(normalize("")).toBe("")
  })
  test('whitespace', () => {
    expect(normalize(" R () ")).toBe("R")
  })
  test('comment', () => {
    expect(normalize(`
R // comment
/* comment */
    `)).toBe("R")
  })
  test('paren', () => {
    expect(normalize("(R)")).toBe("R")
  })
  test('empty paren', () => {
    expect(normalize("()'")).toBe("")
  })
  test('wide', () => {
    expect(normalize("Rw")).toBe("r")
  })
  test('invert', () => {
    expect(normalize("R' U i")).toBe("R' U'")
  })
  test('repetition', () => {
    expect(normalize("R3")).toBe("R'")
  })
  test('repetition with "*"', () => {
    expect(normalize("R*23")).toBe("R'")
  })
  test('conjugate', () => {
    expect(normalize("[R: U]")).toBe("R U R'")
  })
  test('commutator', () => {
    expect(normalize("[R, U]")).toBe("R U R' U'")
  })
  test('multiple operators', () => {
    expect(normalize("R2'2")).toBe("")
  })
})

describe('syntax error', () => {
  test('invalid character', () => {
    expect(() => { normalize("Q") }).toThrow(normalize.SyntaxError)
  })
  test('unclosed paren', () => {
    expect(() => { normalize("(") }).toThrow("")
  })
  test('unclosed bracket', () => {
    expect(() => { normalize("[") }).toThrow(normalize.SyntaxError)
  })
  test('unclosed block comment', () => {
    expect(() => { normalize("/*") }).toThrow(normalize.SyntaxError)
  })
  test('unclosed block comment followed by face letter', () => {
    expect(() => { normalize("/*R") }).toThrow(normalize.SyntaxError)
  })
  test('isolated slash', () => {
    expect(() => { normalize("/") }).toThrow(normalize.SyntaxError)
  })
  test('invalid repetition', () => {
    expect(() => { normalize("R*R") }).toThrow(normalize.SyntaxError)
  })
  test('invalid conjugate', () => {
    expect(() => { normalize("[R:']") }).toThrow(normalize.SyntaxError)
  })
  test('invalid commutator', () => {
    expect(() => { normalize("[R: ']") }).toThrow(normalize.SyntaxError)
  })
})

describe('optimization', () => {
  test('merge', () => {
    expect(normalize("R R")).toBe("R2")
  })
  test('sort', () => {
    expect(normalize("R L R")).toBe("R2 L")
  })
  test('cancel', () => {
    expect(normalize("R F F' L R")).toBe("R2 L")
  })
})

const SEXY_MOVE = "R U R' U'"

describe('options', () => {
  test('empty separator', () => {
    expect(normalize(SEXY_MOVE, { separator: '' })).toBe("RUR'U'")
  })
  test('non-empty separator', () => {
    expect(normalize(SEXY_MOVE, { separator: '~' })).toBe("R~U~R'~U'")
  })
  test('useModifiers', () => {
    expect(normalize(SEXY_MOVE, { useModifiers: false })).toBe("R U R R R U U U")
  })
  test('machine-friendly', () => {
    expect(normalize(SEXY_MOVE, { separator: '', useModifiers: false })).toBe("RURRRUUU")
  })
  test('uniformCenterMoves (rotation)', () => {
    expect(normalize("r", { uniformCenterMoves: 'rotation' })).toBe("L x")
  })
  test('uniformCenterMoves (slice)', () => {
    expect(normalize("r", { uniformCenterMoves: 'slice' })).toBe("R M'")
  })
  test('invert', () => {
    expect(normalize(SEXY_MOVE, { invert: true })).toBe("U R U' R'")
  })
})
