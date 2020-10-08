(function () {
  const hamburger = document.getElementById("hamburger");
  const menuState = document.getElementById("menu-state");

  // Selecting a menu item closes the menu.
  document
    .querySelectorAll("nav a")
    .forEach((el) =>
      el.addEventListener("click", (e) => (hamburger.checked = false))
    );

  menuState.addEventListener("keypress", (e) => {
    if (e.  key === "Enter" || e.key === " ") {
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
