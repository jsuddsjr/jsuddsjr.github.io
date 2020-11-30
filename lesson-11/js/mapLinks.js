(function (d) {
  /**
   * @typedef {Object} TownData
   * @property {String} bingMaps
   */

  fetch("data/townData.json")
    .then((response) => response.json())
    .then((data) => {
      /** @type {TownData} */
      const townData = data[d.body.dataset.town || "preston"];
      const locationToken = "{{location}}";
      
      [
        (d.getElementById("largeMapLink"), d.getElementById("dirMapLink"))
      ].forEach(
        /** @param {HTMLAnchorElement} a*/ (a) => {
          a.href = a.href.replace(locationToken, townData.bingMaps);
        }
      );
      /** @type {HTMLIFrameElement} */
      const iframe = d.getElementById("bingMapsFrame");
      iframe.src = iframe.src.replace(locationToken, townData.bingMaps);
    });
})(document);
