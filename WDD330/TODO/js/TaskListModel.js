import TaskModel from "./TaskModel.js";
import Subscribers from "./Subscribers.js";
/** @typedef {import("./Subscribers").NotifyFunc} NotifyFunc */

const LOCAL_STORAGE_KEY = "__allTasks";
const RELOAD_EVENT = "reload";
const SAVE_EVENT = "save";

export default class TaskListModel {
  /**
   * Constructor.
   * @param {TaskModel[]} [taskList] Optional task list for testing.
   */
  constructor(taskList) {
    this.subscribers = new Subscribers(this);

    /** @type {TaskModel[]} */
    this.taskList = taskList || this.readTasks();

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
   * @param {String} id Task id.
   * @returns Task, if found.
   */
  getTask(id) {
    return this.taskList.find((task) => task.id === id);
  }

  /**
   * Returns tasks matching specified state.
   * @param {Boolean | undefined} isComplete
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
    task.onUpdate(this.saveTasks.bind(this));
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
    this.subscribers.notify(SAVE_EVENT);
  }

  /**
   * Read list of tasks from storage.
   */
  readTasks() {
    /** @type {(string | boolean)[][]} */
    const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    const taskList = tasks.map(([id, desc, isComplete]) =>
      new TaskModel(desc.toString(), !!isComplete, id.toString()).onUpdate(this.saveTasks.bind(this))
    );
    this.taskList = taskList;
    this.subscribers.notify(RELOAD_EVENT);
    return taskList;
  }

  /**
   * Subscribe to update events.
   * @param {NotifyFunc} callback
   * @return A chainable reference.
   */
  onReload(callback) {
    this.subscribers.subscribe(RELOAD_EVENT, callback);
    return this;
  }

  /**
   * Subscribe to save events.
   * @param {NotifyFunc} callback
   * @returns
   */
  onSave(callback) {
    this.subscribers.subscribe(SAVE_EVENT, callback);
    return this;
  }
}
