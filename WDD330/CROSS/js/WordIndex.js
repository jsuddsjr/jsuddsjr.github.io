import Subscribers from "./Subscribers.js";
import ShapeModel from "./ShapeModel.js";

/** @type {Map<string, string[]} */
const index = new Map();
/** @type {Map<number, string[]} */
const indexSize = new Map();
let loading = false;
let loaded = false;

const subscribers = new Subscribers(index);
const LOADED_EVENT = "loaded";
const FAILED_EVENT = "failed";

export default class WordIndex {
  constructor() {
    if (!loading && !loaded) {
      loadIndex().then((loadedOk) => {
        loaded = loadedOk;
        subscribers.notify(loadedOk ? LOADED_EVENT : FAILED_EVENT);
      });
    }
  }

  /**
   * @returns True, if loaded.
   */
  isLoaded = () => loaded;

  /**
   * JEST: reset global values.
   */
  static reset() {
    index.clear();
    indexSize.clear();
    loaded = loading = false;
  }

  /**
   * Get words that match the specified shape.
   * Shape can contain 0/1 for vowel/cons, dot (.) for any or letter.
   * @param {String} shape
   * @returns
   */
  getWordsByShape(shape) {
    shape = shape.replace(/\s/g, ".");
    const types = new Set(shape);

    if (types.size > 3 || ShapeModel.letterMatch.test(shape)) {
      const wordMatch = new RegExp("^" + shape.replace(ShapeModel.shapeMatch, "."));
      const simpleShape = shape.replace(new RegExp(ShapeModel.letterMatch, "g"), (sub) => {
        return /[aeiou]/.test(sub) ? "0" : "1";
      });
      return matchShapeSimple(simpleShape).filter((w) => wordMatch.test(w));
    }

    if (types.has(ShapeModel.anyType)) {
      return matchShapeSimple(shape);
    }

    // Just VOWEL and CONSONANT.
    return index.get(shape) || [];
  }

  /**
   * Get notification when index is loaded.
   * @param {import("./Subscribers.js").NotifyFunc} cb
   * @returns this
   */
  onLoaded(cb) {
    if (loaded) {
      cb(index);
    } else {
      subscribers.subscribe(LOADED_EVENT, cb);
    }
    return this;
  }

  /**
   * Get notification if index fails to load.
   * @param {import("./Subscribers.js").NotifyFunc} cb
   * @returns this
   */
  onFailed(cb) {
    subscribers.subscribe(FAILED_EVENT, cb);
    return this;
  }
}

/**
 * Fetch data from server. Can only be called once.
 */
async function loadIndex() {
  if (loading) {
    throw new Error("LoadIndex called while loading in progress.")
  }

  loading = true;

  const response = await fetch("data/wordShape.txt");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  const text = await response.text();

  for (let line of text.split(/\r?\n/g)) {
    const [key, ...words] = line.split(",");
    index.set(key, words);

    // Index by size of key.
    const keyLen = key.length;
    const sizeArr = indexSize.get(keyLen) || [];
    if (sizeArr.length === 0) {
      indexSize.set(keyLen, sizeArr);
    }
    sizeArr.push(key);
  }

  // Enable reload, if needed.
  loading = false;
  return true;
}

/**
 * Combine list of words that match shape.
 * @param {String} shape
 * @returns
 */
function matchShapeSimple(shape) {
  /** @type {String[]} */
  const results = [];
  const shapesByLen = indexSize.get(shape.length);
  if (shapesByLen) {
    const shapeMatch = new RegExp("^" + shape);
    shapesByLen.forEach((key) => {
      if (shapeMatch.test(key)) {
        results.push.apply(results, index.get(key));
      }
    });
  }
  return results;
}
