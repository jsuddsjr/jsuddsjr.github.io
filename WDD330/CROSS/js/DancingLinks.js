export class Node {
    /**
     * Constructor.
     * @param {string} name
     */
    constructor(name) {
        this._name = name;
        this._right = this._left = this._up = this._down = this._col = null;
    }

    get right() {
        return this._right || this;
    }

    /** @param {Node} value */
    set right(value) {
        this._right = value;
    }

    get left() {
        return this._left || this;
    }

    /** @param {Node} value */
    set left(value) {
        this._left = value;
    }

    get up() {
        return this._up || this;
    }

    /** @param {Node} value */
    set up(value) {
        this._up = value;
    }

    get down() {
        return this._down || this;
    }

    /** @param {Node} value */
    set down(value) {
        this._down = value;
    }

    get col() {
        return this._col || this;
    }

    /** @param {Node} value */
    set col(value) {
        this._col = value;
    }
}



export default class DL {
    constructor(params) {
        this.root = new Node('root');
    }

    /**
     * @param {Node} c
     */
    static cover(c) {
        var r = c.down;
        c.right.left = c.left;
        c.left.right = c.right;
        while (r !== c) {
            r = r.right;
            while (r.col !== c) {
                r.up.down = r.down;
                r.down.up = r.up;
                r.col.size--;
                r = r.right;
            }
            r = r.down;
        }

    }

    /**
     * @param {Node} c
     */
    static uncover(c) {
        var r = c.up;
        c.right.left = c;
        c.left.right = c;
        while (r !== c) {
            r = r.left;
            while (r.col !== c) {
                r.up.down = r;
                r.down.up = r;
                r.col.size++;
                r = r.left;
            }
            r = r.up;
        }
    }
}