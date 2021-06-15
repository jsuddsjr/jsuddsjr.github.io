import ShapeModel from "./ShapeModel";

export default class CellModel {
  /**
   * Constructor.
   * @param {HTMLElement} cellElement
   */
  constructor(cellElement) {
    this.cellElement = cellElement;
    /** @type {CellModel?} */
    this.partnerCell = null;
    this.blocked = false;
    this.shape = new ShapeModel(cellElement);

    cellElement.classList.add("cell");

    const div = document.createElement("div");
    div.classList.add("number");
    cellElement.appendChild(div);

    this.numberElement = div;
  }

  /**
   * Set the content of this cell.
   * @param {String?} char
   */
  setLetter(char) {
    if (char.length > 1) {
      throw new Error("Rebus squares (more than single letter) are not supported.");
    }
    if (/[^01.]/.test()) this.dataset.letter = char;
    this.shape = char;
  }

  setPartnerCell(cell) {
    if (cell !== this) this.partnerCell = cell;
  }

  /**
   * Clue number, or -1 to remove.
   * @param {Number} num
   */
  setClueNumber(num) {
    this.numberElement.textContent = num > 0 ? num : "";
  }

  /**
   * @param {Boolean} [value]
   */
  toggleBlocked(value) {
    if (value == undefined || this.blocked !== value) {
      this.blocked = !this.blocked;
      this.cellElement.classList.toggle("blocked");
      this.partnerCell?.toggleBlocked(this.blocked);
    }
  }
}
