import TaskModel from "./TaskModel.js";
import Subscribers from "./Subscribers.js";

const LOCAL_STORAGE_KEY = "__allTasks";
const RELOAD_EVENT = "reload";

export default class TaskListModel {
  /**
   * Constructor.
   * @param {TaskModel[]} [taskList] Optional task list for testing.
   */
  constructor(taskList) {
    this.subscribers = new Subscribers(this);

    if (taskList) this.taskList = taskList;
    else this.readTasks();

    window.addEventListener("storage", (e) => {
      if (e.key === LOCAL_STORAGE_KEY) this.readTasks();
    });
  }

  /**
   * Returns the task list.
   * @returns {TaskModel[]}
   */
  getAllTasks() {
    return this.taskList;
  }

  /**
   * Returns a task by id.
   * @param {Number} id Task id.
   * @returns {TaskModel} Task, if found.
   */
  getTask(id) {
    return this.taskList.find((task) => task.id === id);
  }

  /**
   * Returns tasks matching specified state.
   * @param {Boolean} isComplete
   */
  filterByState(isComplete) {
    if (isComplete === undefined) return this.getAllTasks();
    return this.taskList.filter((task) => task.isComplete === isComplete);
  }

  /**
   * Append a new task.
   * @param {String} description Task description.
   */
  addTask(description) {
    const task = new TaskModel(description);
    task.subscribe(this.saveTasks.bind(this));
    this.taskList.push(task);
    this.saveTasks();
    return task;
  }

  /**
   * Delete task by id.
   * @param {String} id Task id.
   */
  delTask(id) {
    const index = this.taskList.findIndex((task) => task.id === id);
    if (index !== -1) {
      const deletedTask = this.taskList.splice(index, 1)[0];
      this.saveTasks();
      return deletedTask;
    }
  }

  /**
   * Save tasks to storage after update.
   */
  saveTasks() {
    const tasks = this.taskList.map((task) => [
      task.id,
      task.desc,
      task.isComplete,
    ]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Read list of tasks from storage.
   */
  readTasks() {
    /** @type {(string | boolean)[][]} */
    const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    this.taskList = tasks.map(([id, desc, isComplete]) =>
      new TaskModel(desc, isComplete, id).subscribe(this.saveTasks.bind(this))
    );
    this.subscribers.notify(RELOAD_EVENT);
  }

  /**
   * Subscribe to update events.
   * @param {NotifyFunc} callback
   * @return A chainable reference.
   */
  subscribe(callback) {
    this.subscribers.subscribe(RELOAD_EVENT, callback);
    return this;
  }
}
