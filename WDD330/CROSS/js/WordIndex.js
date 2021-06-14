import Subscribers from "./Subscribers.js";

const index = new Map();
let loaded = false;

const LOADED_EVENT = "loaded";

export default class WordIndex {
  constructor() {
    this.subscribers = new Subscribers(this);
    this.loadIndex();
  }

  async loadIndex() {
    if (loaded) return;
    loaded = true;

    const response = await fetch("data/wordshape.txt");
    const text = await response.text();

    for (let line of text.split(/\r?\n/g)) {
      const [key, ...words] = line.split(",");
      index.set(key, words);
    }

    this.subscribers.notify(LOADED_EVENT);
  }

  getWordsByShape(shape) {
    return index.get(shape);
  }

  onLoaded(cb) {
    this.subscribers.subscribe(LOADED_EVENT, cb);
    return this;
  }
}
