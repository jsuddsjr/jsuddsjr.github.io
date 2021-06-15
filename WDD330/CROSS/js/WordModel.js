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
    this.direction = direction;

    if (this.length < 3) {
      this.setState(ERROR_CLASS);
    } else if (this.length > 8) {
      this.setState(WARNING_CLASS);
    }

    this.cells.forEach((c, i) => c.setWord(this, direction, i));

    // this.setWord(this.randomWord());
    // if (this.checkShape()) this.setState(WORD_WARNING_CLASS);
  }

  /**
   * @returns The number for this clue.
   */
  getClueNumber() {
    return parseInt(this.cells[0].numberElement.textContent);
  }

  /**
   * @returns Word from cells.
   */
  getWord() {
    return this.cells.map((c) => c.shape.getLetter()).join("");
  }

  /**
   * @returns Shape from cells.
   */
  getShape() {
    return this.cells.map((c) => c.shape.getShape()).join("");
  }

  /**
   * Reset the state in all cells.
   */
  clearAllStates() {
    this.cells.forEach((c) => c.cellElement.classList.remove(...ALL_STATES));
  }

  /**
   * Add state to all cells.
   * @param {String} state
   */
  setState(state) {
    this.cells.forEach((c) => c.cellElement.classList.add(state));
  }

  /**
   * Remove state from all cells.
   * @param {String} state
   */
  clearState(state) {
    this.cells.forEach((c) => c.cellElement.classList.remove(state));
  }

  /**
   * Set the content of the word.
   * @param {String} newWord
   */
  setContent(newWord) {
    if (newWord.length !== this.length) {
      throw new Error("Word length does not match number of cells.");
    }
    this.cells.forEach((c, i) => c.shape.setContent(newWord[i]));
  }

  TEST_checkShape() {
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

  TEST_randomWord() {
    const word = [];
    for (let i = 0; i < this.length; i++) {
      word[i] = this.cells[i].cellElement.dataset.letter || (Math.random() > 0.55 ? "0" : "1");
      // String.fromCharCode(65 + Math.trunc(Math.random() * 26));
    }
    return word.join("");
  }
}
