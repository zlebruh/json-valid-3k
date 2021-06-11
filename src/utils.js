import { isType, getType } from 'zletils';

export function extract(rule) {
  if (rule === null) return { type: null };

  return rule.hasOwnProperty('type')
    ? { type: rule.type, ...rule }
    : { type: rule };
}

export function invalidEmpty(item, rule, itemType) {
  if (rule.allowEmpty === false) {
    switch (itemType) {
      case 'Array':
      case 'Object':
      case 'String': return !Object.keys(item).length;
      default: break;
    }
  }

  return false;
}

export function getError(value, rule, isEmptyError = false) {
  const textValue = JSON.stringify(value);

  return isEmptyError !== true
    ? `ERROR: Value ${textValue} does not match type ${rule}`
    : `ERROR: Value ${textValue} of type ${getType(value)} is not allowed to be empty`;
}

export function matchType(value, ruleType) {
  if (Array.isArray(ruleType)) {
    const item = ruleType.find((v) => isType(value, v));
    const match = isType(value, item)
    const TYPE = match ? item : ruleType;
    return { TYPE, match };
  }

  return {
    TYPE: ruleType,
    match: isType(value, ruleType)
  };
}
