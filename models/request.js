const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  requesterID: String,
  requesteeID: String,
  status: String,
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
