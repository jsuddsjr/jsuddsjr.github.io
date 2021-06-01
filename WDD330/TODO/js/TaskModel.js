import Subscribers from "./Subscribers.js";
/** @typedef {import('./Subscribers').NotifyFunc} NotifyFunc */

// A task object with callback.
const UPDATE_EVENT = "update";

export default class TaskModel {
  /**
   * Create a new task object.
   * @param {String} description
   * @param {Boolean} [completed]
   * @param {String} [id]
   */
  constructor(description, completed = false, id) {
    this.id = id || new Date().toISOString();
    this.desc = description;
    this.isComplete = completed;

    this.subscribers = new Subscribers(this);
  }

  /**
   * Change description and notify subscribers.
   * @param {String} description
   * @returns A chainable reference.
   */
  setDescription(description) {
    const newValue = description.trim();
    if (newValue && this.desc !== newValue) {
      this.desc = newValue;
      this.subscribers.notify(UPDATE_EVENT);
    }
    return this;
  }

  /**
   * Toggle completion and notify subscribers.
   * @returns A chainable reference.
   */
  toggleComplete() {
    this.isComplete = !this.isComplete;
    this.subscribers.notify(UPDATE_EVENT);
    return this;
  }

  /**
   * Subscribe to update events.
   * @param {NotifyFunc} callback
   * @return A chainable reference.
   */
  onUpdate(callback) {
    this.subscribers.subscribe(UPDATE_EVENT, callback);
    return this;
  }
}
