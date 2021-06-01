import TaskView from "./TaskView.js";

export default class TaskFooterView {
  /**
   *
   * @param {String} parentSelector
   * @param {TaskView} taskView
   */
  constructor(parentSelector, taskView) {
    if (!parentSelector || !taskView) {
      throw new Error("Missing required parameter for TaskFooterView.");
    }

    this.parentSelector = parentSelector;
    this.parentElement = document.querySelector(parentSelector);

    if (!this.parentElement) {
      throw new Error("Invalid parent selector for TaskFooterView.");
    }

    this.taskView = taskView;
    taskView.onRefresh(this.updateActiveCount.bind(this));

    this.attachEventListeners();
  }

  updateActiveCount() {
    const countSpan = this.parentElement.querySelector("span");
    if (countSpan) countSpan.textContent = this.taskView.countActiveTasks().toFixed();
  }

  attachEventListeners() {
    const SELECTED_CLASS = "selected";
    const allButtons = this.parentElement.querySelectorAll("button");
    function setActiveButton(btn) {
      allButtons.forEach((el) => el.classList.remove(SELECTED_CLASS));
      btn.classList.add(SELECTED_CLASS);
    }

    const [all, active, completed] = allButtons;
    all.addEventListener("click", () => {
      this.taskView.setFilterState();
      setActiveButton(all);
    });
    active.addEventListener("click", () => {
      this.taskView.setFilterState(false);
      setActiveButton(active);
    });
    completed.addEventListener("click", () => {
      this.taskView.setFilterState(true);
      setActiveButton(completed);
    });
  }
}
