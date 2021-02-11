const Tools = require('zletools');

class Validator {
  /**
   * @param {object} cfg
   * @param {object} schema
   * @returns {boolean}
   */
  static validate(cfg, schema) {
    Tools.checkForNumberOfArguments(2, [cfg, schema]);

    if (!Tools.isObject(cfg, true)) {
      throw new Error(Tools.textNotObject(cfg, 'cfg'));
    }
    if (!Tools.isObject(schema, true)) {
      throw new Error(Tools.textNotObject(schema, 'schema'));
    }

    return Validator.doBranch(cfg, schema);
  }

  static typeError(value, type) {
    return `ERROR: Value [${JSON.stringify(value)}] does not match type [${type}]`;
  }

  static checkArray(arr, children) {
    const clone = [];
    const { type, props } = children;
    let valid = true;

    for (let i = 0; i < arr.length; i += 1) {
      const item = arr[i];
      const typeMatch = Tools.getType(item) === type;

      if (typeMatch) {
        if (props) {
          const branch = Validator.doBranch(item, props);
          if (!branch.valid) {
            valid = false;
          }
          clone.push(branch.tree);
        } else {
          clone.push(item);
        }
      } else {
        valid = false;
        clone.push(Validator.typeError(item, type));
        break;
      }
    }

    return {
      valid,
      arr: clone,
    };
  }

  static doBranch(branch, rules = {}) {
    const tree = {};
    const keys = Object.keys(rules);
    let valid = true;

    // if (!keys.length) {
    //   return {
    //     tree: 'ERROR: There are no rules for this property',
    //     valid: false,
    //   };
    // }

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const rule = rules[key];
      const { type, children } = rule;
      let item = branch[key];

      if (!Tools.is(item)) {
        if (rule.optional === true) continue;

        if (Tools.is(rule.default)) {
          item = rule.default;
        }
      }

      const sameType = Validator.matchType(item, type);
      if (sameType) {
        if (type === 'Object') {
          const subBranch = Validator.doBranch(item, rule.props);
          if (!subBranch.valid) {
            valid = false;
          }
          tree[key] = subBranch.tree;
        } else if (type === 'Array' && children) {
          const checke = Validator.checkArray(item, children);
          if (!checke.valid) {
            valid = false;
          }
          tree[key] = checke.arr;
        } else {
          tree[key] = item;
        }
      } else {
        tree[key] = Validator.typeError(item, type);
        valid = false;
      }
    }

    return { valid, tree };
  }

  static matchType(value, type, checkEmpty = false) {
    if (value === type) return true;

    const method = Tools[`is${type}`];
    return method
      ? method(value, checkEmpty)
      : Tools.capitalize(typeof value) === type;
  }
}

exports.validate = Validator.validate;
