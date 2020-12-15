"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function (d) {
  var expanded = "expanded";
  var currentLocation = d.location.href;

  if (currentLocation[currentLocation.length - 1] === "/") {
    currentLocation += "index.html";
  }

  var navList = d.querySelector("nav ul");
  var menuRoot = d.querySelector("nav");
  /** @param {MouseEvent} e */

  var toggleMenu = function toggleMenu(e) {
    var isExpanded = navList.classList.toggle(expanded);
    menuRoot.setAttribute("aria-expanded", isExpanded);
    if (e.currentTarget === e.target) e.preventDefault();
  };

  var collapseMenu = function collapseMenu(e) {
    navList.classList.remove(expanded);
    menuRoot.setAttribute("aria-expanded", "false");
  }; // Selecting a menu item closes the menu.


  d.querySelectorAll("nav a").forEach(
  /** @param {HTMLAnchorElement} el */
  function (el) {
    el.addEventListener("click", collapseMenu);
    el.addEventListener("keypress", function (e) {
      if (e.key === "Enter") collapseMenu();
    });

    if (currentLocation.indexOf(el.href) === 0) {
      el.parentElement.classList.add("active"); // Add label to current menu item. (No Narrator support.)

      el.setAttribute("aria-current", "location");
    }
  }); // Toggle menu state on click.

  menuRoot && menuRoot.addEventListener("click", toggleMenu); // Collapse menu if focus moves elsewhere.

  d.body.addEventListener("focusin", function (e) {
    if (!menuRoot.contains(e.target)) {
      collapseMenu();
    }
  }); // Collapse the menu if the window is resized.

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

  fetch("data/inventory.json").then(function (response) {
    return response.json();
  }).then(
  /** @param {Data} data */
  function (data) {
    d.querySelectorAll("nav .drop-menu").forEach(
    /** @param {HTMLUListElement} ul */
    function (ul) {
      /** @type {HTMLAnchorElement} */
      var menuAnchor = ul.parentElement.children[0];
      ul.innerHTML = data.inventory.map(function (desc) {
        return "<li><a tabindex=\"-1\" role=\"menuitem\" href=\"".concat(menuAnchor.href, "?id=").concat(desc.imageBase, "\">").concat(desc.type, "</a></li>");
      }).join("");

      var subMenuOptions = _toConsumableArray(ul.querySelectorAll("li > a"));

      if (subMenuOptions.length) ul.style.display = "block";
      /**
       * 
       * @param {Boolean} toggle
       */

      var toggleSubMenu = function toggleSubMenu(toggle) {
        menuAnchor.setAttribute("aria-expanded", toggle.toString());
        subMenuOptions.forEach(
        /** @param {HTMLAnchorElement} a */
        function (a) {
          return a.tabIndex = toggle ? 0 : -1;
        });
      };
      /**
       * Toggle the menu with the keyboard.
       * @param {KeyboardEvent} e
       */


      var handleKey = function handleKey(e) {
        switch (e.code) {
          case "ArrowDown":
          case "Space":
            var toggle = menuAnchor.getAttribute("aria-expanded") !== "true";
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
      d.addEventListener('focusin', function (e) {
        if (e.target !== menuAnchor && !subMenuOptions.includes(e.target)) {
          toggleSubMenu(false);
        }
      });
    });
  });
})(document);