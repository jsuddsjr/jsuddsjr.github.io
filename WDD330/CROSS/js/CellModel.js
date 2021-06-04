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
  }

  setPartner(cell) {
    this.partnerCell = cell;
  }

  setBlocked(value) {
    if (this.blocked !== value) {
      this.blocked = value;
      this.partnerCell?.setBlocked(value);
    }
  }
}
