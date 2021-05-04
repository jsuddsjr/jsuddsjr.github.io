function loopSet() {
  const letters = new Set("hello");
  for (const letter of letters) {
    log(letter);
  }
}

function testDec2Bin() {
  function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  log(dec2bin(2476));
  log(dec2bin(-2477));
}

function loopMap() {
  const romanNumerals = new Map();
  romanNumerals.set(1, "I").set(2, "II").set(3, "III").set(4, "IV").set(5, "V");

  for (const key of romanNumerals.keys()) {
    log(key);
  }

  for (const value of romanNumerals.values()) {
    log(value);
  }

  for (const [key, value] of romanNumerals.entries()) {
    log(`${key} in Roman numerals is ${value}`);
  }
}

function testArguments() {
  function arguments() {
    log(arguments);
  }

  arguments("hello", NaN);
  arguments(1, 2, 3, 4, 5);

  function rest(...args) {
    log(args);
  }

  rest(2, 4, 6, 8);
}

function testMeanFunction() {
  function mean(...values) {
    let total = 0;
    for (const value of values) {
      total += value;
    }
    log(total / values.length);
  }

  mean(2, 8, 13, 11, 4, 2);
}

function testDefaultParameters() {
  function hello(name = "World") {
    log(`Hello ${name}!`);
  }

  hello();
}

function testDefaultParameters2() {
  function discount(price, amount = 10) {
    log((price * (100 - amount)) / 100);
  }

  discount(20);
  discount(15, 20);
}

function nested() {
  for (let i = 1; i < 13; i++) {
    for (let j = 1; j < 13; j++) {
      log(`${j} times ${i} is ${i * j}`);
    }
  }
}
