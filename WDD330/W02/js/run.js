/**
 * @param {String[]} code
 */
const runCode = (code) => {
  output = document.getElementById("output");
  let result;
  for (let line of code) {
    try {
      if (line.startsWith('//')) {
        result = line;
      } else {
        result = eval(line);
      }
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
