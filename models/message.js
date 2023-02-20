const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderID: String,
  receiverID: String,
  content: String,
  time: Date,
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
