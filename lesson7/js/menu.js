(function () {
  const menuState = document.getElementById("menu-state");
  const nav = document.querySelector("nav ul");
  const expanded = "expanded";

  const toggleMenu = (e) => {
    const isExpanded = nav.classList.toggle(expanded);
    menuState.setAttribute("aria-expanded", isExpanded);
    e.preventDefault();
  };

  const collapseMenu = (e) => {
    nav.classList.remove(expanded);
    menuState.setAttribute("aria-expanded", "false");
  };

  // Toggle menu state on click.
  menuState.addEventListener("click", toggleMenu);

    // Selecting a menu item closes the menu.
  document.querySelectorAll("nav a").forEach((el) => {
    el.addEventListener("click", collapseMenu);
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter") collapseMenu();
    });
  });

  // Add label to current menu item. (No Narrator support.)
  document
    .querySelector("nav a[href='#']")
    .setAttribute("aria-current", "location");

  // Collapse menu if focus moves elsewhere.
  document.body.addEventListener("focusin", (e) => {
    if (e.target !== menuState && !nav.contains(e.target)) {
      collapseMenu();
    }
  });

  // Collapse the menu if the window is resized.
  window.addEventListener("resize", collapseMenu);
})();
