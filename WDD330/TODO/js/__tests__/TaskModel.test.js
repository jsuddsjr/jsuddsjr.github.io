import TaskModel from '../TaskModel.js'

describe('TaskModel', () => {
    test('should create with two args', () => {
        const task = new TaskModel("desc", true);
        expect(task.isComplete).toEqual(true);
        expect(task.id).toBeTruthy();
    });
});