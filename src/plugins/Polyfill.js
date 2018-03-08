// Polyfill for Object.assign if not support
if (typeof Object.assign !== 'function') {
  const assign = function assign(target, ...varArgs) { // .length of function is 2
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 1; index < varArgs.length; index += 1) {
      const nextSource = varArgs[index];

      if (nextSource != null) { // Skip over if undefined or null
        Object.keys(nextSource).forEach((nextKey) => {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        });
      }
    }
    return to;
  };
  Object.assign = assign;
}
