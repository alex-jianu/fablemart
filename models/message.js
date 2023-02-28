const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderUsername: String,
  receiverUsername: String,
  content: String,
  time: String,
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
