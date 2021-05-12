function testObjectDeclaration() {
  let user = {
    name: "John",
    age: 30,
  };

  log(user);
}

function testMethod() {
  let user = {
    name: "John",
    age: 30,
  };

  user.sayHi = function () {
    log("Hello!");
  };

  user.sayHi(); // Hello!
}

function testMethodWithThis() {
  let user = {
    name: "John",
    age: 30,

    sayHi() {
      // "this" is the "current object"
      log(this.name);
    },
  };

  user.sayHi(); // John
}

function testThisIsNotBound() {
  let user = { name: "John" };
  let admin = { name: "Admin" };

  function sayHi() {
    log(this.name);
  }

  // use the same function in two objects
  user.f = sayHi;
  admin.f = sayHi;

  // these calls have different this
  // "this" inside the function is the object "before the dot"
  user.f(); // John  (this == user)
  admin.f(); // Admin  (this == admin)

  admin["f"](); // Admin (dot or square brackets access the method – doesn't matter)
}

function testArrowFunctionsHaveNoThis() {
  let user = {
    firstName: "Ilya",
    sayHi() {
      let arrow = () => log(this.firstName);
      arrow();
    },
  };

  user.sayHi(); // Ilya
}

function testThisInObjectLiteral() {
  function makeUser() {
    return {
      name: "John",
      ref: this,
    };
  }

  let user = makeUser();

  log(user.ref.name); // What's the result?
  log(user.ref);      // What object is this?
}
