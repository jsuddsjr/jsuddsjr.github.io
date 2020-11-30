(function (d) {
  /**
   * @typedef {Object} TownData
   * @property {String} bingMaps
   * @property {String} bingLevel
   */
  
  const locationToken = /{{location}}/g;
  const levelToken = /{{level}}/g;

  /**
   *
   * @param {String} str
   * @param {TownData} data
   */
  const replaceBingData = (str, data) => {
    return str
      .replace(locationToken, data.bingMaps)
      .replace(levelToken, data.bingLevel);
  };

  fetch("data/townData.json")
    .then((response) => response.json())
    .then((data) => {
      /** @type {TownData} */
      const townData = data[d.body.dataset.town || "preston"];

      [
        (d.getElementById("largeMapLink"), d.getElementById("dirMapLink")),
      ].forEach(
        /** @param {HTMLAnchorElement} a*/ (a) => {
          a.href = replaceBingData(a.href, townData);
        }
      );
      /** @type {HTMLIFrameElement} */
      const iframe = d.getElementById("bingMapsFrame");
      iframe.src = replaceBingData(iframe.src, townData);
    });
})(document);
