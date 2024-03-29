(function (d) {
  const expanded = "expanded";

  let currentLocation = d.location.href;
  if (currentLocation[currentLocation.length - 1] === "/") {
    currentLocation += "index.html";
  }

  const navList = d.querySelector("nav ul");
  const menuState = d.getElementById("menu-state");

  const toggleMenu = (e) => {
    const isExpanded = navList.classList.toggle(expanded);
    menuState.setAttribute("aria-expanded", isExpanded);
    e.preventDefault();
  };

  const collapseMenu = (e) => {
    navList.classList.remove(expanded);
    menuState.setAttribute("aria-expanded", "false");
  };

  // Selecting a menu item closes the menu.
  d.querySelectorAll("nav a").forEach(
    /** @param {HTMLAnchorElement} el */ (el) => {
      el.addEventListener("click", collapseMenu);
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter") collapseMenu();
      });
      if (currentLocation === el.href) {
        el.href = "#";
        // Add label to current menu item. (No Narrator support.)
        el.setAttribute("aria-current", "location");
      }
    }
  );

  // Toggle menu state on click.
  menuState.addEventListener("click", toggleMenu);

  // Collapse menu if focus moves elsewhere.
  d.body.addEventListener("focusin", (e) => {
    if (e.target !== menuState && !navList.contains(e.target)) {
      collapseMenu();
    }
  });

  // Collapse the menu if the window is resized.
  window.addEventListener("resize", collapseMenu);
})(document);
