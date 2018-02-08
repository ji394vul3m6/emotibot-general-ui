import utils from '@/utils/object';

describe('utils/object.js', () => {
  it('test for jsonEqual', () => {
    const testcases = [
      [{}, {}, true],
      [{}, 1, false],
      [{ a: 1, b: 2 }, { a: 1 }, false],
      [{ a: 1, b: 2 }, { a: 1, b: { c: 1 } }, false],
      [{ a: 1, b: 2 }, { a: 1, b: 3 }, false],
      [{ a: 1, b: 2 }, { a: 1, c: 2 }, true],
      [{ a: 1, b: 2 }, { a: 1, b: 2 }, true],
      [{ a: 1, b: { c: 1, d: 2 } }, { a: 1, b: { c: 1, d: 2 } }, true],
      [{ a: 1, b: { c: 1, d: 2 } }, { a: 1, b: { c: 1, d: 3 } }, false],
      [{ a: 1, b: { c: 1, d: 2 } }, { a: 2, b: { c: 1, d: 2 } }, false],
    ];

    testcases.forEach((testcase) => {
      const obj1 = testcase[0];
      const obj2 = testcase[1];
      const exceptValue = testcase[2];
      const ret = utils.jsonEqual(obj1, obj2);
      expect(ret).to.equal(exceptValue);
    });
  });
});
