function testDiceObject() {
  dice = {
    sides: 6,
    roll() {
      return Math.floor(this.sides * Math.random()) + 1;
    },
  };
}

function testMathsObject() {
  myMaths = {
    square(x) {
      return x * x;
    },
    mean(array, callback) {
      if (callback) {
        array.map(callback);
      }
      const total = array.reduce((a, b) => a + b);
      return total / array.length;
    },
  };
}

function testObjectFromString() {
  batman =
    '{"name": "Batman","real name": "Bruce Wayne","height": 74, "weight": 210, "hero": true, "villain": false, "allies": ["Robin","Batgirl","Superman"]}';
  log(JSON.parse(batman));
}

function testObjectToString() {
  const wonderWoman = {
    name: "Wonder Woman",
    "real name": "Diana Prince",
    height: 72,
    weight: 165,
    hero: true,
    villain: false,
    allies: ["Wonder Girl", "Donna Troy", "Superman"],
    lasso: function () {
      console.log("You will tell the truth!");
    },
  };
  log(JSON.stringify(wonderWoman));
}
