import CellModel from './CellModel.js';

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
        this.cells = [];
    }

    show() {
        this.boardElement.innerHTML = "";

        const countCells = this.size * this.size;
        for(let i = 0; i < countCells; i++) {
            const div = document.createElement('div');
            this.cells.push(new CellModel(div));
        }

        // TODO: assume balanced layout.
        this.cells.forEach((el, index) => {
            
        });

        }

    }
}