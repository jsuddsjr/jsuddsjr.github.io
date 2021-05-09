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
 */
const executeWithTry = (fn) => {
  try {
    const result = fn();
    if (result !== undefined) {
      log(result);
    }
  } catch (err) {
    log(String(err));
  }
};

/** @type {HTMLDivElement} */
const output = document.getElementById("output");

/**
 *
 * @param {Array<String>} html
 */
const writeToOutput = (html) => {
  const div = document.createElement("DIV")
  div.innerHTML += html.join("");
  output.appendChild(div);

  html.length = 0;
};

/**
 * @param {Array<String|Function>} code
 */
const runCode = (code) => {
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
      // Remove the wrapper function from code block and ignore setup lines.
      const code = line.toString().split("\n").filter(l => l.indexOf("/**/") === -1);
      const body = code.splice(1, code.length - 2).join("\n");
      const functionName = line.title || line.name
        // Remove leading "test" if exists.
        .replace(/^test/, "")
        // Split the function name into words at capital letters.
        .replace(/([A-Z]|[0-9]+)/g, " $1");
      html.push(`<a id="${line.name}"></a><h4>${functionName}</h4><pre>${body}</pre>`);

      writeToOutput(html);

      startLog();
      executeWithTry(line);
      const result = globalLog.map(toTypeString).join("\n");
      if (result) {
        html.push(`<h4>Output</h4><pre>${result}</pre>`);
      }
    }
  }

  html.push("<br/><br/>");
  writeToOutput(html);
};
