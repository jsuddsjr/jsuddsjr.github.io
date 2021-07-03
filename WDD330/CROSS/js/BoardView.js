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
    /** @type {CellModel[]} */
    this.cells = new Array(size * size);

    /** @type {WordModel[]} */
    this.wordList = [];

    this.index = new WordIndex().onLoaded(this.reportWordMatches.bind(this));

    this.boardElement.style.setProperty("--board-size", size.toString());
    this.boardElement.addEventListener("keypress", () => {
      this.reportWordMatches();
    });

    this.subscribers = new Subscribers(this);
  }

  /**
   * @returns The active list of words.
   */
  getWordList() {
    return this.wordList;
  }

  /**
   * Start a new board.
   */
  show() {
    this.boardElement.innerHTML = "";
    const boardCount = this.cells.length;

    for (let i = 0; i < boardCount; i++) {
      const cell = new CellModel();
      cell.onBlocked((_) => this.renumber());
      cell.onContentUpdated((_) => this.reportWordMatches());
      this.boardElement.appendChild(cell.cellElement);
      this.cells[i] = cell;
    }

    // TODO: assume balanced layout.
    this.cells.forEach((el, index) => {
      el.setPartnerCell(this.cells[boardCount - index - 1]);
    });

    this.renumber();
  }

  /**
   * Recalculate the words on the board.
   */
  renumber() {
    this.wordList = [];
    this.cells.forEach((c) => c.clearAllStates());
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

  /**
   * Create words starting at this location.
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

  /**
   * Find issues with dictionary matches.
   */
  reportWordMatches() {
    if (this.index.isLoaded()) {
      this.wordList.forEach((w) => w.clearAllStates());
      for (let word of this.wordList) {
        const shape = word.getShape();
        const words = this.index.getWordsByShape(shape);
        if (words.length === 0) word.addStates("error");
      }
    }
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
