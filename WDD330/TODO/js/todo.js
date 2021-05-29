import TaskListModel from "./TaskListModel.js";
import TaskView from "./TaskView.js";

const taskList = new TaskListModel();
const taskView = new TaskView("div.tasks", taskList);

taskView.renderAllTasks();

document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();

  /** @type {HTMLInputElement} */
  const input = document.forms[0].elements[0];
  const desc = input.value.trim();
  if (desc) {
    const task = taskList.addTask(desc);
    taskView.renderSingleTask(task);
    input.value = "";
  }
});
