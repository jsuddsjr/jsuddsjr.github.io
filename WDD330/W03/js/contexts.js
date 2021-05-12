function testGlobalContext() {
  return this;
}

testGlobalContext.title = "<code>this</code> in the global context";

function testObjectConstruction() {
  function Human(age) {
    this.age = age;
  }

  let greg = new Human(22);
  let thomas = new Human(24);

  log(greg); // this.age = 22
  log(thomas); // this.age = 24
}

testObjectConstruction.title = "<code>this</code> in object construction";

function testObjectMethod() {
  function Human(name) {
    return {
      name,
      getName() {
        return this.name;
      },
    };
  }

  const zell = Human("Zell");
  const vincy = Human("Vincy");

  log(zell.getName()); // Zell
  log(vincy.getName()); // Vincy
}

testObjectMethod.title = "<code>this</code> in an object method";

function testSimpleFunction() {
  function simpleFunction() {
    log(this);
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

  document
    .querySelector(".timeoutButton")
    ?.addEventListener("click", () => { o.doSomethingLater() });
}

testSetTimeoutError.title =
  "<code>setTimeout</code> doesn't preserve the <code>this</code> reference";
testSetTimeoutError.associatedHtml = `
  <button class="timeoutButton">Do something later</button>
`;

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

  document
    .querySelector(".timeoutWithRef")
    ?.addEventListener("click", () => { o.doSomethingLater() });
}

testSetTimeoutCorrect.title = "Saving a reference to <code>this</code>";
testSetTimeoutCorrect.associatedHtml = `
  <button class="timeoutWithRef">Do something later</button>
`

function testThisInArrowFunction() {
  const o = {
    doSomethingLater() {
      setTimeout(() => this.speakLeet(), 1000);
    },
    speakLeet() {
      alert(`Arrow Function says, "1337 15 4W350M3"`);
    },
  };

  document
    .querySelector(".timeoutArrowFunc")
    ?.addEventListener("click", () => { o.doSomethingLater() });
}

testThisInArrowFunction.associatedHtml = `
<button class="timeoutArrowFunc">Do something later</button>
`

function testThisInEventListener() {
  const button = document.querySelector(".eventButton");

  button?.addEventListener("click", function () {
    alert(this); // button
  });

  button?.addEventListener("click", () => {
    alert(this); // Window
  });
}

testThisInEventListener.title = "<code>this</code> in an event listener";
testThisInEventListener.associatedHtml = `
  <button class="eventButton">Click me!</button>
`;

function testLeetSpeakerWithBoundThis() {
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
  const leetSpeaker = LeetSpeaker(button);
  leetSpeaker.listenClick();
}

testLeetSpeakerWithBoundThis.title =
  "LeetSpeaker Object with bound <code>this</code>";
testLeetSpeakerWithBoundThis.associatedHtml = `
  <button class="leetButton">Speak L33T</button>
`;
