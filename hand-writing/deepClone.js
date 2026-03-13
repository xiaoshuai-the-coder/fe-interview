const deepClone = (target, cache = new WeakMap()) => {
  /**
   *  查询缓存
   * @param {*} key
   * @returns
   */
  const _getCache = (key) => {
    return cache.get(key);
  };
  /**
   * 已当前处理对象作为key，设置缓存
   */
  const _setCache = (data) => {
    cache.set(target, data);
  };
  // 拷贝结果变量
  let result = null;
  if (target === null || typeof target !== "object") {
    return target;
  }
  // 已缓存数据直接返回，防止爆内存
  if (cache.has(target)) {
    return _getCache(target);
  }
  const dateHandler = (t) => {
    const res = new Date(t.getTime());
    _setCache(res);
    return res;
  };
  // 循环处理object和array
  // Reflect只循环本身属性
  const objectHandler = (tar) => {
    const res = Array.isArray(tar) ? [] : {};
    _setCache(res);
    Reflect.ownKeys(tar).forEach((t) => {
      res[t] = deepClone(tar[t], cache);
    });

    return res;
  };

  const regHandler = (t) => {
    const res = new RegExp(t.source, t.flags);
    res.lastIndex = t.lastIndex;
    _setCache(res);
    return res;
  };
  const mapHandler = (t) => {
    const res = new Map();
    _setCache(res);
    t.forEach((val, key) => {
      res.set(deepClone(key, cache), deepClone(val, cache));
    });
    return res;
  };
  const setHandler = (t) => {
    const res = new Set();
    _setCache(res);
    t.forEach((d) => {
      res.add(deepClone(d, cache));
    });
    return res;
  };

  const handlerMap = new Map([
    [Date, dateHandler],
    [Object, objectHandler],
    [Array, objectHandler],
    [RegExp, regHandler],
    [Map, mapHandler],
    [Set, setHandler],
  ]);

  const handler = handlerMap.get(target.constructor);

  if (handler) return handler(target);

  return result;
};

module.exports = { deepClone };
