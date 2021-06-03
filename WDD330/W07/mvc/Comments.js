class CommentModel {
  constructor(hikeName, comment) {
    this.hikeName = hikeName;
    this.date = new Date();
    this.content = comment;
  }
}

export default class Comments {
  constructor(type) {
    this.type = type;

    /** @type {CommentModel[]} */
    this.comments = readLocal(this.type) || [];
  }

  saveComments() {
    storeLocal(this.type, this.comments);
  }

  getAllComments() {
    return this.comments;
  }

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
    this.divSelector = divSelector;

    this.button = form.querySelector("button");
    this.textarea = form.querySelector("textarea");
    this.hikeName = form.dataset.hikeName || "unknown";
    this.attachListener();

    this.commentData = data;
  }

  attachListener() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const comment = this.textarea.value;
      this.commentData.addComment(this.hikeName, comment);
      this.textarea.value = "";
      this.showCommentsList();
    });
  }

  showCommentsList() {
    const container = document.querySelector(this.divSelector);
    this.commentData.getAllComments().forEach((model) => {
      commentTemplate[1] = model.hikeName;
      commentTemplate[3] = model.date.toLocaleDateString();
      commentTemplate[5] = model.content.replace(/</g, "&lt;");
      container.innerHTML = commentTemplate.join("");
    });
  }
}

const commentTemplate = [
  '<div class="comment"> <h3 class="comment-title">',
  null,
  '</h3> <h4 class="comment-date">',
  null,
  '</h4> <div class="comment-body">',
  null,
  "</div></div>",
];
