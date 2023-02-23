const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  itemID: String,
  sellerUsername: String,
  buyerUsername: String,
  status: String,
  transactions: Array,
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
