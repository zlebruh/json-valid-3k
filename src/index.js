import { is, isType, getType, throwUnexpectedType } from 'zletils';
import { extract, getError, matchType, invalidEmpty } from './utils';

class SkipItem {};

function doItem(item, ruleValue) {
  let result = { valid: true, item };
  const rule = extract(ruleValue);
  const itemType = getType(item);
  const { TYPE, match } = matchType(item, rule.type);

  if (rule.optional === true && !is(item)) return new SkipItem;

  if (!match) {
    // Deal with default rule values
    if (('default' in rule) && !is(item)) {
      const value = rule.default
      const valid = isType(value, TYPE);
      result = valid
        ? { valid, item: value }
        : { valid, item: getError(value, TYPE) };
    } else {
      result = { valid: false, item: getError(item, TYPE) };
    }
  }

  if (invalidEmpty(item, rule, itemType)) {
    return rule.silentDrop === true
      ? new SkipItem
      : { valid: false, item: getError(item, TYPE, true) };
  }

  if (itemType === 'Array' && is(rule.children)) result = doArray(item, rule.children);
  if (itemType === 'Object' && isType(rule.props, 'Object')) {
    const branch = doBranch(item, rule.props);
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
export function validate(data, schema, logError) {
  const type = 'Object';

  if (!isType(data, type)) { throwUnexpectedType(data, {}, 'data'); }
  if (!isType(schema, type)) { throwUnexpectedType(schema, {}, 'schema'); }

  const validation = doBranch(data, schema);

  if (logError === true && !validation.valid) {
    console.error('ERROR: The params[0] do not match the schema[1]')
    console.error(`[0] Params:`, data);
    console.error(`[1] Schema:`, schema);
  }

  return validation;
}

export default {
  validate,
}
