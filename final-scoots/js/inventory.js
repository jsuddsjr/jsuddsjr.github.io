(function (d) {
  const container = d.querySelector("div.rentals");

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
    const img = `<img src="images/${imageBase}-200h.webp" alt="${alt}"/>`
    return `<picture>${set}${img}</picture>`;
  };

  fetch("data/inventory.json")
    .then((response) => response.json())
    .then(
      /** @param {{inventory:Array<InventoryData>} data */
      (data) =>
        data.inventory.forEach((inv) => {
          console.log(inv);

          const bookmark = d.createElement("A");
          bookmark.name = inv.imageBase;
          container.appendChild(bookmark);

          const div = d.createElement("DIV");
          
          div.className = "inventory";
          div.innerHTML = formatImage(inv.imageBase, inv.type);

          container.appendChild(div);
        })
    );
})(document);
