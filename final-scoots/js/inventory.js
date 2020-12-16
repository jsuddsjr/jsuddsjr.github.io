(function (d) {
  const container = d.querySelector("div.rentals");

  /** @type {HTMLDataListElement} */
  const options = d.querySelector("datalist#inventory");

  /** @typedef {Object} CostData
   * @property {{half:Number, full:Number}} reservation
   * @property {{half:Number, full:Number}} walk_in
   */

  /** @typedef {Object} InventoryData
   * @property {CostData} cost
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

  /**
   * Convert data into table.
   * @param {InventoryData} data
   */
  const toTable = (data) => {
    const rows = [];
    rows.push(`<tr><td colspan="2">${data.description}</td></tr>`);
    rows.push(
      `<tr><td><strong>Passengers</strong></td><td>${data.persons}</td></tr>`
    );
    rows.push(
      `<tr><td rowspan="2"><strong>Daily rates</strong></td><td>$${data.cost.walk_in.full} (Walk-ins)</td></tr>`
    );
    rows.push(`<tr><td>$${data.cost.reservation.full} (Reservation)</td></tr>`);
    rows.push(
      `<tr><td rowspan="2"><strong>Half-day rates</strong></td><td>$${data.cost.walk_in.half} (Walk-ins)</td></tr>`
    );
    rows.push(`<tr><td>$${data.cost.reservation.half} (Reservation)</td></tr>`);
    return "<table>" + rows.join("") + "</table>";
  };

  const invByType = {};
  const invById = {};

  const switchInventory = (value) => {
    if (!value) return;

    const inventory = invByType[value]
      ? d.getElementById(invByType[value].imageBase)
      : d.getElementById(value);

    if (inventory) {
      d.querySelectorAll(".inventory").forEach((el) => {
        el.classList.remove("selected");
        el.classList.add("hidden");
      });
      inventory.classList.remove("hidden");
      inventory.classList.add("selected");
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
            div.innerHTML += toTable(inv);

            div.innerHTML += `<a class="reservation" href="reservations.html#${inv.imageBase}">Reserve Now</a>`;

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
