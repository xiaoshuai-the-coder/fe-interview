const {get} = require('../get');

describe('get 函数', () => {
  const obj = {
    name: 'tom',
    age: 18,
    address: {
      city: 'beijing',
      zip: null,
      detail: {
        street: 'wangfujing'
      }
    },
    hobbies: ['coding', 'reading'],
    empty: null,
    undef: undefined
  };

  // 1. 基础属性
  test('获取基础属性', () => {
    expect(get(obj, 'name')).toBe('tom');
    expect(get(obj, 'age')).toBe(18);
  });

  // 2. 嵌套属性
  test('获取嵌套属性', () => {
    expect(get(obj, 'address.city')).toBe('beijing');
    expect(get(obj, 'address.detail.street')).toBe('wangfujing');
  });

  // 3. 数组索引
  test('获取数组元素', () => {
    expect(get(obj, 'hobbies.0')).toBe('coding');
    expect(get(obj, 'hobbies.1')).toBe('reading');
  });

  // 4. 属性不存在 → 返回 undefined
  test('属性不存在返回 undefined', () => {
    expect(get(obj, 'xxx')).toBeUndefined();
    expect(get(obj, 'address.xxx')).toBeUndefined();
    expect(get(obj, 'a.b.c.d')).toBeUndefined();
  });

  // 5. 中间层为 null/undefined → 短路返回 undefined
  test('中间层 null/undefined 短路', () => {
    expect(get(obj, 'empty.a')).toBeUndefined();
    expect(get(obj, 'undef.a')).toBeUndefined();
    expect(get(obj, 'address.zip.a')).toBeUndefined();
  });

  // 6. 支持默认值
  test('支持默认值', () => {
    expect(get(obj, 'xxx', 'default')).toBe('default');
    expect(get(obj, 'address.xxx', 'novalue')).toBe('novalue');
  });

  // 7. 空路径
  test('空路径返回原对象', () => {
    expect(get(obj, '')).toBe(obj);
    expect(get(obj, null)).toBe(obj);
  });
});