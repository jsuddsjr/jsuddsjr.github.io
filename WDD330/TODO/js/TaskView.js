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
    this.parentElement = document.body.querySelector(parentSelector);

    if (!this.parentElement) {
      throw new Error("Invalid parent selector for TaskView.")
    }

    this.filterState = undefined;
    this.taskList = taskList;

    taskList.onReload(this.renderAllTasks.bind(this));
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
      el.parentElement.removeChild(el);
    });

    this.updateTaskElement(el, input, task);
    task.onUpdate(this.updateTaskElement.bind(null, el, input));
  }

  updateTaskElement(el, input, task) {
    el.dataset.taskId = task.id.toString();
    input.value = task.desc;
  }

  /**
   * Filter view by isComplete state. Set to `undefined` for all tasks.
   * @param {Boolean} [state]
   */
  setFilterState(state) {
    this.filterState = state;
  }

  renderAllTasks() {
    this.getParentElement().innerHTML = "";
    this.taskList.filterByState(this.filterState).forEach(this.renderSingleTask.bind(this));
  }
}
