(function (d) {
  const container = d.querySelector("div.rentals");

  /** @type {HTMLDataListElement} */
  const options = d.querySelector("datalist#inventory");

  /** @typedef {Object} InventoryData
   * @property {Object} cost
   * @property {String} description
   * @property {String} imageBase
   * @property {Number} persons
   * @property {String} type
   */

  /**
   * Convert image base into picture HTML.
   * @param {String} imageBase
   * @param {String} alt
   */
  const formatImage = (imageBase, alt) => {
    const set = [800, 400]
      .map(
        (size) =>
          `<source media="(min-width: ${
            size * 1.5
          }px)" srcset="images/${imageBase}-${size}h.webp" >`
      )
      .join("");
    const img = `<img src="images/${imageBase}-200h.webp" alt="${alt}"/>`;
    return `<picture>${set}${img}</picture>`;
  };

  const invByType = {};
  const invById = {};

  const switchInventory = (value) => {
    if (!value) return;

    const inventory = invByType[value]
      ? d.getElementById(invByType[value].imageBase)
      : d.getElementById(value);

    if (inventory) {
      d.querySelectorAll(".inventory").forEach(
        (el) => (el.style.display = "none")
      );
      inventory.style.display = "block";
    }

    if (options && invById[value]) {
      options.parentElement.children[0].value = invById[value].type;
    }
  };

  fetch("data/inventory.json")
    .then((response) => response.json())
    .then(
      /** @param {{inventory:Array<InventoryData>} data */
      (data) => {
        data.inventory.forEach((inv) => {
          invByType[inv.type] = inv;
          invById[inv.imageBase] = inv;

          if (container) {
            const bookmark = d.createElement("A");
            bookmark.name = inv.imageBase;
            container.appendChild(bookmark);

            const div = d.createElement("DIV");
            div.className = "inventory";
            div.id = inv.imageBase;

            div.innerHTML = formatImage(inv.imageBase, inv.type);

            if (options) {
                div.innerHTML += `<a class="reservation" href="reservations.html#${inv.imageBase}">Reserve Now</a>`;
            }

            container.appendChild(div);
          }

          if (options) {
            options.innerHTML += `<option id="${inv.imageBase}">${inv.type}</option>`;
          }
        });

        // Select the correct item.
        switchInventory(d.location.hash.substring(1));
      }
    )
    .then(() => container.dispatchEvent(new Event("inventoryLoaded")));

  if (options && container) {
    /** @type {HTMLInputElement} */
    const input = options.parentElement.children[0];
    input.addEventListener("change", (e) => {
      switchInventory(e.target.value);
    });
  }

  window.addEventListener("hashchange", (e) => {
    var hash = e.target.location.hash.substring(1);
    switchInventory(hash);
  });
})(document);
