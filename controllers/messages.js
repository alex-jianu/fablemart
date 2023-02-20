const Message = require("../models/message");

const MessagesController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Message.find((err, messages) => {
        if (err) {
          throw err;
        }

        res.render("messages/index", {
          messages: messages.reverse(),
          user: req.session.user,
        });
      });
    }
  },

  New: (req, res) => {
    res.render("messages/new", { user: req.session.user });
  },
  Create: (req, res) => {},
};

module.exports = MessagesController;
