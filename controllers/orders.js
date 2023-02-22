/* eslint-disable quotes */
const Order = require("../models/order");
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

const OrdersController = {
  Send: async (req, res) => {
    const order = new Order();
    order.buyerUsername = req.session.user.username;
    const item = await Item.findOne({ _id: req.params.id });
    order.itemID = req.params.id;
    order.sellerUsername = item.owner;
    order.status = "pending";
    const owner = await User.findOne({ username: item.owner });
    // if (order.buyerUsername === order.sellerUsername) {
    //   res.redirect(`/items/${req.params.id}`);
    // } else {
    order.save((err) => {
      if (err) {
        throw err;
      }
      let mailOptions = {
        from: "fablemart.makers@gmail.com",
        to: req.session.user.email,
        subject: "You might just be lucky enough to get it!",
        text: `Warm regards, ${req.session.user.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that your order for the FableMart item, ${item.name}, has been sent.\nIf I were you I would try really hard to get in ${item.owner}'s graces ASAP.\nGood luck!\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      mailOptions = {
        from: "fablemart.makers@gmail.com",
        to: owner.email,
        subject: "Your item has everyone drooling over it!",
        text: `Warm regards, ${owner.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that your FableMart item, ${item.name}, has been requested by ${req.session.user.username}.\nGive it away or keep it, that is entirely up to you. Just don't leave people waiting for an answer for too long.\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.redirect(`/items/${req.params.id}`);
    });
    // }
  },

  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const sentOrders = await Order.find({
        buyerUsername: req.session.user.username,
        status: "pending",
      });
      const receivedOrders = await Order.find({
        sellerUsername: req.session.user.username,
        status: "pending",
      });
      res.render("orders/index", {
        sentOrders,
        receivedOrders,
      });
    }
  },

  Confirm: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id });
    const newStatus = "confirmed";
    const newOwner = order.buyerUsername;
    const item = await Item.findOne({ _id: order.itemID });
    const allOrdersPendingToThisItem = await Order.find({
      itemID: item._id,
      status: "pending",
      _id: { $ne: req.params.id },
    });
    const winningUser = await User.findOne({ username: order.buyerUsername });

    const declinedBuyers = allOrdersPendingToThisItem.map(
      (order) => order.buyerUsername
    );
    const allUsers = await User.find({});
    const declinedUsers = allUsers.select((user) =>
      declinedBuyers.includes(user.username)
    );

    declinedUsers.forEach((user) => {
      mailOptions = {
        from: "fablemart.makers@gmail.com",
        to: user.email,
        subject: `${owner.username} has declined your order`,
        text: `Warm regards, ${user.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that ${owner.username} declined your order for their FableMart item, ${item.name}\nMaybe it was not meant to be.\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    await Order.updateMany(
      { itemID: item._id, status: "pending" },
      { status: "declined" }
    );
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    await Item.updateOne({ _id: item._id }, { owner: newOwner });

    mailOptions = {
      from: "fablemart.makers@gmail.com",
      to: winningUser.email,
      subject: `${owner.username} has confirmed your order`,
      text: `Warm regards, ${winningUser.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that ${owner.username} has confirmed your order for their FableMart item, ${item.name}\nCongratulations, and take very good care of your brand-new ${item.name}.\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/orders");
  },

  Decline: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id });
    const newStatus = "declined";
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    const item = await Item.findOne({ _id: order.itemID });
    const owner = await User.findOne({ username: item.owner });
    const buyer = await User.findOne({ username: order.buyerUsername });

    mailOptions = {
      from: "fablemart.makers@gmail.com",
      to: buyer.email,
      subject: `${owner.username} has declined your order`,
      text: `Warm regards, ${buyer.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that ${owner.username} declined your order for their FableMart item, ${item.name}\nMaybe it was not meant to be.\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/orders");
  },

  Cancel: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id });
    const newStatus = "cancelled";
    await Order.updateOne({ _id: order._id }, { status: newStatus });
    const item = await Item.findOne({ _id: order.itemID });
    const owner = await User.findOne({ username: item.owner });

    let mailOptions = {
      from: "fablemart.makers@gmail.com",
      to: req.session.user.email,
      subject: `You've cancelled your order for ${item.name}!`,
      text: `Warm regards, ${req.session.user.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that your order for the FableMart item, ${item.name}, has been cancelled.\nI am sure you'll find something else to your liking soon\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    mailOptions = {
      from: "fablemart.makers@gmail.com",
      to: owner.email,
      subject: `${req.session.user.username} has cancelled their order`,
      text: `Warm regards, ${owner.username}!\n\nI am a FableMart carrier pigeon and I am here to let you know that ${req.session.user.username} cancelled their order for your FableMart item, ${item.name}\nMaybe it was not meant to be.\n\nAnd remember...\nNothing is real, but most of it is really funny!\nᕙ(\`▿\´)ᕗ`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/orders");
  },
};

module.exports = OrdersController;
