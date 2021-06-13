export default class Spinner {
  /**
   * Constructor.
   * @param {HTMLElement} parentElement
   * @param {Boolean} isHidden
   */
  constructor(parentElement, isHidden = false) {
    this.spinner = document.createElement("div");
    this.spinner.className = "spinner";
    if (isHidden) this.hide();

    parentElement.appendChild(this.spinner);
  }

  /**
   * Clear the spinner.
   */
  hide() {
    this.spinner.style.display = "none";
  }

  show() {
    this.spinner.style.display = "inline-block";
  }
}
