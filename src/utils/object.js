function jsonEqual(obj1, obj2) {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 === 'object') {
    const key1 = Object.keys(obj1).sort();
    const key2 = Object.keys(obj2).sort();
    if (key1.length !== key2.length) {
      return false;
    }

    return key1.reduce((ret, key) => {
      const val2 = obj2[key];
      if (!val2) {
        return false;
      }
      return ret && jsonEqual(obj1[key], obj2[key]);
    }, true);
  }
  return obj1 === obj2;
}

export default {
  jsonEqual,
};
