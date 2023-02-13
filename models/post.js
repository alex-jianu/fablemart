const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: String,
  message: String,
  likes: Number,
  likedBy: Array,
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
