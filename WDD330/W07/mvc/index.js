import HikesController from "./HikesController.js";
import Comments, { CommentListView } from "./Comments.js";

const controller = new HikesController("hikeList");
controller.showHikeList();

const comments = new Comments("hike");
const commentView = new CommentListView(
  document.forms["commentForm"],
  "#hikeComments",
  comments
);

commentView.showCommentsList();
