/**
 * Get the reported name of any object.
 * @param {Object} obj
 * @returns
 */
const myType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

/**
 * @param {any} unknown
 * @returns {String}
 */
const toTypeString = (unknown) => {
  let result;
  if (typeof unknown === "string") {
    result = `'${unknown}'`;
  } else if (Array.isArray(unknown)) {
    const asStrings = [];
    for (let i = 0; i < unknown.length; i++) {
      asStrings[i] = toTypeString(unknown[i]);
    }
    // Capture extra properties
    for (let [key, value] of Object.entries(unknown)) {
      if (Number.isInteger(+key) || key === "length") {
        continue;
      }
      if (value !== undefined) {
        asStrings.push(`${key}: ${toTypeString(value)}`);
      }
    }
    result = `[${asStrings.join(", ")}]`;
  } else if (unknown instanceof Set || unknown instanceof Map) {
    const asArray = toTypeString([...unknown]);
    result = `${myType(unknown)} { ${asArray.substr(1, asArray.length - 2)} }`;
  } else if (unknown instanceof WeakSet || unknown instanceof WeakMap) {
    result = `${myType(unknown)} {}`;
  } else if (unknown instanceof RegExp) {
    result = unknown.toString();
  } else if (unknown instanceof HTMLElement) {
    result = unknown.outerHTML;
  } else if (unknown instanceof Object) {
    result = JSON.stringify(unknown, null, 2);
  } else {
    result = String(unknown);
  }
  return result;
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

/** @type {HTMLDivElement} Output region */
const output =
  document.querySelector("#output") || document.createElement("div");

/**
 *
 * @param {Array<String>} html
 */
const writeToOutput = (html) => {
  const div = document.createElement("DIV");
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
      const code = line
        .toString()
        .split("\n")
        .filter((l) => l.indexOf("/**/") === -1);
      const body = code
        .splice(1, code.length - 2)
        .join("\n")
        .replace(/</g, "&lt;");
      const functionName =
        line["title"] ||
        line.name
          // Remove leading "test" if exists.
          .replace(/^test/, "")
          // Split the function name into words at capital letters.
          .replace(/([A-Z]|[0-9]+)/g, " $1");
      html.push(
        `<a id="${line.name}"></a><h4>${functionName}</h4><pre>${body}</pre>`
      );

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
