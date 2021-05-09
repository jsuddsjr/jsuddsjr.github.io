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
    value = JSON.stringify(value, null, 2);
  } else {
    value = String(value);
  }
  return value;
};

let globalLog;
const startLog = () => {
  globalLog = [];
};
const log = (msg) => {
  globalLog.push(msg);
};
/**
 * @param {Function} fn 
 * @returns {String?}  
 */
const executeWithTry = (fn) => {
  try {
    return fn();
  } catch (err) {
    return String(err);
  }
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
      if (!line.trim() || line.startsWith("//")) {
        html.push(`<br/><code>${line}</code><br/>`);
      } else {
        let result;
        try {
          result = toTypeString(eval(line));
        } catch (err) {
          result = err;
        }
        html.push(`<code>${line} -> ${result}</code><br/>`);
      }
    } else if (line instanceof Function) {
      startLog();
      const result = (executeWithTry(line) || globalLog.map(toTypeString)).join("\n");
      // Remove the wrapper function from code block.
      const code = line.toString().split("\n");
      const body = code.splice(1, code.length - 2).join("\n");
      const functionName = line.name
        // Remove leading "test" if exists.
        .replace(/^test/, "")
        // Split the function name into words at capital letters.
        .replace(/([A-Z0-9])/g, " $1");
      html.push(
        `<hr/><h4>${functionName}</h4><pre>${body}</pre>` +
          `<h4>Output</h4><pre>${result}</pre>`
      );
    }

    // PERF: Share the results as we go.
    if (html.length > 10) {
      output.innerHTML += html.join("");
      html.length = 0;
    }
  }

  output.innerHTML += html.join("") + "<br/><br/>";
};
