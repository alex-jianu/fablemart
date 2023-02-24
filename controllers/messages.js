const Message = require("../models/message");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fablemart.makers@gmail.com",
    pass: "ircysilfftmtovnq",
  },
});

const MessagesController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const user = await User.findOne({ username: req.session.user.username });
      const contactedUsers = user.contactedUsers;

      await Message.find((err, messages) => {
        if (err) {
          throw err;
        } else {
          res.render("messages/index", {
            contactedUsers: contactedUsers,
            user: req.session.user,
          });
        }
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
        res.redirect(`/messages/${message.receiverUsername}`);
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

          let mailOptions = {
            from: "fablemart.makers@gmail.com",
            to: receiver.email,
            subject: `Psst...${sender.username} just sent you a message`,
            text: `Warm regards, ${receiver.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that ${sender.username} would like to have a word with you, in private.\nMaybe it is about one of your listed items that caught his eye, or perhaps he would like to hear your travel stories..\nWhatever it is, you should not keep a fellow FableTraveller waiting, so go ahead and see what they want\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.status(201).redirect(`/messages/${receiver.username}`);
        });
      }
    }
  },

  MessagesByUsername: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const user = await User.findOne({
        username: req.session.user.username,
      });
      if (!user.contactedUsers.includes(req.params.username)) {
        const newContactedUsers = user.contactedUsers.concat(
          req.params.username
        );
        await User.updateOne(
          { username: user.username },
          { contactedUsers: newContactedUsers }
        );
      }
      const receiver = await User.findOne({ username: req.params.username });
      const sender = await User.findOne({
        username: req.session.user.username,
      });
      const paramsUsername = req.params.username;

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

      res.render("messages/username", {
        user,
        allMessages: allMessages.reverse(),
        sender,
        receiver,
        paramsUsername,
      });
    }
  },
};

module.exports = MessagesController;
