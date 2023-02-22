/* eslint-disable quotes */
const Order = require("../models/order");
const User = require("../models/user");
const Item = require("../models/item");

const OrdersController = {
  Send: async (req, res) => {
    const order = new Order();
    order.buyerUsername = req.session.user.username;
    const item = await Item.findOne({_id: req.params.id})
    order.itemID = req.params.id;
    order.sellerUsername = item.owner;
    order.status = "pending";
    if (order.buyerUsername === order.sellerUsername) {
      res.redirect(`/items/${req.params.id}`);
    } else {
    order.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect(`/items/${req.params.id}`);
    });
  }
  },

  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const sentOrders = await Order.find({buyerUsername: req.session.user.username, status:"pending"})
      const receivedOrders = await Order.find({sellerUsername: req.session.user.username, status:"pending"})
      res.render("orders/index", {
        sentOrders, receivedOrders
      });
    }
  },

  Confirm: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id});
    const newStatus = "confirmed";
    const newOwner = order.buyerUsername;
    const item = await Item.findOne({_id: order.itemID});
    await Order.updateMany({itemID: item._id}, {status: "declined"});
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    await Item.updateOne({ _id: item._id}, {owner: newOwner});
    res.redirect("/orders");
  },

  Decline: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id});
    const newStatus = "declined";
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    res.redirect("/orders");
  },

  Cancel: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id});
    const newStatus = "cancelled";
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    res.redirect("/orders");
  },
};

module.exports = OrdersController;
