import HikeModel from "./HikeModel.js";
import HikesView from "./HikesView.js";

/** @typedef {import("./HikeModel").Hike} Hike */

// Hike controller
export default class HikesController {
  /**
   * Constructor.
   * @param {String} parentId
   */
  constructor(parentId) {
    /** @type {HTMLUListElement|HTMLOListElement} */
    this.parentElement = document.getElementById(parentId);
    // this is how our controller will know about the model and view...we add them right into the class as members.
    this.hikeModel = new HikeModel();
    this.hikesView = new HikesView(parentId);
  }

  /**
   * This will get called each time we need to display our full hike list.
   * It should grab the list of hikes from the Model, and then send them to the view.
   */
  showHikeList() {
    this.hikesView.renderHikeList(
      this.hikeModel.getAllHikes(),
      this.parentElement
    );
    this.addHikeListener();
  }

  showOneHike(hikeName) {
    // use this when you need to show just one hike...with full details
    const hike = this.hikeModel.getHikeByName(hikeName);
    this.hikesView.renderOneHikeFull(hike, this.parentElement);
  }

  addHikeListener() {
    // for the stretch you will need to attach a listener to each of the listed hikes to watch for a touchend.
    [...this.parentElement.querySelectorAll("div[data-name]")].forEach((el) =>
      ["touchend", "click"].forEach((eventName) =>
        el.addEventListener(eventName, (event) => {
          /** @type {HTMLLIElement} */
          const li = event.currentTarget;
          this.showOneHike(li.dataset.name);
          this.parentElement
            .querySelector("button")
            .addEventListener("click", () => {
              this.showHikeList();
            });
        })
      )
    );
  }
}
