import CommentListView from "./Comments.js";
/** @typedef {import("./HikeModel").Hike} Hike */

// Hike View handler
export default class HikesView {
  /**
   * Optional list element ID
   * @param {String} listElementId
   */
  constructor(listElementId) {
    // you will need this
    this.imgBasePath = "images/";

    const listElement = document.getElementById(listElementId);
    if (
      listElement instanceof HTMLOListElement ||
      listElement instanceof HTMLUListElement
    ) {
      this.listElement = listElement;
    } else {
      throw new Error("Invalid list element ID specified in HikesView.");
    }
  }

  /**
   * Loop through our list of hikes building out the appropriate HTML
   * for each and append it to the listElement
   * @param {Hike[]} hikeList
   * @param {HTMLOListElement | HTMLUListElement} [listElement]
   */
  renderHikeList(hikeList, listElement) {
    listElement = listElement || this.listElement;

    listElement.innerHTML =
      "<li>" +
      hikeList.map((hike) => this.renderOneHikeLight(hike)).join("</li><li>") +
      "</li>";
  }

  /**
   * This method will be used to create the list of hikes with less detail:
   * name, image, distance, difficulty.
   * @param {Hike} hike
   * @param {String[]} props
   */
  renderOneHikeLight(hike, ...props) {
    props = props.length ? props : ["distance", "difficulty"];

    return (
      /*html*/ `<div class="hikeLight" data-name="${hike.name}"><h3>${hike.name}</h3>` +
      this.renderHikeImage(hike, "thumb") +
      props.map((prop) => this.renderHikeProperty(hike, prop)).join("") +
      "</div>"
    );
  }

  /**
   * Displays all hike properties.
   * @param {Hike} hike
   * @param {HTMLElement} parentElement
   * @param {String[]} [filter]
   */
  renderOneHikeFull(hike, parentElement, filter = []) {
    // this method will be used to one hike with full detail...
    // you will need this for the stretch goal!

    if (!parentElement) {
      throw new Error("Can't render to missing `parentElement`");
    }

    parentElement.innerHTML =
      /*html*/ `<div class='hikeFull' data-name="${hike.name}">` +
      /*html*/ `<div class="header"><h2>${hike.name}</h2><button title="Close"></button></div>` +
      this.renderHikeImage(hike, "detail") +
      Object.keys(hike)
        .filter((prop) => !filter.includes(prop))
        .map((prop) => this.renderHikeProperty(hike, prop))
        .join("") +
      "</div>";
  }

  /**
   *
   * @param {Hike} hike
   * @param {String} property
   */
  renderHikeProperty(hike, property) {
    if (property.startsWith("img") || !hike[property]) {
      return "";
    }
    const propTitle = property[0].toUpperCase() + property.substr(1);
    return /*html*/ `<div class="property ${property}"><div>${propTitle}</div><p>${hike[property]}</p></div>`;
  }

  /**
   *
   * @param {Hike} hike
   * @param {String} size
   * @returns
   */
  renderHikeImage(hike, size) {
    if (!hike.imgSrc) {
      throw new Error("Hike missing `imgSrc` property.");
    }
    // TODO: Because the original media was too large.
    const src = hike.imgSrc.replace(/.jpg/, `-${size}.webp`);
    return /*html*/ `<div class="image"><img src="${this.imgBasePath}${src}" alt="${hike.imgAlt}"/></div>`;
  }
}
