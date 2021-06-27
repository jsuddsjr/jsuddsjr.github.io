import buildNavigation from "./routing.js";

// Quake View handler
export default class QuakesView {
  constructor(detailController) {
    this.controller = detailController;
  }

  renderQuakeList(quakeList, listElement, resultsElement) {
    //build a list of the quakes...include the title and time of each quake then append the list to listElement. You should also add the id of the quake record as a data- property to the li. ie. <li data-id="">
    // listElement.innerHTML = quakeList.features
    //   .map((quake) => `<li data-id="${quake.id}">${quake.properties.title}, ${new Date(quake.properties.time)}</li>`)
    //   .join("");

    const file = "views/detail.html";

    buildNavigation(
      listElement,
      quakeList.map((quake) => ({
        file,
        controller: this.controller,
        label: `${quake.properties.title}, ${new Date(quake.properties.time)}`,
        id: quake.id,
      }))
    );

    if (resultsElement) resultsElement.textContent = quakeList.features.length;
  }

  renderQuake(quake, element) {
    const quakeProperties = Object.entries(quake.properties);
    // for the provided quake make a list of each of the properties associated with it. Then append the list to the provided element. Notice the first line of this method. Object.entries() is a slick way to turn an object into an array so that we can iterate over it easier!
  }
}
