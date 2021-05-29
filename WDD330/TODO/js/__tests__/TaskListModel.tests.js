/**
 * @jest-environment jsdom
 */

import TaskListModel from "../TaskListModel";
import TaskModel from "../TaskModel";
import { jest } from "@jest/globals";

const taskList = [
  new TaskModel("Testing", false, 1),
  new TaskModel("Finished", true, 2),
];

// Source: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();

describe("TaskListModel", () => {
  test("should keep track of tasks", () => {
    const tl = new TaskListModel(taskList);
    expect(tl.getAllTasks()).toEqual(taskList);
  });

  test("should return items by filter", () => {
    const tl = new TaskListModel(taskList);
    const completedTasks = tl.filterByState(true);
    expect(completedTasks.length).toBe(1);
  });

  test("should return items by id", () => {
    const tl = new TaskListModel(taskList);
    const task = tl.getTask(1);
    expect(task.id).toEqual(1);
  });

  test("should add tasks and store changes", () => {
    const tl = new TaskListModel([]);
    const task = tl.addTask("desc");
    expect(task.desc).toEqual("desc");
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test("should remove tasks and store changes", () => {
    const task = new TaskModel("desc");
    const tl = new TaskListModel([task]);
    const taskDeleted = tl.delTask(task.id);
    expect(taskDeleted).toEqual(task);
    expect(tl.getAllTasks().length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
