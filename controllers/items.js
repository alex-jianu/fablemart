/* eslint-disable quotes */
const Item = require("../models/item");
const Order = require("../models/order");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fablemart.makers@gmail.com",
    pass: "ircysilfftmtovnq",
  },
});

const ItemsController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Item.find((err, items) => {
        if (err) {
          throw err;
        }

        items.forEach((item) => {
          if (item.likedBy.includes(username)) {
            item.isLiked = true;
          } else {
            item.isLiked = false;
          }
        });

        items.sort(function compareFn(a, b) {
          let textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        res.render("items/index", {
          items: items,
          user: req.session.user,
        });
      });
    }
  },

  MostPopular: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Item.find((err, items) => {
        if (err) {
          throw err;
        }

        items.forEach((item) => {
          if (item.likedBy.includes(username)) {
            item.isLiked = true;
          } else {
            item.isLiked = false;
          }
        });

        items.sort(function compareFn(a, b) {
          return b.likedBy.length - a.likedBy.length;
        });

        res.render("items/most-popular", {
          items: items,
          user: req.session.user,
        });
      });
    }
  },

  MostRecent: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Item.find((err, items) => {
        if (err) {
          throw err;
        }

        items.forEach((item) => {
          if (item.likedBy.includes(username)) {
            item.isLiked = true;
          } else {
            item.isLiked = false;
          }
        });

        res.render("items/most-recent", {
          items: items.reverse(),
          user: req.session.user,
        });
      });
    }
  },

  MostViewed: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Item.find((err, items) => {
        if (err) {
          throw err;
        }

        items.forEach((item) => {
          if (item.likedBy.includes(username)) {
            item.isLiked = true;
          } else {
            item.isLiked = false;
          }
        });

        items.sort(function compareFn(a, b) {
          return b.viewedBy.length - a.viewedBy.length;
        });

        res.render("items/most-viewed", {
          items: items,
          user: req.session.user,
        });
      });
    }
  },

  LikedByYou: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Item.find((err, items) => {
        if (err) {
          throw err;
        }

        items.forEach((item) => {
          if (item.likedBy.includes(username)) {
            item.isLiked = true;
          } else {
            item.isLiked = false;
          }
        });

        items = items.filter((item) =>
          item.likedBy.includes(req.session.user.username)
        );

        res.render("items/liked-by-you", {
          items: items.reverse(),
          user: req.session.user,
        });
      });
    }
  },

  New: (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      res.render("items/new", { user: req.session.user });
    }
  },

  Create: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const item = new Item(req.body);

      item.owner = req.session.user.username;
      item.likedBy = [];
      item.viewedBy = [];
      item.name = item.name.trim();
      item.description = item.description.trim();

      if (item.name === "" || item.description === "") {
        res.redirect("/items/new");
      } else {
        const existingItem = await Item.findOne({
          $or: [{ name: item.name }, { description: item.description }],
        });
        if (!existingItem) {
          item.save((err) => {
            if (err) {
              throw err;
            }
            let mailOptions = {
              from: "fablemart.makers@gmail.com",
              to: req.session.user.email,
              subject: "Everyone is about to die of envy!",
              text: `Warm regards, ${req.session.user.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that your FableMart item, ${item.name} has been listed.\nFrom this day onwards, everyone can look at it in awe!\nMay your travels bring you more such treasures that you can share with other FableTravellers.\nSell them or keep them, that is up to you\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.status(201).redirect("/items");
          });
        } else {
          res.redirect("/items/new");
        }
      }
    }
  },

  Like: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const item = await Item.findById(req.params.id);

      if (item.likedBy.includes(req.session.user.username)) {
        const query = { _id: req.params.id };
        const newLikedBy = item.likedBy.filter(
          (entry) => entry !== req.session.user.username
        );
        await Item.updateOne(query, { likedBy: newLikedBy });
        res.redirect("/items");
      } else {
        const query = { _id: req.params.id };
        const newLikedBy = item.likedBy.concat(req.session.user.username);
        await Item.updateOne(query, { likedBy: newLikedBy });
        res.redirect("/items");
      }
    }
  },

  ItemByID: async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      if (!item.viewedBy.includes(username)) {
        item.viewedBy.push(username);
        await item.save();
      }

      res.render("items/id", {
        item: item,
        id: item._id,
        user: req.session.user,
      });
    }
  },
};

// User ===> Item
// user ===> item
// name: user.email ===> name: item.name
// userByEmail ===> itemByName
// username: user.username ===> description: item.description
// userByUsername ===> itemByDescription
// /sessions/new ===> /items
// /users/new ===> /items/new

module.exports = ItemsController;
