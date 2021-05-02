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
  } else if (value instanceof Set) {
    const asArray = toTypeString([...value]);
    value = `Set { ${asArray.substr(1, asArray.length - 2)} }`;
  } else if (value instanceof WeakSet) {
    value = "WeakSet {}";
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
