import WordModel from "./WordModel.js";
import BoardView from "./BoardView.js";

export default class WordListView {
  /**
   * Constructor.
   * @param {BoardView} board
   * @param {HTMLElement} acrossElement
   * @param {HTMLElement} downElement
   */
  constructor(board, acrossElement, downElement) {
    this.board = board.onLayout(this.update.bind(this));
    this.acrossElement = acrossElement;
    this.downElement = downElement;
  }

  update() {
    this.acrossElement.innerHTML = "";
    this.downElement.innerHTML = "";
    this.board.getWordList().forEach((w) => {
      if (w.direction === "across") {
        this.acrossElement.innerHTML += this.clueFromWord(w);
      } else {
        this.downElement.innerHTML += this.clueFromWord(w);
      }
    });
  }

  /**
   *
   * @param {WordModel} word
   */
  clueFromWord(word) {
    clueTemplate[1] = word.number;
    clueTemplate[3] = word.word;
    return clueTemplate.join("");
  }
}

const clueTemplate = [
  '<li class="number" start="',
  null,
  '"><span class="clue">',
  null,
  "</span></li>",
];
