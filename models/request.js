const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  requesterUsername: String,
  requesteeUsername: String,
  status: String,
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
