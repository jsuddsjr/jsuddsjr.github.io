function doSomething(event) {
  alert(
    `${event.type} @ screen: (${event.screenX},${event.screenY}), page: (${event.pageX},${event.pageY}), client: (${event.screenX},${event.screenY})`
  );
}
// addEventListener("click", doSomething);

function highlight(event) {
  event.target.classList.toggle("highlight");
}

function testKeyboardEvents() {
  addEventListener("keydown", highlight);
  addEventListener("keypress", (event) =>
    alert(`You pressed the ${event.key} character`)
  );
}

function testTouchEvents() {
  addEventListener("touchend", () => alert("Touch stopped"));
}

function testEventHighlights() {
  function highlight(event) {
    event.target.classList.toggle("highlight");
  }

  const clickParagraph = document.getElementById("click");
  clickParagraph?.addEventListener("click", highlight);
  clickParagraph?.addEventListener("mousedown", () => console.log("down"));
  clickParagraph?.addEventListener("mouseup", () => console.log("up"));

  const dblclickParagraph = document.getElementById("dblclick");
  dblclickParagraph?.addEventListener("dblclick", highlight);

  const mouseParagraph = document.getElementById("mouse");
  mouseParagraph?.addEventListener("mouseover", highlight);
  mouseParagraph?.addEventListener("mouseout", highlight);
}

testEventHighlights.associatedHtml = `
<section>
    <p id="click">Click On Me</p>
    <p id="dblclick">Double Click On Me</p>
    <p id="mouse">Hover On Me</p>
</section>
`;

function testRemoveEvent() {
  const onceParagraph = document.getElementById("once");
  onceParagraph?.addEventListener("click", remove);

  function remove(event) {
    alert("Enjoy this while it lasts!");
    event.target.style.backgroundColor = "pink";
    event.target.removeEventListener("click", remove);
  }
}

testRemoveEvent.associatedHtml = `
<section><p id="once">A One Time Thing</p></section>
`;

function testPreventDefaultBehavior() {
  const brokenLink = document.getElementById("broken");
  brokenLink?.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Broken Link!");
  });
}

testPreventDefaultBehavior.associatedHtml = `
<section><p>
  <a id="broken" href="https://sitepoint.com">Broken Link</a>
</p></section>
`;

function testEventPropagation() {
  const ulElement = document.getElementById("list");
  const liElement = document.querySelector("#list li");

  // capturing
  ulElement?.addEventListener(
    "click",
    (event) => alert("CAPTURE: Clicked on ul"),
    true
  );
  liElement?.addEventListener(
    "click",
    (event) => alert("CAPTURE: Clicked on li"),
    true
  );

  // bubbling
  ulElement?.addEventListener(
    "click",
    (event) => alert("BUBBLE: Clicked on ul"),
    false
  );
  liElement?.addEventListener(
    "click",
    (event) => alert("BUBBLE: Clicked on li"),
    false
  );

  // stop propagation
  document.querySelector("#two")?.addEventListener(
    "click",
    (event) => {
      alert("PREVENT DEFAULT: Clicked on two");
      event.stopPropagation();
    },
    false
  );
}

testEventPropagation.associatedHtml = `
<ul id='list'>
    <li>one</li>
    <li id='two'>two</li>
    <li>three</li>
</ul>`;
