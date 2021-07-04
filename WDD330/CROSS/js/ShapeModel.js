const VOWEL = "0";
const CONSONANT = "1";
const ANY_TYPE = ".";
const BLOCKED = "#";
const SHAPE_MATCH = new RegExp(`[${VOWEL}${CONSONANT}${ANY_TYPE}]`);
const LETTER_MATCH = new RegExp(`[^${VOWEL}${CONSONANT}${ANY_TYPE}]`);

/**
 * Manage a cell's attributes. A shape of 0 for vowel and 1 for consonant.
 */
export default class ShapeModel {
  /**
   * Constructor.
   * @param {HTMLElement} cellElement
   */
  constructor(cellElement) {
    this.cellElement = cellElement;
  }

  static isShapeChar(char) {
    return char === BLOCKED || char === VOWEL || char === CONSONANT || char === ANY_TYPE;
  }

  static isLetter(char) {
    return char && char !== VOWEL && char !== CONSONANT && char != ANY_TYPE;
  }

  static get shapeMatch() {
    return SHAPE_MATCH;
  }
  static get letterMatch() {
    return LETTER_MATCH;
  }
  static get anyType() {
    return ANY_TYPE;
  }
  static get consonantType() {
    return CONSONANT;
  }
  static get vowelType() {
    return VOWEL;
  }
  static get blockedType() {
    return BLOCKED;
  }

  setContent(char) {
    if (char && char.length > 1) {
      throw new Error("Rebus squares (more than single letter) are not supported.");
    }

    if (ShapeModel.isLetter(char)) {
      this.cellElement.dataset.letter = char;
    } else this.cellElement.removeAttribute("data-letter");

    if (ShapeModel.isLetter(char) || ShapeModel.isShapeChar(char)) {
      this.cellElement.dataset.shape = char;
    } else this.cellElement.dataset.shape = ANY_TYPE;
  }

  getShape() {
    return this.cellElement.dataset.shape || ANY_TYPE;
  }

  getLetter() {
    return this.cellElement.dataset.letter || " ";
  }
}
