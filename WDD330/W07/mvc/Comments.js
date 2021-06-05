export class CommentModel {
  constructor(hikeName, comment) {
    this.hikeName = hikeName;
    this.date = new Date();
    this.content = comment;
  }
}

export default class Comments {
  /**
   * Constructor.
   * @param {String} type
   * @param {CommentModel[]} [comments]
   */
  constructor(type, comments) {
    this.type = type;

    /** @type {CommentModel[]} */
    this.comments = comments || readLocal(this.type) || [];
  }

  /**
   * Save comments. Called automatically when adding comments.
   */
  saveComments() {
    storeLocal(this.type, this.comments);
  }

  /**
   * Get all comments.
   * @returns All comment objects.
   */
  getAllComments() {
    return this.comments;
  }

  /**
   * Get comments for specified hike.
   * @param {String} hikeName
   * @returns All comment objects for hike.
   */
  filterCommentsByName(hikeName) {
    return this.comments.filter((comment) => comment.hikeName === hikeName);
  }

  /**
   * Add a comment to the FRONT of the list.
   * @param {String} hikeName
   * @param {CommentModel} comment
   */
  addComment(hikeName, comment) {
    comment = comment.trim();
    if (comment) {
      this.comments.unshift(new CommentModel(hikeName, comment));
      this.saveComments();
    }
  }
}

/**
 * Read data from local storage.
 * @param {String} key
 * @returns Object parsed from storage.
 */
function readLocal(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

/**
 * Stores data in local storage.
 * @param {String} key
 * @param {*} data
 */
function storeLocal(key, data) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export class CommentListView {
  /**
   * Constructor
   * @param {HTMLElement} form
   * @param {Comments} data
   */
  constructor(form, divSelector, data) {
    this.form = form;

    const container = document.querySelector(divSelector);
    if (container instanceof HTMLDivElement) {
      this.container = container;
    } else {
      throw new Error("Invalid DIV selector for comment list.");
    }

    this.button = form.querySelector("button");
    this.textarea = form.querySelector("textarea");
    if (!this.button || !this.textarea) {
      throw new Error("Comment form must contain a textArea and button.");
    }

    this.data = data;
    this.showCommentForm();

    attachSubmitListener(this);
  }

  /**
   * Show form for current hike.
   * @param {String} [hikeName]
   */
  showCommentForm(hikeName) {
    if (hikeName) {
      this.form.dataset.hikeName = hikeName;
      this.form.style.display = "";
    } else {
      this.form.style.display = "none";
    }
  }

  /**
   * Render comments for hike, if specified.
   * @param {String} [hikeName]
   */
  renderCommentList(hikeName) {
    const comments = hikeName
      ? this.data.filterCommentsByName(hikeName)
      : this.data.getAllComments();

    const html = comments.map((model) => {
      commentTemplate[COMMENT_TITLE] = model.hikeName;
      commentTemplate[COMMENT_DATE] = new Date(model.date).toLocaleDateString();
      commentTemplate[COMMENT_BODY] = model.content.replace(/</g, "&lt;");
      return commentTemplate.join("");
    });

    this.container.innerHTML = html.join("");
    this.showCommentForm(hikeName);
  }
}

/**
 *
 * @param {CommentListView} listView
 */
function attachSubmitListener(listView) {
  listView.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const comment = listView.textarea.value;
    const hikeName = listView.form.dataset.hikeName || "unknown";
    listView.data.addComment(hikeName, comment);
    listView.textarea.value = "";
    listView.renderCommentList(hikeName);
  });
}

const COMMENT_TITLE = 1;
const COMMENT_DATE = 3;
const COMMENT_BODY = 5;
const commentTemplate = [
  '<div class="comment"> <h3 class="comment-title">',
  null,
  '</h3> <p class="comment-date">',
  null,
  '</p> <div class="comment-body">',
  null,
  "</div></div>",
];
