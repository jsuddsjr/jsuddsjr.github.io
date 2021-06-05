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

  addComment(hikeName, comment) {
    this.comments.push(new CommentModel(hikeName, comment));
    this.saveComments();
  }
}

function readLocal(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function storeLocal(key, data) {
  return window.localStorage.setItem(key, JSON.stringify(data));
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
    this.attachListener();
    this.hideCommentForm();
  }

  attachListener() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const comment = this.textarea.value;
      const hikeName = this.form.dataset.hikeName || "unknown";
      this.data.addComment(hikeName, comment);
      this.textarea.value = "";
      this.renderCommentList();
    });
  }

  /**
   * Show form for current hike.
   * @param {String} hikeName
   */
  showCommentForm(hikeName) {
    this.form.dataset.hikeName = hikeName;
    this.form.style.display = "";
  }

  /**
   * Disable comments.
   */
  hideCommentForm() {
    this.form.style.display = "none";
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
  }
}

const COMMENT_TITLE = 1;
const COMMENT_DATE = 3;
const COMMENT_BODY = 5;
const commentTemplate = [
  '<div class="comment"> <h3 class="comment-title">',
  null,
  '</h3> <h4 class="comment-date">',
  null,
  '</h4> <div class="comment-body">',
  null,
  "</div></div>",
];
