# zlevidation
Validate or generate JSON-like structures with schemas

## Types
```JSON
01. Array
02. Boolean
03. Element
04. Function
05. Number
06. Object
07. String
08. URL
09. ValidEmail
10. ValidIP
```

## Usage - simple
```javascript
import { validate } from 'json-valid-3k';
// OR
// const { validate } = require('json-valid-3k');

const CFG_SIMPLE = {
  arr: [],                            // 01. Array
  boo: true,                          // 02. Boolean
  elm: document.createElement('div'), // 03. Element
  fun: () => {},                      // 04. Function
  num: 3,                             // 05. Number
  obj: {},                            // 06. Object
  str: 'High quality string',         // 07. String
  url: 'https://some.place.com',      // 08. URL
  mail: 'a@b.c',                      // 09. ValidEmail
  ip: '192.168.0.251',                // 10. ValidIP
  def: null,                          // 11. null
};
const SCHEMA_SIMPLE = {
  arr: 'Array',       // { type: 'Array' },
  boo: 'Boolean',     // { type: 'Boolean' },
  elm: 'Element',     // { type: 'Element' },
  fun: 'Function',    // { type: 'Function' },
  num: 'Number',      // { type: 'Number' },
  obj: 'Object',      // { type: 'Object' },
  str: 'String',      // { type: 'String' },
  url: 'URL',         // { type: 'URL' },
  mail: 'ValidEmail', // { type: 'ValidEmail' },
  ip: 'ValidIP',      // { type: 'ValidIP' },
  def: null,          // { type: null },
};

const test = validate(CFG_SIMPLE, SCHEMA_SIMPLE);
// test = {
//   valid: true, // OR false
//   tree: { YOUR_OBJECT_PROPS / ERRORS }, 
// }
```

## Validation object
The validation object has a fairly simple structrure
```javascript
{
  valid: Boolean,
  tree: Object,
}
```
1. `valid`: indicates your object's integrity with the schema.
2. `tree`: this object represents your entire validated tree, as **described in the schema**.

### **Important note about `tree`**
The `tree` object discards everything from the source object that is not in the schema. The idea is that if you really care about your data integrity, than there's not reason not to use it as opposed to dragging everything esle from your source object.

<br /><hr /><br />
## Additional Schema Options
```javascript
{
  // ...Some props
  optional: Boolean,
  default: 'Something', // Has to match the type. NOT applied when "optional" is "true"
  allowEmpty: Boolean, // Default value is true. Using false fails empty Array/Object/String values
  silentDrop: Boolean, // Default value is false. Using true drops failed items without raising the alarm
}
```

<br /><hr /><br />

## Usage - deep nesting
```javascript
import { validate } from 'json-valid-3k';

const a_data = {
  a: 'kisk',
  b: {
    duck: 123,
    bb: 123,
    xx: {
      q: [
        { qub: 456 },
        { qub: 789 },
        { qub: 'I am wrong, hehe' },
        null,
        undefined,
        { irrelevant: 'prop' },
        { qub: 111 },
      ]
    },
    yy: {
      hello: 'World',
    },
  },
  c: ['Dingo'],
  d: () => ({}),
};
const a_schema = {
  a: { type: 'String', optional: true },
  c: { type: 'Array', optional: false },
  b: {
    type: 'Object',
    optional: true,
    props: {
      duck: { type: 'String', optional: true },
      bb: { type: 'Number', optional: false },
      xx: {
        type: 'Object',
        props: {
          q: {
            type: 'Array',
            children: {
              type: 'Object',
              props: { qub: { type: 'Number' } },
            },
          },
        },
      },
      yy: {
        type: 'Object',
        props: {
          hello: { type: 'String' },
          aaa: { type: 'Boolean', default: false },
          bbb: { type: 'Boolean', default: true },
          ccc: { type: null, default: null },
          ddd: { type: null, default: undefined },
          eee: { type: 'String', default: 'This will show up', },
          fff: { type: 'String', default: 'This will NOT show up because it is optional', optional: true },
        },
      },
    },
  },
  d: { type: 'Function' }
};

const test = validate(a_data, a_schema);
test = {
  valid: false, // OR true
  tree: {
    a: "kisk"
    b:
    bb: 123
    duck: "ERROR: Value [123] does not match type [String]"
    xx: {
      q: Array(7) [
        0: {qub: 456}
        1: {qub: 789}
        2: {qub: "ERROR: Value ["I am wrong, hehe"] does not match type [Number]"}
        3: "ERROR: Value [null] does not match type [Object]"
        4: "ERROR: Value [undefined] does not match type [Object]"
        5: {qub: "ERROR: Value [undefined] does not match type [Number]"}
        6: {qub: 111}
      ]
    }
    yy: {
      aaa: false
      bbb: true
      ccc: null
      ddd: "ERROR: Value [undefined] does not match type [null]"
      eee: "This will show up"
      hello: "World"
    }
    c: ["Dingo"]
    d: () => ({})
  }, 
}
```

## Important
Use the **`valid`** property to determine your object's integrity with the schema.

The **`tree`** object stores your output. It contains your validates properties OR the relevant errors for each and every problem, as described in the scema.
