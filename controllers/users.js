/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const User = require("../models/user");
const Item = require("../models/item");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fablemart.makers@gmail.com",
    pass: "ircysilfftmtovnq",
  },
});

const UsersController = {
  New: (req, res) => {
    res.render("users/new", {});
  },

  Create: async (req, res) => {
    const user = new User(req.body);

    User.findOne({ email: user.email }).then((userByEmail) => {
      if (!userByEmail) {
        User.findOne({ username: user.username }).then((userByUsername) => {
          if (!userByUsername) {
            user.save((err) => {
              if (err) {
                throw err;
              }
              let mailOptions = {
                from: "fablemart.makers@gmail.com",
                to: user.email,
                subject: "Don't freak out, but... your FablePASS is ready!!!!",
                text: `Warm regards, ${user.username}!\n\nI am a FableMart carrier pigeon and I am here to bring your own personal FablePASS.\nFrom this day onwards, you are a FableTraveller amongst many others!\nMay your browsing be ever surprising and may you gain some invaluable friends along the way\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
              res.redirect("/sessions/new");
            });
          } else {
            res.redirect("/users/new");
          }
        });
      } else {
        res.redirect("/users/new");
      }
    });
  },

  Profile: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const profileUser = await User.findOne({ username: req.params.username });
      const profileUserItems = await Item.find({ owner: req.params.username });

      res.render("users/username", {
        profileUser: profileUser,
        currentUser: req.session.user,
        items: profileUserItems,
      });
    }
  },
  Edit: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const profileUser = await User.findOne({ username: req.params.username });
      const profileUserItems = await Item.find({ owner: req.params.username });

      res.render("users/edit", {
        profileUser: profileUser,
        currentUser: req.session.user,
        items: profileUserItems,
      });
    }
  },
  Update: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const newBio = req.body.bio;
      await User.updateOne(
        { username: req.session.user.username },
        { bio: newBio }
      );

      res.redirect(`/users/${req.params.username}`);
    }
  },
  // Items: (req, res) => {

  // }
};

module.exports = UsersController;
