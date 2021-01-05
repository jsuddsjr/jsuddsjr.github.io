(function (d) {
  const container = d.querySelector(".weather");

  /**
   * Create sub-grids that align across all columns.
   * @param {HTMLElement} container
   */
  const alignItems = () => {
    const columns = window
      .getComputedStyle(container)
      .gridTemplateColumns.split("px ").length;

    // Do not align single columns.
    if (columns === 1) {
      [...container.children].forEach(
        (child) => (child.style.display = "inline-block")
      );
      return;
    }

    // Slice off the template element.
    chunk([...container.children].slice(1), columns).forEach(
      /** @param {HTMLElement[]} children */
      (children) => {
        // Compute height of all children in this row.
        const sizes = children.map((item) => {
          item.style.display = "inline-block";
          return [...item.children].map(computeElementHeight);
        });

        // Create fixed row template of maximum heights.
        const rowTemplate = sizes
          .reduce((p, c) => c.map((n, i) => Math.max(p[i], n)), sizes[0])
          .map((n) => `${n.toFixed(1)}px`)
          .join(" ");

        // Apply row template to all sub-grids.
        children.forEach((item) => {
          item.style.display = "grid";
          item.style.gridTemplateRows = rowTemplate;
        });
      }
    );
  };

  /**
   * Chunk larger array into sub-arrays.
   * @param {any[]} arr
   * @param {number} size
   */
  const chunk = (arr, size) =>
    Array.from(
      {
        length: Math.ceil(arr.length / size),
      },
      (_, i) => arr.slice(i * size, i * size + size)
    );

  /**
   * Calculate height of element, including margins.
   * @param {HTMLElement} item
   */
  const computeElementHeight = (item) => {
    const style = window.getComputedStyle(item);
    const height = ["margin-top", "margin-bottom"]
      .map((k) => parseInt(style.getPropertyValue(k)))
      .map((n) => (Number.isNaN(n) ? 0 : n))
      .reduce((prev, cur) => prev + cur, item.getBoundingClientRect().height);
    return height;
  };

  window.addEventListener("resize", alignItems);
  // container.addEventListener("weatherLoad", alignItems);
})(document);
