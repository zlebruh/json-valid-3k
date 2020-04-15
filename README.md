# json-validator
A simple tool for validating complex JSON structures

### Usage
import Validator

const a_data = {
  a: 'kisk',
  b: {
    fuck: '123',
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
      fuck: { type: 'String', optional: true },
      bb: { type: 'Number', optional: false },
      xx: {
        type: 'Object', props: {
          q: {
            type: 'Array',
            children: {
              type: 'Object', props: {
                qub: { type: 'Number' }
              }
            }
          }
        }
      }
    },
  },
  d: { type: 'Function' }
};

const result = Validator.validate(a_data, a_schema);
