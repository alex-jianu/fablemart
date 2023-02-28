const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/orders");
const Order = require("../models/order");

router.get("/", OrdersController.Index);
router.post("/:id", OrdersController.Send)
router.patch("/:id/confirm", OrdersController.Confirm);
router.patch("/:id/decline", OrdersController.Decline);
router.patch("/:id/cancel", OrdersController.Cancel);

module.exports = router;
