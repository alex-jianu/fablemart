/* eslint-disable quotes */
const Request = require("../models/request");
const User = require("../models/user");

const RequestsController = {
  Send: async (req, res) => {
    const request = new Request();
    request.requesterUsername = req.session.user.username;
    request.requesteeUsername = req.params.username;
    request.status = "pending";
    const req1 = await Request.find({requesterUsername: request.requesterUsername});

    // if (requesterUsername === requesteeUsername) {
    //   res.redirect("/posts")
    // } else {
      
    // }  

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
    const user1 = await User.findOne({ username: request.requesterUsername });
    const user2 = await User.findOne({ username: request.requesteeUsername });
  
    let user1Friends = user1.friends || [];
    user1Friends = user1Friends.concat(user2.username);
  
    let user2Friends = user2.friends || [];
    user2Friends = user2Friends.concat(user1.username);
  
    await Request.updateOne({ _id: request._id }, { status: newStatus });
    await User.findOneAndUpdate({ username: user1.username }, { friends: user1Friends });
    await User.findOneAndUpdate({ username: user2.username }, { friends: user2Friends });
  
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
