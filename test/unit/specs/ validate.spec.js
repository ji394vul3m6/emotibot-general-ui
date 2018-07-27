import utils from '@/utils/js/validate';

const passwordTestcases = [
  ['abc', false],
  ['csbot@1', true],
];
const emailTestcases = [
  ['abc@123.com', true],
  ['abcde', false],
  ['a.b.c@hotmail.com', true],
];
const usernameTestcases = [
  ['abcde', true],
  ['aaa!123', false],
];

const testConfig = [
  ['isValidPassword', passwordTestcases, utils.isValidPassword],
  ['isValidEmail', emailTestcases, utils.isValidEmail],
  ['isValidUserName', usernameTestcases, utils.isValidUserName],
];

describe('utils/js/validate.js', () => {
  testConfig.forEach((config) => {
    const [name, testcases, func] = config;
    testcases.forEach((testcase) => {
      const [val, excepted] = testcase;

      it(`Test ${name} for ${val}`, () => {
        const ret = func(val);
        expect(ret).to.equal(excepted);
      });
    });
  });
});
