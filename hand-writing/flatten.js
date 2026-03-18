const flatten = (arr) => {
  let result = [];
  arr.forEach((d) => {
    if (Array.isArray(d)) {
      result = result.concat(flatten(d));
    } else {
      result.push(d);
    }
  });

  return result;
};

module.exports = { flatten };
