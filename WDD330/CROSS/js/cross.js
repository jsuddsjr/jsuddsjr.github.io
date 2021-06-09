import BoardView from "./BoardView.js";
import WordListView from "./WordListView.js";

const params = new URLSearchParams(document.location.search);
const boardSize = parseInt(params.get('size')) || 15;

const board = document.querySelector(".board");
const across = document.getElementById("across");
const down = document.getElementById("down");
const count = document.querySelector('span.count');

if (
  board instanceof HTMLElement &&
  across instanceof HTMLElement &&
  down instanceof HTMLElement &&
  count instanceof HTMLElement
) {
  const boardView = new BoardView(board, boardSize);
  const wordListView = new WordListView(boardView, across, down, count);
  boardView.show();
}
