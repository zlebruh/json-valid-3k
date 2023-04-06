export const DATA_1 = {
  arr: [],                            // 01. Array
  boo: true,                          // 02. Boolean
  fun: () => { },                      // 03. Function
  num: 3,                             // 04. Number
  obj: {},                            // 05. Object
  str: 'High quality string',         // 06. String
  url: 'https://some.place.com',      // 07. URL
  mail: 'a@b.c',                      // 08. ValidEmail
  ip: '192.168.0.251',                // 09. ValidIP
  def: null,                          // 10. null
}
export const SCHEMA_1 = {
  arr: 'Array',       // { type: 'Array' },
  boo: 'Boolean',     // { type: 'Boolean' }, 
  fun: 'Function',    // { type: 'Function' },
  num: 'Number',      // { type: 'Number' },
  obj: 'Object',      // { type: 'Object' },
  str: 'String',      // { type: 'String' },
  url: 'URL',         // { type: 'URL' },
  mail: 'ValidEmail', // { type: 'ValidEmail' },
  ip: 'ValidIP',      // { type: 'ValidIP' },
  def: null,          // { type: null },
}

export const DATA_2 = {
  a: 'kisk',
  b: {
    duck: '123',
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
export const SCHEMA_2 = {
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

export default {
  DATA_1, SCHEMA_1,
  DATA_2, SCHEMA_2
}
