import TaskListModel from './TaskListModel.js';
import TaskView from './TaskView.js'

const taskView = new TaskView("div.tasks");
const taskList = new TaskListModel();

await taskView.renderTaskList(taskList);