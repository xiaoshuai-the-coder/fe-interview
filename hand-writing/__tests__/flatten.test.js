const { flatten } = require('../flatten');

describe('数组扁平化', () => {
  test('空数组', () => {
    expect(flatten([])).toEqual([]);
  });

  test('一维数组', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('二层嵌套数组', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  test('多层嵌套数组', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('包含空数组的嵌套', () => {
    expect(flatten([[[]], 1, [[]]])).toEqual([1]);
  });
});