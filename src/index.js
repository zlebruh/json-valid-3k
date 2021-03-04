import { is, isType, getType, throwUnexpectedType } from 'zletils';
import { extract, getError, invalidEmpty } from './utils';

class SkipItem {};

function doItem(item, ruleValue) {
  let result = { valid: true, item };
  const rule = extract(ruleValue);
  const { type, props, children } = rule;
  let itemType = getType(item);

  if (itemType !== type) {
    if (rule.optional === true) return new SkipItem;

    const defaultOK = ('default' in rule) && is(item) && isType(rule.default, type);
    result = defaultOK
      ? { valid: true, item: rule.default }
      : { valid: false, item: getError(item, type) };
  }

  if (invalidEmpty(item, rule, itemType)) {
    return rule.silentDrop === true
      ? new SkipItem
      : { valid: false, item: getError(item, type, true) };
  }

  if (itemType === 'Array' && is(children)) result = doArray(item, children);
  if (itemType === 'Object' && isType(props, 'Object')) {
    const branch = doBranch(item, props);
    result = { valid: branch.valid, item: branch.tree };
  }

  if (result.valid === false && rule.silentDrop === true) {
    return new SkipItem;
  }

  return result;
}

function doArray(arr, rule) {
  const clone = [];
  let valid = true;

  for (let i = 0; i < arr.length; i += 1) {
    const result = doItem(arr[i], rule);

    if (result instanceof SkipItem) continue;
    
    if (result.valid === false) valid = false;
    clone.push(result.item)
  }

  return {
    valid,
    item: clone,
  };
}

function doBranch(branch, rules = {}) {
  const tree = {};
  const keys = Object.keys(rules);
  let valid = true;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const result = doItem(branch[key], rules[key]);

    if (result instanceof SkipItem) continue;
    
    if (result.valid === false) valid = false;
    tree[key] = result.item;
  }

  return { valid, tree };
}

// Exported
export function validate(object, schema, logError) {
  const type = 'Object';

  if (!isType(object, type)) { throwUnexpectedType(object, {}, 'object'); }
  if (!isType(schema, type)) { throwUnexpectedType(schema, {}, 'schema'); }

  const validation = doBranch(object, schema);

  if (logError === true && !validation.valid) {
    console.error('ERROR: The params[0] do not match the schema[1]')
    console.error(`[0] Params:`, object);
    console.error(`[1] Schema:`, schema);
  }

  return validation;
}
