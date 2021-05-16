// TODO: Remove duplicate.

class Turtle {
  constructor(name) {
    this.name = name;
    this.weapon = "hands";
  }
  sayHi() {
    return `Hi dude, my name is ${this.name}`;
  }
  attack() {
    return `Feel the power of my ${this.weapon}!`;
  }
}

function testDeclareTurtle() {
  class Turtle {
    constructor(name) {
      this.name = name;
      this.weapon = "hands";
    }
    sayHi() {
      return `Hi dude, my name is ${this.name}`;
    }
    attack() {
      return `Feel the power of my ${this.weapon}!`;
    }
  }
}
