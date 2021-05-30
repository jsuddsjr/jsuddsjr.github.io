import TaskModel from "../TaskModel.js";
import { jest } from "@jest/globals";

describe("TaskModel", () => {
  test("should create with one args", () => {
    const task = new TaskModel("desc");
    expect(task.isComplete).toEqual(false);
    expect(task.id).toBeTruthy();
  });

  test("should create with two args", () => {
    const task = new TaskModel("desc", true);
    expect(task.isComplete).toEqual(true);
    expect(task.id).toBeTruthy();
  });

  test("should create with three args", () => {
    const task = new TaskModel("desc", true, "id");
    expect(task.isComplete).toEqual(true);
    expect(task.id).toEqual("id");
  });

  test("should accept new description", () => {
    const task = new TaskModel("desc");
    task.setDescription("desc1");
    expect(task.desc).toEqual("desc1");
  });

  test("should not accept blank description", () => {
    const task = new TaskModel("desc");
    task.setDescription(" \n\t ");
    expect(task.desc).toEqual("desc");
  });

  test("should notify updates", () => {
    const task = new TaskModel("desc");
    const cb = jest.fn((task) => task);
    task.subscribe(cb);

    task.toggleComplete();

    expect(cb).toBeCalled();

    /** @type {TaskModel} */
    const taskRef = cb.mock.results[0].value;
    expect(taskRef).toEqual(task);
    expect(taskRef.isComplete).toEqual(true);
  });
});
