import Comments, { CommentModel } from '../Comments.js';
import { jest } from "@jest/globals";

// Source: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();

const HIKE_NAME1 = 'hike1';
const HIKE_DESC1 = "hike1_desc";
const HIKE_NAME2 = 'hike2';
const HIKE_DESC2 = "hike2_desc";

const testingComments = [
    new CommentModel(HIKE_NAME1, HIKE_DESC1),
    new CommentModel(HIKE_NAME2, HIKE_DESC2)
]

describe('CommentModel', () => {
    test('should construct', () => {
        const comment = new CommentModel(HIKE_NAME1, HIKE_DESC1);
        expect(comment.hikeName).toEqual(HIKE_NAME1);
        expect(comment.content).toEqual(HIKE_DESC1);
    });
});

describe('Comments', () => {
    test('should return hike by name', () => {
        const comments = new Comments('testing', testingComments);
        const hikes = comments.filterCommentsByName(HIKE_NAME2);
        expect(hikes.length).toBe(1);
        expect(hikes[0].hikeName).toBe(HIKE_NAME2);
    });

    test('should add comments for hike', () => {
        const comments = new Comments('testing', testingComments);
        comments.addComment(HIKE_NAME2, HIKE_DESC2);
        const hikes = comments.filterCommentsByName(HIKE_NAME2);
        expect(hikes.length).toBe(2);
    });

    test('should save to localStorage', () => {
        const comments = new Comments('testing', testingComments);
        comments.saveComments();
        expect(localStorage.setItem).toHaveBeenCalled();
    });
});