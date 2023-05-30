const REGEX = {
  ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, /* jscs:ignore */ // eslint-disable-line
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, /* jscs:ignore */ // eslint-disable-line
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/, /* jscs:ignore */ // eslint-disable-line
}
const noProtoOb = (ob) => Object.assign(Object.create(null), ob)

const getType = (val) => {
  try {
    return val.constructor.name
  } catch (err) {
    return val === null ? val : typeof val
  }
}

const exists = (v) => typeof v !== 'undefined' && v !== null
const isEmpty = (v) => {
  const size = v?.['size'] || v?.['length']
  return !exists(size) && is(v, 'Object')
    ? !Object.keys(v).length
    : size === 0
}
const isArray = (v) => Array.isArray(v)
const isBoolean = (v) => typeof v === 'boolean'
const isString = (v) => typeof v === 'string'
const isNumber = (v) => typeof v === 'number'
const isObject = (v) => typeof v === 'object' && !Array.isArray(v) && v !== null
const isMap = (v) => v instanceof Map
const isSet = (v) => v instanceof Set

const isURL = (v) => REGEX.url.test(v)
const isMail = (v) => REGEX.email.test(v)
const isIP4 = (v) => REGEX.ip.test(v)
const isFn = (v) => v instanceof Function
const isHtml = (v) => v instanceof HTMLElement

const is = (v, type, checkEmpty = false) => {
  if (!exists(v)) return false
  if (!exists(type)) return true

  const typeIsList = isArray(type)

  if (!types.has(type) && !typeIsList) {
    throw new TypeError(`Type [${type}] is not recognized. Use the 'types' Map to set one or many`)
  }

  const match = typeIsList
    ? type.some(k => types.get(k)(v))
    : types.get(type)(v)

  return checkEmpty === true
    ? match && !isEmpty(v)
    : match
}

const dropped = new Map()
const errors = new Map()
export const types = new Map()
  .set('Array', isArray)
  .set('Boolean', isBoolean)
  .set('String', isString)
  .set('Number', isNumber)
  .set('Object', isObject)
  .set('Map', isMap)
  .set('Set', isSet)
  .set('URL', isURL)
  .set('ValidEmail', isMail)
  .set('ValidIP', isIP4)
  .set('Function', isFn)
  .set('Element', isHtml)

// #######
const extract = (rule) => {
  if (rule === null) return { type: null }

  return rule.hasOwnProperty('type')
    ? { type: rule.type, ...rule }
    : { type: rule }
}
// #######

const validateJSON = (data, rules = {}, path = '') => {
  let valid = true

  const validateBranch = (val, valRules, rootKey) => {
    const branch = validateJSON(val, valRules, rootKey)

    if (!branch.valid) valid = false

    return branch.tree
  }

  if (isArray(data)) {
    const tree = data.map((v, idx) => validateBranch(v, rules, path + `[${idx}]`), [])

    return noProtoOb({ tree, valid })
  }

  const tree = isArray(data) ? [] : noProtoOb()

  const onErr = (key, rule, type, item, noValue, PATH, sizeErr, isFnRule) => {
    const textValue = JSON.stringify(item)
    const error = isFnRule === true
      ? `ERROR: Value ${textValue} was not matched by custom function: ${type}`
      : sizeErr
        ? `ERROR: Value ${textValue} of type ${type} is not allowed to be empty`
        : `ERROR: Value ${textValue} does not match type ${type}`

    if (rule.optional === true && noValue) return

    if (rule.silentDrop === true) {
      return dropped.set(PATH, error)
    }

    valid = false
    tree[key] = error
    errors.set(PATH, error)
  }

  for (const key of Object.keys(rules)) {
    const PATH = `${path}[${key}]`
    const RULE = rules[key]
    const VALUE = data[key]
    const isFnRule = typeof RULE === 'function'
    const rule = extract(RULE)
    const noValue = !is(VALUE)
    const useDefault = noValue && is(rule?.default)
    const item = useDefault ? rule.default : VALUE
    const type = isString(rule) ? rule : rule?.type
    const children = rule?.props || rule?.children?.props || rule?.children
    const nullSituation = VALUE === null && (rule === null || rule?.type === null)
    const match = isFnRule ? RULE(VALUE, data, rules) : is(item, type)

    if (match || nullSituation) {
      if (rule?.allowEmpty === false && typeof item !== 'function' && isEmpty(item)) {
        onErr(key, rule, type, item, noValue, PATH, true, isFnRule)
      } else {
        tree[key] = item
      }
    } else {
      onErr(key, rule, type, item, noValue, PATH, false, isFnRule)
    }

    if (children) {
      tree[key] = validateBranch(item, children, PATH)
    }
  }

  return noProtoOb({ tree, valid, errors, dropped })
}

export const validate = (data, schema) => {
  dropped.clear()
  errors.clear()
  return validateJSON(data, schema)
}

export default { types, validate, is, isEmpty }
