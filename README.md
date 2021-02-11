# json-validator
A simple tool for validating complex JSON structures

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
const Validator = require('json-valid-3k');

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
  arr: { type: 'Array' },
  boo: { type: 'Boolean' },
  elm: { type: 'Element' },
  fun: { type: 'Function' },
  num: { type: 'Number' },
  obj: { type: 'Object' },
  str: { type: 'String' },
  url: { type: 'URL' },
  mail: { type: 'ValidEmail' },
  ip: { type: 'ValidIP' },
  def: { type: null },
};

const test = Validator.validate(CFG_SIMPLE, SCHEMA_SIMPLE);
// test = {
//   valid: true, // OR false
//   tree: { YOUR_OBJECT_PROPS / ERRORS }, 
// }
```

## Usage - deep nesting
```javascript
const Validator = require('json-valid-3k');

const a_data = {
  a: 'kisk',
  b: {
    duck: 123,
    bb: 123,
    xx: {
      q: [
        { qub: 456 },
        { qub: 789 },
      ]
    }
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
              props: { qub: { type: 'Number' } }
            }
          }
        }
      }
    },
  },
  d: { type: 'Function' }
};

const test = Validator.validate(a_data, a_schema);
// test = {
//   valid: false, // OR true
//   tree: {
//     a: "kisk"
//     b:
//     bb: 123
//     duck: "ERROR: Value [123] does not match type [String]"
//     xx: {q: Array(2)}
//     c: ["Dingo"]
//     d: () => ({})
//   }, 
// }
```

## Additional Schema Options
```javascript
{
  // ...Some props
  optional: Boolean, // Overrides default value, if any
  default: 'Something', // This could be literally anything
  // The value is only assigned if the property is missing in the data structure
}
```

## Important
You can used the **valid** property to determine wheter everythings fine but you can also dig deep in the structure to determine what exactly went wrong.