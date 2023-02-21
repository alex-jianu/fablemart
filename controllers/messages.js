const Message = require("../models/message");
const User = require("../models/user");

const MessagesController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const user = await User.findOne({ username: req.session.user.username });
      const contactedUsers = user.contactedUsers;

      // await Message.find((err, messages) => {
      //   if (err) {
      //     throw err;
      //   }

      res.render("messages/index", {
        contactedUsers: contactedUsers,
        user: req.session.user,
      });
    }
  },

  New: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      if (!req.session.user.contactedUsers.includes(req.params.username)) {
        await User.updateOne(
          { username: req.session.user.username },
          { contactedUsers: req.params.username }
        );
      }
      res.render(`messages/${req.params.username}`, {
        user: req.session.user,
        receiver: req.params.username,
      });
    }
  },
  Create: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const message = new Message(req.body);
      const receiver = await User.findOne({ username: req.params.username });
      const sender = await User.findOne({
        username: req.session.user.username,
      });
      message.senderUsername = req.session.user.username;
      message.receiverUsername = req.params.username;
      let date = new Date().toJSON().slice(0, 10);
      let time = new Date().toJSON().slice(11, 16);
      message.time = `${time} - ${date}`;

      sender.contactedUsers = sender.contactedUsers || [];
      receiver.contactedUsers = receiver.contactedUsers || [];

      if (message.content.trim() === "") {
        res.redirect(`/messages/${message.receiverUsername}/new`);
      } else {
        if (!sender.contactedUsers.includes(message.receiverUsername)) {
          let newContactedUsers = sender.contactedUsers.concat(
            message.receiverUsername
          );
          await User.updateOne(
            { username: sender.username },
            {
              contactedUsers: newContactedUsers,
            }
          );
        }

        if (!receiver.contactedUsers.includes(sender.username)) {
          await User.updateOne(
            { username: receiver.username },
            {
              contactedUsers: receiver.contactedUsers.concat(
                message.senderUsername
              ),
            }
          );
        }
        message.save((err) => {
          if (err) {
            throw err;
          }

          res.status(201).redirect(`/messages/${receiver.username}`);
        });
      }
    }
  },

  MessagesByUsername: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const receiver = await User.findOne({ username: req.params.username });
      const sender = await User.findOne({
        username: req.session.user.username,
      });

      const allMessages = await Message.find({
        $or: [
          {
            senderUsername: sender.username,
            receiverUsername: receiver.username,
          },
          {
            senderUsername: receiver.username,
            receiverUsername: sender.username,
          },
        ],
      });

      // const sentMessages = await Message.find({
      //   senderUsername: sender.username,
      //   receiverUsername: receiver.username,
      // });

      // const receivedMessages = await Message.find({
      //   senderUsername: receiver.username,
      //   receiverUsername: sender.username,
      // });

      res.render("messages/username", {
        allMessages,
        sender,
        receiver,
      });
    }
  },
};

module.exports = MessagesController;
