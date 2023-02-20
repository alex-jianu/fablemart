const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  owner: String,
  likedBy: Array,
  viewedBy: Array,
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;