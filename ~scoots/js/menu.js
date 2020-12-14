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
        el.parentElement.classList.add("active");
        // Add label to current menu item. (No Narrator support.)
        el.setAttribute("aria-current", "location");
      }
    }
  );

  // Toggle menu state on click.
  menuState && menuState.addEventListener("click", toggleMenu);

  // Collapse menu if focus moves elsewhere.
  d.body.addEventListener("focusin", (e) => {
    if (e.target !== menuState && !navList.contains(e.target)) {
      collapseMenu();
    }
  });

  // Collapse the menu if the window is resized.
  window.addEventListener("resize", collapseMenu);

  /**
   * @typedef {Object} InventoryDescriptor
   * @property {String} imageBase
   * @property {String} type
   */

  /**
   * @typedef {Object} Data
   * @property {Array<InventoryDescriptor>} inventory
   */

  // Add sub-menu items from inventory data.
  fetch("data/inventory.json")
    .then((response) => response.json())
    .then(
      /** @param {Data} data */ (data) => {
        d.querySelectorAll("nav .drop-menu").forEach(
          /** @param {HTMLUListElement} ul */ (ul) => {
            /** @type {HTMLAnchorElement} */
            const menuAnchor = ul.parentElement.children[0];
            const div = d.createElement("DIV");
            data.inventory.forEach((desc) => {
              div.innerHTML += `<li><a href="${menuAnchor.href}?id=${desc.imageBase}">${desc.type}</a></li>`;
            });
            ul.appendChild(div);
          }
        );
      }
    );
})(document);
