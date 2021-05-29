// A task object with callback.
const UPDATE_EVENT = "update";

export default class TaskModel {
  /**
   * Create a new task object.
   * @param {String} description
   * @param {Boolean} completed
   * @param {String} id
   */
  constructor(description, completed, id) {
    this.id = id || new Date().toISOString();
    this.desc = description;
    this.isComplete = completed;
  }

  setDescription(description) {
    const newValue = description.trim();
    if (newValue && this.desc !== newValue) {
      this.desc = newValue;
      this.sendEvent(UPDATE_EVENT);
    }
  }

  toggleComplete() {
    this.isComplete ^= true;
    this.sendEvent(UPDATE_EVENT);
  }

  sendEvent(eventName) {
    this.dispatchEvent(new Event(eventName));
  }
}
