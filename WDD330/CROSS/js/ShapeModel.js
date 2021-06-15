const VOWEL = "0";
const CONSONANT = "1";
const ANY_TYPE = ".";
const SHAPE_MATCH = new RegExp(`[${VOWEL}${CONSONANT}${ANY_TYPE}]`);
const LETTER_MATCH = new RegExp(`[^${VOWEL}${CONSONANT}${ANY_TYPE}]`);

export default class ShapeModel {
  /**
   * Constructor.
   * @param {HTMLElement} cellElement
   */
  constructor(cellElement) {
    this.cell = cellElement;
  }

  static isShapeChar(char) {
    return char === VOWEL || char === CONSONANT || char === ANY_TYPE;
  }

  static isLetter(char) {
    return char !== VOWEL && char !== CONSONANT && char != ANY_TYPE && char !== null;
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

    if (ShapeModel.isLetter(char)) this.cell.dataset.letter = char;
    else this.cell.removeAttribute("data-letter");

    if (char) this.cell.dataset.shape = char;
    else this.cell.removeAttribute("data-shape");
  }

  getShape() {
    return this.cell.dataset.shape || ANY_TYPE;
  }

  getLetter() {
    return this.cell.dataset.letter || " ";
  }
}
