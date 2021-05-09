function testGlobalContext() {
  return myType(this);
}

testGlobalContext.title = "<code>this</code> in the global context";

function testObjectContstruction() {
  function Human(age) {
    this.age = age;
  }

  let greg = new Human(22);
  let thomas = new Human(24);

  log(greg); // this.age = 22
  log(thomas); // this.age = 24
}

testObjectContstruction.title = "<code>this</code> in object construction";

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

testObjectMethod.title = "<code>this</code> in an object method";

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

testSimpleFunction.title = "<code>this</code> in a simple function";

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

testSetTimeoutError.title =
  "<code>setTimeout</code> doesn't preserve the <code>this</code> reference";

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

testSetTimeoutCorrect.title = "Saving a reference to <code>this</code>";

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

testThisInEventListener.title = "<code>this</code> in an event listener";

function testLeetSpeakerWithBoundThis() {
  /**/ const b1 = document.createElement("BUTTON");
  /**/ b1.textContent = "Speak L33T!";
  /**/ b1.className = "leetButton";
  /**/ document.querySelector("#output").appendChild(b1);

  function LeetSpeaker(elem) {
    return {
      listenClick() {
        this.listener = this.speakLeet.bind(this);
        elem.addEventListener("click", this.listener);
      },

      speakLeet(e) {
        const elem = e.currentTarget;
        alert(`1337 15 4W350M3`);
        elem.removeEventListener("click", this.listener);
      },
    };
  }

  const button = document.querySelector(".leetButton");
  const leetSpeaker = new LeetSpeaker(button);
  leetSpeaker.listenClick();
}

testLeetSpeakerWithBoundThis.title =
  "LeetSpeaker Object with bound <code>this</code>";
