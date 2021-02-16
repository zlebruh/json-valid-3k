const Tools = require('zletools');

// Local
/**
 * @param {*} value
 * @param {String} type
 * @returns {String}
 */
function typeError(value, type) {
  return `ERROR: Value [${JSON.stringify(value)}] does not match type [${type}]`;
}

/**
 * @param {Array} arr
 * @param {String} children
 * @returns {{valid: Boolean, arr: Array}}
 */
function checkArray(arr, children) {
  const clone = [];
  const { type, props } = children;
  let valid = true;

  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    const typeMatch = Tools.getType(item) === type;

    if (typeMatch) {
      if (props) {
        const branch = doBranch(item, props);
        if (!branch.valid) {
          valid = false;
        }
        clone.push(branch.tree);
      } else {
        clone.push(item);
      }
    } else {
      valid = false;
      clone.push(typeError(item, type));
    }
  }

  return {
    valid,
    arr: clone,
  };
}

/**
 * @param {Object} branch
 * @param {Object} rules
 * @returns {{valid: Boolean, tree: Object}}
 */
function doBranch(branch, rules = {}) {
  const tree = {};
  const keys = Object.keys(rules);
  let valid = true;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const rule = rules[key];
    const { type, children } = rule;
    let item = branch[key];

    if (!Tools.is(item)) {
      if (rule.optional === true) continue;

      if (rule.hasOwnProperty('default')) {
        item = rule.default;
      }
    }

    const sameType = matchType(item, type);
    if (sameType) {
      if (type === 'Object') {
        const subBranch = doBranch(item, rule.props);
        if (!subBranch.valid) {
          valid = false;
        }
        tree[key] = subBranch.tree;
      } else if (type === 'Array' && children) {
        const checke = checkArray(item, children);
        if (!checke.valid) {
          valid = false;
        }
        tree[key] = checke.arr;
      } else {
        tree[key] = item;
      }
    } else {
      tree[key] = typeError(item, type);
      valid = false;
    }
  }

  return { valid, tree };
}

/**
 * @param {*} value
 * @param {String} type
 * @param {Boolean} [checkEmpty]
 * @return {Boolean}
 */
function matchType(value, type, checkEmpty = false) {
  if (value === type) return true;

  const method = Tools[`is${type}`];
  return method
    ? method(value, checkEmpty)
    : Tools.capitalize(typeof value) === type;
}

// Exported
/**
 * @param {Object} cfg
 * @param {Object} schema
 * @returns {{valid: boolean, tree: Object}}
 */
function validate(cfg, schema) {
  Tools.checkForNumberOfArguments(2, [cfg, schema]);

  if (!Tools.isObject(cfg, true)) {
    throw new Error(Tools.textNotObject(cfg, 'cfg'));
  }
  if (!Tools.isObject(schema, true)) {
    throw new Error(Tools.textNotObject(schema, 'schema'));
  }

  return doBranch(cfg, schema);
}

exports.validate = validate;
