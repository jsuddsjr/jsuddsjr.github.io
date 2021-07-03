import WordModel from "./WordModel.js";
import BoardView from "./BoardView.js";

export default class WordListView {
  /**
   * Constructor.
   * @param {BoardView} board
   * @param {HTMLElement} acrossElement
   * @param {HTMLElement} downElement
   * @param {HTMLElement} countElement
   */
  constructor(board, acrossElement, downElement, countElement) {
    this.board = board.onLayout(this.update.bind(this));
    this.acrossElement = acrossElement;
    this.downElement = downElement;
    this.countElement = countElement;
  }

  update() {
    this.acrossElement.innerHTML = "";
    this.downElement.innerHTML = "";

    const wordList = this.board.getWordList();
    wordList.forEach((w) => {
      if (w.direction === "across") {
        this.acrossElement.innerHTML += this.clueFromWord(w);
      } else {
        this.downElement.innerHTML += this.clueFromWord(w);
      }
    });
    this.countElement.textContent = wordList.length;
  }

  /**
   *
   * @param {WordModel} word
   */
  clueFromWord(word) {
    clueTemplate[1] = word.getClueNumber();
    clueTemplate[3] = word.getWord();
    clueTemplate[5] = word.getScrabbleValue();
    return clueTemplate.join("");
  }
}

const clueTemplate = [
  '<li class="number" value="',
  null,
  '"><span class="clue">',
  null,
  '</span> <span data-score="',
  null,
  '"></span></li>',
];
