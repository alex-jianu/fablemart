const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: String,
  message: String,
  likes: Number,
  likedBy: Array,
  isLiked: Boolean,
  isMultiple: Boolean,
  postID: String,
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
