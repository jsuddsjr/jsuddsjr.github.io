/**
 * Generate a random unique ID between "aaaa" and "zzzz".
 */
const generateKey = (function () {
  const KEY_MAX = parseInt("zzzz", 36);
  const KEY_MIN = parseInt("aaaa", 36);
  const KEY_RND_MAX = KEY_MAX - KEY_MIN;
  return () => Math.trunc(Math.random() * KEY_RND_MAX + KEY_MIN).toString(36);
})();

/**
 * @param {Object} obj
 * @returns Reported name of any object
 */
const myType = (obj) =>
  obj.constructor.name || Object.prototype.toString.call(obj).slice(8, -1);

/**
 * Ensure strings with line breaks are displayed preformatted.
 * @param {String} str
 * @returns A string with PRE tags, if needed.
 */
const preWrap = (str) => (str.indexOf("\n") !== -1 ? `<pre>${str}</pre>` : str);

const objectName = (obj) => {
  const typeName = myType(obj);
  return typeName !== "Object" ? `<i>${typeName}</i> ` : "";
};

/**
 * Trim beginning space from multi-line string.
 * @param {string} str
 */
const trimFromAllLines = (str) => {
  if (/\n/.test(str)) {
    const lines = str.split(new RegExp("\r?\n"));
    const lastLine = lines[lines.length - 1];
    const leadingSpace = /^\s+/;
    if (leadingSpace.test(lastLine)) {
      const shortestSpace = lines.reduce(
        (prev, next, index) =>
          index != 0 &&
          next.length > 0 &&
          (m = leadingSpace.exec(next)) &&
          (!prev || prev.length > m[0].length)
            ? m[0]
            : prev,
        null
      );
      if (shortestSpace) {
        const leadingMatch = new RegExp(`^${shortestSpace}`);
        return lines.map((s) => s.replace(leadingMatch, "")).join("\n");
      }
    }
  }
  return str.trimStart();
};

/**
 * Prepare opening HTML tags for display.
 * @param {String} html
 * @returns String with opening tags replaced.
 */
const unHtml = (html) => html.replace(/</g, "&lt;");

/**
 * @param {any} unknown
 * @returns String representation of type.
 */
const toTypeString = (unknown) => {
  let result;
  if (typeof unknown === "string") {
    let q = unknown.indexOf('"') !== -1 ? "'" : '"';
    result = preWrap(`${q}${unHtml(unknown)}${q}`);
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
    result = `${objectName(unknown)} { ${asArray.substr(
      1,
      asArray.length - 2
    )} }`;
  } else if (unknown instanceof WeakSet || unknown instanceof WeakMap) {
    result = `${objectName(unknown)} {}`;
  } else if (unknown instanceof RegExp) {
    result = unknown.toString();
  } else if (unknown instanceof HTMLElement) {
    result = unHtml(unknown.outerHTML);
  } else if (unknown instanceof Text) {
    result = `#text "${unknown.textContent}"`;
  } else if (unknown instanceof HTMLCollection || unknown instanceof NodeList) {
    result = objectName(unknown) + toTypeString(Array.from(unknown));
  } else if (unknown instanceof Window) {
    result = "<i>Window</i> { ... }";
  } else if (unknown instanceof Function) {
    result = trimFromAllLines(unknown.toString());
  } else if (typeof unknown === "object") {
    const clone = Object.assign({}, unknown);
    Object.keys(clone).forEach((k) => {
      const value = clone[k];
      if (value instanceof Function) {
        clone[k] = "[Function]";
      }
    });
    result = objectName(unknown) + JSON.stringify(clone, null, 2);
    if (result.length > 512) {
      result = result.substr(0, 512) + "... }";
    }
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

/**
 *
 * @param {Function} fn
 * @param {String} asyncLogKey
 */
const executeWithAsync = (fn, asyncLogKey) => {
  (function (asyncLog) {
    setTimeout(() => {
      const log = asyncLog;
      // Re-evaluate in this new scope (includes async log);
      const result = eval(`(${fn.toString()})`)();
      if (result) {
        log(result);
      }
    }, 0);
  })(
    (function (key) {
      const logDiv = document.getElementById(key);
      return function (msg, style) {
        if (!logDiv.firstChild) {
          logDiv.innerHTML = "<h4>Output</h4>\n";
        }
        const parent = style
          ? logDiv.appendChild(document.createElement("span"))
          : logDiv;
        if (style) {
          parent.style = style;
        }
        parent.innerHTML += toTypeString(msg) + "\n";
      };
    })(asyncLogKey)
  );
};

/** @type {HTMLDivElement} Output region */
const output =
  document.querySelector("#output") || document.createElement("div");

/**
 * @param {String|String[]} html
 */
const writeToOutput = (html) => {
  if (Array.isArray(html)) {
    const temp = html.join("");
    html.length = 0;
    html = temp;
  }
  const div = document.createElement("div");
  div.innerHTML += html;
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
        html.push(`<br/><h4>${line}</h4>`);
      } else {
        let result;
        try {
          result = toTypeString(eval(line));
        } catch (err) {
          result = err;
        }
        html.push(preWrap(`<code>${unHtml(line)} -> ${result}</code><br/>`));
      }
    } else if (line instanceof Function) {
      // Remove the wrapper function from code block and ignore setup lines.
      const code = line
        .toString()
        .split("\n")
        .filter((l) => l.indexOf("/**/") === -1);

      // Do we have a body?
      if (code.length > 2) {
        const body = trimFromAllLines(
          code
            .splice(1, code.length - 2)
            .join("\n")
            .replace(/</g, "&lt;")
        );
        const functionName =
          line["title"] ||
          line.name
            // Remove leading "test" if exists.
            .replace(/^test/, "")
            // Split the function name into words at capital letters.
            .replace(/([A-Z]|[0-9]+)/g, " $1");
        html.push(
          `<a id="${line.name}"></a><h4>${functionName}</h4><pre>${unHtml(
            body
          )}</pre>`,
          line["associatedHtml"] || ""
        );
        writeToOutput(html);
      }

      if (line.isAsync) {
        const logKey = generateKey();
        writeToOutput(`<pre id="${logKey}"></pre>`);
        executeWithAsync(line, logKey);
      } else {
        startLog();
        executeWithTry(line);
        const result = globalLog.map(toTypeString).join("\n");
        if (result) {
          html.push(`<h4>Output</h4><pre>${result}</pre>`);
        }
      }
    }
  }

  html.push("<br/><br/>");
  writeToOutput(html);
};
