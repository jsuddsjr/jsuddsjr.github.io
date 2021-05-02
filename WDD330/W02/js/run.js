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
    value = JSON.stringify(value);
  } else {
    value = String(value);
  }
  return value;
};

const startLog = () => {
  globalLog = [];
};
const log = (msg) => {
  globalLog.push(msg);
};

/**
 * @param {Array<String|Function>} code
 */
const runCode = (code) => {
  output = document.getElementById("output");
  let result;
  for (let c of code) {
    if (typeof c === "string") {
      if (!c || c.startsWith("//")) {
        output.innerHTML += `<br/><code>${c}</code><br/>`;
      } else {
        try {
          result = toTypeString(eval(c));
        } catch (err) {
          result = err;
        }
      }
      output.innerHTML += `<code>${c} -> ${result}</code><br />`;
    } else if (c instanceof Function) {
      startLog();
      const result = (c() || globalLog.map(toTypeString)).join("<br/>");
      let body = c.toString().split("\n");
      body = body
        .splice(1, body.length - 2)
        .join("</br/>")
        .replace(/\n/g, "<br/>")
        .replace(/ /g, "&nbsp;");
      output.innerHTML += `<h4>${c.name}</h4><code>${body}</code><br/><h4>Output</h4><code>${result}</code><hr/>`;
    }
  }
};
