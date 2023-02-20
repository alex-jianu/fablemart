const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/orders");
const Order = require("../models/order");

router.get("/", OrdersController.Index);

module.exports = router;
