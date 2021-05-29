// A task object with callback.

export default class TaskModel {
  /**
   * @callback UpdateCallback
   * @returns {Void}
   */
  /**
   * Create a new task object.
   * @param {Number} id
   * @param {String} description
   * @param {Boolean} completed
   * @param {UpdateCallback} cbUpdated
   */
  constructor(description, completed, cbUpdated) {
    this.id = ++TaskModel.highestId;
    this.desc = description;
    this.isComplete = completed;
    this.cb = cbUpdated;
  }

  static highestId = 0;

  setDescription(description) {
    const newValue = description.trim();
    if (newValue) {
      this.desc = newValue;
      this.isComplete = false;
      this.cb();
    }
  }

  toggleComplete() {
    this.isComplete ^= true;
    this.cb();
  }
}
