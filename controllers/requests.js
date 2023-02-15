/* eslint-disable quotes */
const Request = require("../models/request");
const User = require("../models/user");

const RequestsController = {
  Send: async (req, res) => {
    const request = new Request();
    request.requesterUsername = req.session.user.username;
    request.requesteeUsername = req.params.username;
    request.status = "pending";
    request.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/posts");
    });
  },

  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const sentRequests = await Request.find({
        requesterUsername: req.session.user.username,
        status: "pending",
      });
      const receivedRequests = await Request.find({
        requesteeUsername: req.session.user.username,
        status: "pending",
      });
      res.render("requests/index", {
        sentRequests: sentRequests.reverse(),
        receivedRequests: receivedRequests.reverse(),
      });
    }
  },

  Confirm: async (req, res) => {
    const request = await Request.findById(req.params.id);
    const newStatus = "confirmed";
    const user1 = await User.find({username: request.requesterUsername});
    const user2 = await User.find({username: request.requesteeUsername});
    console.log(user1)
    console.log(user2)
    const user1Friends = user1.friends.concat(user2.username);
    const user2Friends = user2.friends.concat(user1.username);

    await Request.updateOne({ _id: request._id }, { status: newStatus });
    await User.updateOne({_id: user1._id}, {friends: user1Friends});
    await User.updateOne({_id: user2._id}, {friends: user2Friends});

    res.redirect("/requests");
  },

  Decline: async (req, res) => {
    const request = await Request.findById(req.params.id);
    const newStatus = "declined";
    await Request.updateOne({ _id: request._id }, { status: newStatus });
    res.redirect("/requests");
  },

  Cancel: async (req, res) => {
    const request = await Request.findById(req.params.id);
    const newStatus = "cancelled";
    await Request.updateOne({ _id: request._id }, { status: newStatus });
    res.redirect("/requests");
  },
};

module.exports = RequestsController;
