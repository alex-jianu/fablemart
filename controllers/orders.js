/* eslint-disable quotes */
const Order = require("../models/order");
const User = require("../models/user");

const OrdersController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      res.render("/orders/index", {
        orders: orders.reverse(),
      });
    }
  },

  // Confirm: async (req, res) => {
  //   const order = await Order.findById(req.params.id);
  //   const newStatus = "confirmed";
  //   const user1 = await User.findOne({ username: order.buyerUsername });
  //   const user2 = await User.findOne({ username: order.sellerUsername });

  //   let user1Friends = user1.friends || [];
  //   user1Friends = user1Friends.concat(user2.username);

  //   let user2Friends = user2.friends || [];
  //   user2Friends = user2Friends.concat(user1.username);

  //   await User.updateOne(
  //     { username: user1.username },
  //     { friends: user1Friends }
  //   );
  //   await User.updateOne(
  //     { username: user2.username },
  //     { friends: user2Friends }
  //   );
  //   await Order.updateOne({ _itemID: order._itemID }, { status: newStatus });

  //   res.redirect("/orders");
  // },

  Decline: async (req, res) => {
    const order = await Order.findById(req.params.itemID);
    const newStatus = "declined";
    await Order.updateOne({ _itemID: request._itemID }, { status: newStatus });
    res.redirect("/orders");
  },

  Cancel: async (req, res) => {
    const order = await Order.findByItemId(req.params.itemID);
    const newStatus = "cancelled";
    await Order.updateOne({ _itemID: order._itemID }, { status: newStatus });
    res.redirect("/orders");
  },
};

module.exports = OrdersController;
