/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const User = require("../models/user");
const Item = require("../models/item");

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
      res.redirect("/")
    }else {
      const profileUser = await User.findOne({username:req.params.username});
      const profileUserItems = await Item.find({owner: req.params.username});


      res.render("users/username", {profileUser: profileUser, currentUser: req.session.user, items: profileUserItems});
    }

  },
  Edit: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/")
    }else {
      const profileUser = await User.findOne({username:req.params.username});
    
    
      res.render("users/edit", {profileUser:  profileUser, currentUser: req.session.user});
    }
  },
  Update: async (req, res) => {
    const newBio = req.body.bio;
    await User.updateOne({username: req.session.user.username}, {bio: newBio});

    res.redirect(`/users/${req.params.username}`)
  }
  // Items: (req, res) => {

  // }
};

module.exports = UsersController;

