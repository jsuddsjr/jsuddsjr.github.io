/**
 * @typedef {Object} Hike
 * @property {String} name
 * @property {String} imgSrc
 * @property {String} imgAlt
 * @property {String} distance
 * @property {String} difficulty
 * @property {String} description
 * @property {String} directions
 */

// normally the model would have more going on...retrieving the hikes from a database,
// adding hikes, editing hikes, filtering, etc. Our model will be very simple.  We could
// simply export the hikeList, but a better pattern would be to create a 'getter' function
// to do it instead. That way as our model changed...we could simply change the getter function
// and anything using it should be able to remain the same.

/** @type {Hike[]} */
const hikeList = [
  {
    name: "Bechler Falls",
    imgSrc: "falls.jpg",
    imgAlt: "Image of Bechler Falls",
    distance: "3 miles",
    difficulty: "Easy",
    description:
      "Beautiful short hike along the Bechler river to Bechler Falls",
    directions:
      "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road.Drive to the end of the Cave Falls road. There is a parking area at the trailhead.",
  },
  {
    name: "Teton Canyon",
    imgSrc: "falls.jpg",
    imgAlt: "Image of Teton Canyon",
    distance: "3 miles",
    difficulty: "Easy",
    description:
      "Beautiful short hike along the Bechler river to Bechler Falls",
    directions:
      "Take Highway 33 East to Driggs. Turn left onto Teton Canyon Road. Follow that road for a few miles then turn right onto Staline Raod for a short distance, then left onto Alta Road. Veer right after Alta back onto Teton Canyon Road. There is a parking area at the trailhead.",
  },
  {
    name: "Denanda Falls",
    imgSrc: "falls.jpg",
    imgAlt: "Image of Denanda Falls",
    distance: "3 miles",
    difficulty: "Easy",
    description:
      "Beautiful short hike along the Bechler river to Bechler Falls",
    directions:
      "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road. Drive to until you see the sign for Bechler Meadows on the left. Turn there. There is a parking area at the trailhead.",
  },
];

// Hike Model
export default class HikeModel {
  constructor() {
    // We need a constructor...but in this case it isn't doing much
  }

  /**
   * @returns {Hike[]} A copy of hike list.
   */
  getAllHikes() {
    // should return a list of all the hikes.
    // NEVER return the original array; malicious users can modify and destroy data.
    return JSON.parse(JSON.stringify(hikeList));
  }

  /**
   * Add a hike to the array.
   * @param {Hike} hike
   * @throws If `hike` is missing required properties.
   */
  addHike(hike) {
    const propSet = new Set(Object.keys(hike));
    if (!Object.keys(hikeList[0]).every((prop) => propSet.has(prop))) {
      throw new Error("Object missing one or more hike properties.");
    }
    hikeList.push(hike);
  }

  /**
   * Delete hike by name.
   * @param {String} hikeName
   * @returns True if hike was deleted.
   */
  removeHikeByName(hikeName) {
    const hike = this.getHikeByName(hikeName);
    return this.removeHike(hike);
  }

  /**
   * Remove specified hike. Hike must be reference to existing hike.
   * @param {Hike} hike
   * @returns True if hike was deleted.
   */
  removeHike(hike) {
    if (hike) {
      const index = hikeList.indexOf();
      if (index >= 0) {
        hikeList.splice(index, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * Find first hike with specified name.
   * @param {String} hikeName
   * @returns
   */
  getHikeByName(hikeName) {
    // filter the hikes for the record identified by hikeName and return it
    return this.getHikeByProperty("name", hikeName);
  }

  /**
   * Find by specified property name and value.
   * @param {String} propName Hike property.
   * @param {String} propValue Hike value.
   * @throws `propName` is not valid hike property.
   */
  getHikeByProperty(propName, propValue) {
    if (!this.getHikeProperties().has(propName)) {
      throw new Error("Unrecognized hike property.");
    }
    return hikeList.find((el) => el[propName] === propValue);
  }

  /**
   * Get standard hike properties.
   * @param {Hike} [hike]
   * @returns A new set containing hike properties.
   */
  getHikeProperties(hike) {
    hike = hike || hikeList[0]
    return new Set(Object.keys(hike));
  }
}
