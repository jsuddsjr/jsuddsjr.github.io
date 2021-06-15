import ShapeModel from "./ShapeModel.js";

export default class CellModel {
  /**
   * Constructor.
   * @param {HTMLElement} cellElement
   */
  constructor(cellElement) {
    this.cellElement = cellElement;
    cellElement.classList.add("cell");

    /** @type {CellModel?} */
    this.partnerCell = null;
    this.isBlocked = false;
    this.shape = new ShapeModel(cellElement);

    /** @type {HTMLElement} */
    this.numberElement = null;
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
