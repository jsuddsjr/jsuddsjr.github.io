const VOWEL = "0";
const CONSONANT = "1";
const ANY_TYPE = ".";
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
    return char === VOWEL || char === CONSONANT || char === ANY_TYPE;
  }

  static isLetter(char) {
    return char && char !== VOWEL && char !== CONSONANT && char != ANY_TYPE;
  }

  static shapeMatch = SHAPE_MATCH;
  static letterMatch = LETTER_MATCH;
  static anyType = ANY_TYPE;
  static consonantType = CONSONANT;
  static vowelType = VOWEL;

  setContent(char) {
    if (char && char.length > 1) {
      throw new Error("Rebus squares (more than single letter) are not supported.");
    }

    if (ShapeModel.isLetter(char)) this.cellElement.dataset.letter = char;
    else this.cellElement.removeAttribute("data-letter");

    if (ShapeModel.isShapeChar(char)) this.cellElement.dataset.shape = char;
    else this.cellElement.removeAttribute("data-shape");
  }

  getShape() {
    return this.cellElement.dataset.letter || this.cellElement.dataset.shape || ANY_TYPE;
  }

  getLetter() {
    return this.cellElement.dataset.letter || " ";
  }
}
