import TaskModel from "./TaskModel.js";
import TaskListModel from "./TaskListModel.js";
import Subscribers from "./Subscribers.js";
/** @typedef {import('./Subscribers').NotifyFunc} NotifyFunc */
import { appendTemplate } from "../../js/template.js";

const COMPLETED_CLASS = "complete";
const REFRESH_EVENT = "refresh";

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
      throw new Error("Invalid parent selector for TaskView.");
    }

    this.subscribers = new Subscribers(this);
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
    // Clear out the welcome text.
    const message = this.parentElement.querySelector('.message');
    if (message) this.parentElement.removeChild(message);

    const el = await appendTemplate(this.parentSelector, "task");
    if (!(el instanceof HTMLElement)) return;

    const [checkbox, input] = el.querySelectorAll("input");
    const button = el.querySelector("button");
    if (!button) return;

    if (task.isComplete) {
      el.classList.add(COMPLETED_CLASS);
      checkbox.checked = true;
      input.disabled = true;
    } else {
      button.disabled = true;
    }

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
      if (button.parentElement && el.parentElement) {
        const id = button.parentElement.dataset.taskId || '';
        this.taskList.delTask(id);
        el.parentElement.removeChild(el);
      }

      // No one likes an empty list.
      if (this.isEmpty()) {
        this.parentElement.innerHTML = `<p class="message">Great work!! 🥳 </p>`;
      }
    });

    this.updateTaskElement(el, input, task);
    task.onUpdate(this.updateTaskElement.bind(this, el, input));
  }

  /**
   * Helper callback for updating the details of a single task.
   * @param {HTMLElement} el
   * @param {HTMLInputElement} input
   * @param {TaskModel} task
   */
  updateTaskElement(el, input, task) {
    el.dataset.taskId = task.id;
    input.value = task.desc;
    this.subscribers.notify(REFRESH_EVENT);
  }

  /**
   * Filter view by isComplete state. Set to `undefined` for all tasks.
   * @param {Boolean} [state]
   */
  setFilterState(state) {
    this.filterState = state;
    this.renderAllTasks();
  }

  /**
   * @returns True, if current filter options result in empty list.
   */
  isEmpty() {
    return this.taskList.filterByState(this.filterState).length === 0;
  }

  /**
   * @returns Number of active tasks.
   */
  countActiveTasks() {
    return this.taskList.filterByState(false).length;
  }

  /**
   * Re-render all tasks.
   * @param {String} emptyMessage
   */
  renderAllTasks(emptyMessage = "Nothing to see here.") {
    const activeTasks = this.taskList.filterByState(this.filterState);
    if (activeTasks.length) {
      this.parentElement.innerHTML = "";
      activeTasks.forEach(this.renderSingleTask.bind(this));
    } else {
      this.parentElement.innerHTML = `<p class="message">${emptyMessage}</p>`;
    }
    this.subscribers.notify(REFRESH_EVENT);
  }

  /**
   * Get notifications for refresh events.
   * @param {NotifyFunc} callback
   */
  onRefresh(callback) {
    this.subscribers.subscribe(REFRESH_EVENT, callback);
  }
}
