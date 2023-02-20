const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  itemID: String,
  sellerID: String,
  buyerID: String,
  status: String,
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
