import BoardView from './BoardView.js';

const board = document.querySelector('.board');
if (board instanceof HTMLElement) {
    const boardView = new BoardView(board);
    boardView.show();
}
