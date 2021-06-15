import ShapeModel from "./ShapeModel.js";
import WordModel from "./WordModel.js";

const NO_SOLUTION_CLASS = "no-solution";
export default class CellModel {
  /**
   * Constructor.
   */
  constructor() {
    this.cellElement = document.createElement("div");
    this.cellElement.className = "cell";
    this.cellElement.tabIndex = 0;

    /** @type {CellModel?} */
    this.partnerCell = null;
    this.isBlocked = false;
    this.shape = new ShapeModel(this.cellElement);
    this.available = new Set(ShapeModel.anyType);

    /** @type {HTMLElement} */
    this.numberElement = null;

    this.cellElement.addEventListener("keydown", (e) => {
      if (e.key.length === 1) this.shape.setContent(e.key.toLowerCase());
      else if (e.key === "Delete" || e.key === "Backspace") this.shape.setContent();
    });
  }

  /**
   * Connect the cell back to their word model.
   * @param {WordModel} word
   * @param {String} direction
   * @param {Number} index
   */
  setWord(word, direction, index) {
    this[direction] = word;
    this[direction + "_index"] = index;
  }

  /**
   * Return a set of shared letters.
   * @param {Set<string>} across
   * @param {Set<string>} down
   * @returns Shared letters, or empty set.
   */
  intersect(across, down) {
    if (across.has(ShapeModel.anyType)) {
      this.available = down;
    } else if (down.has(ShapeModel.anyType)) {
      this.available = across;
    } else {
      this.available = new Set([...across.values()].filter(down.has));
    }

    if (this.available.size === 0) {
      this.cellElement.classList.add(NO_SOLUTION_CLASS);
    } else {
      this.cellElement.classList.remove(NO_SOLUTION_CLASS);
      if (this.available.size === 1) {
        this.shape.setContent(this.available.values()[0]);
      }
    }

    return this.available;
  }

  /**
   *
   * @param {CellModel|HTMLElement} cell
   */
  setPartnerCell(cell) {
    if (cell instanceof HTMLElement) {
      cell = new CellModel(cell);
    }
    if (cell !== this) this.partnerCell = cell;
  }

  /**
   * Clue number, or -1 to remove.
   * @param {Number} num
   */
  setClueNumber(num) {
    if (!this.numberElement) {
      this.numberElement = this.cellElement.appendChild(document.createElement("div"));
      this.numberElement.className = "number";
    }
    this.numberElement.textContent = num > 0 ? num : "";
  }

  /**
   * @param {Boolean} [value]
   */
  toggleBlocked(value) {
    if (value == undefined || this.isBlocked !== value) {
      this.isBlocked = !this.isBlocked;
      this.cellElement.classList.toggle("blocked");
      this.partnerCell?.toggleBlocked(this.isBlocked);
    }
  }
}
