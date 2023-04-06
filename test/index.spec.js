import { validate } from '../src/index'
import { DATA_1, SCHEMA_1, DATA_2, SCHEMA_2 } from './_resources'

const PROXY = (...args) => {
  try { 
    return validate(...args)
  } catch (error) {
    return error.message
  }
}

describe('Validation - validation errors', () => {
  it('expect ERROR with missing properties', () => {
    const { valid, tree } = PROXY({c: []}, {a: 'Number', b: 'String', c: 'Array'})
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value undefined does not match type Number')
    expect(tree.b).toBe('ERROR: Value undefined does not match type String')
    expect(Array.isArray(tree.c)).toBe(true)
  })

  it('expect ERROR with invalid properties', () => {
    const { valid, tree } = PROXY({a: '1', b: 2, c: []}, {a: 'Number', b: 'String', c: 'Array'})
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value "1" does not match type Number')
    expect(tree.b).toBe('ERROR: Value 2 does not match type String')
    expect(Array.isArray(tree.c)).toBe(true)
  })
})

describe('Validation - success stories', () => {
  it('expect SUCCESS with emty data/schema', () => {
    expect(validate({}, {}).valid).toBe(true)
  })

  it('expect SUCCESS Simple #1', () => {
    const test = validate({ a: 1 }, { a: 'Number' })
    expect(test.valid).toBe(true)
  })

  it('expect SUCCESS Simple #2', () => {
    const test = validate(DATA_1, SCHEMA_1)
    expect(test.valid).toBe(true)
  })

  it('expect SUCCESS Simple #3', () => {
    const DATA = { a: 'de', b: 111, c: false }
    const SCHEMA = { a: 'String', b: 'Number', c: 'Boolean' }
    const test = validate(DATA, SCHEMA)

    expect(test.valid).toEqual(true)
  })

  it('expect SUCCSS Complex #1', () => {
    const test = validate(DATA_2, SCHEMA_2)
    expect(test.valid).toEqual(true)
  })
})

describe('Validation - schema options [optional: Boolean]', () => {
  it('expect ERROR', () => {
    const DATA = {a: '1', b: 2, c: []}
    const SCHEMA = {
      a: {type: 'Number', optional: true},
      b: {type: 'String', optional: true},
      c: 'Array'
    }
    const { valid, tree } = PROXY(DATA, SCHEMA)
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value "1" does not match type Number')
    expect(tree.b).toBe('ERROR: Value 2 does not match type String')
  })

  it('expect SUCCESS', () => {
    const test = PROXY({c: []}, {c: 'Array'})
    expect(test.valid).toBe(true)
  })
})

describe('Validation - schema options [default: any]', () => {
  it('expect ERROR with wrong type', () => {
    const test = PROXY({c: []}, {a: {type: 'Number', default: '1'}, c: 'Array'})
    expect(test.valid).toBe(false)
    expect(test.tree.a).toBe('ERROR: Value "1" does not match type Number')
  })

  it('expect SUCCESS when used correctly', () => {
    const test = PROXY({c: []}, {a: {type: 'Number', default: 1}, c: 'Array'})
    expect(test.valid).toBe(true)
    expect(test.tree.a).toBe(1)
  })
})

describe('Validation - schema options [allowEmpty: Boolean]', () => {
  it('[allowEmpty: false] expect ERROR with an empty Array', () => {
    const { valid, tree } = PROXY({a: []}, {a: {type: 'Array', allowEmpty: false}})
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value [] of type Array is not allowed to be empty')
  })

  it('[allowEmpty: false] expect ERROR with an empty Object', () => {
    const { valid, tree } = PROXY({a: {}}, {a: {type: 'Object', allowEmpty: false}})
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value {} of type Object is not allowed to be empty')
  })

  it('[allowEmpty: false] expect ERROR with an empty String', () => {
    const { valid, tree } = PROXY({a: ''}, {a: {type: 'String', allowEmpty: false}})
    expect(valid).toBe(false)
    expect(tree.a).toBe('ERROR: Value "" of type String is not allowed to be empty')
  })

  it('[allowEmpty: false] expect SUCCESS with a non-empty Array', () => {
    const test = PROXY({a: [111]}, {a: {type: 'Array', allowEmpty: false}})
    expect(test.valid).toBe(true)
  })

  it('[allowEmpty: false] expect SUCCESS with a non-empty Object', () => {
    const test = PROXY({a: {o: 'k'}}, {a: {type: 'Object', allowEmpty: false}})
    expect(test.valid).toBe(true)
  })

  it('[allowEmpty: false] expect SUCCESS with a non-empty String', () => {
    const test = PROXY({a: 'ok'}, {a: {type: 'String', allowEmpty: false}})
    expect(test.valid).toBe(true)
  })
})
describe('Validation - schema options [silentDrop: Boolean]', () => {
  it('[silentDrop: true] expect SUCCESS dropping a failed item', () => {
    const { valid, tree, dropped } = PROXY({a: 1, b: 2}, {a: 'Number', b: {type: 'Object', silentDrop: true}})
    expect(valid).toBe(true)
    expect(tree.a).toBe(1)
    expect(tree.b).toBe(undefined)
    expect(dropped.size).toBe(1)
  })
})
