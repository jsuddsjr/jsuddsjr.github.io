import CellModel from "./CellModel.js";
import WordModel from "./WordModel.js";
import WordIndex from "./WordIndex.js";
import Subscribers from "./Subscribers.js";

const LAYOUT_EVENT = "layout";

export default class BoardView {
  /**
   * Constructor.
   * @param {HTMLElement} boardElement
   * @param {Number} size
   */
  constructor(boardElement, size = 15) {
    this.boardElement = boardElement;
    this.size = size;

    this.boardElement.style.setProperty("--board-size", size);

    /** @type {CellModel[]} */
    this.cells = new Array(size * size);

    /** @type {WordModel[]} */
    this.wordList = [];

    this.index = new WordIndex().onLoaded(this.reportWordMatches.bind(this));

    this.subscribers = new Subscribers(this);
  }

  /**
   * @returns The active list of words.
   */
  getWordList() {
    return this.wordList;
  }

  show() {
    this.boardElement.innerHTML = "";
    const boardCount = this.cells.length;

    for (let i = 0; i < boardCount; i++) {
      const div = document.createElement("div");
      const cell = new CellModel(div);
      div.addEventListener("click", (e) => {
        cell.toggleBlocked();
        this.renumber();
      });
      this.boardElement.appendChild(div);
      this.cells[i] = cell;
    }

    // TODO: assume balanced layout.
    this.cells.forEach((el, index) => {
      el.setPartnerCell(this.cells[boardCount - index - 1]);
    });

    this.renumber();
  }

  /**
   * Apply numbers across the board.
   */
  renumber() {
    this.resetWordList();

    let currentNumber = 1;
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.isBlocked) continue;

      const cellAboveIndex = i - this.size;
      const cellAbove = cellAboveIndex < 0 || this.cells[cellAboveIndex].isBlocked;
      const cellToLeft = i % this.size === 0 || this.cells[i - 1].isBlocked;
      if (cellAbove || cellToLeft) {
        cell.setClueNumber(currentNumber++);
        this.addCrossWords(cell, i, cellToLeft, cellAbove);
      } else {
        cell.setClueNumber(-1);
      }
    }

    this.reportWordMatches();
    this.subscribers.notify(LAYOUT_EVENT);
  }

  resetWordList() {
    this.wordList.forEach((w) => w.clearStates());
    this.wordList = [];
  }

  /**
   *
   * @param {CellModel} anchorCell
   * @param {Number} index
   * @param {Boolean} across
   * @param {Boolean} down
   */
  addCrossWords(anchorCell, index, across, down) {
    if (across) {
      const cellsAcross = [anchorCell];
      const remainingRow = this.size - (index % this.size);
      for (let i = 1; i < remainingRow; i++) {
        const cell = this.cells[index + i];
        if (cell.isBlocked) break;
        cellsAcross.push(cell);
      }
      this.wordList.push(new WordModel(cellsAcross, "across"));
    }

    if (down) {
      const cellsDown = [anchorCell];
      for (let i = this.size; i < this.cells.length - index; i += this.size) {
        const cell = this.cells[index + i];
        if (cell.isBlocked) break;
        cellsDown.push(cell);
      }
      this.wordList.push(new WordModel(cellsDown, "down"));
    }
  }

  reportWordMatches() {
    const shapes = [];
    for (let word of this.wordList) {
      const dictionary = this.index.getWordsByShape(word.word) || [];
      if (dictionary.length === 0) word.setState("error");
      shapes.push({ n: dictionary.length, s: word.word });
    }

    console.log(shapes.sort((a, b) => a.n - b.n));
  }

  /**
   * Subscribe to layout events.
   * @param {import("./Subscribers.js").NotifyFunc} callback
   * @returns this
   */
  onLayout(callback) {
    this.subscribers.subscribe(LAYOUT_EVENT, callback);
    return this;
  }
}
