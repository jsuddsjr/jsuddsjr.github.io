function square(x) {
  return x * x;
}

function sayHello() {
  return `Hello, my name is ${this.name}`;
}

function sayHelloWithGreeting(greeting = "Hello") {
  return `${greeting}, my name is ${this.name}`;
}

function square(x) {
  square.cache = square.cache || {};
  let result = square.cache[x];
  if (!result) {
    square.cache[x] = result = x * x;
  }
  return result;
}
