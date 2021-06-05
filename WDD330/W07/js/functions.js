function square(x) {
    return x*x;
}

function sayHello() {
  return `Hello, my name is ${this.name}`;
}

function sayHelloWithGreeting(greeting = "Hello") {
  return `${greeting}, my name is ${this.name}`;
}
