function testConstructorFunction() {
  Dice = function (sides = 6) {
    this.sides = sides;
    this.roll = function () {
      return Math.floor(this.sides * Math.random() + 1);
    };
  };

  return new Dice();
}

// TODO: Stop using copies for global objects!
class DiceClass {
  constructor(sides = 6) {
    this.sides = sides;
  }
  roll() {
    return Math.floor(this.sides * Math.random() + 1);
  }
}

function testES6ClassDeclaration() {
  class DiceClass {
    constructor(sides = 6) {
      this.sides = sides;
    }
    roll() {
      return Math.floor(this.sides * Math.random() + 1);
    }
    static description() {
      return "A way of choosing random numbers";
    }
  }

  return new DiceClass(20);
}

testES6ClassDeclaration.title = "ES6 Class Declarations";
