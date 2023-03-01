/* eslint-disable quotes */
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fablemart.makers@gmail.com",
    pass: "ircysilfftmtovnq",
  },
});

const PasswordsController = {
  Index: (req, res) => {
    res.render("forgot-password/insert-email", { error: "" });
  },

  Recover: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.render("forgot-password/insert-email", {
        error: "No such account exists",
      });
    } else {
      let mailOptions = {
        from: "fablemart.makers@gmail.com",
        to: user.email,
        subject: "Oh, my, looks like you forgot your enchanted passphrase...",
        text: `Warm regards, ${user.username}!\n\nI am a FableMart carrier pigeon and I am here to bring your FablePASS enchanted passphrase.\n\nYour personal enchanted passphrase is: ${user.password}\n\nPlease make sure you hold on to it tight this time!\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.render("forgot-password/email-sent", {});
    }
  },
};

module.exports = PasswordsController;
