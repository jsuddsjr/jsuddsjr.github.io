import CrossView from './CrossView.js';

const board = document.querySelector('.board');
if (board instanceof HTMLElement) {
    const crossView = new CrossView(board);
    crossView.show();
}
