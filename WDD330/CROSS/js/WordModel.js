import CellModel from "./CellModel.js";

const ACTIVE_CLASS = "active";
const ACTIVE_CELL_CLASS = "active-cell";
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
      this.setStates(ERROR_CLASS);
    } else if (this.length > 8) {
      this.setStates(WARNING_CLASS);
    }

    this.cells.forEach((c, i) => c.setWord(this, direction, i));

    // this.setWord(this.randomWord());
    // if (this.checkShape()) this.setState(WORD_WARNING_CLASS);
  }

  /** @type {WordModel?} */
  static activeWord = null;

  /**
   *
   * @param {CellModel} activeCell
   * @param {1|-1} direction
   */
  setActiveWord(activeCell, direction) {
    if (WordModel.activeWord && WordModel.activeWord !== this) {
      WordModel.activeWord?.clearStates(ACTIVE_CLASS, ACTIVE_CELL_CLASS);
      this.setStates(ACTIVE_CLASS);
      WordModel.activeWord = this;
    }
    else {
      let cursorIndex = (this.cells.indexOf(activeCell) + direction);
      if (cursorIndex < 0) cursorIndex = this.cells.length - 1;
      else if (cursorIndex >= this.cells.length) cursorIndex = 0;

      activeCell.cellElement.classList.remove(ACTIVE_CELL_CLASS);
      this.cells[cursorIndex].cellElement.classList.add(ACTIVE_CELL_CLASS);
      this.cells[cursorIndex].cellElement.focus();
    }
  }

  /**
   * @returns The number for this clue.
   */
  getClueNumber() {
    const number = this.cells[0].numberElement;
    if (!number) throw new Error("Word is missing number element!")
    return parseInt(number.textContent || "0");
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
    this.clearStates(...ALL_STATES);
  }

  /**
   * Add state to all cells.
   * @param {...String} states
   */
  setStates(...states) {
    this.cells.forEach((c) => c.cellElement.classList.add(...states));
  }

  /**
   * Remove state from all cells.
   * @param {...String} states
   */
  clearStates(...states) {
    this.cells.forEach((c) => c.cellElement.classList.remove(...states));
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
    for (let c of this.getWord()) {
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
