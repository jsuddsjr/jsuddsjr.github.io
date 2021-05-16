function testSubmitForm() {
  const form = document.forms["search"];
  form.addEventListener("submit", search, false);

  /** @type {EventListener} */
  function search(event) {
    event.preventDefault();
    alert(`You searched for ${input.value}`);
  }
}

function testMakeHero() {
  const form = document.forms["heroForm"];
  form.addEventListener("submit", makeHero);

  /** @type {EventListener} */
  function makeHero(event) {
    // Exit early if validation did not pass.
    //if (event.defaultPrevented) return;
    event.preventDefault();

    const hero = {
      name: form.heroName.value,
      realName: form.realName.value,
      powers: [...form.powers]
        .filter((box) => box.checked)
        .map((box) => box.value),
      category: form.category.value,
      age: form.age.value,
      city: form.city.value,
      origin: form.origin.value,
    };

    // Form elements are arrays.
    console.log(form.category);

    // You can also get the selected index directly.
    console.log(form.city.options[form.city.selectedIndex].text);

    alert(JSON.stringify(hero));
    return hero;
  }
}

function testFormValidation() {
  /** @type {HTMLFormElement} */
  const form = document.forms.heroForm;
  form.addEventListener("submit", validate);

  /** @type {EventListener} */
  function validate(event) {
    const firstLetter = form.heroName.value[0];
    if (firstLetter.toUpperCase() === "X") {
      event.stopPropagation();
      alert("Your name is not allowed to start with X!");
    }
  }
}

function testFormValidationInline() {
  const form = document.forms[0];

  const label = form.querySelector("label");
  const error = document.createElement("div");
  error.classList.add("error");
  error.textContent = "! Your name is not allowed to start with X.";
  label.append(error);

  form.heroName.addEventListener('change', validateInline);

  function validateInline() {
    const heroName = this.value.toUpperCase();
    if (heroName.startsWith("X")) {
      error.style.display = "block";
    } else {
      error.style.display = "none";
    }
  }
}
