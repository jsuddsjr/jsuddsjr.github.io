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
    this.content = "";
    this.shape = ".";

    cellElement.classList.add("cell");

    const div = document.createElement("div");
    div.classList.add("number");
    cellElement.appendChild(div);

    this.numberElement = div;
  }

  setPartner(cell) {
    if (cell !== this) this.partnerCell = cell;
  }

  setNumber(num) {
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
