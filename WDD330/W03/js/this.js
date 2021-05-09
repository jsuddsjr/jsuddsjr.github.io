function testDiceObject() {
  dice = {
    sides: 6,
    roll(die = 1) {
      return Array.from({ length: die }, (_) =>
        Math.ceil(this.sides * Math.random())
      ).reduce((a, b) => a + b);
    },
  };
}

function rollDiceButton(sides, count = 1) {
  const button = document.createElement("BUTTON");
  button.textContent = `Roll ${count} x ${sides}-side die`;
  button.addEventListener("click", () => {
    dice.sides = sides;
    alert(dice.roll(count));
  });
  document.querySelector("#output").appendChild(button);
}

async function rollDiceInput() {
  const div = document.createElement("div");
  const output = document.getElementById("output");
  output.appendChild(div);

  div.id = "dice";
  await insertTemplate("#dice");
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
