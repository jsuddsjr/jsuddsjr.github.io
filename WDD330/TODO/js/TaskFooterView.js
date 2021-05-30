import TaskListModel from "./TaskListModel.js";

export default class TaskFooterView {
  /**
   *
   * @param {String} parentSelector
   * @param {TaskListModel} taskList
   */
  constructor(parentSelector, taskList) {
    if (!parentSelector || !taskList) {
      throw new Error("Missing required parameter for TaskFooterView.");
    }

    this.parentSelector = parentSelector;
    this.parentElement = document.querySelector(parentSelector);

    if (!this.parentElement) {
      throw new Error("Invalid parent selector for TaskFooterView.");
    }

    this.taskList = taskList;

    taskList.onReload(this);
  }

  updateFooter() {
    const countSpan = this.parentElement.querySelector("span.count");
    countSpan.textContent = this.taskList.filterByState(false).length;
  }
}
