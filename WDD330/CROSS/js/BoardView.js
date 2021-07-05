import CellModel from "./CellModel.js";
import WordModel from "./WordModel.js";
import WordIndex from "./WordIndex.js";
import Subscribers from "./Subscribers.js";
import GameStore from "./GameStore.js";

const LAYOUT_EVENT = "layout";
const SAVED_EVENT = "saved";

export default class BoardView {
  /**
   * Constructor.
   * @param {HTMLElement} boardElement
   * @param {Number} size
   * @param {String} title
   */
  constructor(boardElement, size = 15, title = "") {
    this.boardElement = boardElement;
    this.title = title;
    this.size = size;

    /** @type {CellModel[]} */
    this.cells = new Array(size * size);
    /** @type {WordModel[]} */
    this.wordList = [];

    this.setSize(size);

    this.boardElement.addEventListener("keypress", () => {
      this.reportWordIssues();
    });

    this.index = new WordIndex().onLoaded(this.reportWordIssues.bind(this));
    this.subscribers = new Subscribers(this);
    this.store = new GameStore();
  }

  /**
   * @returns The active list of words.
   */
  getWordList() {
    return this.wordList;
  }

  /**
   * Sets the width and height of the board.
   * Also resets the board contents.
   * @param {Number} size
   */
  setSize(size) {
    this.size = size;
    this.boardElement.style.setProperty("--board-size", size.toString());
  }

  /**
   * Save the current board with a title.
   * @param {String} name
   */
  save(name) {
    this.title = name;
    this.store.saveBoard(this.cells, name);
    this.subscribers.notify(SAVED_EVENT);
  }

  /**
   * Start a new board.
   */
  show() {
    this.boardElement.innerHTML = "";

    const data = this.store.loadBoard(this.title) || this.store.lastSaved;
    if (data) {
      this.setSize(Math.trunc(Math.sqrt(data.cells.length)));
      this.cells = this.store.cellsFromBoard(data);
      this.title = data.name;
    } else {
      this.cells = Array.from({ length: this.size * this.size }, () => new CellModel());
    }

    const boardCount = this.cells.length;
    this.cells.forEach((cell, index) => {
      this.boardElement.appendChild(cell.cellElement);
      cell.setPartnerCell(this.cells[boardCount - index - 1]);
      cell.onBlocked((_) => {
        this.store.writeTempData(this.cells);
        this.renumber();
      });
      cell.onContentUpdated((_) => {
        this.store.writeTempData(this.cells);
        this.reportWordIssues();
      });
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

    this.reportWordIssues();
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
  reportWordIssues() {
    this.wordList.forEach((w) => w.clearAllStates());
    for (let word of this.wordList) {
      if (word.length < 3) {
        word.addStates(WordModel.ERROR_CLASS);
        continue;
      }

      if (word.length > 10) {
        word.addStates(WordModel.WARNING_CLASS);
      }

      if (this.index.isLoaded()) {
        const wordShape = word.getShape();
        const wordsFound = this.index.getWordsByShape(wordShape);
        if (wordsFound.length === 0) {
          word.addStates(WordModel.WORD_WARNING_CLASS);
        } else {
          const potentials = this.index.getPotentialsByShape(wordShape);
          const cells = word.cells;
          const dir = word.direction;
          potentials.forEach((set, index) => {
            if (set.size > 1 && set.size < 7) {
              cells[index].cellElement.dataset[dir] = [...set.keys()].sort().join("");
            } else {
              cells[index].cellElement.removeAttribute(`data-${dir}`);
              if (set.size === 1) {
                const c = [...set.values()][0];
                cells[index].shape.setContent(c);
              }
            }
          });
        }
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

  /**
   * Subscribe to save events.
   * @param {import("./Subscribers.js").NotifyFunc} callback
   * @returns this
   */
  onSaved(callback) {
    this.subscribers.subscribe(SAVED_EVENT, callback);
    return this;
  }
}
