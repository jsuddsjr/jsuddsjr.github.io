import CellModel from "./CellModel.js";

const ERROR_CLASS = "error";
const WARNING_CLASS = "warning";
const WORD_WARNING_CLASS = "word-warning";
const ALL_STATES = [ERROR_CLASS, WARNING_CLASS, WORD_WARNING_CLASS];

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
    } else if (this.length > 8) {
      this.setState(WARNING_CLASS);
    }

    // TODO: Testing
    this.setWord(this.randomWord());

    if (this.checkShape()) this.setState(WORD_WARNING_CLASS);
  }

  /**
   * @param {WordModel} word
   */
  clearStates() {
    this.cells.forEach((c) => {
      c.cellElement.classList.remove(...ALL_STATES);
      // c.cellElement.dataset.letter = "";
    });
  }

  checkShape() {
    const shapes = [0, 0];
    for (let c of this.word) {
      const index = Number(c);
      const other = index ? 0 : 1;
      shapes[index]++;
      shapes[other] = 0;
      if (shapes[index] > 4) {
        return true;
      }
    }
    return false;
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
      word[i] = this.cells[i].cellElement.dataset.letter || (Math.random() > 0.55 ? "0" : "1");
      // String.fromCharCode(65 + Math.trunc(Math.random() * 26));
    }
    return word.join("");
  }
}
