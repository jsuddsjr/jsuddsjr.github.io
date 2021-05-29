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


}