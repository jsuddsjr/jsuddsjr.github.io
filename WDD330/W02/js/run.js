/**
 * @param {String[]} code
 */
const runCode = (code) => {
  output = document.getElementById("output");
  let result;
  for (let line of code) {
    if (line.startsWith('//')) {
      output.innerHTML += `<br/><code>${line}</code><br/>`;
      continue;
    }

    try {
      result = eval(line);
      if (typeof result === "string") {
        result = `'${result}'`;
      } else if (typeof result !== "undefined") {
        result = result.toString();
      }
    } catch (err) {
      result = err;
    }
    output.innerHTML += `<code>${line} -> ${result}</code><br />`;
  }
};
