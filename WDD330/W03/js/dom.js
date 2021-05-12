function testCreateDomElement() {
  function createElement(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
  }

  return createElement("li", "Aquaman");
}

function testReplaceTitleElement() {
  const h1 = document.getElementById("title");
  const oldText = h1.firstChild;
  const newText = document.createTextNode("Justice League of America");
  return h1.replaceChild(newText, oldText);
}
