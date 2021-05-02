/**
 * Get the reported name of any object.
 * @param {Object} obj
 * @returns
 */
const myType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

/**
 * @param {any} value
 * @returns {String}
 */
const toTypeString = (value) => {
  if (typeof value === "string") {
    value = `'${value}'`;
  } else if (Array.isArray(value)) {
    const asStrings = [];
    for (let i = 0; i < value.length; i++) {
      asStrings[i] = toTypeString(value[i]);
    }
    value = `[${asStrings.join(", ")}]`;
  } else if (value instanceof Set || value instanceof Map) {
    const asArray = toTypeString([...value]);
    value = `${myType(value)} { ${asArray.substr(1, asArray.length - 2)} }`;
  } else if (value instanceof WeakSet || value instanceof WeakMap) {
    value = `${myType(value)} {}`;
  } else if (value instanceof Object) {
    value = myType(value);
  } else {
    value = String(value);
  }
  return value;
};

/**
 * @param {String[]} code
 */
const runCode = (code) => {
  output = document.getElementById("output");
  let result;
  for (let line of code) {
    if (!line || line.startsWith("//")) {
      output.innerHTML += `<br/><code>${line}</code><br/>`;
    } else {
      try {
        result = toTypeString(eval(line));
      } catch (err) {
        result = err;
      }
      output.innerHTML += `<code>${line} -> ${result}</code><br />`;
    }
  }
};
