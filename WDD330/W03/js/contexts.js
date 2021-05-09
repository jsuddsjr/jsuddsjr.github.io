function testGlobalContext() {
  return myType(this);
}

function testObjectContstruction() {
  function Human(age) {
    this.age = age;
  }

  let greg = new Human(22);
  let thomas = new Human(24);

  log(greg); // this.age = 22
  log(thomas); // this.age = 24
}

function testObjectMethod() {
  function Human(name) {
    return {
      name,
      getName() {
        return this.name;
      },
    };
  }

  const zell = new Human("Zell");
  const vincy = new Human("Vincy");

  log(zell.getName()); // Zell
  log(vincy.getName()); // Vincy
}

function testSimpleFunction() {
  function simpleFunction() {
    log(myType(this));
  }

  const o = {
    sayThis() {
      simpleFunction();
    },
  };

  simpleFunction(); // Window
  o.sayThis(); // Window
}

function testSetTimeoutError() {
  const o = {
    doSomethingLater() {
      setTimeout(function () {
        try {
          this.speakLeet(); // TypeError
        } catch (err) {
          alert(err);
        }
      }, 1000);
    },
    speakLeet() {
      console.log(`Lost reference to this says, "1337 15 4W350M3"`);
    },
  };

  o.doSomethingLater();
}

function testSetTimeoutCorrect() {
  const o = {
    doSomethingLater() {
      const self = this;
      setTimeout(function () {
        self.speakLeet();
      }, 1000);
    },
    speakLeet() {
      alert(`Reference to self says, "1337 15 4W350M3"`);
    },
  };

  o.doSomethingLater();
}

function testThisInArrowFunction() {
  const o = {
    doSomethingLater() {
      setTimeout(() => this.speakLeet(), 1000);
    },
    speakLeet() {
      alert(`Arrow Function says, "1337 15 4W350M3"`);
    },
  };

  o.doSomethingLater();
}

function testThisInEventListener() {
  /**/ const b1 = document.createElement("BUTTON");
  /**/ b1.textContent = "Click Me!";
  /**/ document.querySelector("#output").appendChild(b1);

  const button = document.querySelector("button");

  button.addEventListener("click", function () {
    alert(this); // button
  });

  button.addEventListener("click", () => {
    alert(this); // Window
  });

  button.onclick = function () {
    alert(this); // button
  };
}
