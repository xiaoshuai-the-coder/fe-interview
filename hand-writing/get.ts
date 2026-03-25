const get = function (obj: Record<string, any>, key: string, defaultValue: any) {
    if (!obj || !key) {
        return obj
    }
  let result: any = obj;
  let keys = key.split('.')
  for(let k of keys) {
    if (result[k] === null || result[k] === undefined) {
        result = undefined
        break
    }
    result = result[k]
  }

  return result !== undefined ? result : defaultValue;
};

module.exports = { get };
