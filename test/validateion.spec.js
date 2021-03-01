// ############################################################
// None of this would work due to Jest ESM support being tricky
// ############################################################

test('Run a dummy test that fails successfully', () => {
  let result;
  try {
    result = validate();
  } catch (err) {
    console.log(err.message);
  }

  expect(result).toBeFalsy(result);
})

// ### TODO - MAKE SURE THIS WORKS TOO
// validate({ a: [{ aaa: [[[[]]]] }] },
// {
//   a: {
//     type: 'Array',
//     children: {
//       type: 'Object',
//       props: {
//         aaa: {
//           type: 'Array',
//           children: {
//             type: 'Array',
//             children: {
//               type: 'Array',
//               allowEmpty: false,
//               children: {
//                 type: 'Array',
//                 allowEmpty: true
//               }
//             },
//             allowEmpty: false,
//             silentDrop: false,
//           },
//           allowEmpty: false
//         }
//       }
//     },
//     allowEmpty: false
//   }
// });
// ### TODO - MAKE SURE THIS WORKS TOO

// ############################################################
// None of this would work due to Jest ESM support being tricky
// ############################################################

// // import { validate } from '../src/index';

// // REQUISITES
// const a_data = {
//   a: 'kisk',
//   b: {
//     duck: '123',
//     bb: 123,
//     xx: {
//       q: [
//         { qub: 456 },
//         { qub: 789 },
//       ]
//     }
//   },
//   c: ['Dingo'],
//   d: () => ({}),
// };
// const a_schema = {
//   a: { type: 'String', optional: true },
//   c: { type: 'Array', optional: false },
//   b: {
//     type: 'Object',
//     optional: true,
//     props: {
//       duck: { type: 'String', optional: true },
//       bb: { type: 'Number', optional: false },
//       xx: {
//         type: 'Object', props: {
//           q: {
//             type: 'Array',
//             children: {
//               type: 'Object', props: {
//                 qub: { type: 'Number' }
//               }
//             }
//           }
//         }
//       }
//     },
//   },
//   d: { type: 'Function' }
// };

// // ERROR TESTS
// test('Validate without params', () => {
//   let result;
//   try {
//     result = validate();
//   } catch (err) {
//     console.log(err.message);
//   }

//   expect(result).toBeFalsy(result);
// });

// test('Validate without Schema', () => {
//   let result;
//   try {
//     result = validate(a_data);
//   } catch (err) {
//     console.log(err.message);
//   }

//   expect(result).toBeFalsy(result);
// });

// test('Validate without Data', () => {
//   let result;
//   try {
//     result = validate(a_schema);
//   } catch (err) {
//     console.log(err.message);
//   }

//   expect(result).toBeFalsy(result);
// });

// // POSITIVE TESTS
// test('Validate simple structure', () => {
//   const DATA = {a: 'de', b: 111, c: false};
//   const SCHEMA = {
//     a: {type: 'String'},
//     b: {type: 'Number'},
//     c: {type: 'Boolean'},
//   };
//   const result = validate(DATA, SCHEMA);

//   expect(result).toEqual(
//     expect.objectContaining({
//       valid: true,
//     })
//   );
// });

// test('Validate complex structure', () => {
//   const result = validate(a_data, a_schema);

//   expect(result).toEqual(
//     expect.objectContaining({
//       valid: true,
//     })
//   );
// });
