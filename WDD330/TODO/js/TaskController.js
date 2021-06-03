import { TaskFooterView } from "./TaskFooterView.js";
import TaskListModel from "./TaskListModel.js";
import TaskView from "./TaskView.js";

export default class TaskController {
  constructor() {
    this.taskList = new TaskListModel();
    this.taskView = new TaskView("div.tasks", this.taskList);
    this.taskFooterView = new Task("div.footer", this.taskView);
  }

  run() {
    this.taskView.renderAllTasks("Add a task to get started! 👇");

    document.forms[0].addEventListener("submit", (e) => {
      e.preventDefault();

      /** @type {HTMLInputElement} */
      const input = document.forms['entry'].elements['task'];
      const desc = input.value.trim();
      if (desc) {
        const task = this.taskList.addTask(desc);
        this.taskView.renderSingleTask(task);
        input.value = "";
      }
    });
  }
}
