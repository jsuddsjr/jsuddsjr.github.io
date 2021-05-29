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

  getId() {
    return this.id;
  }

  getDescription() {
    return this.desc;
  }

  setDescription(description) {
    this.desc = description
  }

  toggleComplete() {
    this.isComplete ^= true;
    this.cb();
  }
}
