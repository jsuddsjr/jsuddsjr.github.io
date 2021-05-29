import TaskModel from "./TaskModel.js";

const LOCAL_STORAGE_KEY = "__allTasks";

export default class TaskListModel {
  constructor() {
    const taskList = [
      new TaskModel("Testing", false, this.saveTasks.bind(this)),
      new TaskModel("Finished", true, this.saveTasks.bind(this)),
    ];

    this.taskList = this.readTasks(); // taskList;
  }

  /**
   * Returns the task list.
   * @returns {TaskModel[]}
   */
  getAllTasks() {
    return this.taskList;
  }

  /**
   * Returns tasks matching specified state.
   * @param {Boolean} isComplete
   */
  filterByState(isComplete) {
    return this.taskList.filter((task) => task.isComplete === isComplete);
  }

  /**
   * Append a new task.
   * @param {String} description Task description.
   */
  addTask(description) {
    const task = new TaskModel(description, false, this.saveTasks);
    this.taskList.push(task);
    T.saveTasks();
    return task.getId();
  }

  /**
   * Delete task by id.
   * @param {Number} id Task id.
   */
  delTask(id) {
    const index = this.taskList.findIndex((task) => task.id === id);
    if (index !== -1) {
      const deletedTask = this.taskList.splice(index, 1, 0)[0];
      this.saveTasks();
      return deletedTask;
    }
  }

  /**
   * Find a task by id.
   * @param {Number} id Task id.
   * @returns {TaskModel} Task, if found.
   */
  findTask(id) {
    return this.taskList.find((task) => task.id === id);
  }

  /**
   * Save tasks to storage after update.
   */
  saveTasks() {
    console.log("saveTasks called.");

    const tasks = this.taskList.map(task => [task.desc, task.isComplete]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Read list of tasks from storage.
   */
  readTasks() {
    console.log("readTasks called.");

    /** @type {(string | boolean)[][]} */
    const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    return tasks.map(([desc, isComplete]) => new TaskModel(desc, isComplete, this.saveTasks.bind(this)));
  }
}
