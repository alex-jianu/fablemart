const Request = require("../models/request");
const User = require("../models/user");


const RequestsController = {
    Send: async (req, res) => {
        const requester = req.session.user;
        const requestee = await User.find({username: req.params.username});
        const request = new Request();
        request.requesterID = requester._id;
        request.requesteeID = requestee._id;
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
            const sentRequests = await Request.find({requesterID: req.session.user._id, status: "pending"});
            const receivedRequests = await Request.find({requesteeID: req.session.user._id, status: "pending"});
            res.render("requests/index", {sentRequests: sentRequests, receivedRequests: receivedRequests});
        }

    },

    Confirm: (req, res) => {

    },

    Decline: async (req, res) => {
        const request = await Request.findById(req.params.id);
        const newStatus = "declined";
        await Request.updateOne({_id: request._id}, {status: newStatus} );
        res.redirect("/requests");
    },

    Cancel: async (req, res) => {
        const request = await Request.findById(req.params.id);
        const newStatus = "cancelled";
        await Request.updateOne({_id: request._id}, {status: newStatus} );
        res.redirect("/requests");

    }
}





module.exports = RequestsController;