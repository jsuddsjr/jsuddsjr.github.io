import Subscribers from "./Subscribers.js";

/** @type {Map<string, string[]} */
const index = new Map();
/** @type {Map<number, string[]} */
const indexSize = new Map();
let loading = false;
const LOADED_EVENT = "loaded";

const VOWEL = "0";
const CONSONANT = "1";
const ANY_TYPE = ".";
const LETTER_MATCH = new RegExp(`[^${VOWEL}${CONSONANT}${ANY_TYPE}]`);

export default class WordIndex {
  constructor() {
    this.loaded = false;
    this.subscribers = new Subscribers(this);
    this.loadIndex();
  }

  async loadIndex() {
    if (loading) return;
    loading = true;

    const response = await fetch("data/wordshape.txt");
    const text = await response.text();

    for (let line of text.split(/\r?\n/g)) {
      const [key, ...words] = line.split(",");
      index.set(key, words);

      const keyLen = key.length;
      const sizeArr = indexSize.get(keyLen) || [];
      if (sizeArr.length === 0) indexSize.set(keyLen, sizeArr);
      sizeArr.push(key);
    }

    this.loaded = true;
    this.subscribers.notify(LOADED_EVENT);
  }

  /**
   * Get words that match the specified shape.
   * Shape can contain 0/1 for vowel/cons, dot (.) for any or letter.
   * @param {String} shape
   * @returns
   */
  getWordsByShape(shape) {
    const types = new Set(shape);

    if (types.size > 3 || LETTER_MATCH.test(shape)) {
      // TODO: Blended search contains letters.
      return [];
    }

    if (types.has(ANY_TYPE)) {
      const result = [];
      const shapesByLen = indexSize.get(shape.length);
      if (shapesByLen) {
        const shapeMatch = new RegExp(shape);
        shapesByLen.forEach((key) => {
          if (shapeMatch.test(key)) {
            result.push.apply(results, index.get(key));
          }
        });
      }
      return result;
    }

    // Just VOWEL and CONSONANT.
    return index.get(shape);
  }

  /**
   * Get notification when index is loaded.
   * @param {import("./Subscribers.js").NotifyFunc} cb
   * @returns this
   */
  onLoaded(cb) {
    if (this.loaded) {
      cb(this);
    } else {
      this.subscribers.subscribe(LOADED_EVENT, cb);
    }
    return this;
  }
}
