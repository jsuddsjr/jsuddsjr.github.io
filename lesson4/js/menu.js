(function () {
  const hamburger = document.getElementById("hamburger");
  const menuState = document.getElementById("menu-state");
  const nav = document.querySelector("nav");

  // Selecting a menu item closes the menu.
  document.querySelectorAll("nav a").forEach((el) => {
    el.addEventListener("click", (e) => (hamburger.checked = false));
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        hamburger.checked = false;
      }
    });
  });

  // Add label to current menu item. (No Narrator support.)
  document
    .querySelector("nav a[href='#']")
    .setAttribute("aria-current", "location");

  // Collapse menu if focus moves elsewhere.
  document.body.addEventListener("focusin", (e) => {
    if (!nav.contains(e.target)) {
      hamburger.checked = false;
    }
  });

  // Collapse the menu if the window is resized.
  window.addEventListener("resize", (e) => {
    hamburger.checked = false;
  });

  // Keyboard support for expand/collapse.
  menuState.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      hamburger.checked = !hamburger.checked;
      e.preventDefault();
    }
  });

  // Update expand state when checkbox changes.
  hamburger.addEventListener(
    "change",
    (e) => (menuState.ariaExpanded = hamburger.checked)
  );
})();
