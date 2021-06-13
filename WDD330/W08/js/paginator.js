/**
 * @callback PageClickCallback
 * @param {Number} selectedPage
 * @param {Number} pageSize
 * @returns {Void}
 */

const CURRENT_CLASS = "current";
export default class Paginator {
  constructor(controlId, callback) {
    this.control = document.getElementById(controlId);
    this.callback = callback;
  }

  /**
   * Set paginator variables.
   * @param {Number} recordCount
   * @param {Number} pageSize
   */
  setPageParameters(recordCount, pageSize) {
    if (this.pageSize == pageSize && this.recordCount == recordCount) {
      return; // Nothing to do.
    }
    if (!pageSize) {
      throw new Error("Page size must not be 0.");
    }

    this.pageSize = Number(pageSize);
    this.recordCount = Number(recordCount);
    this.pageCount = Math.ceil(recordCount / pageSize);
    this.control.innerHTML = "";

    this.prevButton = this.control.appendChild(createButton("previous", this.movePrevious.bind(this)));
    this.nextButton = this.control.appendChild(createButton("next", this.moveNext.bind(this)));
    this.numbers = this.control.appendChild(document.createElement("div"));

    for (let i = 0; i < this.pageCount; i++) {
      const span = document.createElement("span");
      span.title = `${i + 1}`;
      span.className = "pageNumber";
      span.tabIndex = "0";
      span.setAttribute("role", "button");
      span.addEventListener("click", this.setCurrentPage.bind(this, i));
      span.addEventListener("keypress", (e) => {
        if (e.key === " " || e.key === "Enter") this.setCurrentPage(i);
      });
      this.numbers.appendChild(span);
    }

    this.currentPage = 0;
    this.numbers.children[0].classList.add(CURRENT_CLASS);
    this.prevButton.disabled = true;
  }

  /**
   * Navigate to specified page in array.
   * @param {Number} selectedPage
   */
  setCurrentPage(selectedPage) {
    if (selectedPage == this.currentPage) return; // Do nothing.
    this.numbers.children[this.currentPage].classList.remove(CURRENT_CLASS);
    this.currentPage = Number(selectedPage);
    this.numbers.children[this.currentPage].classList.add(CURRENT_CLASS);
    this.prevButton.disabled = !this.canMovePrevious();
    this.nextButton.disabled = !this.canMoveNext();
    this.callback(selectedPage + 1, this.pageSize);
  }

  /**
   * @returns True if previous page is available.
   */
  canMovePrevious() {
    return this.currentPage > 0;
  }

  /**
   * @returns True if next page is available.
   */
  canMoveNext() {
    return this.currentPage < this.pageCount - 1;
  }

  /**
   * Move to the previous page.
   */
  movePrevious() {
    if (this.canMovePrevious()) {
      this.setCurrentPage(this.currentPage - 1);
    }
  }

  /**
   * Move to the next page.
   */
  moveNext() {
    if (this.canMoveNext()) {
      this.setCurrentPage(this.currentPage + 1);
    }
  }
}

function createButton(className, eventHandler) {
  const btn = document.createElement("button");
  btn.addEventListener("click", eventHandler);
  btn.className = className;
  btn.title = className;
  return btn;
}
