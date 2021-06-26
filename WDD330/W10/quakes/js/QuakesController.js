import { getLocation } from "./utilities.js";
import Quake from "./Quake.js";
import QuakesView from "./QuakesView.js";

// Quake controller
export default class QuakesController {
  /**
   *
   * @param {String} parent Parent element selector
   * @param {String} count Results indicator
   */
  constructor(parent, count) {
    this.parent = parent;
    this.count = count;
    // sometimes the DOM won't exist/be ready when the Class gets instantiated, so we will set this later in the init()
    this.parentElement = null;
    this.countElement = null;
    // let's give ourselves the option of using a location other than the current location by passing it in.
    this.position = {
      lat: 0,
      lon: 0,
    };
    this.initError = "";
    // this is how our controller will know about the model and view...we add them right into the class as members.
    this.quakes = new Quake();
    this.quakesView = new QuakesView();
    this.dateRange = null;
  }

  async init() {
    // use this as a place to grab the element identified by this.parent, do the initial call of this.initPos(), and display some quakes by calling this.getQuakesByRadius()
    this.parentElement = document.querySelector(this.parent);
    this.countElement = document.querySelector(this.count);
    const initOk = await this.initPos();
    if (initOk) {
      this.getQuakesByRadius(); // default values
      return Promise.resolve(this.getPosAsLocation());
    }
    return Promise.reject(false);
  }

  async initPos() {
    // if a position has not been set
    try {
      // try to get the position using getLocation()
      const position = await getLocation();
      // if we get the location back then set the latitude and longitude into this.position
      this.position = { lat: position.coords.latitude, lon: position.coords.longitude };
      return true;
    } catch (error) {
      this.initError = error.message;
      this.parentElement.innerHTML = `Failed to get position. (${this.initError}) You can enter a value manually, if you like.`;
      return false;
    }
  }

  async setPosFromLocation(location) {
    if (location && location.indexOf(",") !== -1) {
      const [lat, lon] = parseLocation(location);
      this.position = { lat, lon };
      return true;
    } else {
      return await this.initPos();
    }
  }

  getPosAsLocation() {
    return `${this.position.lat}, ${this.position.lon}`;
  }

  setDateRange(start, end) {
    if (start && end) {
      this.dateRange = { start: formatDate(start), end: formatDate(end) };
    } else {
      this.dateRange = null;
    }
  }

  async getQuakesByRadius(radius = 100, minmagnitude = 0) {
    // this method provides the glue between the model and view. Notice it first goes out and requests the appropriate data from the model, then it passes it to the view to be rendered.
    //set loading message
    this.parentElement.innerHTML = '<div class="loading"></div>';

    // get the list of quakes in the specified radius of the location
    const quakeList = await this.quakes.getEarthQuakesByRadius(this.position, radius, this.dateRange, minmagnitude);
    // render the list to html
    this.quakesView.renderQuakeList(quakeList, this.parentElement, this.countElement);
    // add a listener to the new list of quakes to allow drill down in to the details
    this.parentElement.addEventListener("click", (e) => {
      this.getQuakeDetails(e.target.dataset.id);
    });
  }

  async getQuakeDetails(quakeId) {
    // get the details for the quakeId provided from the model, then send them to the view to be displayed
  }
}

function formatDate(input, onerror = "") {
  try {
    const d = new Date(input);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay()}`;
  } catch (ex) {
    console.log(ex);
    return onerror;
  }
}

function parseLocation(input) {
  if (input.indexOf(",") !== -1) {
    return input.split(/,\s?/).map(parseFloat);
  }
  return [0, 0];
}
