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
  /** @type {HTMLDivElement} */
  const output = document.getElementById("output");
  let html = [];
  for (let line of code) {
    if (typeof line === "string") {
      if (!line || line.startsWith("//")) {
        html.push(`<br/><code>${line}</code><br/>`);
      } else {
        try {
          result = toTypeString(eval(line));
        } catch (err) {
          result = err;
        }
        html.push(`<code>${line} -> ${result}</code><br/>`);
      }
    } else if (line instanceof Function) {
      startLog();
      const result = (line() || globalLog.map(toTypeString)).join('\n');
      let body = line.toString().split('\n');
      body = body.splice(1, body.length - 2).join('\n');
      html.push(
        `<hr/><h4>${line.name}</h4><pre>${body}</pre>`+
        `<h4>Output</h4><pre>${result}</pre>`
      );
    }
  }

  output.innerHTML = html.join("") + "<br/><br/>";
};
