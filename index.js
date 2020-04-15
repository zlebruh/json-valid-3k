class Tools {
  /**
   * Tries to determine the type of a value. Use with extreme caution
   * @param {*} val
   * @returns {string}
   */
  static getType(val) {
    try {
      return val.constructor.name;
    } catch (err) {
      return val === null ? val : typeof val;
    }
  }

  /**
   * @param {Object} number of arguments
   * @param {Object} arg
   */
  static checkForNumberOfArguments(number, arg) {
    if (arg.length < number) {
      throw new TypeError(`Failed. ${number}  arguments required, but only ${arg.length} present.`);
    }
  }

  /**
   * Checking for the existing of things. NOTE: null is considered non-existing by this method
   * @param val
   * @returns {boolean}
   */
  static is(val) {
    return val !== undefined && val !== null;
  }

  /**
   * @param {String} str
   * @param {Boolean} [checkEmpty] - optional
   * @returns {boolean}
   */
  static isString(str = '', checkEmpty = false) {
    const isString = typeof str === 'string';
    return !checkEmpty ? isString : isString && !!str.length;
  }

  /**
   * @param {Number} num
   * @returns {boolean}
   */
  static isNumber(num) {
    return typeof num === 'number' && isFinite(num); // eslint-disable-line
  }

  /**
   * @param {*} val
   * @returns {boolean}
   */
  static isFunction(val) {
    return typeof val === 'function';
  }

  /**
   * @param {*} val
   * @param {Boolean} [checkEmpty] - optional check whether the supposed array is empty
   * @returns {Boolean}
   */
  static isArray(val, checkEmpty = false) {
    const isArr = Array.isArray(val);
    return checkEmpty === true
      ? isArr && !!val.length
      : isArr;
  }

  /**
   * @param {*} val
   * @param {Boolean} [checkEmpty] - optional check whether the object has any values
   * @returns {Boolean}
   */
  static isObject(val, checkEmpty) {
    try {
      const isOb = typeof val === 'object' && !Array.isArray(val) && val !== null;
      return checkEmpty === true
        ? isOb && !!Object.keys(val).length
        : isOb;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {Object} val
   * @param {String} [name]
   */
  static throwNotObject(val, name) {
    throw new TypeError(Tools.textNotObject(val, name));
  }

  /**
   * @param {Object} val
   * @param {String} [name] - optional parameter for more clarity
   * @returns {string}
   */
  static textNotObject(val, name) {
    const type = Tools.getType(val);
    const middle = Tools.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle}  is not an object or is empty`;
  }

  /**
   * Capitalize or de-capitalize a string
   * ToDo: this should be added to String.prototype
   * @param {String} string
   * @param {Boolean} [toUp]
   * @returns {String}
   */
  static capitalize(string = '', toUp = true) {
    return string.charAt(0)[toUp ? 'toUpperCase' : 'toLowerCase']() + string.slice(1);
  }
}

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
    return `ERROR: Value ${JSON.stringify(value)} is not type ${type}`;
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
        debugger;
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

    if (!keys.length) {
      return {
        tree: 'ERROR: There are no rules for this property',
        valid: false,
      };
    }

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const rule = rules[key];
      const item = branch[key];
      const { type, children } = rule;
      const sameType = Validator.matchType(item, type);

      if (!Tools.is(value) && rule.optional === true) {
        continue;
      }

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
    const method = Tools[`is${type}`];
    return Tools.is(method)
      ? method(value, checkEmpty)
      : Tools.capitalize(typeof value) === type;
  }
}

exports.validate = Validator.validate;
