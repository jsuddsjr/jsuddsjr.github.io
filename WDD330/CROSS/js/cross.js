import BoardView from "./BoardView.js";
import WordListView from "./WordListView.js";

const board = document.querySelector(".board");
const across = document.getElementById("across");
const down = document.getElementById("down");
if (
  board instanceof HTMLElement &&
  across instanceof HTMLElement &&
  down instanceof HTMLElement
) {
  const boardView = new BoardView(board);
  const wordListView = new WordListView(boardView, across, down);
  boardView.show();
}
