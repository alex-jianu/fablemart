/* eslint-disable quotes */
const Order = require("../models/order");
const User = require("../models/user");

const OrdersController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      res.render("requests/index", {
        orders: orders.reverse(),
      });
    }
  },

  // Confirm: async (req, res) => {
  //   const request = await Request.findById(req.params.id);
  //   const newStatus = "confirmed";
  //   const user1 = await User.findOne({ username: request.requesterUsername });
  //   const user2 = await User.findOne({ username: request.requesteeUsername });

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
  //   await Request.updateOne({ _id: request._id }, { status: newStatus });

  //   res.redirect("/requests");
  // },

  // Decline: async (req, res) => {
  //   const request = await Request.findById(req.params.id);
  //   const newStatus = "declined";
  //   await Request.updateOne({ _id: request._id }, { status: newStatus });
  //   res.redirect("/requests");
  // },

  // Cancel: async (req, res) => {
  //   const request = await Request.findById(req.params.id);
  //   const newStatus = "cancelled";
  //   await Request.updateOne({ _id: request._id }, { status: newStatus });
  //   res.redirect("/requests");
  // },
};

module.exports = OrdersController;
