/** @typedef {import("./HikeModel").Hike} Hike */

// Hike View handler
export default class HikesView {
  /**
   * Optional list element ID
   * @param {String} listElementId
   */
  constructor(listElementId) {
    // you will need this
    this.imgBasePath = "//byui-cit.github.io/cit261/examples/";
    this.listElementId = listElementId;
  }

  /**
   *
   * @param {Hike[]} hikeList
   * @param {HTMLOListElement | HTMLUListElement} [listElement]
   */
  renderHikeList(hikeList, listElement) {
    // loop through our list of hikes building out the appropriate HTML
    // for each and append it to the listElement

    listElement = listElement || document.getElementById(this.listElementId);

    if (!listElement) {
      throw new Error("Can't render to missing `listElement`");
    }

    listElement.innerHTML =
      "<li>" +
      hikeList.map(this.renderOneHikeLight).join("</li><li>") +
      "</li>";
  }

  /**
   *
   * @param {Hike} hike
   * @param {String[]} props
   */
  renderOneHikeLight(hike, ...props) {
    // this method will be used to create the list of hikes with less detail:
    // name, image, distance, difficulty.

    props = props || ["name", "distance", "difficulty"];

    return (
      "<div class='hikeLight'>" +
      renderHikeImage(hike) +
      props.map((prop) => renderHikeProperty(hike, prop)).join("") +
      "</div>"
    );
  }

  /**
   *
   * @param {Hike} hike
   * @param {HTMLElement} parentElement
   */
  renderOneHikeFull(hike, parentElement) {
    // this method will be used to one hike with full detail...
    // you will need this for the stretch goal!

    if (!parentElement) {
      throw new Error("Can't render to missing `parentElement`");
    }

    parentElement.innerHTML =
      "<div class='hikeFull'>" +
      renderHikeImage(hike) +
      Object.keys(hike)
        .filter((prop) => !prop.startsWith("img"))
        .map((prop) => renderHikeProperty(hike, prop))
        .join("") +
      "</div>";
  }
}

// PRIVATE METHODS

/**
 *
 * @param {Hike} hike
 * @param {String} property
 */
function renderHikeProperty(hike, property) {
  if (!hike[property]) {
    return "";
  }
  const propTitle = property[0].toUpperCase() + property.substr(1);
  return `<div class="${property}"><div>${propTitle}</div><div>${hike[property]}</div></div>`;
}

/**
 *
 * @param {Hike} hike
 * @returns
 */
function renderHikeImage(hike) {
  if (!hike.imgSrc) {
    throw new Error("Hike missing `imgSrc` property.");
  }
  return `<img src="${imgBasePath}${hike.imgSrc}" alt="${hike.imgAlt} />`;
}
