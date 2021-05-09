function testSupermanObject() {
  superman = {
    name: "Superman",
    "real name": "Clark Kent",
    height: 75,
    weight: 235,
    hero: true,
    villain: false,
    allies: ["Batman", "Supergirl", "Superboy"],
    fly() {
      return "Up, up and away!";
    },
  };
}

function testHulkObject() {
  hulk = { name: "Hulk", ["catch" + "Phrase"]: "Hulk Smash!" };
}

function testSuperGirlObject() {
  nameSymbol = Symbol("name");
  realName = Symbol("real name");
  supergirl = { [nameSymbol]: "Supergirl" };
}

function testSupermanProps() {
  for (const key of Object.keys(superman)) {
    log(key);
  }

  for (const key in superman) {
    log(key + ": " + superman[key]);
  }

  for (const [key, value] of Object.entries(superman)) {
    log(`${key}: ${value}`);
  }
}

testSupermanProps.title = "Finding all the properties of an object";

function testJla() {
  jla = {
    superman: { realName: "Clark Kent" },
    batman: { realName: "Bruce Wayne" },
    wonderWoman: { realName: "Diana Prince" },
    flash: { realName: "Barry Allen" },
    aquaman: { realName: "Arthur Curry" },
  };
}

testJla.title = "Junior League Array (JLA)";

function testPassingObjects() {
  function greet({ greeting = "Hello", name = "John", age = 18 }) {
    return `${greeting}! My name is ${name} and I am ${age} years old.`;
  }

  log(greet({ greeting: `What's up dude`, age: 10, name: `Bart` }));

  // Using default params
  log(greet({ name: "Lisa", age: 8 }));

  // You must still pass an object even when using defaults.
  log(greet({}));
}
