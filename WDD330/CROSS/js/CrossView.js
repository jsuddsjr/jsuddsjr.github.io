import CellModel from "./CellModel.js";

export default class CrossView {
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
      el.setPartner(this.cells[boardCount - index - 1]);
    });

    this.renumber();
  }

  renumber() {
    let currentNumber = 1;
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (i < this.size) {
        // Number for every cell in top row.
        if (!cell.blocked) cell.setNumber(currentNumber++);
      } else {
        const cellAbove = i - this.size;
        const cellToLeft = i % this.size;
        if (
          this.cells[cellAbove].blocked ||
          cellToLeft === 0 ||
          this.cells[i - 1].blocked
        ) {
          cell.setNumber(currentNumber++);
        }
        else {
          cell.setNumber(-1);
        }
      }
    }
  }
}
