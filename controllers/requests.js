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

  Confirm: (req, res) => {},

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
