/* eslint-disable quotes */
const Item = require("../models/item");
const Order = require("../models/order");
const User = require("../models/user");

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

        res.render("items/index", {
          items: items.reverse(),
          user: req.session.user,
        });
      });
    }
  },

  New: (req, res) => {
    res.render("items/new", { user: req.session.user });
  },
  Create: async (req, res) => {
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
          res.status(201).redirect("/items");
        });
      } else {
        res.redirect("/items/new");
      }
    }
  },

  Like: async (req, res) => {
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
  },
  ItemByID: async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;
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
