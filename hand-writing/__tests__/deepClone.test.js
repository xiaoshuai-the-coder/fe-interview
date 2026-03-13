// deepClone.test.js
const { deepClone } = require('../deepClone');

describe('超强版深拷贝（支持正则/Date/Map/Set/循环引用）', () => {
  test('基础类型', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('str')).toBe('str');
    expect(deepClone(null)).toBeNull();
  });

  test('对象嵌套', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cp = deepClone(obj);
    cp.b.c = 999;
    expect(obj.b.c).toBe(2);
  });

  test('Date 日期', () => {
    const date = new Date();
    const cp = deepClone(date);
    expect(cp).toEqual(date);
    expect(cp).not.toBe(date);
  });

  test('正则表达式', () => {
    const reg = /test/gim;
    const cp = deepClone(reg);
    expect(cp.source).toBe(reg.source);
    expect(cp.flags).toBe(reg.flags);
  });

  test('Map', () => {
    const m = new Map([['k', 'v']]);
    const cp = deepClone(m);
    expect(cp.get('k')).toBe('v');
    expect(cp).not.toBe(m);
  });

  test('Set', () => {
    const s = new Set([1, 2]);
    const cp = deepClone(s);
    expect(cp.has(1)).toBe(true);
  });

  test('循环引用不爆栈', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const cp = deepClone(obj);
    expect(cp).not.toBe(obj);
    expect(cp.self).toBe(cp);
  });
});