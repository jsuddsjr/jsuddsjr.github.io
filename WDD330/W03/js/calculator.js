function testCalculator() {
  /**
   * Prompts for a value and tries to convert to number.
   * @param {String} prompt
   * @returns {Number}
   */
  function readNumber(prompt) {
    let result = NaN;
    while (Number.isNaN(result)) {
      result = parseFloat(window.prompt(prompt, 0));
    }
    return result;
  }

  let calculator = {
    n1: 0,
    n2: 0,
    read: () => {
      this.n1 = readNumber("Give me your first number.");
      this.n2 = readNumber("Alright. Now your second number.");
    },
    sum: () => {
        return this.n1 + this.n2;
    },
    mul: () => {
        return this.n1 * this.n2;
    }
  };

  calculator.read();
  log(calculator.sum());
  log(calculator.mul());
}
