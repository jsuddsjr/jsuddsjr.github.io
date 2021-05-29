import TaskModel from "./TaskModel.js";
import TaskListModel from "./TaskListModel.js";
import { appendTemplate } from "../../js/template.js";

const COMPLETED_CLASS = "complete";

export default class TaskView {
  /**
   *
   * @param {String} parentSelector
   */
  constructor(parentSelector) {
    this.parentSelector = parentSelector;
  }

  /**
   * Render a single task element.
   * @param {TaskModel} task
   * @returns
   */
  async renderSingleTask(task) {
    const el = await appendTemplate(this.parentSelector, "task");
    if (!el) return;

    if (task.isComplete) {
      el.classList.add(COMPLETED_CLASS);
    }

    el.addEventListener("click", (e) => {
      el.classList.toggle(COMPLETED_CLASS);
      task.toggleComplete();
    });

    el.dataset.taskId = task.id.toString();
    el.querySelector("p").innerText = task.desc;
  }

  /**
   * Render all tasks in the model.
   * @param {TaskListModel} taskList
   */
  async renderTaskList(taskList) {
    if (!taskList) {
      throw new Error("`taskList` param is required.");
    }

    const el = document.body.querySelector(this.parentSelector);
    el.innerHTML = "";

    taskList.getAllTasks().forEach(this.renderSingleTask.bind(this));
  }
}
