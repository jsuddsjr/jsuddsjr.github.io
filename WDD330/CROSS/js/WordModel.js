import CellModel from "./CellModel.js";

const ERROR_CLASS = "error";
const ALL_STATES = [ERROR_CLASS];

export default class WordModel {
  /**
   * @param {CellModel[]} cells
   * @param {String} direction
   */
  constructor(cells, direction = "across") {
    this.cells = cells;
    this.length = cells.length;
    this.number = cells[0].numberElement.textContent;
    this.direction = direction;
    this.word = "";

    if (this.length < 3) {
      this.setState(ERROR_CLASS);
    }

    // TODO: Testing
    this.setWord(this.randomWord());
  }

  /**
   * @param {WordModel} word
   */
  clearStates() {
    this.cells.forEach((c) => c.cellElement.classList.remove(ALL_STATES));
  }

  /**
   *
   * @param {String} newState
   */
  setState(newState) {
    this.cells.forEach((c) => c.cellElement.classList.add(newState));
  }

  /**
   *
   * @param {String} newWord
   */
  setWord(newWord) {
    if (newWord.length === this.length) {
      this.word = newWord;
      for (let i = 0; i < this.length; i++) {
        this.cells[i].cellElement.dataset.letter = newWord[i];
      }
    }
  }

  randomWord() {
    const word = [];
    for (let i = 0; i < this.length; i++) {
      word[i] =
        this.cells[i].cellElement.dataset.letter ||
        String.fromCharCode(65 + Math.trunc(Math.random() * 26));
    }
    return word.join("");
  }
}
