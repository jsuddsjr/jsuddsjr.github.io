(function (d) {
  const expanded = "expanded";

  let currentLocation = d.location.href;
  if (currentLocation[currentLocation.length - 1] === "/") {
    currentLocation += "index.html";
  }

  const navList = d.querySelector("nav ul");
  const menuRoot = d.querySelector("nav");

  const toggleMenu = (e) => {
    const isExpanded = navList.classList.toggle(expanded);
    menuRoot.setAttribute("aria-expanded", isExpanded);
    e.preventDefault();
  };

  const collapseMenu = (e) => {
    navList.classList.remove(expanded);
    menuRoot.setAttribute("aria-expanded", "false");
  };

  // Selecting a menu item closes the menu.
  d.querySelectorAll("nav a").forEach(
    /** @param {HTMLAnchorElement} el */ (el) => {
      el.addEventListener("click", collapseMenu);
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter") collapseMenu();
      });
      if (currentLocation.indexOf(el.href) === 0) {
        el.parentElement.classList.add("active");
        // Add label to current menu item. (No Narrator support.)
        el.setAttribute("aria-current", "location");
      }
    }
  );

  // Toggle menu state on click.
  menuRoot && menuRoot.addEventListener("click", toggleMenu);

  // Collapse menu if focus moves elsewhere.
  d.body.addEventListener("focusin", (e) => {
    if (!menuRoot.contains(e.target)) {
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
            ul.innerHTML = data.inventory
              .map(
                (desc) =>
                  `<li><a tabindex="-1" role="menuitem" href="${menuAnchor.href}?id=${desc.imageBase}">${desc.type}</a></li>`
              )
              .join("");

            const subMenuOptions = [...ul.querySelectorAll("li > a")];
            if (subMenuOptions.length) ul.style.display = "block";

            /**
             * 
             * @param {Boolean} toggle
             */
            const toggleSubMenu = (toggle) => {
              menuAnchor.setAttribute("aria-expanded", toggle.toString());
              subMenuOptions.forEach(
                /** @param {HTMLAnchorElement} a */ (a) =>
                  (a.tabIndex = toggle ? 0 : -1)
              );
            };

            /**
             * Toggle the menu with the keyboard.
             * @param {KeyboardEvent} e
             */
            const handleKey = (e) => {
              switch (e.code) {
                case "ArrowDown":
                case "Enter":
                case "Space":
                  const toggle =
                    menuAnchor.getAttribute("aria-expanded") !== "true";
                  toggleSubMenu(toggle);
                  e.preventDefault();
                  break;
                case "ArrowUp":
                case "ArrowLeft":
                case "ArrowRight":
                  toggleSubMenu(false);
                  break;
              }
            };

            menuAnchor.addEventListener("keydown", handleKey);
            d.addEventListener('focusin', e => {
              if (e.target !== menuAnchor && !subMenuOptions.includes(e.target)) {
                toggleSubMenu(false);
              }
            });
          }
        );
      }
    );
})(document);
