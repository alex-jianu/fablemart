const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  friends: Array,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
