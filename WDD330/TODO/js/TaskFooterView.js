import TaskListModel from "./TaskListModel.js";

export default class TaskFooterView {
  /**
   *
   * @param {String} parentSelector
   * @param {TaskListModel} taskList
   */
  constructor(parentSelector, taskList) {
    this.parentSelector = parentSelector;
    this.taskList = taskList;

    taskList.subscribe(this);
  }

  updateFooter() {
    const el = document.querySelector(this.parentSelector);
    if (!el) {
      throw new Error("Invalid parent selector for TaskFooterView.");
    }

    const countSpan = el.querySelector("span.count");
    countSpan.textContent = this.taskList.
  }
}
