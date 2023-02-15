const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: String,
  message: String,
  likes: Number,
  likedBy: Array,
  isLiked: Boolean,
  isMultiple: Boolean,
  commentsPlural: Boolean,
  comments: Array,
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
