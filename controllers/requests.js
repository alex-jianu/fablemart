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
            const sentRequests = await Request.find({requesterID: req.session.user._id});
            const receivedRequests = await Request.find({requesteeId: req.session.user._id});
            res.render("requests/index", {sentRequests: sentRequests, receivedRequests: receivedRequests});
        }

    }
}





module.exports = RequestsController;