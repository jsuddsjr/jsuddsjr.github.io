import TaskModel from "./TaskModel.js";
import TaskListModel from "./TaskListModel.js";
import { appendTemplate } from "../../js/template.js";

const COMPLETED_CLASS = "complete";

export default class TaskView {
  /**
   *
   * @param {String} parentSelector
   * @param {TaskListModel} taskList
   */
  constructor(parentSelector, taskList) {
    if (!parentSelector || !taskList) {
      throw new Error("Missing required parameter.");
    }
    this.parentSelector = parentSelector;
    this.taskList = taskList;
  }

  /**
   * Render a single task element.
   * @param {TaskModel} task
   * @returns
   */
  async renderSingleTask(task) {
    const el = await appendTemplate(this.parentSelector, "task");
    if (!el) return;

    const [checkbox, input] = el.querySelectorAll("input");
    const button = el.querySelector("button");

    if (task.isComplete) {
      el.classList.add(COMPLETED_CLASS);
      checkbox.checked = true;
      input.disabled = true;
    } else {
      button.disabled = true;
    }

    // el.addEventListener("click", (e) => {
    //   checkbox.checked = !checkbox.checked;
    //   checkbox.dispatchEvent(new Event("click"));
    // });

    input.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });

    input.addEventListener("change", (e) => {
      task.setDescription(input.value);
      this.renderAllTasks();
    });

    checkbox.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      el.classList.toggle(COMPLETED_CLASS);
      button.disabled = !button.disabled;
      input.disabled = !input.disabled;
      task.toggleComplete();
    });

    button.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      const id = button.parentElement.dataset.taskId;
      this.taskList.delTask(id);
      this.renderAllTasks();
    });

    el.dataset.taskId = task.id.toString();
    input.value = task.desc;
  }

  async renderAllTasks() {
    const el = document.body.querySelector(this.parentSelector);
    el.innerHTML = "";

    this.taskList.getAllTasks().forEach(this.renderSingleTask.bind(this));
  }
}
